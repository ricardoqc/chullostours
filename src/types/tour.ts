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
  caption?: string;
  credito?: string;
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

export interface HotelCiudad {
  ciudad: string;
  hotel: string;
  direccion?: string;
  sitio_web?: string;
  tipo_habitacion: string;
  servicios: string[];
  /** URLs relativas a /public, absolutas o Unsplash referencial */
  imagenes?: string[];
  /** true = fotos referenciales; editar imagenes[] en JSON del tour */
  imagenes_referenciales?: boolean;
}

export interface HotelOpcion {
  id: string;
  nombre: string;
  categoria: string;
  precio_usd: number;
  precio_soles?: number;
  precio_pen?: number;
  precio_etiqueta: string;
  descripcion: string;
  estrellas?: 3 | 4 | 5;
  /** false = solo tours / sin estadía incluida (hoteles debe ser []) */
  incluye_alojamiento?: boolean;
  hoteles: HotelCiudad[];
}

export interface DescuentoEdad {
  rango_edad: string;
  descuento_soles?: number;
  descuento_usd?: number;
  nota: string;
}

export interface DescuentosInfo {
  nota?: string;
  menores?: DescuentoEdad[];
}

/** Child / age-based fare for booking UI */
export interface TarifaPersona {
  id: string;
  label: string;
  rango_edad?: string;
  edad_min?: number;
  edad_max?: number;
  /** Absolute price per person if set; otherwise use discount fields */
  precio_usd?: number;
  precio_soles?: number;
  descuento_usd?: number;
  descuento_soles?: number;
  nota?: string;
  /** free | discount | fixed */
  tipo?: "free" | "discount" | "fixed";
}

export interface CardBadge {
  id: string;
  label: string;
  icon?: "check" | "users" | "shield" | "clock" | "ticket" | "mountain";
  tone?: "success" | "neutral" | "brand" | "warning";
  visible?: boolean;
}

export interface BoletoTuristico {
  tipo: "BTC_GENERAL" | "BTC_PARCIAL" | "NINGUNO";
  incluido: boolean;
  precio_pen: number;
  nota?: string;
}

export interface EntradasIncluidasDestacado {
  destacado: boolean;
  titulo?: string;
  detalle?: string;
  variant?: "emerald" | "gold" | "brand";
}

export interface MapaDestino {
  place_id: string;
  order: number;
  dia?: number;
  marker?: "city" | "airport" | "nature" | "landmark" | "trek";
}

export interface MapaTour {
  zoom_inicial?: number;
  destinos: MapaDestino[];
}

/** Optional add-on (e.g. Huayna Picchu). Only shown/calculated when enabled=true */
export interface TourExtra {
  id: string;
  label: string;
  precio_usd: number;
  precio_soles?: number;
  enabled: boolean;
  descripcion?: string;
}

export interface PreciosComparacion {
  agencias_usd: number;
  online_usd: number;
  etiqueta?: string;
}

export interface TourHighlightItem {
  icono: string;
  titulo: string;
  detalle: string;
}

export interface Tour {
  id?: string;
  /** Base / "from" price in USD — required for UI */
  precio_usd?: number;
  precio?: number;
  precio_soles?: number;
  precio_pen?: number;
  /** Default true. When false, hidden from catalog/search/sitemap */
  visible?: boolean;
  aplica_descuentos_edad?: boolean;
  card_badges?: CardBadge[];
  boleto_turistico?: BoletoTuristico;
  entradas_incluidas?: EntradasIncluidasDestacado;
  mapa?: MapaTour;
  horarios_disponibles?: string[];
  punto_inicio?: string;
  categoria?: string;
  /** Filter taxonomy e.g. ["cusco","machu-picchu"] */
  destino_ids?: string[];
  titulo: string;
  slug: string;
  url: string;
  metas: TourMeta;
  atributos: TourAtributos;
  resumen: string;
  descripcion_completa?: string;
  propuesta_de_valor?: string[];
  tour_highlights?: TourHighlightItem[];
  destacados_highlights: string[];
  galeria: TourImagen[];
  itinerario: DiaItinerario[];
  incluye: string[];
  no_incluye: string[];
  recomendaciones: string[];
  puntos_de_interes?: PuntoDeInteres[];
  opciones_hotel?: HotelOpcion[];
  descuentos?: DescuentosInfo;
  tarifas_personas?: TarifaPersona[];
  extras?: TourExtra[];
  precios_comparacion?: PreciosComparacion;
  faqs: FAQItem[];
  seo: SEOMetadata;
  geo_ai_optimization: GEOOptimization;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seo_schema: any;
}
