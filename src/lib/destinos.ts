import fs from "fs";
import path from "path";
import type {
  DestinationDocument,
  DestinationIndexData,
  DestinationIndexItem,
} from "@/types/destination";
import placesFallback from "../../data/places.json";

const DESTINOS_DIR = path.join(process.cwd(), "data", "destinos");
const INDEX_PATH = path.join(DESTINOS_DIR, "index.json");

/**
 * Destination data access (contrato estable).
 * Hoy: filesystem JSON en data/destinos.
 * Futuro Directus: reemplazar solo este módulo / destinos-store con adaptador
 *   DESTINO_DATA_SOURCE=directus sin cambiar TipTap ni páginas /destinos.
 */

const DESTINO_REGIONES_FALLBACK: Record<string, string> = {
  cusco: "Cusco, Perú",
  "machu-picchu": "Cusco, Perú",
  "aguas-calientes": "Urubamba, Cusco",
  ollantaytambo: "Valle Sagrado, Cusco",
  sacsayhuaman: "Cusco, Perú",
  "valle-sagrado": "Urubamba, Cusco",
  humantay: "Anta, Cusco",
  vinicunca: "Canchis, Cusco",
  puno: "Puno, Perú",
  lima: "Lima, Perú",
};

export function getDestinosIndex(): DestinationIndexData {
  if (!fs.existsSync(INDEX_PATH)) {
    return { total: 0, updated_at: "", destinations: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")) as DestinationIndexData;
  } catch (err) {
    console.error("Error reading destinos index.json:", err);
    return { total: 0, updated_at: "", destinations: [] };
  }
}

export function readDestinationDocument(slug: string): DestinationDocument | null {
  const filePath = path.join(DESTINOS_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as DestinationDocument;
    } catch (err) {
      console.error(`Error reading destino ${slug}:`, err);
      return null;
    }
  }
  return placeFallbackToDocument(slug);
}

function placeFallbackToDocument(slug: string): DestinationDocument | null {
  const places = placesFallback as Record<
    string,
    { nombre: string; lat: number; lng: number; tipo: string; descripcion: string; imagen: string }
  >;
  const place = places[slug];
  if (!place) return null;
  const region = DESTINO_REGIONES_FALLBACK[slug] || "Perú";
  return {
    id: 0,
    title: place.nombre,
    slug,
    status: "publish",
    region,
    tipo: place.tipo,
    excerpt: place.descripcion,
    body_html: `<p>${place.descripcion}</p>`,
    info_html: "",
    lugares: [],
    tips: [],
    geo: {
      lat: place.lat,
      lng: place.lng,
      country: "PE",
      region_label: region,
    },
    featured_image: place.imagen,
    featured_image_alt: place.nombre,
    gallery: place.imagen ? [place.imagen] : [],
    seo: {
      title: `Tours en ${place.nombre} | Chullos Tours`,
      description: place.descripcion,
      canonical: `https://chullostours.com/destinos/${slug}/`,
      og_image: place.imagen,
    },
  };
}

/** Todos los documentos (incluye draft) — mapas / taxonomía tours. */
export function getAllDestinationDocuments(): DestinationDocument[] {
  const index = getDestinosIndex();
  if (index.destinations.length > 0) {
    return index.destinations
      .map((item) => readDestinationDocument(item.slug))
      .filter((doc): doc is DestinationDocument => Boolean(doc));
  }
  // Fallback: places.json keys
  return Object.keys(placesFallback).map((slug) => placeFallbackToDocument(slug)!).filter(Boolean);
}

export function getPublishedDestinations(): DestinationDocument[] {
  return getAllDestinationDocuments().filter((d) => d.status === "publish");
}

export function getDestinationDocBySlug(
  slug: string,
  opts?: { publishedOnly?: boolean }
): DestinationDocument | null {
  const doc = readDestinationDocument(slug);
  if (!doc) return null;
  if (opts?.publishedOnly && doc.status !== "publish") return null;
  return doc;
}

export function getDestinationSlugOptions(): { id: string; label: string }[] {
  const docs = getAllDestinationDocuments();
  const fromDocs = docs.map((d) => ({ id: d.slug, label: d.title }));
  // Keep legacy taxonomy aliases used by tours
  const extras = [
    { id: "cusco-ciudad", label: "Cusco Ciudad" },
    { id: "lago-titicaca", label: "Lago Titicaca" },
  ];
  const seen = new Set(fromDocs.map((d) => d.id));
  for (const e of extras) {
    if (!seen.has(e.id)) fromDocs.push(e);
  }
  return fromDocs.sort((a, b) => a.label.localeCompare(b.label, "es"));
}

export function generateDestinationSchema(doc: DestinationDocument): Record<string, unknown> {
  const type = doc.geo.schema_tourist_attraction ? "TouristAttraction" : "Place";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: doc.title,
    description: doc.seo.description || doc.excerpt,
    image: doc.seo.og_image || doc.featured_image || undefined,
    url: doc.seo.canonical || `https://chullostours.com/destinos/${doc.slug}/`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: doc.geo.lat,
      longitude: doc.geo.lng,
      ...(doc.geo.altitude_m != null ? { elevation: doc.geo.altitude_m } : {}),
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: doc.geo.region_label || doc.region,
      addressCountry: doc.geo.country || "PE",
    },
    ...(doc.geo.same_as_wikidata ? { sameAs: [doc.geo.same_as_wikidata] } : {}),
  };
}

export type { DestinationDocument, DestinationIndexItem, DestinationIndexData };
