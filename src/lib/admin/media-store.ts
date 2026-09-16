import fs from "fs";
import path from "path";
import {
  ensureAssetRegistered,
  findAssetByHash,
  findAssetBySrc,
  hashBuffer,
  removeAssetFromIndex,
  repointAssetSrc,
  repointAssetsUnderPrefix,
  shortHash,
} from "@/lib/admin/media-index";

export const MEDIA_FOLDERS = ["library", "home", "site", "tours", "destinos", "blog"] as const;
export const LIBRARY_FOLDER = "library" as const;

export type MediaKind = "image" | "video" | "other";

export type MediaFile = {
  src: string;
  name: string;
  folder: string;
  kind: MediaKind;
  size: number;
  updatedAt: string;
  hash?: string;
  reused?: boolean;
  usedBy?: string[];
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
    const src = publicSrcFromRelative(relative);
    const indexed = findAssetBySrc(src);
    files.push({
      src,
      name,
      folder: normalized,
      kind: kindFromName(name),
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
      hash: indexed?.hash,
      usedBy: indexed?.usedBy,
    });
  }

  folders.sort((a, b) => a.name.localeCompare(b.name, "es"));
  files.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return { folder: normalized, folders, files, root: "/media" };
}

function collectImagesRecursive(relativeFolder: string, acc: MediaFile[]) {
  const listed = listMediaFolder(relativeFolder);
  if (!listed) return;

  for (const file of listed.files) {
    if (file.kind !== "image") continue;
    if (!acc.some((item) => item.src === file.src)) {
      acc.push(file);
    }
  }

  for (const child of listed.folders) {
    collectImagesRecursive(child.folder, acc);
  }
}

/** Flat image list for reuse: library first, then existing tour/destino assets. */
export function listReusableImages() {
  ensureMediaTree();
  const files: MediaFile[] = [];
  collectImagesRecursive(LIBRARY_FOLDER, files);
  collectImagesRecursive("tours", files);
  collectImagesRecursive("destinos", files);
  files.sort((a, b) => {
    const aLib = a.folder === LIBRARY_FOLDER || a.folder.startsWith(`${LIBRARY_FOLDER}/`) ? 0 : 1;
    const bLib = b.folder === LIBRARY_FOLDER || b.folder.startsWith(`${LIBRARY_FOLDER}/`) ? 0 : 1;
    if (aLib !== bLib) return aLib - bLib;
    return a.name.localeCompare(b.name, "es");
  });
  return files.map(({ src, name, folder, size, usedBy }) => ({
    src,
    name,
    folder,
    size,
    usedBy: usedBy || [],
  }));
}

export function listMediaForSlug(slug: string) {
  const reusable = listReusableImages();
  const legacyPreferred = reusable.filter(
    (file) => file.folder === `tours/${slug}` || file.folder.startsWith(`tours/${slug}/`)
  );
  const rest = reusable.filter((file) => !legacyPreferred.some((item) => item.src === file.src));
  return [...legacyPreferred, ...rest].map(({ src, name, folder }) => ({ src, name, folder }));
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

export function sanitizeFolderSegment(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 60);
}

