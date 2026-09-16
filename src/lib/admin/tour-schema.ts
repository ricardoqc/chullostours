import { z } from "zod";
import type { ActividadItinerario, Tour } from "@/types/tour";

const imagePathSchema = z
  .string()
  .min(1)
  .refine(
    (src) =>
      src.startsWith("/media/") ||
      src.startsWith("/tours/") ||
      src.startsWith("/img/") ||
      src.startsWith("https://") ||
      src.startsWith("http://"),
    { message: "La ruta debe ser relativa (/media, /tours, /img) o una URL http(s)." }
  )
  .refine((src) => !src.includes(".."), { message: "La ruta no puede contener '..'." });

const galleryItemSchema = z.object({
  src: imagePathSchema,
  alt: z.string().min(1, "El texto alternativo es obligatorio."),
  caption: z.string().optional(),
  credito: z.string().optional(),
});

const itineraryDaySchema = z.object({
  dia: z.number().int().positive().optional(),
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  actividades: z.array(z.string()),
  alojamiento: z.string().optional(),
  comidas_incluidas: z.array(z.string()).optional(),
});

const faqSchema = z.object({
  pregunta: z.string().min(1),
  respuesta: z.string().min(1),
});

export const tourDraftSchema = z.object({
  titulo: z.string().min(2),
  visible: z.boolean(),
  categoria: z.string().optional(),
  destino_ids: z.array(z.string()),
  resumen: z.string().min(1),
  descripcion_completa: z.string().optional(),
  precio_usd: z.number().nonnegative(),
  precio_pen: z.number().nonnegative().optional(),
  atributos: z.object({
    duracion: z.string().min(1),
    ubicacion: z.string().min(1),
    idiomas: z.array(z.string()),
    tipo_tour: z.string().min(1),
    dificultad: z.string().optional(),
    altitud_maxima: z.string().optional(),
    grupo_max: z.number().int().positive().optional(),
    nivel_fisico: z.string().optional(),
  }),
  propuesta_de_valor: z.array(z.string()),
  destacados_highlights: z.array(z.string()),
  incluye: z.array(z.string()),
  no_incluye: z.array(z.string()),
  recomendaciones: z.array(z.string()),
  imagen_principal: z.string().optional(),
  galeria: z.array(galleryItemSchema).min(1, "Agrega al menos una imagen."),
  itinerario: z.array(itineraryDaySchema).min(1),
  faqs: z.array(faqSchema),
  metas: z.object({
    description: z.string().min(1),
    og_title: z.string().min(1),
    og_url: z.string().min(1),
  }),
  seo: z.object({
    meta_title: z.string().min(1),
    meta_description: z.string().min(1),
    canonical: z.string().min(1),
    focus_keyword: z.string().min(1),
    og_image: z.string().optional(),
  }),
});

export const tourVisibilitySchema = z.object({
  visible: z.boolean(),
});

export const tourDuplicateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa un slug en minúsculas separado por guiones."),
  titulo: z.string().min(2),
});

export type TourDraft = z.infer<typeof tourDraftSchema>;

export const DESTINO_OPTIONS = [
  { id: "cusco", label: "Cusco & Alrededores" },
  { id: "cusco-ciudad", label: "Cusco Ciudad" },
  { id: "machu-picchu", label: "Machu Picchu" },
  { id: "valle-sagrado", label: "Valle Sagrado" },
  { id: "puno", label: "Puno" },
  { id: "lago-titicaca", label: "Lago Titicaca" },
  { id: "lima", label: "Lima & Costa" },
] as const;

function activityToString(actividad: string | ActividadItinerario): string {
  if (typeof actividad === "string") return actividad;
  return [actividad.hora, actividad.titulo || actividad.actividad, actividad.descripcion]
    .filter(Boolean)
    .join(" | ");
}

