import fs from "fs";
import path from "path";
import type {
  DestinationDocument,
  DestinationIndexData,
  DestinationIndexItem,
} from "@/types/destination";
import {
  applyDraftToDestination,
  destinoToDraft,
  type DestinoDraft,
} from "@/lib/admin/destino-schema";
import { syncMediaUsage } from "@/lib/admin/media-index";
import { revalidateDestinoPages } from "@/lib/admin/revalidate";
import {
  getDestinosIndex,
  getPlacesAsDestinationDocuments,
  listDestinationJsonFiles,
} from "@/lib/destinos";

export const DESTINOS_DIR = path.join(process.cwd(), "data", "destinos");
const INDEX_PATH = path.join(DESTINOS_DIR, "index.json");

export type AdminDestinoSummary = {
  file: string;
  slug: string;
  title: string;
  status: string;
  region: string;
  tipo: string;
  image: string;
};

function destinoOwnerKey(slug: string) {
  return `destino:${slug}`;
}

function writeJsonAtomic(filePath: string, data: unknown) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, filePath);
}

export function readDestinoDocument(
  slug: string
): { file: string; doc: DestinationDocument } | null {
  const filePath = path.join(DESTINOS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const doc = JSON.parse(fs.readFileSync(filePath, "utf-8")) as DestinationDocument;
    return { file: `${slug}.json`, doc };
  } catch (err) {
    console.error(`Error reading destino ${slug}:`, err);
    return null;
  }
}

/**
 * Lista destinos desde JSON en disco (igual que tours), no solo desde index.json.
 * Así el CMS no queda vacío si el volumen de prod tiene places/archivos pero índice vacío.
 */
export function listAdminDestinos(): AdminDestinoSummary[] {
  ensureDestinosIndex();
  const items: AdminDestinoSummary[] = [];
  for (const file of listDestinationJsonFiles()) {
    const slug = file.replace(/\.json$/, "");
    const found = readDestinoDocument(slug);
    if (!found) continue;
    const { doc } = found;
    items.push({
      file,
      slug: doc.slug || slug,
      title: doc.title || slug,
      status: doc.status || "draft",
      region: doc.region || "",
      tipo: doc.tipo || "",
      image: doc.featured_image || "/img/placeholder.jpg",
    });
  }

  // Disco sin JSON editables (volumen vacío / solo lectura): alinear con la web pública
  if (items.length === 0) {
    for (const doc of getPlacesAsDestinationDocuments()) {
      items.push({
        file: `${doc.slug}.json`,
        slug: doc.slug,
        title: doc.title,
        status: doc.status || "publish",
        region: doc.region || "",
        tipo: doc.tipo || "",
        image: doc.featured_image || "/img/placeholder.jpg",
      });
    }
  }

  items.sort((a, b) => a.title.localeCompare(b.title, "es"));
  return items;
}

function toIndexItem(doc: DestinationDocument): DestinationIndexItem {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    region: doc.region,
    tipo: doc.tipo,
    excerpt: doc.excerpt,
    featured_image: doc.featured_image,
    lat: doc.geo.lat,
    lng: doc.geo.lng,
    filename: `${doc.slug}.json`,
  };
}

function syncIndexEntry(doc: DestinationDocument) {
  const index = getDestinosIndex();
  const nextItem = toIndexItem(doc);
  const idx = index.destinations.findIndex(
    (d) => d.slug === doc.slug || d.id === doc.id
  );
  if (idx >= 0) {
    index.destinations[idx] = nextItem;
  } else {
    index.destinations.push(nextItem);
  }
  index.total = index.destinations.length;
  index.updated_at = new Date().toISOString();
  writeJsonAtomic(INDEX_PATH, index);
}

function collectMediaSrcs(doc: DestinationDocument): string[] {
  const srcs: string[] = [];
  if (doc.featured_image?.startsWith("/media/")) srcs.push(doc.featured_image);
  if (doc.seo?.og_image?.startsWith("/media/")) srcs.push(doc.seo.og_image);
  for (const g of doc.gallery || []) {
    if (g.startsWith("/media/")) srcs.push(g);
  }
  for (const lugar of doc.lugares || []) {
    if (lugar.imagen?.startsWith("/media/")) srcs.push(lugar.imagen);
  }
  const re = /src=["'](\/media\/[^"']+)["']/g;
  let match: RegExpExecArray | null;
  const html = `${doc.body_html || ""}${doc.info_html || ""}`;
  while ((match = re.exec(html))) {
    srcs.push(match[1]);
  }
  return srcs;
}

function syncDestinoMediaUsage(doc: DestinationDocument) {
  syncMediaUsage(destinoOwnerKey(doc.slug), collectMediaSrcs(doc));
}

export function writeDestinoDocument(doc: DestinationDocument) {
  fs.mkdirSync(DESTINOS_DIR, { recursive: true });
  const filePath = path.join(DESTINOS_DIR, `${doc.slug}.json`);
  writeJsonAtomic(filePath, doc);
  syncIndexEntry(doc);
  syncDestinoMediaUsage(doc);
}

