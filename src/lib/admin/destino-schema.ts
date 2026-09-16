import { z } from "zod";
import type { DestinationDocument } from "@/types/destination";

const imagePathSchema = z.string().refine(
  (src) =>
    !src ||
    src.startsWith("/media/") ||
    src.startsWith("/tours/") ||
    src.startsWith("/img/") ||
    src.startsWith("https://") ||
    src.startsWith("http://"),
  { message: "La ruta debe ser /media, /tours, /img o URL http(s)." }
);

const lugarSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
});

export const destinoDraftSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug en minúsculas con guiones."),
  status: z.enum(["publish", "draft"]),
  region: z.string().min(1),
  tipo: z.string().min(1),
  excerpt: z.string().min(1),
  body_html: z.string().min(1, "La descripción no puede estar vacía."),
  info_html: z.string().optional(),
  lugares: z.array(lugarSchema),
  tips: z.array(z.string()),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
    altitude_m: z.number().optional(),
    country: z.string().min(1),
    region_label: z.string().optional(),
    best_season: z.string().optional(),
    climate_summary: z.string().optional(),
    schema_tourist_attraction: z.boolean().optional(),
    same_as_wikidata: z.string().optional(),
  }),
  featured_image: imagePathSchema,
  featured_image_alt: z.string().optional(),
  gallery: z.array(z.string()),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    focus_keyword: z.string().optional(),
    synonyms: z.string().optional(),
    canonical: z.string().optional(),
    og_image: z.string().optional(),
  }),
  related_place_ids: z.array(z.string()).optional(),
});

export const destinoStatusSchema = z.object({
  status: z.enum(["publish", "draft"]),
});

export const destinoCreateSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug en minúsculas con guiones."),
});

export type DestinoDraft = z.infer<typeof destinoDraftSchema>;

export const DESTINO_TIPO_OPTIONS = [
  { id: "city", label: "Ciudad" },
  { id: "landmark", label: "Sitio / landmark" },
  { id: "nature", label: "Naturaleza" },
  { id: "trek", label: "Trek / montaña" },
] as const;

export function destinoToDraft(doc: DestinationDocument): DestinoDraft {
  return {
    title: doc.title,
    subtitle: doc.subtitle || "",
    slug: doc.slug,
    status: doc.status === "publish" ? "publish" : "draft",
    region: doc.region || "Perú",
    tipo: doc.tipo || "landmark",
    excerpt: doc.excerpt || "",
    body_html: doc.body_html || "<p></p>",
    info_html: doc.info_html || "",
    lugares: doc.lugares || [],
    tips: doc.tips || [],
    geo: {
      lat: doc.geo?.lat ?? 0,
      lng: doc.geo?.lng ?? 0,
      altitude_m: doc.geo?.altitude_m,
      country: doc.geo?.country || "PE",
      region_label: doc.geo?.region_label || doc.region || "",
      best_season: doc.geo?.best_season || "",
      climate_summary: doc.geo?.climate_summary || "",
      schema_tourist_attraction: Boolean(doc.geo?.schema_tourist_attraction),
      same_as_wikidata: doc.geo?.same_as_wikidata || "",
    },
    featured_image: doc.featured_image || "",
    featured_image_alt: doc.featured_image_alt || "",
    gallery: doc.gallery || [],
    seo: {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.excerpt || "",
      focus_keyword: doc.seo?.focus_keyword || "",
      synonyms: doc.seo?.synonyms || "",
      canonical: doc.seo?.canonical || `https://chullostours.com/destinos/${doc.slug}/`,
      og_image: doc.seo?.og_image || doc.featured_image || "",
    },
    related_place_ids: doc.related_place_ids || [],
  };
}

export function applyDraftToDestination(
  existing: DestinationDocument,
  draft: DestinoDraft
): DestinationDocument {
  return {
    ...existing,
    title: draft.title,
    subtitle: draft.subtitle,
    slug: draft.slug,
    status: draft.status,
    region: draft.region,
    tipo: draft.tipo,
    excerpt: draft.excerpt,
    body_html: draft.body_html,
    info_html: draft.info_html,
    lugares: draft.lugares,
    tips: draft.tips,
    geo: {
      lat: draft.geo.lat,
      lng: draft.geo.lng,
      altitude_m: draft.geo.altitude_m,
      country: draft.geo.country,
      region_label: draft.geo.region_label,
      best_season: draft.geo.best_season,
      climate_summary: draft.geo.climate_summary,
      schema_tourist_attraction: draft.geo.schema_tourist_attraction,
      same_as_wikidata: draft.geo.same_as_wikidata || undefined,
    },
    featured_image: draft.featured_image,
    featured_image_alt: draft.featured_image_alt,
    gallery: draft.gallery,
    seo: {
      title: draft.seo.title,
      description: draft.seo.description,
      focus_keyword: draft.seo.focus_keyword,
      synonyms: draft.seo.synonyms,
      canonical: draft.seo.canonical,
      og_image: draft.seo.og_image,
    },
    related_place_ids: draft.related_place_ids,
    modified: new Date().toISOString().slice(0, 10),
  };
}
