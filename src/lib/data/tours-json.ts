import fs from "fs";
import path from "path";
import { Tour } from "@/types/tour";

const dataDirectory = path.join(process.cwd(), "data", "tours");

let cachedTours: Tour[] | null = null;
let cachedMtimeMs = -1;

/** Máximo tiempo que un worker puede servir JSON en memoria tras un cambio en disco. */
const CACHE_TTL_MS = 5_000;
let cachedAtMs = 0;

function toursDirMtimeMs(): number {
  try {
    if (!fs.existsSync(dataDirectory)) return 0;
    let max = fs.statSync(dataDirectory).mtimeMs;
    for (const name of fs.readdirSync(dataDirectory)) {
      if (!name.endsWith(".json")) continue;
      try {
        max = Math.max(max, fs.statSync(path.join(dataDirectory, name)).mtimeMs);
      } catch {
        /* ignore */
      }
    }
    return max;
  } catch {
    return Date.now();
  }
}

/** Low-level JSON file reader with short-lived in-memory caching */
export function readAllToursFromJson(): Tour[] {
  const now = Date.now();
  const dirMtime = toursDirMtimeMs();

  if (
    cachedTours &&
    cachedTours.length > 0 &&
    process.env.NODE_ENV === "production" &&
    cachedMtimeMs === dirMtime &&
    now - cachedAtMs < CACHE_TTL_MS
  ) {
    return cachedTours;
  }

  if (!fs.existsSync(dataDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(dataDirectory);
  const tours: Tour[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(dataDirectory, fileName);
    try {
      const stat = fs.statSync(filePath);

      if (
        stat.isFile() &&
        fileName.endsWith(".json") &&
        fileName !== "rutas_migracion.json"
      ) {
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const tourData: Tour = JSON.parse(fileContents);
        if (tourData && tourData.slug) {
          tours.push(tourData);
        }
      }
    } catch (err) {
      console.error(`Error parsing tour file ${fileName}:`, err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    cachedTours = tours;
    cachedMtimeMs = dirMtime;
    cachedAtMs = now;
  }

  return tours;
}

/** Invalida el caché en memoria tras una edición del CMS. */
export function clearToursJsonCache() {
  cachedTours = null;
  cachedMtimeMs = -1;
  cachedAtMs = 0;
}

export function readTourBySlugFromJson(rawSlug: string): Tour | null {
  if (!rawSlug) return null;

  const normalized = decodeURIComponent(rawSlug)
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "");

  const allTours = readAllToursFromJson();

  // 1. Exact match
  const exact = allTours.find((t) => t.slug?.toLowerCase() === normalized);
  if (exact) return exact;

  // 2. Dash/underscore normalized match
  const normalizedDash = normalized.replace(/_/g, "-");
  const dashMatch = allTours.find(
    (t) => t.slug?.toLowerCase().replace(/_/g, "-") === normalizedDash
  );
  if (dashMatch) return dashMatch;

  // 3. Match against file names or title slugs
  const fileMatch = allTours.find((t) => {
    const s = (t.slug || "").toLowerCase();
    return s.includes(normalizedDash) || normalizedDash.includes(s);
  });
  if (fileMatch) return fileMatch;

  return null;
}
