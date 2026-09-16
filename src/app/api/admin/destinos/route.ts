import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createDestino,
  ensureDestinosIndex,
  listAdminDestinos,
  setDestinoStatus,
} from "@/lib/admin/destinos-store";
import { destinoCreateSchema, destinoStatusSchema } from "@/lib/admin/destino-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  ensureDestinosIndex();
  const destinations = listAdminDestinos();
  return NextResponse.json({
    success: true,
    destinations,
    options: destinations.map((d) => ({
      id: d.slug,
      label: d.title,
      status: d.status,
    })),
  });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();

    if (body && typeof body === "object" && "status" in body && "slug" in body && !("title" in body)) {
      const parsed = destinoStatusSchema.safeParse({ status: body.status });
      if (!parsed.success) {
        return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
      }
      const updated = setDestinoStatus(String(body.slug), parsed.data.status);
      if (!updated) {
        return NextResponse.json({ error: "Destino no encontrado." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        slug: body.slug,
        status: parsed.data.status,
      });
    }

    const parsed = destinoCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const created = createDestino(parsed.data.title, parsed.data.slug);
    if ("error" in created) {
      return NextResponse.json({ error: "Ese slug ya existe." }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      file: created.file,
      slug: created.doc.slug,
      draft: created.draft,
    });
  } catch (error) {
    console.error("Error creating destino:", error);
    return NextResponse.json({ error: "Error al crear el destino." }, { status: 500 });
  }
}
