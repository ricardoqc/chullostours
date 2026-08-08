export interface TourMeta {
  description: string;
  og_title: string;
  og_url: string;
}

export interface TourAtributos {
  duracion: string;
  ubicacion: string;
  idiomas: string[];
  tipo_tour: string;
  alojamiento_incluido?: string;
  dificultad?: string;
  altitud_maxima?: string;
  distancia_km?: string;
  grupo_max?: number;
  nivel_fisico?: string;
}

export interface TourImagen {
  src: string;
  alt: string;
}

export interface ActividadItinerario {
  hora?: string;
  titulo?: string;
  actividad?: string;
  descripcion?: string;
  lugar?: string;
  altitud?: string;
  duracion?: string;
}

export interface DiaItinerario {
  dia?: number;
  titulo: string;
  descripcion?: string;
  actividades: (string | ActividadItinerario)[];
  alojamiento?: string;
  comidas_incluidas?: string[];
}

export interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export interface PuntoDeInteres {
  nombre: string;
  tipo: string;
  descripcion: string;
  altitud?: string;
  datos_curiosos?: string[];
}

export interface SEOMetadata {
  focus_keyword: string;
  secondary_keywords?: string[];
  meta_title: string;
  meta_description: string;
  canonical: string;
  robots: string;
  language: string;
  open_graph: {
    og_title: string;
    og_description: string;
    og_type: string;
    og_url: string;
    og_image: string;
    og_site_name: string;
    og_locale: string;
  };
  twitter_card: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
}

export interface GEOOptimization {
  entity_name: string;
  entity_type: string;
  primary_destination: {
    name: string;
    same_as_wikidata?: string;
    geo_coordinates?: {
      latitude: number;
      longitude: number;
    };
    region: string;
    country: string;
  };
  ai_direct_answer_summary: string;
  key_facts_for_ai: { fact: string; value: string }[];
}

export interface Tour {
  titulo: string;
  slug: string;
  url: string;
  metas: TourMeta;
  atributos: TourAtributos;
  resumen: string;
  descripcion_completa?: string;
  propuesta_de_valor?: string[];
  destacados_highlights: string[];
  galeria: TourImagen[];
  itinerario: DiaItinerario[];
  incluye: string[];
  no_incluye: string[];
  recomendaciones: string[];
  puntos_de_interes?: PuntoDeInteres[];
  faqs: FAQItem[];
  seo: SEOMetadata;
  geo_ai_optimization: GEOOptimization;
  seo_schema: any;
}
