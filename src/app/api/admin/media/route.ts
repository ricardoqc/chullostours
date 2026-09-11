import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  deleteMediaFile,
  listMediaFolder,
  listMediaForSlug,
  publicSrcExists,
  saveUploadedFile,
} from "@/lib/admin/media-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";
  const slug = searchParams.get("slug") || "";
  const folder = searchParams.get("folder");

  if (src) {
    return NextResponse.json({
      success: true,
      src,
      exists: publicSrcExists(src),
    });
  }

  if (slug) {
    return NextResponse.json({
      success: true,
      slug,
      files: listMediaForSlug(slug),
    });
  }

  const listed = listMediaFolder(folder || "");
  if (!listed) {
    return NextResponse.json({ error: "Carpeta no válida." }, { status: 400 });
  }

  return NextResponse.json({ success: true, ...listed });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const form = await request.formData();
  const folder = String(form.get("folder") || "");
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Adjunta un archivo." }, { status: 400 });
  }

  const result = await saveUploadedFile(folder, file);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, file: result.file });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";
  const result = deleteMediaFile(src);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, src: result.src });
}
