export interface BlogPostSEO {
  title: string;
  description: string;
  focus_keyword?: string;
  synonyms?: string;
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
  video_url?: string;
  reading_time_minutes?: number;
  page_views?: number;
  original_url?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  contentHtml: string;
  rawMarkdown: string;
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
