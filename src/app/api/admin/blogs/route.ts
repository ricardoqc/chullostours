import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createBlogPost,
  ensureBlogJsonFiles,
  listAdminBlogs,
  setBlogStatus,
} from "@/lib/admin/blogs-store";
import { blogCreateSchema, blogStatusSchema } from "@/lib/admin/blog-schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  ensureBlogJsonFiles();
  return NextResponse.json({ success: true, posts: listAdminBlogs() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();

    if (body && typeof body === "object" && "status" in body && "slug" in body && !("title" in body)) {
      const parsed = blogStatusSchema.safeParse({ status: body.status });
      if (!parsed.success) {
        return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
      }
      const updated = setBlogStatus(String(body.slug), parsed.data.status);
      if (!updated) {
        return NextResponse.json({ error: "Post no encontrado." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        slug: body.slug,
        status: parsed.data.status,
      });
    }

    const parsed = blogCreateSchema.safeParse(body);
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

    const created = createBlogPost(parsed.data.title, parsed.data.slug);
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
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Error al crear el post." }, { status: 500 });
  }
}
