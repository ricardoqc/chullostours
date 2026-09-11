import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "chullos_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export function getAdminSecret(): string | null {
  const fromEnv = process.env.ADMIN_SECRET?.trim();
  return fromEnv || null;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

export function secretsMatch(provided: string, expected: string): boolean {
  const a = sha256(provided);
  const b = sha256(expected);
  return timingSafeEqual(a, b);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminSessionToken(secret: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${exp}`;
  return `${exp}.${sign(payload, secret)}`;
}

export function isValidAdminSessionToken(token: string | undefined, secret: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = sign(`admin:${exp}`, secret);
  try {
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function applyAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated(request?: Request): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  if (request) {
    const headerKey = request.headers.get("x-admin-key");
    if (headerKey && secretsMatch(headerKey, secret)) return true;
  }

  const store = await cookies();
  return isValidAdminSessionToken(store.get(ADMIN_COOKIE)?.value, secret);
}

export async function requireAdmin(request?: Request): Promise<NextResponse | null> {
  const secret = getAdminSecret();
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "ADMIN_SECRET no está configurado. Crea un archivo .env.local (Next no lee .env.example) y reinicia el servidor.",
      },
      { status: 503 }
    );
  }

  const ok = await isAdminAuthenticated(request);
  if (!ok) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return null;
}