/** Sanitizes a relative upload path like "Album/Sub/foto.jpg" into folder + file parts. */
export function parseRelativeUploadPath(relativePath: string | null | undefined) {
  const cleaned = (relativePath || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
  if (!cleaned || cleaned.includes("..")) return null;

  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const fileName = parts[parts.length - 1];
  const dirParts = parts.slice(0, -1).map(sanitizeFolderSegment).filter(Boolean);
  const safeName = sanitizeUploadName(fileName);
  if (!safeName) return null;

  return {
    relativeDir: dirParts.join("/"),
    safeName,
    originalName: fileName,
  };
}

function resolveUploadTargetFolder(folder: string, relativeDir = "") {
  const requested = normalizeMediaFolder(folder);
  if (requested === null) return null;

  const top = requested.split("/")[0] || LIBRARY_FOLDER;
  // Legacy tour/destino roots → shared library; keep nested library/home/site/blog paths.
  let base =
    top === "tours" || top === "destinos" || !requested ? LIBRARY_FOLDER : requested;

  if (relativeDir) {
    const nested = normalizeMediaFolder(`${base}/${relativeDir}`);
    if (nested === null) return null;
    base = nested;
  }

  return base;
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

function libraryFileName(hash: string, safeName: string) {
  const ext = path.extname(safeName);
  const stem = path.basename(safeName, ext);
  return `${shortHash(hash)}-${stem}${ext}`;
}

function rewriteSrcInJsonFile(filePath: string, oldSrc: string, newSrc: string) {
  if (!fs.existsSync(filePath)) return 0;
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.includes(oldSrc)) return 0;
  const next = raw.split(oldSrc).join(newSrc);
  if (next === raw) return 0;
  fs.writeFileSync(filePath, next, "utf-8");
  return 1;
}

function rewriteMediaReferences(oldSrc: string, newSrc: string) {
  let count = 0;
  const toursDir = path.join(process.cwd(), "data", "tours");
  if (fs.existsSync(toursDir)) {
    for (const name of fs.readdirSync(toursDir)) {
      if (!name.endsWith(".json")) continue;
      count += rewriteSrcInJsonFile(path.join(toursDir, name), oldSrc, newSrc);
    }
  }
  count += rewriteSrcInJsonFile(path.join(process.cwd(), "data", "places.json"), oldSrc, newSrc);
  count += rewriteSrcInJsonFile(path.join(process.cwd(), "data", "home-hero.json"), oldSrc, newSrc);
  return count;
}

function rewriteMediaPrefixReferences(oldPrefix: string, newPrefix: string) {
  const from = oldPrefix.endsWith("/") ? oldPrefix.slice(0, -1) : oldPrefix;
  const to = newPrefix.endsWith("/") ? newPrefix.slice(0, -1) : newPrefix;
  // Replace longer paths first by rewriting file contents with string replace of prefix.
  let count = 0;
  const files: string[] = [];
  const toursDir = path.join(process.cwd(), "data", "tours");
  if (fs.existsSync(toursDir)) {
    for (const name of fs.readdirSync(toursDir)) {
      if (name.endsWith(".json")) files.push(path.join(toursDir, name));
    }
  }
  files.push(path.join(process.cwd(), "data", "places.json"));
  files.push(path.join(process.cwd(), "data", "home-hero.json"));
  const destinosDir = path.join(process.cwd(), "data", "destinos");
  if (fs.existsSync(destinosDir)) {
    for (const name of fs.readdirSync(destinosDir)) {
      if (name.endsWith(".json")) files.push(path.join(destinosDir, name));
    }
  }

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.includes(from)) continue;
    // Match exact folder prefix in /media/... paths
    const next = raw.replaceAll(`${from}/`, `${to}/`).replaceAll(`"${from}"`, `"${to}"`);
    if (next !== raw) {
      fs.writeFileSync(filePath, next, "utf-8");
      count += 1;
    }
  }
  return count;
}

