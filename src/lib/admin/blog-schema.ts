import { z } from "zod";
import type { BlogPost, BlogPostDocument } from "@/types/blog";
import { DESTINO_OPTIONS } from "@/lib/admin/tour-schema";

export { DESTINO_OPTIONS };

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

export const blogDraftSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug en minúsculas con guiones."),
  status: z.enum(["publish", "draft"]),
  date: z.string().min(4),
  author: z.string().min(1),
  excerpt: z.string().min(1),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  body_html: z.string().min(1, "El contenido no puede estar vacío."),
  featured_image: imagePathSchema,
  featured_image_alt: z.string().optional(),
  featured_image_caption: z.string().optional(),
  featured_image_credito: z.string().optional(),
  video_url: z.string().optional(),
  reading_time_minutes: z.number().int().positive().optional(),
  page_views: z.number().int().nonnegative().optional(),
  original_url: z.string().optional(),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    focus_keyword: z.string().optional(),
    synonyms: z.string().optional(),
    canonical: z.string().optional(),
    og_image: z.string().optional(),
  }),
  geo: z.object({
    place_ids: z.array(z.string()),
    primary_place_id: z.string().optional(),
    schema_tourist_attraction: z.boolean().optional(),
  }),
});

export const blogStatusSchema = z.object({
  status: z.enum(["publish", "draft"]),
});

export const blogCreateSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug en minúsculas con guiones."),
});

export type BlogDraft = z.infer<typeof blogDraftSchema>;

export function blogToDraft(post: BlogPost | BlogPostDocument): BlogDraft {
  return {
    title: post.title,
    slug: post.slug,
    status: post.status === "publish" ? "publish" : "draft",
    date: post.date,
    author: post.author || "Chullos Tours",
    excerpt: post.excerpt || "",
    categories: post.categories || [],
    tags: post.tags || [],
    body_html:
      ("body_html" in post && post.body_html) ||
      ("contentHtml" in post && post.contentHtml) ||
      "",
    featured_image: post.featured_image || "",
    featured_image_alt: post.featured_image_alt || "",
    featured_image_caption: post.featured_image_caption || "",
    featured_image_credito: post.featured_image_credito || "",
    video_url: post.video_url || "",
    reading_time_minutes: post.reading_time_minutes,
    page_views: post.page_views,
    original_url: post.original_url || "",
    seo: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt || "",
      focus_keyword: post.seo?.focus_keyword || "",
      synonyms: post.seo?.synonyms || "",
      canonical: post.seo?.canonical || `https://chullostours.com/blog/${post.slug}`,
      og_image: post.seo?.og_image || post.featured_image || "",
    },
    geo: {
      place_ids: post.geo?.place_ids || [],
      primary_place_id: post.geo?.primary_place_id || "",
      schema_tourist_attraction: Boolean(post.geo?.schema_tourist_attraction),
    },
  };
}

export function applyDraftToDocument(
  existing: BlogPostDocument,
  draft: BlogDraft
): BlogPostDocument {
  const og = draft.seo.og_image || draft.featured_image || existing.seo?.og_image;
  return {
    ...existing,
    title: draft.title,
    slug: draft.slug,
    status: draft.status,
    date: draft.date,
    modified: new Date().toISOString().slice(0, 10),
    author: draft.author,
    excerpt: draft.excerpt,
    categories: draft.categories,
    tags: draft.tags,
    body_html: draft.body_html,
    featured_image: draft.featured_image || "",
    featured_image_alt: draft.featured_image_alt || "",
    featured_image_caption: draft.featured_image_caption || "",
    featured_image_credito: draft.featured_image_credito || "",
    video_url: draft.video_url || undefined,
    reading_time_minutes: draft.reading_time_minutes,
    page_views: draft.page_views,
    original_url: draft.original_url || undefined,
    seo: {
      title: draft.seo.title,
      description: draft.seo.description,
      focus_keyword: draft.seo.focus_keyword || undefined,
      synonyms: draft.seo.synonyms || undefined,
      canonical: draft.seo.canonical || `https://chullostours.com/blog/${draft.slug}`,
      og_image: og || undefined,
    },
    geo: {
      place_ids: draft.geo.place_ids,
      primary_place_id: draft.geo.primary_place_id || undefined,
      schema_tourist_attraction: draft.geo.schema_tourist_attraction,
    },
  };
}
