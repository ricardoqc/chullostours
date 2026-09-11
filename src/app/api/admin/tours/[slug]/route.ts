import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/admin/auth";
import { findTourBySlug, saveTourDraft, setTourVisibility } from "@/lib/admin/tours-store";
import { tourDraftSchema, tourToDraft, tourVisibilitySchema } from "@/lib/admin/tour-schema";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const found = findTourBySlug(slug);
  if (!found) {
    return NextResponse.json({ error: `No se encontró el tour '${slug}'.` }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    file: found.file,
    slug: found.tour.slug,
    draft: tourToDraft(found.tour),
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;

  try {
    const body = await request.json();

    if (body && typeof body === "object" && "visible" in body && !("titulo" in body) && !("galeria" in body)) {
      const parsed = tourVisibilitySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Valor de visibilidad inválido." }, { status: 400 });
      }
      const updated = setTourVisibility(slug, parsed.data.visible);
      if (!updated) {
        return NextResponse.json({ error: `No se encontró el tour '${slug}'.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, slug, visible: parsed.data.visible, file: updated.file });
    }

    const parsed = tourDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Hay campos inválidos en el tour.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const saved = saveTourDraft(slug, parsed.data);
    if (!saved) {
      return NextResponse.json({ error: `No se encontró el tour '${slug}'.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      file: saved.file,
      slug: saved.tour.slug,
      draft: tourToDraft(saved.tour),
    });
  } catch (error) {
    console.error("Error saving tour:", error);
    return NextResponse.json({ error: "Error al guardar el tour." }, { status: 500 });
  }
}
