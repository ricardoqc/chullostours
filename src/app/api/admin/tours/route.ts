import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/admin/auth";
import { listAdminTours, setTourVisibility } from "@/lib/admin/tours-store";
import { tourVisibilitySchema } from "@/lib/admin/tour-schema";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const tours = listAdminTours();
    return NextResponse.json({
      success: true,
      total: tours.length,
      published: tours.filter((tour) => tour.visible).length,
      hidden: tours.filter((tour) => !tour.visible).length,
      tours,
    });
  } catch (error) {
    console.error("Error fetching admin tours:", error);
    return NextResponse.json({ error: "Error al leer el catálogo de tours." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = tourVisibilitySchema.safeParse({ visible: body.visible });
    const slug = typeof body.slug === "string" ? body.slug : "";

    if (!slug || !parsed.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos. Se requiere 'slug' y 'visible' (booleano)." },
        { status: 400 }
      );
    }

    const updated = setTourVisibility(slug, parsed.data.visible);
    if (!updated) {
      return NextResponse.json(
        { error: `No se encontró ningún tour con el slug '${slug}'.` },
        { status: 404 }
      );
    }

    const tourTitle = updated.tour.titulo || slug;
    return NextResponse.json({
      success: true,
      message: parsed.data.visible
        ? `El tour '${tourTitle}' ahora está PUBLICADO y VISIBLE en la web.`
        : `El tour '${tourTitle}' ha sido DESACTIVADO y OCULTO de la web.`,
      slug,
      visible: parsed.data.visible,
      file: updated.file,
    });
  } catch (error) {
    console.error("Error updating tour visibility:", error);
    return NextResponse.json({ error: "Error al actualizar la visibilidad del tour." }, { status: 500 });
  }
}