export async function saveUploadedFile(
  folder: string,
  file: File,
  options?: { relativePath?: string }
) {
  const parsedRelative = parseRelativeUploadPath(options?.relativePath);
  const safeName = parsedRelative?.safeName || sanitizeUploadName(file.name);
  if (!safeName) {
    return { error: "Formato no permitido. Usa jpg, png, webp, avif, gif, mp4 o webm." as const };
  }

  const limit = maxBytesForName(safeName);
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    return { error: `El archivo supera el límite de ${mb} MB.` as const };
  }

  const targetFolder = resolveUploadTargetFolder(folder, parsedRelative?.relativeDir || "");
  if (!targetFolder) {
    return { error: "Carpeta no válida. Usa library, home, site, tours, destinos o blog." as const };
  }

  const dir = resolveInsideMedia(targetFolder);
  if (!dir) return { error: "Carpeta no válida. Usa library, home, site, tours, destinos o blog." as const };

  ensureMediaTree();
  fs.mkdirSync(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = hashBuffer(buffer);
  const existing = findAssetByHash(hash);

  if (existing) {
    const relative = existing.src.replace(/^\/media\//, "");
    const existingPath = resolveInsideMedia(
      path.posix.dirname(relative),
      path.posix.basename(relative)
    );
    if (existingPath && fs.existsSync(existingPath)) {
      return {
        file: {
          src: existing.src,
          name: existing.name,
          folder: path.posix.dirname(relative) || LIBRARY_FOLDER,
          kind: existing.kind,
          size: existing.size,
          updatedAt: new Date().toISOString(),
          hash: existing.hash,
          reused: true,
          usedBy: existing.usedBy,
        } satisfies MediaFile,
        reused: true as const,
      };
    }
  }

  const top = targetFolder.split("/")[0];
  const preferHashedName = top === LIBRARY_FOLDER;
  const finalName = preferHashedName
    ? libraryFileName(hash, safeName)
    : uniqueFilePath(dir, safeName);
  const dest = path.join(dir, finalName);

  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, buffer);
  }

  const relative = `${normalizeMediaFolder(targetFolder)}/${finalName}`.replace(/^\//, "");
  const src = publicSrcFromRelative(relative);
  const { asset } = ensureAssetRegistered({
    hash,
    src,
    name: finalName,
    size: buffer.length,
    kind: kindFromName(finalName),
  });

  return {
    file: {
      src,
      name: finalName,
      folder: normalizeMediaFolder(targetFolder) || LIBRARY_FOLDER,
      kind: kindFromName(finalName),
      size: buffer.length,
      updatedAt: new Date().toISOString(),
      hash: asset.hash,
      reused: false,
      usedBy: asset.usedBy,
    } satisfies MediaFile,
    reused: false as const,
  };
}

export function createMediaFolder(parentFolder: string, name: string) {
  const segment = sanitizeFolderSegment(name);
  if (!segment) return { error: "Nombre de carpeta no válido." as const };

  const parent = normalizeMediaFolder(parentFolder);
  if (parent === null || parent === "") {
    return { error: "Indica una carpeta raíz válida (library, home, site…)." as const };
  }

  const nextFolder = normalizeMediaFolder(`${parent}/${segment}`);
  if (!nextFolder) return { error: "Ruta de carpeta no válida." as const };

  const dir = resolveInsideMedia(nextFolder);
  if (!dir) return { error: "Ruta de carpeta no válida." as const };

  if (fs.existsSync(dir)) {
    return { error: "Ya existe una carpeta con ese nombre." as const };
  }

  ensureMediaTree();
  fs.mkdirSync(dir, { recursive: true });
  return { ok: true as const, folder: nextFolder, name: segment };
}

export function renameMediaFolder(folder: string, newName: string) {
  const current = normalizeMediaFolder(folder);
  if (!current || !current.includes("/")) {
    return { error: "No se pueden renombrar las carpetas raíz del volumen." as const };
  }

  const segment = sanitizeFolderSegment(newName);
  if (!segment) return { error: "Nombre de carpeta no válido." as const };

  const parent = path.posix.dirname(current);
  const nextFolder = normalizeMediaFolder(`${parent}/${segment}`);
  if (!nextFolder) return { error: "Ruta de carpeta no válida." as const };
  if (nextFolder === current) return { ok: true as const, folder: current, name: segment };

  const fromPath = resolveInsideMedia(current);
  const toPath = resolveInsideMedia(nextFolder);
  if (!fromPath || !toPath) return { error: "Ruta de carpeta no válida." as const };
  if (!fs.existsSync(fromPath) || !fs.statSync(fromPath).isDirectory()) {
    return { error: "Carpeta no encontrada." as const };
  }
  if (fs.existsSync(toPath)) return { error: "Ya existe una carpeta con ese nombre." as const };

  fs.renameSync(fromPath, toPath);

  const oldPrefix = publicSrcFromRelative(current);
  const newPrefix = publicSrcFromRelative(nextFolder);
  repointAssetsUnderPrefix(oldPrefix, newPrefix);
  rewriteMediaPrefixReferences(oldPrefix, newPrefix);

  return { ok: true as const, folder: nextFolder, name: segment, from: current };
}

