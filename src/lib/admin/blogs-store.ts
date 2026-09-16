import fs from "fs";
import path from "path";
import type { BlogIndexData, BlogIndexItem, BlogPostDocument } from "@/types/blog";
import {
  applyDraftToDocument,
  blogToDraft,
  type BlogDraft,
} from "@/lib/admin/blog-schema";
import { syncMediaUsage } from "@/lib/admin/media-index";
import { revalidateBlogPages } from "@/lib/admin/revalidate";
import { getBlogIndex, getBlogPostBySlug } from "@/lib/blogs";

export const BLOGS_DIR = path.join(process.cwd(), "data", "blogs", "posts");
const INDEX_PATH = path.join(BLOGS_DIR, "index.json");

export type AdminBlogSummary = {
  file: string;
  slug: string;
  title: string;
  status: string;
  date: string;
  image: string;
  reading_time: string;
};

function blogOwnerKey(slug: string) {
  return `blog:${slug}`;
}

function writeJsonAtomic(filePath: string, data: unknown) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, filePath);
}

export function readBlogDocument(slug: string): { file: string; doc: BlogPostDocument } | null {
  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const file = `${slug}.json`;
  const doc: BlogPostDocument = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    date: post.date,
    modified: post.modified,
    author: post.author,
    excerpt: post.excerpt,
    categories: post.categories || [],
    tags: post.tags || [],
    seo: post.seo,
    geo: post.geo || { place_ids: [] },
    video_url: post.video_url,
    reading_time_minutes: post.reading_time_minutes,
    page_views: post.page_views,
    original_url: post.original_url,
    featured_image: post.featured_image,
    featured_image_alt: post.featured_image_alt,
    featured_image_caption: post.featured_image_caption,
    featured_image_credito: post.featured_image_credito,
    body_html: post.body_html || post.contentHtml || "",
    body_markdown: post.rawMarkdown || undefined,
  };

  return { file, doc };
}

export function listAdminBlogs(): AdminBlogSummary[] {
  const index = getBlogIndex();
  const items = index.posts.map((item) => ({
    file: item.filename || `${item.slug}.json`,
    slug: item.slug,
    title: item.title,
    status: item.status,
    date: item.date,
    image: item.featured_image || "/img/placeholder.jpg",
    reading_time: item.reading_time || "5",
  }));
  items.sort((a, b) => b.date.localeCompare(a.date));
  return items;
}

function toIndexItem(doc: BlogPostDocument): BlogIndexItem {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    date: doc.date,
    filename: `${doc.slug}.json`,
    reading_time: String(doc.reading_time_minutes || 5),
    page_views: String(doc.page_views || 0),
    seo_title: doc.seo.title,
    seo_desc: doc.seo.description,
    original_url: doc.original_url || `https://chullostours.com/blog/${doc.slug}/`,
    featured_image: doc.featured_image,
    featured_image_alt: doc.featured_image_alt,
  };
}

function syncIndexEntry(doc: BlogPostDocument) {
  const index = getBlogIndex();
  const nextItem = toIndexItem(doc);
  const idx = index.posts.findIndex((p) => p.slug === doc.slug || p.id === doc.id);
  if (idx >= 0) {
    index.posts[idx] = nextItem;
  } else {
    index.posts.push(nextItem);
  }
  index.total_posts = index.posts.length;
  index.updated_at = new Date().toISOString();
  writeJsonAtomic(INDEX_PATH, index);
}

function syncBlogMediaUsage(doc: BlogPostDocument) {
  const srcs = [doc.featured_image, doc.seo?.og_image].filter((src): src is string =>
    Boolean(src?.startsWith("/media/"))
  );
  // Also collect /media/ from body_html
  const re = /src=["'](\/media\/[^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(doc.body_html || ""))) {
    srcs.push(match[1]);
  }
  syncMediaUsage(blogOwnerKey(doc.slug), srcs);
}

export function writeBlogDocument(doc: BlogPostDocument) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
  const filePath = path.join(BLOGS_DIR, `${doc.slug}.json`);
  writeJsonAtomic(filePath, doc);
  syncIndexEntry(doc);
  syncBlogMediaUsage(doc);
}

