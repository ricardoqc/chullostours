import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { duplicateDestino } from "@/lib/admin/destinos-store";
import { destinoCreateSchema } from "@/lib/admin/destino-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = destinoCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const result = duplicateDestino(slug, parsed.data.slug, parsed.data.title);
    if ("error" in result) {
      const status = result.error === "not_found" ? 404 : 409;
      const message =
        result.error === "not_found" ? "Destino origen no encontrado." : "Ese slug ya existe.";
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({
      success: true,
      file: result.file,
      slug: result.doc.slug,
    });
  } catch (error) {
    console.error("Error duplicating destino:", error);
    return NextResponse.json({ error: "Error al duplicar." }, { status: 500 });
  }
}
