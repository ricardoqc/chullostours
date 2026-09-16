import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  readDestinoDocument,
  saveDestinoDraft,
  setDestinoStatus,
} from "@/lib/admin/destinos-store";
import {
  destinoDraftSchema,
  destinoStatusSchema,
  destinoToDraft,
} from "@/lib/admin/destino-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const found = readDestinoDocument(slug);
  if (!found) {
    return NextResponse.json({ error: `No se encontró el destino '${slug}'.` }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    file: found.file,
    slug: found.doc.slug,
    draft: destinoToDraft(found.doc),
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;

  try {
    const body = await request.json();

    if (
      body &&
      typeof body === "object" &&
      "status" in body &&
      !("title" in body) &&
      !("body_html" in body)
    ) {
      const parsed = destinoStatusSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
      }
      const updated = setDestinoStatus(slug, parsed.data.status);
      if (!updated) {
        return NextResponse.json({ error: `No se encontró el destino '${slug}'.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, slug, status: parsed.data.status });
    }

    const parsed = destinoDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Hay campos inválidos en el destino.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const saved = saveDestinoDraft(slug, parsed.data);
    if (!saved || "error" in saved) {
      const message =
        saved && "error" in saved && saved.error === "slug_taken"
          ? "Ese slug ya está en uso."
          : `No se encontró el destino '${slug}'.`;
      return NextResponse.json(
        { error: message },
        { status: saved && "error" in saved ? 409 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      file: saved.file,
      slug: saved.doc.slug,
      draft: destinoToDraft(saved.doc),
    });
  } catch (error) {
    console.error("Error saving destino:", error);
    return NextResponse.json({ error: "Error al guardar el destino." }, { status: 500 });
  }
}
