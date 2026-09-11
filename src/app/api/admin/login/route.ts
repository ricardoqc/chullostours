import { NextResponse } from "next/server";
import {
  applyAdminCookie,
  createAdminSessionToken,
  getAdminSecret,
  secretsMatch,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
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

  let body: { key?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!key || !secretsMatch(key, secret)) {
    return NextResponse.json({ error: "Clave administrativa incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  applyAdminCookie(response, createAdminSessionToken(secret), request);
  return response;
}
