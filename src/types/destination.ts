/** SEO de destino (contrato estable FS ↔ Directus). */
export interface DestinationSEO {
  title: string;
  description: string;
  focus_keyword?: string;
  synonyms?: string;
  canonical?: string;
  og_image?: string;
}

/** Datos geográficos / schema.org. */
export interface DestinationGEO {
  lat: number;
  lng: number;
  altitude_m?: number;
  country: string;
  region_label?: string;
  best_season?: string;
  climate_summary?: string;
  schema_tourist_attraction?: boolean;
  same_as_wikidata?: string;
}

/** Lugar turístico anidado dentro de un destino hub. */
export interface DestinationLugar {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

/**
 * Documento persistido en JSON (contrato estable FS ↔ Directus).
 * Futuro: collection `destinations` + DESTINO_DATA_SOURCE=fs|directus.
 */
export interface DestinationDocument {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  status: "publish" | "draft" | string;
  region: string;
  tipo: string;
  excerpt: string;
  body_html: string;
  info_html?: string;
  lugares: DestinationLugar[];
  tips?: string[];
  geo: DestinationGEO;
  featured_image: string;
  featured_image_alt?: string;
  gallery: string[];
  seo: DestinationSEO;
  related_place_ids?: string[];
  /** Landing hub dedicada (ej. /machu-picchu-2026/) a la que este destino debe funnelear en vez de competir por las mismas keywords. */
  featured_guide_url?: string;
  featured_guide_label?: string;
  created?: string;
  modified?: string;
}

export interface DestinationIndexItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  region: string;
  tipo: string;
  excerpt: string;
  featured_image: string;
  lat: number;
  lng: number;
  filename: string;
}

export interface DestinationIndexData {
  total: number;
  updated_at: string;
  destinations: DestinationIndexItem[];
}
