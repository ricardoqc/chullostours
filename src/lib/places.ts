import placesFallback from "../../data/places.json";
import destinosIndexData from "../../data/destinos/index.json";
import type { MapaDestino, Tour } from "@/types/tour";
import type { DestinationIndexData } from "@/types/destination";

export interface PlaceRecord {
  nombre: string;
  lat: number;
  lng: number;
  tipo: string;
  descripcion: string;
  imagen: string;
  status?: string;
  region?: string;
}

export type PlacesCatalog = Record<string, PlaceRecord>;

const destinosIndex = destinosIndexData as DestinationIndexData;

/** Catálogo GEO/mapas: index CMS (client-safe) + fallback places.json. */
function buildPlacesCatalog(): PlacesCatalog {
  const catalog: PlacesCatalog = {};
  if (destinosIndex.destinations?.length) {
    for (const item of destinosIndex.destinations) {
      catalog[item.slug] = {
        nombre: item.title,
        lat: item.lat,
        lng: item.lng,
        tipo: item.tipo,
        descripcion: item.excerpt,
        imagen: item.featured_image,
        status: item.status,
        region: item.region,
      };
    }
    return catalog;
  }
  return placesFallback as PlacesCatalog;
}

export const placesCatalog: PlacesCatalog = buildPlacesCatalog();

export interface ResolvedMapStop {
  id: string;
  order: number;
  dia?: number;
  marker?: MapaDestino["marker"];
  lat: number;
  lng: number;
  title: string;
  summary: string;
  image: string;
}

export function resolveMapStops(destinos: MapaDestino[]): ResolvedMapStop[] {
  const catalog = buildPlacesCatalog();
  const stops: ResolvedMapStop[] = [];
  for (const d of destinos.slice().sort((a, b) => a.order - b.order)) {
    const place = catalog[d.place_id];
    if (!place) continue;
    stops.push({
      id: d.place_id,
      order: d.order,
      dia: d.dia,
      marker: d.marker,
      lat: place.lat,
      lng: place.lng,
      title: place.nombre,
      summary: place.descripcion,
      image: place.imagen,
    });
  }
  return stops;
}

const DESTINO_ID_ALIASES: Record<string, string> = {
  "cusco-ciudad": "cusco",
  cusco: "cusco",
  "machu-picchu": "machu-picchu",
  "valle-sagrado": "valle-sagrado",
  humantay: "humantay",
  vinicunca: "vinicunca",
  puno: "puno",
  lima: "lima",
  "aguas-calientes": "aguas-calientes",
  ollantaytambo: "ollantaytambo",
};

/** Resuelve paradas del mapa desde `mapa.destinos` o, si falta, desde `destino_ids`. */
export function resolveTourMapStops(tour: Tour): ResolvedMapStop[] {
  const catalog = buildPlacesCatalog();
  if (tour.mapa?.destinos?.length) {
    const fromMapa = resolveMapStops(tour.mapa.destinos);
    if (fromMapa.length > 0) return fromMapa;
  }

  const destinos: MapaDestino[] = [];
  const seen = new Set<string>();
  for (const rawId of tour.destino_ids ?? []) {
    const placeId =
      DESTINO_ID_ALIASES[rawId] ?? (catalog[rawId] ? rawId : undefined);
    if (!placeId || seen.has(placeId)) continue;
    seen.add(placeId);
    destinos.push({
      place_id: placeId,
      order: destinos.length + 1,
      marker: catalog[placeId]?.tipo as MapaDestino["marker"],
    });
  }

  const fromIds = resolveMapStops(destinos);
  if (fromIds.length > 0) return fromIds;

  return resolveMapStops([{ place_id: "cusco", order: 1, marker: "city" }]);
}

export interface DestinationSummary {
  slug: string;
  nombre: string;
  region: string;
  descripcion: string;
  imagen: string;
  tipo: string;
  toursCount: number;
  subtitle?: string;
}

const DESTINO_ID_EXTRA_ALIASES: Record<string, string> = {
  "lago-titicaca": "puno",
  "cusco-ciudad": "cusco",
  "islas-uros": "puno",
};

function normalizeDestinoId(rawId: string): string | undefined {
  const catalog = buildPlacesCatalog();
  const placeId =
    DESTINO_ID_EXTRA_ALIASES[rawId] ?? DESTINO_ID_ALIASES[rawId] ?? rawId;
  return catalog[placeId] ? placeId : undefined;
}

export function getTourDestinationIds(tour: Tour): string[] {
  const ids = new Set<string>();
  for (const rawId of tour.destino_ids ?? []) {
    const placeId = normalizeDestinoId(rawId);
    if (placeId) ids.add(placeId);
  }
  return [...ids];
}

export function isDestinationSlug(slug: string): boolean {
  return Boolean(buildPlacesCatalog()[slug]);
}

function summaryFromCatalog(
  slug: string,
  toursCount: number
): DestinationSummary | null {
  const place = buildPlacesCatalog()[slug];
  if (!place) return null;
  const indexItem = destinosIndex.destinations?.find((d) => d.slug === slug);
  return {
    slug,
    nombre: place.nombre,
    region: place.region || indexItem?.region || "Perú",
    descripcion: place.descripcion,
    imagen: place.imagen,
    tipo: place.tipo,
    toursCount,
  };
}

export function getToursByDestination(slug: string, tours: Tour[]): Tour[] {
  if (!isDestinationSlug(slug)) return [];
  return tours.filter((tour) => getTourDestinationIds(tour).includes(slug));
}

/** Público: solo destinos publicados. */
export function getDestinationBySlug(
  slug: string,
  tours: Tour[]
): DestinationSummary | null {
  const place = buildPlacesCatalog()[slug];
  if (!place) return null;
  if (place.status && place.status !== "publish") return null;
  return summaryFromCatalog(slug, getToursByDestination(slug, tours).length);
}

/** Destinos publicados (todos, con o sin tours), ordenados por volumen de tours. */
export function getPublishedDestinationSummaries(tours: Tour[]): DestinationSummary[] {
  const catalog = buildPlacesCatalog();
  return Object.keys(catalog)
    .filter((slug) => !catalog[slug].status || catalog[slug].status === "publish")
    .map((slug) =>
      summaryFromCatalog(slug, getToursByDestination(slug, tours).length)
    )
    .filter((s): s is DestinationSummary => Boolean(s))
    .sort(
      (a, b) =>
        b.toursCount - a.toursCount || a.nombre.localeCompare(b.nombre, "es")
    );
}

/** Destinos publicados con al menos un tour. */
export function getDestinationsWithTours(tours: Tour[]): DestinationSummary[] {
  return getPublishedDestinationSummaries(tours).filter((d) => d.toursCount > 0);
}

/** Opciones de slug para admin tours (desde index CMS + aliases legacy). */
export function getDestinationSlugOptions(): { id: string; label: string }[] {
  const fromIndex = (destinosIndex.destinations || []).map((d) => ({
    id: d.slug,
    label: d.title,
  }));
  const extras = [
    { id: "cusco-ciudad", label: "Cusco Ciudad" },
    { id: "lago-titicaca", label: "Lago Titicaca" },
  ];
  const seen = new Set(fromIndex.map((d) => d.id));
  for (const e of extras) {
    if (!seen.has(e.id)) fromIndex.push(e);
  }
  return fromIndex.sort((a, b) => a.label.localeCompare(b.label, "es"));
}
