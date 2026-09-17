import type { ReservationEmailData } from "@/types/email";
import { companyInfo } from "./company-info";

function esc(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(data: ReservationEmailData): string {
  const symbol = data.isSoles ? "S/" : "$";
  const currency = data.currencyLabel || (data.isSoles ? "PEN" : "USD");
  return `${symbol} ${Number(data.totalPrice || 0).toLocaleString("es-PE")} ${currency}`;
}

function phoneDigits(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:13px;vertical-align:top;width:42%;">${esc(label)}</td>
      <td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:700;text-align:right;vertical-align:top;">${value}</td>
    </tr>`;
}

function shell(params: {
  preheader: string;
  badge: string;
  title: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(params.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(params.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#6b0014;padding:28px 24px;text-align:center;">
              <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Chullos Tours</div>
              <div style="margin-top:6px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#ffc000;">${esc(params.badge)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              ${params.body}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:18px 24px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;line-height:1.5;">
              <strong style="color:#0f172a;">${esc(companyInfo.legalName)}</strong><br>
              ${esc(companyInfo.address.full)} · RUC ${esc(companyInfo.ruc)}<br>
              <span style="color:#94a3b8;">${esc(companyInfo.copyright)}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Confirmación al cliente: solicitud recibida (sin cobro en web).
 */
export function getReservationCustomerEmailHtml(data: ReservationEmailData): string {
  const wa = companyInfo.phones.primary.whatsappUrl;
  const body = `
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6b0014;text-transform:uppercase;letter-spacing:0.6px;">
      Ticket ${esc(data.ticketId)}
    </p>
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:#0f172a;">
      ¡Hola ${esc(data.fullName)}!
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
      Recibimos tu solicitud para <strong style="color:#0f172a;">${esc(data.tourTitle)}</strong>.
      Un asesor de Chullos Tours te contactará por WhatsApp o correo para confirmar disponibilidad.
      <strong>No se ha realizado ningún cobro en la web.</strong>
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:4px 16px;margin:0 0 22px;">
      ${row("Experiencia", esc(data.tourTitle))}
      ${row("Fecha", esc(`${data.travelDate}${data.selectedHorario ? ` · ${data.selectedHorario}` : ""}`))}
      ${row("Viajeros", esc(`${data.travelers} persona${data.travelers === 1 ? "" : "s"}`))}
      ${data.hotelOption ? row("Hospedaje", esc(data.hotelOption)) : ""}
      ${data.extrasLabels?.length ? row("Extras", esc(data.extrasLabels.join(", "))) : ""}
      ${row("Total estimado", `<span style="color:#6b0014;font-size:16px;">${esc(money(data))}</span>`)}
    </table>

    <div style="text-align:center;margin:8px 0 18px;">
      <a href="${esc(wa)}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:700;font-size:14px;">
        Hablar por WhatsApp
      </a>
    </div>
    <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;">
      Guarda este correo. Tu número de ticket es <strong style="color:#64748b;">${esc(data.ticketId)}</strong>.
    </p>
  `;

  return shell({
    preheader: `Solicitud recibida: ${data.tourTitle} · Ticket ${data.ticketId}`,
    badge: "Confirmación de solicitud",
    title: "Confirmación de solicitud - Chullos Tours",
    body,
  });
}

/**
 * Ticket interno para el equipo (admin / reservas).
 */
export function getReservationStaffEmailHtml(data: ReservationEmailData): string {
  const digits = phoneDigits(data.phone);
  const waHref = `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hola ${data.fullName}, te escribimos de Chullos Tours sobre tu solicitud ${data.ticketId} para ${data.tourTitle}.`
  )}`;

  const companionsHtml =
    data.companions && data.companions.length > 0
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          ${data.companions
            .map(
              (c, i) => `
            <tr>
              <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;">
                <strong>#${i + 1}</strong> ${esc(c.firstName)} ${esc(c.lastName)}
                ${c.passport ? ` · Pasaporte: ${esc(c.passport)}` : ""}
                ${c.age != null ? ` · Edad: ${esc(c.age)}` : ""}
              </td>
            </tr>`
            )
            .join("")}
        </table>`
      : `<p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">Sin acompañantes detallados.</p>`;

  const body = `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px 14px;margin:0 0 18px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;text-transform:uppercase;color:#c2410c;">Ticket de reserva</div>
      <div style="font-size:20px;font-weight:800;color:#9a3412;margin-top:4px;">${esc(data.ticketId)}</div>
    </div>

    <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;">Nueva solicitud web</h1>

    <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.6px;color:#6b0014;">Cliente</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      ${row("Nombre", esc(data.fullName))}
      ${row("WhatsApp", `<a href="https://wa.me/${digits}" style="color:#0f172a;text-decoration:none;">${esc(data.phone)}</a>`)}
      ${row("Email", `<a href="mailto:${esc(data.email)}" style="color:#0f172a;text-decoration:none;">${esc(data.email)}</a>`)}
      ${row("País", esc(data.country || "No especificado"))}
      ${data.dni ? row("Documento", esc(data.dni)) : ""}
      ${data.howDidYouFindUs ? row("¿Cómo nos encontró?", esc(data.howDidYouFindUs)) : ""}
    </table>

    <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.6px;color:#6b0014;">Experiencia</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      ${row("Tour", esc(data.tourTitle))}
      ${data.tourSlug ? row("Slug", esc(data.tourSlug)) : ""}
      ${row("Fecha", esc(`${data.travelDate}${data.selectedHorario ? ` · ${data.selectedHorario}` : ""}`))}
      ${row("Viajeros", esc(`${data.travelers}${data.adults != null ? ` (${data.adults} adultos${data.childrenCount ? ` + ${data.childrenCount} menores` : ""})` : ""}`))}
      ${row("Hospedaje", esc(data.hotelOption || data.hotelName || "No aplica"))}
      ${data.extrasLabels?.length ? row("Extras", esc(data.extrasLabels.join(", "))) : row("Huayna Picchu", data.includeHuaynaPicchu ? "Sí" : "No")}
      ${row("Total estimado", `<span style="color:#6b0014;font-size:15px;">${esc(money(data))}</span>`)}
    </table>

    <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.6px;color:#6b0014;">Viajeros / acompañantes</h2>
    <div style="margin:0 0 18px;padding:12px 14px;border:1px solid #e2e8f0;border-radius:12px;background:#fafafa;">
      ${companionsHtml}
    </div>

    ${
      data.flightNumber || data.arrivalDate || data.allergies || data.specialNeeds
        ? `
    <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.6px;color:#6b0014;">Logística y notas</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      ${data.arrivalDate ? row("Llegada a Cusco", esc(data.arrivalDate)) : ""}
      ${data.flightNumber ? row("Vuelo", esc(`${data.flightNumber}${data.flightDate ? ` (${data.flightDate})` : ""}`)) : ""}
      ${data.allergies ? row("Alergias", esc(data.allergies)) : ""}
      ${data.specialNeeds ? row("Requerimientos", esc(data.specialNeeds)) : ""}
    </table>`
        : ""
    }

    <div style="text-align:center;margin-top:8px;">
      <a href="${waHref}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700;font-size:14px;">
        Contactar por WhatsApp
      </a>
    </div>
  `;

  return shell({
    preheader: `Ticket ${data.ticketId} · ${data.fullName} · ${data.tourTitle}`,
    badge: "Ticket interno de reservas",
    title: `Ticket ${data.ticketId} - Chullos Tours`,
    body,
  });
}
