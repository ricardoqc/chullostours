import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { duplicateBlogPost } from "@/lib/admin/blogs-store";
import { z } from "zod";
import { blogToDraft } from "@/lib/admin/blog-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const duplicateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2),
});

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { slug } = await context.params;
  try {
    const body = await request.json();
    const parsed = duplicateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos de duplicado inválidos." }, { status: 400 });
    }

    const result = duplicateBlogPost(slug, parsed.data.slug, parsed.data.title);
    if ("error" in result) {
      const status = result.error === "not_found" ? 404 : 409;
      return NextResponse.json(
        { error: result.error === "not_found" ? "Post no encontrado." : "Slug en uso." },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      file: result.file,
      slug: result.doc.slug,
      draft: blogToDraft(result.doc),
    });
  } catch (error) {
    console.error("Error duplicating blog:", error);
    return NextResponse.json({ error: "Error al duplicar." }, { status: 500 });
  }
}
