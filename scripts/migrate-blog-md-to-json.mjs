/**
 * One-shot: convierte data/blogs/posts/*.md → *.json
 * Uso: node scripts/migrate-blog-md-to-json.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "..", "data", "blogs", "posts");
const indexPath = path.join(postsDir, "index.json");

function markdownToHtml(md) {
  if (!md) return "";
  let html = md;
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
  html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, alt, src) => {
    return `<figure><img src="${src}" alt="${alt}" />${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure>`;
  });
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^\> (.*$)/gim, "<blockquote><p>$1</p></blockquote>");
  html = html.replace(/^---$/gim, "<hr />");
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, "<ul>$&</ul>");
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|figure|blockquote|div|ul|ol|hr)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
  return html;
}

function getVal(frontmatterRaw, key) {
  const match = frontmatterRaw.match(new RegExp(`${key}:\\s*"([^"]*)"`, "i"));
  if (match) return match[1];
  const matchNoQuotes = frontmatterRaw.match(new RegExp(`${key}:\\s*([^\\n]+)`, "i"));
  return matchNoQuotes ? matchNoQuotes[1].trim() : "";
}

function getList(frontmatterRaw, key) {
  const regex = new RegExp(`${key}:\\s*\\n((?:\\s*-\\s*"[^"]*"\\n?)+)`, "i");
  const match = frontmatterRaw.match(regex);
  if (!match) return [];
  const items = match[1].match(/"([^"]+)"/g);
  return items ? items.map((i) => i.replace(/"/g, "")) : [];
}

function parseMd(raw, indexItem) {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const parts = normalized.split(/^---$/m);
  if (parts.length < 3) return null;
  const frontmatterRaw = parts[1];
  const markdownBody = parts.slice(2).join("---").trim();
  const slug = getVal(frontmatterRaw, "slug") || indexItem?.slug || "";
  const title = getVal(frontmatterRaw, "title") || indexItem?.title || "";
  const seoTitle = getVal(frontmatterRaw, "title") || indexItem?.seo_title || title;
  // Prefer nested seo.description if present in raw as sibling fields after seo: block — use index fallback
  const seoDesc =
    indexItem?.seo_desc ||
    getVal(frontmatterRaw, "description") ||
    getVal(frontmatterRaw, "excerpt") ||
    "";

  // Extract seo nested values more carefully
  const seoBlock = frontmatterRaw.match(/seo:\s*\n((?:\s{2}\w+:.*\n?)+)/i);
  let focus = "";
  let synonyms = "";
  let seoTitleNested = seoTitle;
  let seoDescNested = seoDesc;
  if (seoBlock) {
    const block = seoBlock[1];
    const t = block.match(/title:\s*"([^"]*)"/i);
    const d = block.match(/description:\s*"([^"]*)"/i);
    const f = block.match(/focus_keyword:\s*"([^"]*)"/i);
    const s = block.match(/synonyms:\s*"([^"]*)"/i);
    if (t) seoTitleNested = t[1];
    if (d) seoDescNested = d[1];
    if (f) focus = f[1];
    if (s) synonyms = s[1];
  }

  return {
    id: parseInt(getVal(frontmatterRaw, "id") || `${indexItem?.id || 0}`, 10),
    title,
    slug,
    status: getVal(frontmatterRaw, "status") || indexItem?.status || "publish",
    date: getVal(frontmatterRaw, "date") || indexItem?.date || "",
    modified: getVal(frontmatterRaw, "modified") || undefined,
    author: getVal(frontmatterRaw, "author") || "Chullos Tours",
    excerpt: getVal(frontmatterRaw, "excerpt") || "",
    categories: getList(frontmatterRaw, "categories"),
    tags: getList(frontmatterRaw, "tags"),
    seo: {
      title: seoTitleNested,
      description: seoDescNested,
      focus_keyword: focus || getVal(frontmatterRaw, "focus_keyword") || undefined,
      synonyms: synonyms || undefined,
      canonical: `https://chullostours.com/blog/${slug}`,
      og_image:
        getVal(frontmatterRaw, "featured_image") || indexItem?.featured_image || undefined,
    },
    geo: {
      place_ids: [],
      schema_tourist_attraction: /machu-picchu|machupicchu/i.test(slug),
    },
    video_url: getVal(frontmatterRaw, "video_url") || undefined,
    reading_time_minutes: parseInt(
      getVal(frontmatterRaw, "reading_time_minutes") || indexItem?.reading_time || "5",
      10
    ),
    page_views: parseInt(getVal(frontmatterRaw, "page_views") || indexItem?.page_views || "0", 10),
    original_url: getVal(frontmatterRaw, "original_url") || indexItem?.original_url || undefined,
    featured_image: getVal(frontmatterRaw, "featured_image") || indexItem?.featured_image || "",
    featured_image_alt:
      getVal(frontmatterRaw, "featured_image_alt") || indexItem?.featured_image_alt || "",
    featured_image_caption: getVal(frontmatterRaw, "featured_image_caption") || "",
    featured_image_credito: getVal(frontmatterRaw, "featured_image_credito") || "",
    body_html: markdownToHtml(markdownBody),
    body_markdown: markdownBody,
  };
}

const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
let converted = 0;

for (const item of index.posts) {
  const mdName = item.filename?.endsWith(".md") ? item.filename : `${item.slug}.md`;
  const mdPath = path.join(postsDir, mdName);
  const jsonName = `${item.slug}.json`;
  const jsonPath = path.join(postsDir, jsonName);

  if (fs.existsSync(jsonPath)) {
    item.filename = jsonName;
    continue;
  }
  if (!fs.existsSync(mdPath)) {
    console.warn("Missing MD:", mdName);
    continue;
  }

  const doc = parseMd(fs.readFileSync(mdPath, "utf-8"), item);
  if (!doc) {
    console.warn("Parse failed:", mdName);
    continue;
  }

  fs.writeFileSync(jsonPath, `${JSON.stringify(doc, null, 2)}\n`, "utf-8");
  item.filename = jsonName;
  converted += 1;
  console.log("Converted", item.slug);
}

index.updated_at = new Date().toISOString();
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf-8");
console.log(`Done. Converted ${converted} posts.`);
