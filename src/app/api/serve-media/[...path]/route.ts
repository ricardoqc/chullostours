import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { resolveInsideMedia } from "@/lib/admin/media-store";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { obfuscateMediaBuffer, shouldServeClearMedia } from "@/lib/media-access";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path: parts } = await context.params;
  if (!parts?.length) {
    return NextResponse.json({ error: "Ruta inválida." }, { status: 400 });
  }

  const relative = parts.map((part) => decodeURIComponent(part)).join("/");
  const folder = path.posix.dirname(relative);
  const fileName = path.posix.basename(relative);
  const filePath = resolveInsideMedia(folder === "." ? "" : folder, fileName);

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const stat = fs.statSync(filePath);
  const admin = await isAdminAuthenticated(request);
  const serveClear = admin || shouldServeClearMedia(request, relative);

  const range = request.headers.get("range");
  if (serveClear && range && (ext === ".mp4" || ext === ".webm")) {
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : Math.min(start + 1024 * 1024 - 1, stat.size - 1);
      if (start >= stat.size || end >= stat.size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${stat.size}` },
        });
      }
      const chunk = fs.readFileSync(filePath).subarray(start, end + 1);
      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(chunk.length),
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  }

  const buffer = fs.readFileSync(filePath);

  if (!serveClear) {
    const encrypted = obfuscateMediaBuffer(buffer);
    const safeBase = fileName.replace(/\.[^.]+$/, "") || "chullos-media";
    return new NextResponse(new Uint8Array(encrypted), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(encrypted.length),
        "Content-Disposition": `attachment; filename="${safeBase}.chullos.enc"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Chullos-Media": "protected",
      },
    });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${fileName.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-site",
    },
  });
}
