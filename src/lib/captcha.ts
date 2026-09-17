/**
 * Protección antibot: honeypot + tiempo mínimo de llenado + Cloudflare Turnstile (opcional).
 */

export type CaptchaCheckResult =
  | { ok: true }
  | { ok: false; error: string };

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  );
}

export function getTurnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
}

/** Rechaza envíos demasiado rápidos (bots). */
export function checkFormTiming(
  formStartedAt: number | undefined,
  minMs = 2500
): CaptchaCheckResult {
  if (!formStartedAt || !Number.isFinite(formStartedAt)) {
    return { ok: true };
  }
  const elapsed = Date.now() - formStartedAt;
  if (elapsed >= 0 && elapsed < minMs) {
    return { ok: false, error: "Envío demasiado rápido. Intenta de nuevo." };
  }
  return { ok: true };
}

export async function verifyTurnstileToken(
  token: string | undefined,
  ip?: string
): Promise<CaptchaCheckResult> {
  if (!isTurnstileConfigured()) {
    return { ok: true };
  }

  if (!token || !token.trim()) {
    return { ok: false, error: "Completa la verificación antibot." };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token.trim());
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, error: "Verificación antibot fallida. Recarga e intenta de nuevo." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo validar el antibot. Intenta de nuevo." };
  }
}
