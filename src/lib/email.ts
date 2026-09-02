import { ReservationEmailData, EmailSendResult } from "@/types/email";
import {
  getReservationCustomerEmailHtml,
  getReservationStaffEmailHtml,
} from "./email-templates";
import { companyInfo } from "./company-info";
import { getAdminEmails } from "./mail-config";
import {
  getMailTransporter,
  isMailConfigured,
  sendMailMessage,
} from "./nodemailer";

function logDevSimulation(label: string, details: Record<string, string>) {
  console.log("==================================================");
  console.log(`[EMAIL DEV MODE] ${label}`);
  for (const [key, value] of Object.entries(details)) {
    console.log(`${key}: ${value}`);
  }
  console.log(`Admin: ${getAdminEmails().join(", ")}`);
  console.log("==================================================");
}

async function sendDualEmails(params: {
  customerEmail: string;
  customerSubject: string;
  customerHtml: string;
  adminSubject: string;
  adminHtml: string;
  devLabel: string;
  devDetails: Record<string, string>;
}): Promise<EmailSendResult> {
  if (!isMailConfigured()) {
    logDevSimulation(params.devLabel, params.devDetails);
    return {
      success: true,
      messageId: `dev-simulated-${Date.now()}`,
    };
  }

  const transporter = getMailTransporter();
  if (!transporter) {
    return {
      success: false,
      error: "Credenciales SMTP no configuradas (GOOGLE_MAIL_USER / GOOGLE_MAIL_APP_PASSWORD).",
    };
  }

  const adminResult = await sendMailMessage(transporter, {
    to: getAdminEmails(),
    replyTo: params.customerEmail,
    subject: params.adminSubject,
    html: params.adminHtml,
  });

  if (!adminResult.ok) {
    return {
      success: false,
      error: adminResult.error || "No se pudo notificar al equipo interno.",
    };
  }

  const customerResult = await sendMailMessage(transporter, {
    to: params.customerEmail,
    subject: params.customerSubject,
    html: params.customerHtml,
  });

  if (!customerResult.ok) {
    console.error("Customer email failed after admin notification:", customerResult.error);
    return {
      success: true,
      messageId: adminResult.messageId || "partial-customer-failed",
      error: `Equipo notificado; falló correo al cliente: ${customerResult.error}`,
    };
  }

  return {
    success: true,
    messageId: customerResult.messageId || adminResult.messageId || "sent-smtp",
  };
}

/**
 * Send reservation emails: admin notification + customer confirmation.
 */