export function tourToDraft(tour: Tour): TourDraft {
  return {
    titulo: tour.titulo,
    visible: tour.visible !== false,
    categoria: tour.categoria,
    destino_ids: tour.destino_ids || [],
    resumen: tour.resumen,
    descripcion_completa: tour.descripcion_completa || "",
    precio_usd: tour.precio_usd ?? tour.precio ?? 0,
    precio_pen: tour.precio_pen,
    atributos: {
      duracion: tour.atributos?.duracion || "",
      ubicacion: tour.atributos?.ubicacion || "",
      idiomas: tour.atributos?.idiomas || [],
      tipo_tour: tour.atributos?.tipo_tour || "",
      dificultad: tour.atributos?.dificultad,
      altitud_maxima: tour.atributos?.altitud_maxima,
      grupo_max: tour.atributos?.grupo_max,
      nivel_fisico: tour.atributos?.nivel_fisico,
    },
    propuesta_de_valor: tour.propuesta_de_valor || [],
    destacados_highlights: tour.destacados_highlights || [],
    incluye: tour.incluye || [],
    no_incluye: tour.no_incluye || [],
    recomendaciones: tour.recomendaciones || [],
    imagen_principal: tour.imagen_principal || tour.galeria?.[0]?.src || "",
    galeria: (tour.galeria || []).map((item) => ({
      src: item.src,
      alt: item.alt,
      caption: item.caption,
      credito: item.credito,
    })),
    itinerario: (tour.itinerario || []).map((day) => ({
      dia: day.dia,
      titulo: day.titulo,
      descripcion: day.descripcion,
      actividades: (day.actividades || []).map(activityToString),
      alojamiento: day.alojamiento,
      comidas_incluidas: day.comidas_incluidas,
    })),
    faqs: tour.faqs || [],
    metas: {
      description: tour.metas?.description || tour.resumen || "",
      og_title: tour.metas?.og_title || tour.titulo,
      og_url: tour.metas?.og_url || tour.url,
    },
    seo: {
      meta_title: tour.seo?.meta_title || tour.titulo,
      meta_description: tour.seo?.meta_description || tour.resumen,
      canonical: tour.seo?.canonical || tour.url,
      focus_keyword: tour.seo?.focus_keyword || tour.titulo,
      og_image:
        tour.seo?.open_graph?.og_image || tour.imagen_principal || tour.galeria?.[0]?.src,
    },
  };
}

function resolveMainSrc(draft: TourDraft): string {
  const candidate = (draft.imagen_principal || "").trim();
  if (candidate && draft.galeria.some((item) => item.src === candidate)) {
    return candidate;
  }
  return draft.galeria[0]?.src || candidate || "";
}

function syncSchemaPricesAndImages(tour: Tour, draft: TourDraft) {
  const graph = tour.seo_schema?.["@graph"];
  if (!Array.isArray(graph)) return;

  const main = resolveMainSrc(draft);
  const images = [
    ...(main ? [main] : []),
    ...draft.galeria.map((item) => item.src).filter((src) => src !== main),
  ];
  for (const node of graph) {
    if (!node || typeof node !== "object") continue;
    if (node["@type"] === "Product") {
      if (node.offers && typeof node.offers === "object") {
        node.offers.price = String(draft.precio_usd);
      }
      if (images.length > 0) {
        node.image = images;
      }
      node.name = draft.titulo;
      if (draft.resumen) node.description = draft.resumen;
    }
  }
}

export function applyDraftToTour(existing: Tour, draft: TourDraft): Tour {
  const mainSrc = resolveMainSrc(draft);
  const next: Tour = {
    ...existing,
    titulo: draft.titulo,
    visible: draft.visible,
    categoria: draft.categoria,
    destino_ids: draft.destino_ids,
    resumen: draft.resumen,
    descripcion_completa: draft.descripcion_completa,
    precio_usd: draft.precio_usd,
    precio: draft.precio_usd,
    precio_pen: draft.precio_pen,
    atributos: {
      ...existing.atributos,
      ...draft.atributos,
    },
    propuesta_de_valor: draft.propuesta_de_valor,
    destacados_highlights: draft.destacados_highlights,
    incluye: draft.incluye,
    no_incluye: draft.no_incluye,
    recomendaciones: draft.recomendaciones,
    imagen_principal: mainSrc || undefined,
    galeria: draft.galeria,
    itinerario: draft.itinerario.map((day, index) => ({
      ...existing.itinerario?.[index],
      ...day,
      actividades: day.actividades,
    })),
    faqs: draft.faqs,
    metas: {
      ...existing.metas,
      ...draft.metas,
    },
    seo: {
      ...existing.seo,
      meta_title: draft.seo.meta_title,
      meta_description: draft.seo.meta_description,
      canonical: draft.seo.canonical,
      focus_keyword: draft.seo.focus_keyword,
      open_graph: {
        ...existing.seo?.open_graph,
        og_title: draft.metas.og_title,
        og_description: draft.seo.meta_description,
        og_url: draft.metas.og_url,
        og_image: mainSrc || draft.seo.og_image || existing.seo?.open_graph?.og_image,
      },
      twitter_card: {
        ...existing.seo?.twitter_card,
        title: draft.seo.meta_title,
        description: draft.seo.meta_description,
        image: mainSrc || draft.seo.og_image || existing.seo?.twitter_card?.image,
      },
    },
  };

  syncSchemaPricesAndImages(next, draft);
  return next;
}
