import fs from "fs";
import path from "path";
import type {
  BlogPost,
  BlogPostDocument,
  BlogPostFrontmatter,
  BlogIndexData,
  BlogIndexItem,
  BlogRedirect,
} from "@/types/blog";
import { placesCatalog } from "@/lib/places";

const postsDir = path.join(process.cwd(), "data", "blogs", "posts");
const indexPath = path.join(postsDir, "index.json");

/**
 * Blog data access (contrato estable).
 * Hoy: filesystem JSON en data/blogs/posts.
 * Futuro Directus: reemplazar solo este módulo / blogs-store con adaptador
 *   BLOG_DATA_SOURCE=directus sin cambiar TipTap ni páginas /blog.
 */
export function getBlogIndex(): BlogIndexData {
  if (!fs.existsSync(indexPath)) {
    return { total_posts: 0, updated_at: "", posts: [], redirects: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(indexPath, "utf-8")) as BlogIndexData;
  } catch (err) {
    console.error("Error reading blog index.json:", err);
    return { total_posts: 0, updated_at: "", posts: [], redirects: [] };
  }
}

export function getAllBlogPosts(): BlogIndexItem[] {
  return getBlogIndex().posts.filter((p) => p.status === "publish");
}

export function getBlogRedirect(slug: string): BlogRedirect | undefined {
  return getBlogIndex().redirects.find((r) => r.from_slug === slug);
}

export function markdownToHtml(md: string): string {
  if (!md) return "";

  let html = md;
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-base font-bold text-gray-800 my-4">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-lg font-bold text-[#6b0014] my-4">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold text-[#6b0014] my-4">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-[#6b0014] mt-8 mb-4">$1</h3>');
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-3xl font-extrabold text-[#1C1C1C] mt-10 mb-5 pb-2 border-b border-gray-200">$1</h2>'
  );
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold text-[#6b0014] my-6">$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>');
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    return `<figure class="my-6 rounded-2xl overflow-hidden shadow-md bg-gray-50 border border-gray-100">
      <img src="${src}" alt="${alt}" class="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
      ${alt ? `<figcaption class="text-center text-xs text-gray-500 py-2.5 px-4 italic bg-gray-50 border-t border-gray-100">${alt}</figcaption>` : ""}
    </figure>`;
  });
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-[#6b0014] font-semibold underline decoration-[#ffc000] underline-offset-4 hover:text-red-700 transition-colors">$1</a>'
  );
  html = html.replace(
    /^\> (.*$)/gim,
    '<blockquote class="border-l-4 border-[#6b0014] bg-amber-50/50 p-4 my-4 rounded-r-xl italic text-gray-800">$1</blockquote>'
  );
  html = html.replace(/^---$/gim, '<hr class="my-8 border-t border-gray-200" />');
  html = html.replace(/(?:\|.*?\|\r?\n)+/g, (tableMatch) => {
    const lines = tableMatch.trim().split(/\r?\n/);
    if (lines.length < 2) return tableMatch;
    const headers = lines[0].split("|").map((s) => s.trim()).filter(Boolean);
    const bodyRows = lines.slice(2);
    let tableHtml =
      '<div class="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm"><table class="w-full text-left text-sm border-collapse"><thead class="bg-[#6b0014] text-white"><tr>';
    headers.forEach((h) => {
      tableHtml += `<th class="py-3 px-4 font-bold border-b border-red-900">${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody class="divide-y divide-gray-200 bg-white">';
    bodyRows.forEach((row, i) => {
      const cells = row.split("|").map((s) => s.trim()).filter(Boolean);
      tableHtml += `<tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-amber-50/30 transition-colors">`;
      cells.forEach((c) => {
        tableHtml += `<td class="py-3 px-4 text-gray-800">${c}</td>`;
      });
      tableHtml += "</tr>";
    });
    tableHtml += "</tbody></table></div>";
    return tableHtml;
  });
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc mb-1 text-gray-700">$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal mb-1 text-gray-700">$1</li>');
  html = html.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>\s*)+/g, '<ul class="my-4 space-y-1">$&</ul>');
  html = html.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>\s*)+/g, '<ol class="my-4 space-y-1">$&</ol>');

  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<figure") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<div") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed;
      }
      return `<p class="mb-5 text-gray-700 leading-relaxed text-base">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

function documentToBlogPost(doc: BlogPostDocument): BlogPost {
  return {
    ...doc,
    contentHtml: doc.body_html || "",
    rawMarkdown: doc.body_markdown || "",
    body_html: doc.body_html,
    geo: doc.geo || { place_ids: [] },
    seo: {
      ...doc.seo,
      canonical: doc.seo.canonical || `https://chullostours.com/blog/${doc.slug}`,
      og_image: doc.seo.og_image || doc.featured_image,
    },
  };
}

