import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createMediaFolder,
  deleteMediaFile,
  deleteMediaFolder,
  listMediaFolder,
  listMediaForSlug,
  listReusableImages,
  publicSrcExists,
  renameMediaFile,
  renameMediaFolder,
  saveUploadedFile,
} from "@/lib/admin/media-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";
  const slug = searchParams.get("slug") || "";
  const reusable = searchParams.get("reusable");
  const folder = searchParams.get("folder");

  if (src) {
    return NextResponse.json({
      success: true,
      src,
      exists: publicSrcExists(src),
    });
  }

  if (reusable === "1" || reusable === "true") {
    return NextResponse.json({
      success: true,
      files: listReusableImages(),
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

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      action?: string;
      folder?: string;
      name?: string;
    };

    if (body.action === "create-folder") {
      const result = createMediaFolder(String(body.folder || ""), String(body.name || ""));
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  }

  const form = await request.formData();
  const folder = String(form.get("folder") || "library");
  const relativePath = String(form.get("relativePath") || "");
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Adjunta un archivo." }, { status: 400 });
  }

  const result = await saveUploadedFile(folder, file, {
    relativePath: relativePath || undefined,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    file: result.file,
    reused: Boolean(result.reused),
  });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    action?: string;
    folder?: string;
    src?: string;
    name?: string;
  };

  if (body.action === "rename-folder") {
    const result = renameMediaFolder(String(body.folder || ""), String(body.name || ""));
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...result });
  }

  if (body.action === "rename-file") {
    const result = renameMediaFile(String(body.src || ""), String(body.name || ""));
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...result });
  }

  return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";
  const folder = searchParams.get("folder") || "";
  const force = searchParams.get("force") === "1";
  const recursive = searchParams.get("recursive") === "1";

  if (folder) {
    const result = deleteMediaFolder(folder, { recursive: recursive || force });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, folder: result.folder });
  }

  const result = deleteMediaFile(src, { force });
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, usedBy: "usedBy" in result ? result.usedBy : undefined },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, src: result.src });
}
