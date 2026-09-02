import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export function getMailTransporter() {
  const user = process.env.GOOGLE_MAIL_USER;
  const pass = process.env.GOOGLE_MAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.GOOGLE_MAIL_USER && process.env.GOOGLE_MAIL_APP_PASSWORD);
}

export function getSenderEmail(): string | null {
  return process.env.GOOGLE_MAIL_USER?.trim() || null;
}

export function getFromAddress(): string {
  const sender = getSenderEmail();
  const displayName = process.env.MAIL_FROM_NAME?.trim() || "Chullos Tours";
  return sender ? `"${displayName}" <${sender}>` : displayName;
}

export async function sendMailMessage(
  transporter: Transporter,
  options: {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
  }
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
    });

    return { ok: true, messageId: info.messageId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error SMTP desconocido";
    return { ok: false, error: message };
  }
}