export function deleteMediaFolder(folder: string, options?: { recursive?: boolean }) {
  const current = normalizeMediaFolder(folder);
  if (!current || !current.includes("/")) {
    return { error: "No se pueden borrar las carpetas raíz del volumen." as const };
  }

  const dir = resolveInsideMedia(current);
  if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return { error: "Carpeta no encontrada." as const };
  }

  const entries = fs.readdirSync(dir).filter((name) => !shouldSkip(name));
  if (entries.length > 0 && !options?.recursive) {
    return { error: "La carpeta no está vacía. Vacía su contenido o confirma el borrado recursivo." as const };
  }

  // Collect media srcs under this folder for index cleanup / usage check
  const prefix = publicSrcFromRelative(current);
  const blocked: string[] = [];
  const toRemove: string[] = [];

  function walk(relFolder: string) {
    const listed = listMediaFolder(relFolder);
    if (!listed) return;
    for (const file of listed.files) {
      const indexed = findAssetBySrc(file.src);
      if (indexed && indexed.usedBy.length > 0) {
        blocked.push(`${file.src} (${indexed.usedBy.join(", ")})`);
      } else {
        toRemove.push(file.src);
      }
    }
    for (const child of listed.folders) walk(child.folder);
  }

  walk(current);
  if (blocked.length > 0) {
    return {
      error: `No se puede borrar: hay archivos en uso (${blocked.slice(0, 3).join("; ")}).` as const,
    };
  }

  for (const src of toRemove) {
    deleteMediaFile(src, { force: true });
  }

  fs.rmSync(dir, { recursive: true, force: true });
  return { ok: true as const, folder: current, prefix };
}

export function renameMediaFile(src: string, newName: string) {
  if (!src.startsWith("/media/") || src.includes("..")) {
    return { error: "Solo se pueden renombrar archivos del volumen /media." as const };
  }

  const safeName = sanitizeUploadName(newName);
  if (!safeName) {
    return { error: "Nombre de archivo no válido o extensión no permitida." as const };
  }

  const relative = src.replace(/^\/media\//, "").split("?")[0];
  const folder = path.posix.dirname(relative);
  const oldName = path.posix.basename(relative);
  if (safeName === oldName) return { ok: true as const, src, name: safeName };

  const fromPath = resolveInsideMedia(folder, oldName);
  if (!fromPath || !fs.existsSync(fromPath) || !fs.statSync(fromPath).isFile()) {
    return { error: "Archivo no encontrado." as const };
  }

  const dir = path.dirname(fromPath);
  const finalName = uniqueFilePath(dir, safeName);
  const toPath = path.join(dir, finalName);
  fs.renameSync(fromPath, toPath);

  const nextRelative = `${folder}/${finalName}`.replace(/^\//, "");
  const nextSrc = publicSrcFromRelative(nextRelative);
  repointAssetSrc(src, nextSrc, finalName);
  rewriteMediaReferences(src, nextSrc);

  return { ok: true as const, src: nextSrc, name: finalName, from: src };
}

export function deleteMediaFile(src: string, options?: { force?: boolean }) {
  if (!src.startsWith("/media/") || src.includes("..")) {
    return { error: "Solo se pueden borrar archivos del volumen /media." as const };
  }

  const indexed = findAssetBySrc(src);
  if (indexed && indexed.usedBy.length > 0 && !options?.force) {
    return {
      error: `No se puede borrar: está en uso (${indexed.usedBy.join(", ")}).` as const,
      usedBy: indexed.usedBy,
    };
  }

  const relative = src.replace(/^\/media\//, "").split("?")[0];
  const filePath = resolveInsideMedia(path.posix.dirname(relative), path.posix.basename(relative));
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return { error: "Archivo no encontrado." as const };
  }

  fs.unlinkSync(filePath);
  removeAssetFromIndex(src);
  return { ok: true as const, src };
}
