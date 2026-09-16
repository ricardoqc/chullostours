export interface BlogPostSEO {
  title: string;
  description: string;
  focus_keyword?: string;
  synonyms?: string;
  canonical?: string;
  og_image?: string;
}

/** GEO explícito para schema.org / landings (preparado para Directus). */
export interface BlogPostGEO {
  place_ids: string[];
  primary_place_id?: string;
  schema_tourist_attraction?: boolean;
}

export interface BlogPostFrontmatter {
  id: number;
  title: string;
  slug: string;
  status: string;
  date: string;
  modified?: string;
  author: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  seo: BlogPostSEO;
  geo?: BlogPostGEO;
  video_url?: string;
  reading_time_minutes?: number;
  page_views?: number;
  original_url?: string;
  featured_image?: string;
  featured_image_alt?: string;
  featured_image_caption?: string;
  featured_image_credito?: string;
}

/** Documento persistido en JSON (contrato estable FS ↔ Directus). */
export interface BlogPostDocument extends BlogPostFrontmatter {
  body_html: string;
  body_markdown?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  contentHtml: string;
  rawMarkdown: string;
  body_html?: string;
}

export interface BlogIndexItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  date: string;
  filename: string;
  reading_time: string;
  page_views: string;
  seo_title: string;
  seo_desc: string;
  original_url: string;
  featured_image?: string;
  featured_image_alt?: string;
}

export interface BlogRedirect {
  from_slug: string;
  to_slug: string;
  type: number;
  reason: string;
}

export interface BlogIndexData {
  total_posts: number;
  updated_at: string;
  posts: BlogIndexItem[];
  redirects: BlogRedirect[];
}