function parseMarkdownFile(filePath: string, item?: BlogIndexItem): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const parts = normalized.split(/^---$/m);
    if (parts.length < 3) return null;

    const frontmatterRaw = parts[1];
    const markdownBody = parts.slice(2).join("---").trim();

    const getVal = (key: string): string => {
      const match = frontmatterRaw.match(new RegExp(`${key}:\\s*"([^"]*)"`, "i"));
      if (match) return match[1];
      const matchNoQuotes = frontmatterRaw.match(new RegExp(`${key}:\\s*([^\\n]+)`, "i"));
      return matchNoQuotes ? matchNoQuotes[1].trim() : "";
    };

    const getList = (key: string): string[] => {
      const regex = new RegExp(`${key}:\\s*\\n((?:\\s*-\\s*"[^"]*"\\n?)+)`, "i");
      const match = frontmatterRaw.match(regex);
      if (!match) return [];
      const items = match[1].match(/"([^"]+)"/g);
      return items ? items.map((i) => i.replace(/"/g, "")) : [];
    };

    const slug = getVal("slug") || item?.slug || "";
    const frontmatter: BlogPostFrontmatter = {
      id: parseInt(getVal("id") || `${item?.id || 0}`, 10),
      title: getVal("title") || item?.title || "",
      slug,
      status: getVal("status") || "publish",
      date: getVal("date") || item?.date || "",
      modified: getVal("modified"),
      author: getVal("author") || "Chullos Tours",
      excerpt: getVal("excerpt"),
      categories: getList("categories"),
      tags: getList("tags"),
      seo: {
        title: item?.seo_title || getVal("title"),
        description: item?.seo_desc || getVal("excerpt"),
        focus_keyword: getVal("focus_keyword"),
        synonyms: getVal("synonyms"),
        canonical: `https://chullostours.com/blog/${slug}`,
        og_image: getVal("featured_image") || item?.featured_image,
      },
      geo: {
        place_ids: [],
        schema_tourist_attraction: /machu-picchu|machupicchu/i.test(slug),
      },
      video_url: getVal("video_url"),
      reading_time_minutes: parseInt(getVal("reading_time_minutes") || item?.reading_time || "5", 10),
      page_views: parseInt(getVal("page_views") || item?.page_views || "0", 10),
      original_url: getVal("original_url"),
      featured_image: getVal("featured_image") || item?.featured_image || "",
      featured_image_alt: getVal("featured_image_alt") || item?.featured_image_alt || "",
      featured_image_caption: getVal("featured_image_caption") || "",
      featured_image_credito: getVal("featured_image_credito") || "",
    };

    return {
      ...frontmatter,
      contentHtml: markdownToHtml(markdownBody),
      rawMarkdown: markdownBody,
      body_html: markdownToHtml(markdownBody),
    };
  } catch (err) {
    console.error(`Error loading markdown blog ${filePath}:`, err);
    return null;
  }
}

/** Categorías demasiado genéricas para usarse como señal de clúster temático. */
const GENERIC_CATEGORIES = new Set([
  "recomendaciones",
  "viajes",
  "información turística",
  "informacion turistica",
  "informacion machu picchu",
  "tours",
  "travel",
  "adventure",
  "uncategorized",
]);

