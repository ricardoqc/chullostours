import { createHash, createHmac, timingSafeEqual } from "crypto";

const VIEW_TTL_MS = 10 * 60 * 1000;

function mediaSecret() {
  return (
    process.env.MEDIA_VIEW_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    "chullos-media-dev-secret"
  );
}

function keyBytes() {
  return createHash("sha256").update(mediaSecret()).digest();
}

/** XOR stream cipher — el archivo .enc no es una imagen válida. */
export function obfuscateMediaBuffer(buffer: Buffer): Buffer {
  const key = keyBytes();
  const out = Buffer.allocUnsafe(buffer.length);
  for (let i = 0; i < buffer.length; i += 1) {
    out[i] = buffer[i] ^ key[i % key.length] ^ (i & 0xff);
  }
  return out;
}

export function signMediaView(relativePath: string, exp = Date.now() + VIEW_TTL_MS): string {
  const payload = `${relativePath}:${exp}`;
  const sig = createHmac("sha256", mediaSecret()).update(payload).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyMediaView(relativePath: string, token: string | null | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = createHmac("sha256", mediaSecret()).update(`${relativePath}:${exp}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function publicSrcToRelative(src: string): string | null {
  const clean = src.split("?")[0].split("#")[0];
  if (!clean.startsWith("/media/")) return null;
  return clean.slice("/media/".length);
}

/**
 * Decide si servir el binario claro o el .enc.
 * - Vista embebida (img/video same-origin) → claro
 * - Admin / firma view → claro
 * - Abrir URL / descargar / curl → cifrado
 */
export function shouldServeClearMedia(request: Request, relativePath: string): boolean {
  const url = new URL(request.url);
  if (url.searchParams.get("download") === "1") return false;

  const view = url.searchParams.get("view");
  if (view && verifyMediaView(relativePath, view)) return true;

  const dest = (request.headers.get("sec-fetch-dest") || "").toLowerCase();
  const site = (request.headers.get("sec-fetch-site") || "").toLowerCase();
  const mode = (request.headers.get("sec-fetch-mode") || "").toLowerCase();

  // Navegación directa a la URL → archivo cifrado
  if (dest === "document" || mode === "navigate") return false;

  // <img>, <video>, picture, CSS, next/image optimizer suele pedir como image
  if (dest === "image" || dest === "video" || dest === "audio") {
    if (site === "same-origin" || site === "same-site" || site === "none") return true;
  }

  // Next.js image optimizer (fetch servidor, a menudo sin Sec-Fetch-Dest)
  const accept = request.headers.get("accept") || "";
  const ua = request.headers.get("user-agent") || "";
  if (!dest && (accept.includes("image/") || ua.includes("Next.js") || ua.includes("node"))) {
    return true;
  }

  return false;
}
