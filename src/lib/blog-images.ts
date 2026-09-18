import type { BlogPost } from "@/types/blog";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80";

const SLUG_COVERS: Record<string, string> = {
  machu: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
  camino: "/media/tours/camino-inca-2-dias/01.jpg",
  cusco: "/media/tours/city-tour-cusco/05.avif",
  humantay: "/media/tours/laguna-humantay-tour-cusco/05.avif",
  colores: "/media/tours/montana-colores-vinicunca-tour/06.avif",
  lima: "https://chullostours.com/wp-content/uploads/2023/10/lima-cathedral-in-the-plaza-de-armes-in-central-lima-in-peru-south-america_t20_pxn3Y1.jpg",
  puno: "/media/tours/tour-lago-titicaca-2-dias/05.avif",
};

function firstMediaFromHtml(html?: string): string | null {
  if (!html) return null;
  const match = html.match(/src=["']([^"']+)["']/i);
  const src = match?.[1]?.trim();
  if (src && (src.startsWith("http") || src.startsWith("/"))) return src;
  return null;
}

/** Prioritizes post.featured_image, then body/markdown images, then slug fallback. */
export function getBlogCoverImage(
  post: Pick<BlogPost, "slug" | "rawMarkdown" | "featured_image"> & {
    body_html?: string;
    contentHtml?: string;
  }
): string {
  if (post.featured_image && (post.featured_image.startsWith("http") || post.featured_image.startsWith("/"))) {
    return post.featured_image;
  }

  const fromMarkdown = post.rawMarkdown?.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (fromMarkdown?.[1]) {
    const src = fromMarkdown[1].trim();
    if (src.startsWith("http") || src.startsWith("/")) return src;
  }

  const fromHtml = firstMediaFromHtml(post.body_html || post.contentHtml);
  if (fromHtml) return fromHtml;

  const slug = post.slug.toLowerCase();
  for (const [key, url] of Object.entries(SLUG_COVERS)) {
    if (slug.includes(key)) return url;
  }

  return DEFAULT_COVER;
}