export function saveDestinoDraft(slug: string, draft: DestinoDraft) {
  const found = readDestinoDocument(slug);
  if (!found) return null;

  const next = applyDraftToDestination(found.doc, draft);
  if (next.slug !== slug) {
    const clash = readDestinoDocument(next.slug);
    if (clash) return { error: "slug_taken" as const };
    writeDestinoDocument(next);
    const oldPath = path.join(DESTINOS_DIR, `${slug}.json`);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    const index = getDestinosIndex();
    index.destinations = index.destinations.filter((d) => d.slug !== slug);
    writeJsonAtomic(INDEX_PATH, index);
    syncIndexEntry(next);
    revalidateDestinoPages(slug);
    revalidateDestinoPages(next.slug);
    return { file: `${next.slug}.json`, doc: next };
  }

  writeDestinoDocument(next);
  revalidateDestinoPages(next.slug);
  return { file: `${next.slug}.json`, doc: next };
}

export function setDestinoStatus(slug: string, status: "publish" | "draft") {
  const found = readDestinoDocument(slug);
  if (!found) return null;
  found.doc.status = status;
  found.doc.modified = new Date().toISOString().slice(0, 10);
  writeDestinoDocument(found.doc);
  revalidateDestinoPages(slug);
  return found;
}

export function createDestino(title: string, slug: string) {
  if (readDestinoDocument(slug)) return { error: "slug_taken" as const };

  const index = getDestinosIndex();
  const maxId = index.destinations.reduce((max, d) => Math.max(max, d.id || 0), 100);
  const doc: DestinationDocument = {
    id: maxId + 1,
    title,
    subtitle: "",
    slug,
    status: "draft",
    region: "Perú",
    tipo: "landmark",
    excerpt: "",
    body_html: "<p></p>",
    info_html: "<p></p>",
    lugares: [],
    tips: [],
    geo: {
      lat: -13.5319,
      lng: -71.9675,
      country: "PE",
      region_label: "Perú",
      schema_tourist_attraction: true,
    },
    featured_image: "",
    featured_image_alt: title,
    gallery: [],
    seo: {
      title: `Tours en ${title} | Chullos Tours`,
      description: "",
      canonical: `https://chullostours.com/destinos/${slug}/`,
    },
    related_place_ids: [],
    created: new Date().toISOString().slice(0, 10),
    modified: new Date().toISOString().slice(0, 10),
  };

  writeDestinoDocument(doc);
  revalidateDestinoPages(slug);
  return { file: `${slug}.json`, doc, draft: destinoToDraft(doc) };
}

export function duplicateDestino(sourceSlug: string, nextSlug: string, title: string) {
  const found = readDestinoDocument(sourceSlug);
  if (!found) return { error: "not_found" as const };
  if (readDestinoDocument(nextSlug)) return { error: "slug_taken" as const };

  const index = getDestinosIndex();
  const maxId = index.destinations.reduce((max, d) => Math.max(max, d.id || 0), 100);
  const copy: DestinationDocument = {
    ...structuredClone(found.doc),
    id: maxId + 1,
    slug: nextSlug,
    title,
    status: "draft",
    created: new Date().toISOString().slice(0, 10),
    modified: new Date().toISOString().slice(0, 10),
    seo: {
      ...found.doc.seo,
      title: `Tours en ${title} | Chullos Tours`,
      canonical: `https://chullostours.com/destinos/${nextSlug}/`,
    },
  };

  writeDestinoDocument(copy);
  revalidateDestinoPages(nextSlug);
  return { file: `${nextSlug}.json`, doc: copy };
}

/**
 * Asegura index.json alineado con los JSON en disco.
 * Si no hay archivos (p. ej. volumen Coolify sin data/destinos), materializa desde places.json
 * para que el admin muestre lo mismo que la web pública.
 */
export function ensureDestinosIndex(): DestinationIndexData {
  fs.mkdirSync(DESTINOS_DIR, { recursive: true });

  let files = listDestinationJsonFiles();
  if (files.length === 0) {
    try {
      const places = getPlacesAsDestinationDocuments();
      places.forEach((place, idx) => {
        const doc: DestinationDocument = {
          ...place,
          id: place.id > 0 ? place.id : idx + 1,
          body_html: place.body_html || `<p>${place.excerpt || ""}</p>`,
          info_html: place.info_html || "<p></p>",
          lugares: place.lugares || [],
          tips: place.tips || [],
          gallery: place.gallery?.length
            ? place.gallery
            : place.featured_image
              ? [place.featured_image]
              : [],
          created: place.created || new Date().toISOString().slice(0, 10),
          modified: place.modified || new Date().toISOString().slice(0, 10),
        };
        writeJsonAtomic(path.join(DESTINOS_DIR, `${doc.slug}.json`), doc);
      });
      files = listDestinationJsonFiles();
    } catch (err) {
      console.error("No se pudieron materializar destinos desde places.json:", err);
    }
  }

  const destinations: DestinationIndexItem[] = [];
  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const found = readDestinoDocument(slug);
    if (!found) continue;
    destinations.push(toIndexItem(found.doc));
  }

  const index: DestinationIndexData = {
    total: destinations.length,
    updated_at: new Date().toISOString(),
    destinations,
  };

  try {
    writeJsonAtomic(INDEX_PATH, index);
  } catch (err) {
    console.error("No se pudo escribir data/destinos/index.json:", err);
  }

  return index;
}
