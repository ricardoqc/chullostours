import { ReservationEmailData, ContactEmailData } from "@/types/email";
import { companyInfo } from "./company-info";

/**
 * Customer Confirmation Email HTML Template
 */
export function getReservationCustomerEmailHtml(data: ReservationEmailData): string {
  const currency = data.isSoles ? "PEN" : "USD";
  const symbol = data.isSoles ? "S/" : "$";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Solicitud de Reserva - Chullos Tours</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background-color: #6b0014; padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Chullos Tours</h1>
      <p style="color: #ffc000; margin: 5px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Operador Directo Oficial en Cusco</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px 25px;">
      <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">¡Hola ${data.fullName}! 👋</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Hemos recibido con éxito tu solicitud de reserva para <strong>${data.tourTitle}</strong>. Uno de nuestros asesores expertos se comunicará contigo vía WhatsApp o correo electrónico para confirmar la disponibilidad y darte los últimos detalles.
      </p>

      <!-- Details Card -->
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #6b0014; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Resumen de tu Viaje</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Tour:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.tourTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Fecha de Inicio:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.travelDate} ${data.selectedHorario ? `(${data.selectedHorario})` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Viajeros:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.travelers} personas</td>
          </tr>
          ${data.hotelOption ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Opción Hotel:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">${data.hotelOption}</td>
          </tr>
          ` : ""}
          ${data.includeHuaynaPicchu ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Extra:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; text-align: right; font-weight: 600;">Entrada Huayna Picchu</td>
          </tr>
          ` : ""}
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: 700; font-size: 15px;">Total estimado:</td>
            <td style="padding: 12px 0 0 0; color: #6b0014; text-align: right; font-weight: 800; font-size: 16px;">${symbol} ${data.totalPrice.toLocaleString()} ${currency}</td>
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
        Recuerda: No se ha realizado ningún cobro por adelantado en la web.
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

/**
 * Internal Staff Notification Email HTML Template
 */
export function getReservationStaffEmailHtml(data: ReservationEmailData): string {
  const currency = data.isSoles ? "PEN" : "USD";
  const symbol = data.isSoles ? "S/" : "$";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Nueva Reserva - Chullos Tours</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 25px; border: 1px solid #cbd5e1;">
    <h2 style="color: #6b0014; margin-top: 0;">🚨 NUEVA SOLICITUD DE RESERVA WEB</h2>
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">

    <h3>📌 Datos del Viajero</h3>
    <ul>
      <li><strong>Nombre:</strong> ${data.fullName}</li>
      <li><strong>WhatsApp / Tel:</strong> <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, "")}">${data.phone}</a></li>
      <li><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></li>
      <li><strong>País:</strong> ${data.country || "No especificado"}</li>
      ${data.dni ? `<li><strong>DNI:</strong> ${data.dni}</li>` : ""}
    </ul>

    <h3>🎯 Datos de la Experiencia</h3>
    <ul>
      <li><strong>Tour:</strong> ${data.tourTitle}</li>
      <li><strong>Fecha:</strong> ${data.travelDate} ${data.selectedHorario ? `(Turno: ${data.selectedHorario})` : ""}</li>
      <li><strong>Viajeros:</strong> ${data.travelers} personas</li>
      <li><strong>Opción de Hotel:</strong> ${data.hotelOption || data.hotelName || "No aplica / Solo tour"}</li>
      <li><strong>Huayna Picchu:</strong> ${data.includeHuaynaPicchu ? "SÍ" : "No"}</li>
      <li><strong>Total Estimado:</strong> ${symbol} ${data.totalPrice} ${currency}</li>
    </ul>

    ${data.flightNumber || data.arrivalDate || data.allergies ? `
    <h3>✈️ Logística & Notas</h3>
    <ul>
      ${data.arrivalDate ? `<li><strong>Llegada a Cusco:</strong> ${data.arrivalDate}</li>` : ""}
      ${data.flightNumber ? `<li><strong>Vuelo:</strong> ${data.flightNumber} (${data.flightDate || ""})</li>` : ""}
      ${data.allergies ? `<li><strong>Alergias / Restricciones:</strong> ${data.allergies}</li>` : ""}
      ${data.specialNeeds ? `<li><strong>Requerimientos:</strong> ${data.specialNeeds}</li>` : ""}
    </ul>
    ` : ""}

    <div style="margin-top: 25px; text-align: center;">
      <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${data.fullName}, te escribimos de Chullos Tours con respecto a tu solicitud para ${data.tourTitle}`)}" style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Contactar al cliente por WhatsApp
      </a>
    </div>
  </div>
</body>
</html>
  `;
}
