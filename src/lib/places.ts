import placesData from "../../data/places.json";
import type { MapaDestino, Tour } from "@/types/tour";

export interface PlaceRecord {
  nombre: string;
  lat: number;
  lng: number;
  tipo: string;
  descripcion: string;
  imagen: string;
}

export type PlacesCatalog = Record<string, PlaceRecord>;

export const placesCatalog = placesData as PlacesCatalog;

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
  const stops: ResolvedMapStop[] = [];
  for (const d of destinos.slice().sort((a, b) => a.order - b.order)) {
    const place = placesCatalog[d.place_id];
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
  if (tour.mapa?.destinos?.length) {
    const fromMapa = resolveMapStops(tour.mapa.destinos);
    if (fromMapa.length > 0) return fromMapa;
  }

  const destinos: MapaDestino[] = [];
  const seen = new Set<string>();
  for (const rawId of tour.destino_ids ?? []) {
    const placeId =
      DESTINO_ID_ALIASES[rawId] ?? (placesCatalog[rawId] ? rawId : undefined);
    if (!placeId || seen.has(placeId)) continue;
    seen.add(placeId);
    destinos.push({
      place_id: placeId,
      order: destinos.length + 1,
      marker: placesCatalog[placeId]?.tipo as MapaDestino["marker"],
    });
  }

  const fromIds = resolveMapStops(destinos);
  if (fromIds.length > 0) return fromIds;

  return resolveMapStops([{ place_id: "cusco", order: 1, marker: "city" }]);
}

/* ---------------------------------------------------------------------------
 * Catálogo de destinos (/destinos) — fuente de verdad: data/places.json
 * ------------------------------------------------------------------------ */

export interface DestinationSummary {
  slug: string;
  nombre: string;
  region: string;
  descripcion: string;
  imagen: string;
  tipo: string;
  toursCount: number;
}

const DESTINO_REGIONES: Record<string, string> = {
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

/** Ids de taxonomía que no existen en places.json y se agrupan en un lugar real. */
const DESTINO_ID_EXTRA_ALIASES: Record<string, string> = {
  "lago-titicaca": "puno",
  "cusco-ciudad": "cusco",
  "islas-uros": "puno",
};

function normalizeDestinoId(rawId: string): string | undefined {
  const placeId =
    DESTINO_ID_EXTRA_ALIASES[rawId] ?? DESTINO_ID_ALIASES[rawId] ?? rawId;
  return placesCatalog[placeId] ? placeId : undefined;
}

/** Ids de destino de un tour, normalizados contra el catálogo y sin duplicados. */
export function getTourDestinationIds(tour: Tour): string[] {
  const ids = new Set<string>();
  for (const rawId of tour.destino_ids ?? []) {
    const placeId = normalizeDestinoId(rawId);
    if (placeId) ids.add(placeId);
  }
  return [...ids];
}

export function isDestinationSlug(slug: string): boolean {
  return Boolean(placesCatalog[slug]);
}

function buildDestinationSummary(
  slug: string,
  place: PlaceRecord,
  toursCount: number
): DestinationSummary {
  return {
    slug,
    nombre: place.nombre,
    region: DESTINO_REGIONES[slug] ?? "Perú",
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

export function getDestinationBySlug(
  slug: string,
  tours: Tour[]
): DestinationSummary | null {
  const place = placesCatalog[slug];
  if (!place) return null;
  return buildDestinationSummary(
    slug,
    place,
    getToursByDestination(slug, tours).length
  );
}

/** Destinos del catálogo con al menos un tour asociado, ordenados por volumen. */
export function getDestinationsWithTours(tours: Tour[]): DestinationSummary[] {
  const counts = new Map<string, number>();
  for (const tour of tours) {
    for (const id of getTourDestinationIds(tour)) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([slug]) => Boolean(placesCatalog[slug]))
    .map(([slug, count]) =>
      buildDestinationSummary(slug, placesCatalog[slug], count)
    )
    .sort(
      (a, b) =>
        b.toursCount - a.toursCount || a.nombre.localeCompare(b.nombre, "es")
    );
}