/**
 * Posts relacionados por clúster temático (categorías específicas compartidas, ej. "Machu Picchu",
 * "Cusco", "Perú"), no por orden de archivo. Cae de vuelta a los más recientes si no hay suficientes
 * coincidencias para completar `limit`.
 */
export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  const candidates = getAllBlogPosts().filter((p) => p.slug !== currentSlug);

  const currentSpecific = new Set(
    (current?.categories || [])
      .map((c) => c.toLowerCase())
      .filter((c) => !GENERIC_CATEGORIES.has(c))
  );

  const scored = candidates
    .map((item) => {
      const post = getBlogPostBySlug(item.slug);
      if (!post) return null;
      const shared = (post.categories || [])
        .map((c) => c.toLowerCase())
        .filter((c) => currentSpecific.has(c)).length;
      return { post, shared };
    })
    .filter((x): x is { post: BlogPost; shared: number } => x !== null);

  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  const related = scored.filter((x) => x.shared > 0).slice(0, limit);
  if (related.length < limit) {
    const fillSlugs = new Set(related.map((x) => x.post.slug));
    for (const x of scored) {
      if (related.length >= limit) break;
      if (x.shared > 0 || fillSlugs.has(x.post.slug)) continue;
      related.push(x);
      fillSlugs.add(x.post.slug);
    }
  }

  return related.slice(0, limit).map((x) => x.post);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const index = getBlogIndex();
  const item = index.posts.find((p) => p.slug === slug);

  const jsonCandidates = [
    item?.filename?.endsWith(".json") ? item.filename : null,
    `${slug}.json`,
  ].filter(Boolean) as string[];

  for (const name of jsonCandidates) {
    const filePath = path.join(postsDir, name);
    if (!fs.existsSync(filePath)) continue;
    try {
      const doc = JSON.parse(fs.readFileSync(filePath, "utf-8")) as BlogPostDocument;
      if (!doc.slug) doc.slug = slug;
      return documentToBlogPost(doc);
    } catch (err) {
      console.error(`Error loading blog JSON ${name}:`, err);
    }
  }

  const mdName = item?.filename?.endsWith(".md") ? item.filename : `${slug}.md`;
  const mdPath = path.join(postsDir, mdName);
  if (fs.existsSync(mdPath)) {
    return parseMarkdownFile(mdPath, item);
  }

  return null;
}

export function generateBlogSchema(post: BlogPost) {
  const pageUrl = post.seo.canonical || `https://chullostours.com/blog/${post.slug}`;
  const image =
    post.seo.og_image ||
    post.featured_image ||
    "https://chullostours.com/images/og-blog-chullostours.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    headline: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    image: [image],
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Person",
      name: post.author || "Alexandra Gamboa",
      jobTitle: "Especialista en Turismo en Perú",
      worksFor: {
        "@type": "TravelAgency",
        name: "Chullos Tours",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Chullos Tours",
      url: "https://chullostours.com",
      logo: {
        "@type": "ImageObject",
        url: "https://chullostours.com/images/logo.png",
      },
    },
  };

  const schemas: object[] = [articleSchema];
  const geo = post.geo;
  const wantAttraction =
    geo?.schema_tourist_attraction ||
    geo?.place_ids?.includes("machu-picchu") ||
    (!geo?.place_ids?.length &&
      (post.slug.includes("machu-picchu") || post.slug.includes("machupicchu")));

  if (wantAttraction) {
    const primaryId = geo?.primary_place_id || geo?.place_ids?.[0] || "machu-picchu";
    const place = placesCatalog[primaryId];
    schemas.push({
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: place?.nombre || "Machu Picchu",
      description:
        place?.descripcion ||
        "Santuario Histórico de Machu Picchu, Maravilla del Mundo Moderno en Cusco, Perú.",
      geo: {
        "@type": "GeoCoordinates",
        latitude: place?.lat ?? -13.1631,
        longitude: place?.lng ?? -72.545,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: place?.nombre || "Aguas Calientes",
        addressRegion: "Cusco",
        addressCountry: "PE",
      },
      isAccessibleForFree: false,
      touristType: ["History", "Culture", "Hiking", "Adventure"],
    });
  }

  return schemas;
}
