import fs from "fs";
import path from "path";

export const MEDIA_FOLDERS = ["home", "site", "tours", "destinos", "blog"] as const;

export type MediaKind = "image" | "video" | "other";

export type MediaFile = {
  src: string;
  name: string;
  folder: string;
  kind: MediaKind;
  size: number;
  updatedAt: string;
};

export type MediaFolderEntry = {
  name: string;
  folder: string;
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
const VIDEO_EXT = /\.(mp4|webm)$/i;
const ALLOWED_EXT = /\.(jpe?g|png|webp|avif|gif|mp4|webm)$/i;
const SKIP_NAMES = new Set([".gitkeep", "_inventario.txt"]);

const IMAGE_MAX_BYTES = 12 * 1024 * 1024;
const VIDEO_MAX_BYTES = 80 * 1024 * 1024;

function defaultMediaRoot() {
  return path.join(process.cwd(), "public", "media");
}

export function getMediaRoot(): string {
  const fromEnv = process.env.MEDIA_ROOT?.trim();
  return path.resolve(fromEnv || defaultMediaRoot());
}

export function ensureMediaTree() {
  const root = getMediaRoot();
  fs.mkdirSync(root, { recursive: true });
  for (const folder of MEDIA_FOLDERS) {
    fs.mkdirSync(path.join(root, folder), { recursive: true });
  }
}

function withRootSep(root: string) {
  return root.endsWith(path.sep) ? root : `${root}${path.sep}`;
}

export function normalizeMediaFolder(folder: string | null | undefined): string | null {
  const cleaned = (folder || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/+/g, "/");

  if (!cleaned) return "";
  if (cleaned.includes("..") || cleaned.startsWith("media/")) return null;

  const top = cleaned.split("/")[0];
  if (!MEDIA_FOLDERS.includes(top as (typeof MEDIA_FOLDERS)[number])) return null;

  return cleaned;
}

export function resolveInsideMedia(relativeFolder: string, fileName = ""): string | null {
  const folder = normalizeMediaFolder(relativeFolder);
  if (folder === null) return null;

  const root = getMediaRoot();
  const target = path.resolve(root, folder, fileName);
  const allowedRoot = withRootSep(root);
  if (target !== root && !target.startsWith(allowedRoot)) return null;
  return target;
}

export function publicSrcFromRelative(relativePath: string) {
  return `/media/${relativePath.replace(/^\/+/, "")}`;
}

export function kindFromName(name: string): MediaKind {
  if (IMAGE_EXT.test(name)) return "image";
  if (VIDEO_EXT.test(name)) return "video";
  return "other";
}

function shouldSkip(name: string) {
  return name.startsWith(".") || SKIP_NAMES.has(name.toLowerCase());
}

export function listMediaFolder(folder = "") {
  ensureMediaTree();
  const dir = resolveInsideMedia(folder);
  if (!dir) return null;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const folders: MediaFolderEntry[] = [];
  const files: MediaFile[] = [];
  const normalized = normalizeMediaFolder(folder) || "";

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      folders.push({
        name,
        folder: normalized ? `${normalized}/${name}` : name,
      });
      continue;
    }

    if (!stat.isFile() || shouldSkip(name) || !ALLOWED_EXT.test(name)) continue;
    const relative = normalized ? `${normalized}/${name}` : name;
    files.push({
      src: publicSrcFromRelative(relative),
      name,
      folder: normalized,
      kind: kindFromName(name),
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
    });
  }

  folders.sort((a, b) => a.name.localeCompare(b.name, "es"));
  files.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return { folder: normalized, folders, files, root: "/media" };
}

export function listMediaForSlug(slug: string) {
  ensureMediaTree();
  const folder = `tours/${slug}`;
  const listed = listMediaFolder(folder);
  const items = (listed?.files || []).filter((file) => file.kind === "image");

  const legacyDir = path.join(process.cwd(), "public", "tours", slug);
  if (fs.existsSync(legacyDir)) {
    for (const name of fs.readdirSync(legacyDir)) {
      if (!IMAGE_EXT.test(name)) continue;
      const src = `/tours/${slug}/${name}`;
      if (!items.some((item) => item.src === src)) {
        items.push({
          src,
          name,
          folder: `tours/${slug}`,
          kind: "image",
          size: 0,
          updatedAt: "",
        });
      }
    }
  }

  return items.map(({ src, name }) => ({ src, name }));
}

export function publicSrcExists(src: string): boolean {
  if (src.startsWith("http://") || src.startsWith("https://")) return true;
  if (!src.startsWith("/") || src.includes("..")) return false;
  const relative = src.replace(/^\//, "").split("?")[0];

  if (relative.startsWith("media/")) {
    const inside = relative.slice("media/".length);
    const filePath = resolveInsideMedia(path.posix.dirname(inside), path.posix.basename(inside));
    return Boolean(filePath && fs.existsSync(filePath));
  }

  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

export function sanitizeUploadName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  if (!ALLOWED_EXT.test(ext)) return null;
  return `${base || "archivo"}${ext}`;
}

export function uniqueFilePath(dir: string, fileName: string) {
  const ext = path.extname(fileName);
  const stem = path.basename(fileName, ext);
  let candidate = fileName;
  let i = 2;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${stem}-${i}${ext}`;
    i += 1;
  }
  return candidate;
}

export function maxBytesForName(name: string) {
  return kindFromName(name) === "video" ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES;
}

export async function saveUploadedFile(folder: string, file: File) {
  const safeName = sanitizeUploadName(file.name);
  if (!safeName) {
    return { error: "Formato no permitido. Usa jpg, png, webp, avif, gif, mp4 o webm." as const };
  }

  const limit = maxBytesForName(safeName);
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    return { error: `El archivo supera el límite de ${mb} MB.` as const };
  }

  const dir = resolveInsideMedia(folder);
  if (!dir) return { error: "Carpeta no válida. Usa home, site, tours, destinos o blog." as const };

  ensureMediaTree();
  fs.mkdirSync(dir, { recursive: true });

  const finalName = uniqueFilePath(dir, safeName);
  const dest = path.join(dir, finalName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(dest, buffer);

  const relative = `${normalizeMediaFolder(folder)}/${finalName}`.replace(/^\//, "");
  return {
    file: {
      src: publicSrcFromRelative(relative),
      name: finalName,
      folder: normalizeMediaFolder(folder) || "",
      kind: kindFromName(finalName),
      size: buffer.length,
      updatedAt: new Date().toISOString(),
    } satisfies MediaFile,
  };
}

export function deleteMediaFile(src: string) {
  if (!src.startsWith("/media/") || src.includes("..")) {
    return { error: "Solo se pueden borrar archivos del volumen /media." as const };
  }

  const relative = src.replace(/^\/media\//, "").split("?")[0];
  const filePath = resolveInsideMedia(path.posix.dirname(relative), path.posix.basename(relative));
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return { error: "Archivo no encontrado." as const };
  }

  fs.unlinkSync(filePath);
  return { ok: true as const, src };
}
