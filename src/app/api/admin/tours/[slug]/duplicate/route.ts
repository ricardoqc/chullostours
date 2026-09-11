import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { duplicateTour } from "@/lib/admin/tours-store";
import { tourDuplicateSchema, tourToDraft } from "@/lib/admin/tour-schema";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = tourDuplicateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Slug o título inválidos para duplicar." }, { status: 400 });
    }

    const result = duplicateTour(slug, parsed.data.slug, parsed.data.titulo);
    if ("error" in result && result.error === "not_found") {
      return NextResponse.json({ error: `No se encontró el tour '${slug}'.` }, { status: 404 });
    }
    if ("error" in result && result.error === "slug_taken") {
      return NextResponse.json({ error: "Ya existe un tour con ese slug." }, { status: 409 });
    }
    if (!("tour" in result)) {
      return NextResponse.json({ error: "No se pudo duplicar el tour." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      file: result.file,
      slug: result.tour.slug,
      draft: tourToDraft(result.tour),
    });
  } catch (error) {
    console.error("Error duplicating tour:", error);
    return NextResponse.json({ error: "Error al duplicar el tour." }, { status: 500 });
  }
}
