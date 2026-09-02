import { companyInfo } from "@/lib/company-info";

/** Destinatarios internos (admin / ventas). Coma-separados en ADMIN_EMAIL. */
export function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAIL ||
    `${companyInfo.emails.reservas},${companyInfo.emails.info}`;

  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}