export function saveBlogDraft(slug: string, draft: BlogDraft) {
  const found = readBlogDocument(slug);
  if (!found) return null;

  // Slug rename: write new file, update index, remove old if needed
  const next = applyDraftToDocument(found.doc, draft);
  if (next.slug !== slug) {
    const clash = readBlogDocument(next.slug);
    if (clash) return { error: "slug_taken" as const };
    writeBlogDocument(next);
    const oldPath = path.join(BLOGS_DIR, `${slug}.json`);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    // Fix index old slug entry
    const index = getBlogIndex();
    index.posts = index.posts.filter((p) => p.slug !== slug);
    writeJsonAtomic(INDEX_PATH, index);
    syncIndexEntry(next);
    revalidateBlogPages(slug);
    revalidateBlogPages(next.slug);
    return { file: `${next.slug}.json`, doc: next };
  }

  writeBlogDocument(next);
  revalidateBlogPages(next.slug);
  return { file: `${next.slug}.json`, doc: next };
}

export function setBlogStatus(slug: string, status: "publish" | "draft") {
  const found = readBlogDocument(slug);
  if (!found) return null;
  found.doc.status = status;
  found.doc.modified = new Date().toISOString().slice(0, 10);
  writeBlogDocument(found.doc);
  revalidateBlogPages(slug);
  return found;
}

export function createBlogPost(title: string, slug: string) {
  if (readBlogDocument(slug)) return { error: "slug_taken" as const };

  const index = getBlogIndex();
  const maxId = index.posts.reduce((max, p) => Math.max(max, p.id || 0), 9000);
  const doc: BlogPostDocument = {
    id: maxId + 1,
    title,
    slug,
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
    author: "Chullos Tours",
    excerpt: "",
    categories: [],
    tags: [],
    seo: {
      title,
      description: "",
      canonical: `https://chullostours.com/blog/${slug}`,
    },
    geo: { place_ids: [] },
    body_html: "<p></p>",
    featured_image: "",
    featured_image_alt: "",
    reading_time_minutes: 5,
    page_views: 0,
  };

  writeBlogDocument(doc);
  revalidateBlogPages(slug);
  return { file: `${slug}.json`, doc, draft: blogToDraft(doc) };
}

export function duplicateBlogPost(sourceSlug: string, nextSlug: string, title: string) {
  const found = readBlogDocument(sourceSlug);
  if (!found) return { error: "not_found" as const };
  if (readBlogDocument(nextSlug)) return { error: "slug_taken" as const };

  const index = getBlogIndex();
  const maxId = index.posts.reduce((max, p) => Math.max(max, p.id || 0), 9000);
  const copy: BlogPostDocument = {
    ...structuredClone(found.doc),
    id: maxId + 1,
    slug: nextSlug,
    title,
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
    modified: new Date().toISOString().slice(0, 10),
    seo: {
      ...found.doc.seo,
      title,
      canonical: `https://chullostours.com/blog/${nextSlug}`,
    },
    original_url: undefined,
  };

  writeBlogDocument(copy);
  revalidateBlogPages(nextSlug);
  return { file: `${nextSlug}.json`, doc: copy };
}

/** Ensure every indexed post has a JSON file (lazy migrate leftover MD). */
export function ensureBlogJsonFiles() {
  const index: BlogIndexData = getBlogIndex();
  let changed = false;
  for (const item of index.posts) {
    const jsonPath = path.join(BLOGS_DIR, `${item.slug}.json`);
    if (fs.existsSync(jsonPath)) {
      if (item.filename !== `${item.slug}.json`) {
        item.filename = `${item.slug}.json`;
        changed = true;
      }
      continue;
    }
    const post = getBlogPostBySlug(item.slug);
    if (!post) continue;
    const doc: BlogPostDocument = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      date: post.date,
      modified: post.modified,
      author: post.author,
      excerpt: post.excerpt,
      categories: post.categories || [],
      tags: post.tags || [],
      seo: post.seo,
      geo: post.geo || { place_ids: [] },
      video_url: post.video_url,
      reading_time_minutes: post.reading_time_minutes,
      page_views: post.page_views,
      original_url: post.original_url,
      featured_image: post.featured_image,
      featured_image_alt: post.featured_image_alt,
      featured_image_caption: post.featured_image_caption,
      featured_image_credito: post.featured_image_credito,
      body_html: post.body_html || post.contentHtml || "",
      body_markdown: post.rawMarkdown,
    };
    writeJsonAtomic(jsonPath, doc);
    item.filename = `${item.slug}.json`;
    changed = true;
  }
  if (changed) {
    index.updated_at = new Date().toISOString();
    writeJsonAtomic(INDEX_PATH, index);
  }
}
