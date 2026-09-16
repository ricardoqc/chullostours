import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { readBlogDocument, saveBlogDraft, setBlogStatus } from "@/lib/admin/blogs-store";
import { blogDraftSchema, blogStatusSchema, blogToDraft } from "@/lib/admin/blog-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const found = readBlogDocument(slug);
  if (!found) {
    return NextResponse.json({ error: `No se encontró el post '${slug}'.` }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    file: found.file,
    slug: found.doc.slug,
    draft: blogToDraft(found.doc),
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;

  try {
    const body = await request.json();

    if (body && typeof body === "object" && "status" in body && !("title" in body) && !("body_html" in body)) {
      const parsed = blogStatusSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
      }
      const updated = setBlogStatus(slug, parsed.data.status);
      if (!updated) {
        return NextResponse.json({ error: `No se encontró el post '${slug}'.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, slug, status: parsed.data.status });
    }

    const parsed = blogDraftSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Hay campos inválidos en el post.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const saved = saveBlogDraft(slug, parsed.data);
    if (!saved || "error" in saved) {
      const message =
        saved && "error" in saved && saved.error === "slug_taken"
          ? "Ese slug ya está en uso."
          : `No se encontró el post '${slug}'.`;
      return NextResponse.json({ error: message }, { status: saved && "error" in saved ? 409 : 404 });
    }

    return NextResponse.json({
      success: true,
      file: saved.file,
      slug: saved.doc.slug,
      draft: blogToDraft(saved.doc),
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json({ error: "Error al guardar el post." }, { status: 500 });
  }
}
