import { NextRequest, NextResponse } from "next/server";
import { sendCustomTripEmails } from "@/lib/email";
import { customTripSubmitSchema } from "@/lib/custom-trip-schema";

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

    const raw = await req.json();
    const parsed = customTripSubmitSchema.safeParse(raw);

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

    if (!body.termsAccepted) {
      return NextResponse.json(
        { success: false, error: "Debes aceptar los términos y condiciones." },
        { status: 400 }
      );
    }

    const travelDate = body.datesFlexible
      ? "Fechas flexibles"
      : body.startDate?.trim() || "Por definir";

    const result = await sendCustomTripEmails({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      destinations: body.destinations,
      travelers: body.travelers,
      nights: body.nights,
      travelDate,
      style: body.style,
      budget: body.budget,
      fitness: body.fitness,
      hasFlights: body.hasFlights,
      notes: body.notes,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "No se pudo enviar el correo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solicitud de viaje a medida recibida y notificada con éxito.",
      messageId: result.messageId,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor.";
    console.error("API error /api/send-custom-trip:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
