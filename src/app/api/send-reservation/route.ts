import { NextRequest, NextResponse } from "next/server";
import { sendReservationEmails } from "@/lib/email";
import { getTourBySlug } from "@/lib/tours";
import { calculateTourTotal, getEnabledExtras } from "@/lib/pricing";
import { reservationSubmitSchema } from "@/lib/reservation-schema";
import { checkFormTiming, verifyTurnstileToken } from "@/lib/captcha";
import {
  createLeadId,
  createTicketId,
  saveLead,
  updateLead,
} from "@/lib/leads-store";
import { isMailConfigured } from "@/lib/nodemailer";

/** Simple in-memory rate limit (per instance). */
const hits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;
const WINDOW_MS = 60_000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta en un minuto." },
        { status: 429 }
      );
    }

    if (process.env.NODE_ENV === "production" && !isMailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Correo no configurado en el servidor. Define GOOGLE_MAIL_USER y GOOGLE_MAIL_APP_PASSWORD.",
        },
        { status: 503 }
      );
    }

    const raw = await req.json();
    const parsed = reservationSubmitSchema.safeParse(raw);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Datos inválidos.";
      return NextResponse.json({ success: false, error: firstIssue }, { status: 400 });
    }

    const body = parsed.data;

    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Solicitud recibida.",
        messageId: "honeypot",
      });
    }

    const timing = checkFormTiming(body.formStartedAt);
    if (!timing.ok) {
      return NextResponse.json({ success: false, error: timing.error }, { status: 400 });
    }

    const captcha = await verifyTurnstileToken(body.captchaToken, ip);
    if (!captcha.ok) {
      return NextResponse.json({ success: false, error: captcha.error }, { status: 400 });
    }

    if (!body.termsAccepted) {
      return NextResponse.json(
        { success: false, error: "Debes aceptar los términos y condiciones." },
        { status: 400 }
      );
    }

    const tour = getTourBySlug(body.tourSlug);
    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour no encontrado." },
        { status: 404 }
      );
    }

    const pricing = calculateTourTotal(tour, {
      adults: body.adults,
      childrenByTarifa: body.withChildren ? body.childrenByTarifa || {} : {},
      selectedHotelId: body.selectedHotelOptionId,
      selectedExtraIds: body.selectedExtraIds || [],
      currency: body.currency || "USD",
    });

    const childrenCount = body.withChildren
      ? Object.values(body.childrenByTarifa || {}).reduce((a, b) => a + b, 0)
      : 0;
    const travelers = body.adults + childrenCount;

    const selectedHotel = tour.opciones_hotel?.find(
      (h) => h.id === body.selectedHotelOptionId
    );

    const extrasLabels = getEnabledExtras(tour)
      .filter((extra) => (body.selectedExtraIds || []).includes(extra.id))
      .map((extra) => extra.label);

    const ticketId = createTicketId();
    const leadId = createLeadId("res");

    const emailPayload = {
      ticketId,
      tourTitle: body.tourTitle,
      tourSlug: body.tourSlug,
      travelDate: body.travelDate,
      selectedHorario: body.selectedHorario,
      travelers,
      adults: body.adults,
      childrenCount,
      totalPrice: pricing.total,
      isSoles: (body.currency || "USD") === "PEN",
      currencyLabel: body.currency || "USD",
      fullName: body.fullName,
      email: body.email,
      phone: body.dialCode ? `${body.dialCode} ${body.phone}` : body.phone,
      country: body.country,
      dni: body.dni,
      hotelOption: selectedHotel?.nombre || body.hotelOption,
      hotelName: body.hotelName,
      extrasLabels,
      includeHuaynaPicchu: body.includeHuaynaPicchu,
      flightNumber: body.flightNumber,
      flightDate: body.flightDate,
      arrivalDate: body.arrivalDate,
      allergies: body.allergies,
      specialNeeds: body.specialNeeds,
      howDidYouFindUs: body.howDidYouFindUs,
      companions: body.fillCompanions ? body.companions : [],
    };

    saveLead({
      id: leadId,
      type: "reservation",
      status: "new",
      createdAt: new Date().toISOString(),
      ticketId,
      fullName: body.fullName,
      email: body.email,
      phone: emailPayload.phone,
      country: body.country,
      tourSlug: body.tourSlug,
      tourTitle: body.tourTitle,
      travelDate: body.travelDate,
      travelers,
      totalPrice: pricing.total,
      currency: body.currency || "USD",
      source: body.howDidYouFindUs,
      ip,
      userAgent: req.headers.get("user-agent") || undefined,
      payload: {
        ...emailPayload,
        selectedExtraIds: body.selectedExtraIds || [],
        selectedHotelOptionId: body.selectedHotelOptionId,
      },
    });

    const result = await sendReservationEmails(emailPayload);

    updateLead(leadId, {
      emailOk: result.success,
      emailMessageId: result.messageId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "No se pudo enviar el correo.",
          leadId,
          ticketId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solicitud de reserva recibida y notificada con éxito.",
      messageId: result.messageId,
      serverTotal: pricing.total,
      leadId,
      ticketId,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor.";
    console.error("API error /api/send-reservation:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