export async function sendReservationEmails(
  data: ReservationEmailData
): Promise<EmailSendResult> {
  try {
    const customerHtml = getReservationCustomerEmailHtml(data);
    const staffHtml = getReservationStaffEmailHtml(data);

    return await sendDualEmails({
      customerEmail: data.email,
      customerSubject: `Solicitud de Reserva Recibida: ${data.tourTitle} - Chullos Tours`,
      customerHtml,
      adminSubject: `Nueva Reserva Web: ${data.fullName} - ${data.tourTitle}`,
      adminHtml: staffHtml,
      devLabel: "Simulating reservation email dispatch",
      devDetails: {
        Lead: `${data.email} (${data.fullName})`,
        Tour: `${data.tourTitle} | Date: ${data.travelDate} | Pax: ${String(data.travelers)}`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("Error sending reservation email:", message);
    return { success: false, error: message };
  }
}

export interface CustomTripEmailData {
  fullName: string;
  email: string;
  phone: string;
  destinations: string[];
  travelers: number;
  nights: number;
  travelDate: string;
  style: string;
  budget: string;
  fitness: string;
  hasFlights: string;
  notes?: string;
}

const FLIGHTS_LABELS: Record<string, string> = {
  si: "Sí, ya comprados",
  no: "Aún no",
  proceso: "En búsqueda / cotizando",
};

function getFlightsLabel(value: string): string {
  return FLIGHTS_LABELS[value] || value;
}

function getCustomTripCustomerEmailHtml(data: CustomTripEmailData): string {
  const destinations = data.destinations.join(" · ");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de Viaje a Medida - Chullos Tours</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">

    <!-- Header -->
    <div style="background-color: #6b0014; padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Chullos Tours</h1>
      <p style="color: #ffc000; margin: 5px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Itinerarios 100% Personalizados</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px 25px;">
      <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">¡Hola ${data.fullName}! 👋</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Hemos recibido tu solicitud de <strong>viaje a medida</strong>. Un especialista de nuestro equipo cusqueño diseñará una propuesta con tus preferencias y te la enviará por WhatsApp o correo electrónico.
      </p>

      <!-- Details Card -->
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #6b0014; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Resumen de tu Solicitud</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Destinos:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${destinations}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Fecha estimada:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.travelDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Viajeros:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.travelers} personas</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Noches:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.nights} noches</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Estilo de viaje:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.style}</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: 700; font-size: 15px;">Presupuesto:</td>
            <td style="padding: 12px 0 0 0; color: #6b0014; text-align: right; font-weight: 800; font-size: 15px;">${data.budget}</td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 30px 0 20px 0;">
        <a href="${companyInfo.phones.primary.whatsappUrl}" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 700; font-size: 14px; border-radius: 50px; display: inline-block; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
          💬 Chatear por WhatsApp con un Asesor
        </a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px;">
        Recuerda: la cotización es gratuita y sin compromiso. No se ha realizado ningún cobro en la web.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
      <p style="margin: 0;"><strong>${companyInfo.legalName}</strong></p>
      <p style="margin: 4px 0 0 0;">${companyInfo.address.full} | RUC: ${companyInfo.ruc}</p>
      <p style="margin: 8px 0 0 0; color: #94a3b8;">${companyInfo.copyright}</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getCustomTripStaffEmailHtml(data: CustomTripEmailData): string {
  const phoneDigits = data.phone.replace(/[^0-9]/g, "");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Nueva Solicitud de Viaje a Medida - Chullos Tours</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 25px; border: 1px solid #cbd5e1;">
    <h2 style="color: #6b0014; margin-top: 0;">🧭 NUEVA SOLICITUD DE VIAJE A MEDIDA</h2>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">

    <h3>📌 Datos del Viajero</h3>
    <ul>
      <li><strong>Nombre:</strong> ${data.fullName}</li>
      <li><strong>WhatsApp / Tel:</strong> <a href="https://wa.me/${phoneDigits}">${data.phone}</a></li>
      <li><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></li>
    </ul>

    <h3>🗺️ Datos del Viaje Solicitado</h3>
    <ul>
      <li><strong>Destinos:</strong> ${data.destinations.join(", ")}</li>
      <li><strong>Fecha estimada:</strong> ${data.travelDate}</li>
      <li><strong>Viajeros:</strong> ${data.travelers} personas</li>
      <li><strong>Noches:</strong> ${data.nights}</li>
      <li><strong>Estilo:</strong> ${data.style}</li>
      <li><strong>Presupuesto:</strong> ${data.budget}</li>
      <li><strong>Nivel físico:</strong> ${data.fitness}</li>
      <li><strong>Vuelos:</strong> ${getFlightsLabel(data.hasFlights)}</li>
    </ul>

    ${data.notes ? `
    <h3>📝 Notas del Viajero</h3>
    <p style="background-color: #f8fafc; border-left: 3px solid #ffc000; padding: 12px; font-size: 14px; line-height: 1.6;">${data.notes}</p>
    ` : ""}

    <div style="margin-top: 25px; text-align: center;">
      <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hola ${data.fullName}, te escribimos de Chullos Tours con respecto a tu solicitud de viaje personalizado a ${data.destinations.join(", ")}`)}" style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Contactar al cliente por WhatsApp
      </a>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send custom trip request emails: admin notification + customer confirmation.
 */
export async function sendCustomTripEmails(
  data: CustomTripEmailData
): Promise<EmailSendResult> {
  try {
    const customerHtml = getCustomTripCustomerEmailHtml(data);
    const staffHtml = getCustomTripStaffEmailHtml(data);

    return await sendDualEmails({
      customerEmail: data.email,
      customerSubject: "Solicitud de Viaje a Medida Recibida - Chullos Tours",
      customerHtml,
      adminSubject: `Nuevo Viaje a Medida: ${data.fullName} - ${data.destinations.join(", ")}`,
      adminHtml: staffHtml,
      devLabel: "Simulating custom trip email dispatch",
      devDetails: {
        Lead: `${data.email} (${data.fullName})`,
        Destinos: `${data.destinations.join(", ")} | Date: ${data.travelDate} | Pax: ${String(data.travelers)}`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("Error sending custom trip email:", message);
    return { success: false, error: message };
  }
}
