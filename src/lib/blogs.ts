import fs from 'fs';
import path from 'path';
import {
  BlogPost,
  BlogPostFrontmatter,
  BlogPostSEO,
  BlogIndexData,
  BlogIndexItem,
  BlogRedirect
} from '@/types/blog';

const postsDir = path.join(process.cwd(), 'data', 'blogs', 'posts');
const indexPath = path.join(postsDir, 'index.json');

/**
 * Reads and returns index.json metadata
 */
export function getBlogIndex(): BlogIndexData {
  if (!fs.existsSync(indexPath)) {
    return { total_posts: 0, updated_at: '', posts: [], redirects: [] };
  }
  try {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading blog index.json:', err);
    return { total_posts: 0, updated_at: '', posts: [], redirects: [] };
  }
}

/**
 * Returns all published blog post index items
 */
export function getAllBlogPosts(): BlogIndexItem[] {
  const index = getBlogIndex();
  return index.posts.filter((p) => p.status === 'publish');
}

/**
 * Checks if a slug is redirected (301)
 */
export function getBlogRedirect(slug: string): BlogRedirect | undefined {
  const index = getBlogIndex();
  return index.redirects.find((r) => r.from_slug === slug);
}

/**
 * Helper to convert Markdown text to HTML
 */
export function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md;

  // Gutenberg block comments cleanup
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Headings
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-base font-bold text-gray-800 my-4">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-lg font-bold text-[#6b0014] my-4">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold text-[#6b0014] my-4">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-[#6b0014] mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-extrabold text-[#1C1C1C] mt-10 mb-5 pb-2 border-b border-gray-200">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold text-[#6b0014] my-6">$1</h1>');

  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>');

  // Images with captions/alt
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    return `<figure class="my-6 rounded-2xl overflow-hidden shadow-md bg-gray-50 border border-gray-100">
      <img src="${src}" alt="${alt}" class="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
      ${alt ? `<figcaption class="text-center text-xs text-gray-500 py-2.5 px-4 italic bg-gray-50 border-t border-gray-100">${alt}</figcaption>` : ''}
    </figure>`;
  });

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#6b0014] font-semibold underline decoration-[#ffc000] underline-offset-4 hover:text-red-700 transition-colors">$1</a>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#6b0014] bg-amber-50/50 p-4 my-4 rounded-r-xl italic text-gray-800">$1</blockquote>');

  // Horizontal Rules
  html = html.replace(/^---$/gim, '<hr class="my-8 border-t border-gray-200" />');

  // Tables parsing
  html = html.replace(/(?:\|.*?\|\r?\n)+/g, (tableMatch) => {
    const lines = tableMatch.trim().split(/\r?\n/);
    if (lines.length < 2) return tableMatch;

    const headers = lines[0].split('|').map(s => s.trim()).filter(Boolean);
    const bodyRows = lines.slice(2); // Skip header line & separator line

    let tableHtml = '<div class="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm"><table class="w-full text-left text-sm border-collapse"><thead class="bg-[#6b0014] text-white"><tr>';
    headers.forEach(h => {
      tableHtml += `<th class="py-3 px-4 font-bold border-b border-red-900">${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody class="divide-y divide-gray-200 bg-white">';

    bodyRows.forEach((row, i) => {
      const cells = row.split('|').map(s => s.trim()).filter(Boolean);
      tableHtml += `<tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-amber-50/30 transition-colors">`;
      cells.forEach(c => {
        tableHtml += `<td class="py-3 px-4 text-gray-800">${c}</td>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Unordered Lists
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc mb-1 text-gray-700">$1</li>');

  // Ordered Lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal mb-1 text-gray-700">$1</li>');

  // Wrap consecutive list items in <ul> / <ol>
  html = html.replace(/(<li class="ml-6 list-disc[^>]*>.*?<\/li>\s*)+/g, '<ul class="my-4 space-y-1">$&</ul>');
  html = html.replace(/(<li class="ml-6 list-decimal[^>]*>.*?<\/li>\s*)+/g, '<ol class="my-4 space-y-1">$&</ol>');

  // Paragraphs - split double linebreaks
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<figure') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<hr')
      ) {
        return trimmed;
      }
      return `<p class="mb-5 text-gray-700 leading-relaxed text-base">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

/**
 * Parses frontmatter YAML and returns Post object
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const index = getBlogIndex();

  // Find file by slug
  let item = index.posts.find((p) => p.slug === slug);
  let filename = item ? item.filename : `${slug}.md`;

  const filePath = path.join(postsDir, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');

    // Parse YAML frontmatter
    const parts = raw.split(/^---$/m);
    if (parts.length < 3) {
      return null;
    }

    const frontmatterRaw = parts[1];
    const markdownBody = parts.slice(2).join('---').trim();

    // Parse frontmatter fields
    const getVal = (key: string): string => {
      const match = frontmatterRaw.match(new RegExp(`${key}:\\s*"([^"]*)"`, 'i'));
      if (match) return match[1];
      const matchNoQuotes = frontmatterRaw.match(new RegExp(`${key}:\\s*([^\\r\\n]+)`, 'i'));
      return matchNoQuotes ? matchNoQuotes[1].trim() : '';
    };

    const getList = (key: string): string[] => {
      const regex = new RegExp(`${key}:\\s*\\r?\\n((?:\\s*-\\s*"[^"]*"\\r?\\n?)+)`, 'i');
      const match = frontmatterRaw.match(regex);
      if (!match) return [];
      const items = match[1].match(/"([^"]+)"/g);
      return items ? items.map((i) => i.replace(/"/g, '')) : [];
    };

    const seoTitle = getVal('title') || item?.seo_title || getVal('title');
    const seoDesc = getVal('description') || item?.seo_desc || getVal('excerpt');

    const frontmatter: BlogPostFrontmatter = {
      id: parseInt(getVal('id') || `${item?.id || 0}`, 10),
      title: getVal('title') || item?.title || '',
      slug: getVal('slug') || slug,
      status: getVal('status') || 'publish',
      date: getVal('date') || item?.date || '',
      modified: getVal('modified'),
      author: getVal('author') || 'Chullos Tours',
      excerpt: getVal('excerpt'),
      categories: getList('categories'),
      tags: getList('tags'),
      seo: {
        title: seoTitle,
        description: seoDesc,
        focus_keyword: getVal('focus_keyword'),
        synonyms: getVal('synonyms')
      },
      video_url: getVal('video_url'),
      reading_time_minutes: parseInt(getVal('reading_time_minutes') || item?.reading_time || '5', 10),
      page_views: parseInt(getVal('page_views') || item?.page_views || '0', 10),
      original_url: getVal('original_url')
    };

    const contentHtml = markdownToHtml(markdownBody);

    return {
      ...frontmatter,
      contentHtml,
      rawMarkdown: markdownBody
    };
  } catch (err) {
    console.error(`Error loading blog post ${slug}:`, err);
    return null;
  }
}

/**
 * Generates Schema.org JSON-LD structured data for GEO and SEO
 */
export function generateBlogSchema(post: BlogPost) {
  const pageUrl = `https://chullostours.com/blog/${post.slug}`;
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    headline: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    image: [
      'https://chullostours.com/images/og-blog-chullostours.jpg'
    ],
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Person',
      name: 'Alexandra Gamboa',
      jobTitle: 'Especialista en Turismo en Perú',
      worksFor: {
        '@type': 'TravelAgency',
        name: 'Chullos Tours'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Chullos Tours',
      url: 'https://chullostours.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chullostours.com/images/logo.png'
      }
    }
  };

  // Check if post has TouristAttraction focus (Machu Picchu / Cusco)
  const isMachuPicchu = post.slug.includes('machu-picchu') || post.slug.includes('machupicchu');
  const attractionSchema = isMachuPicchu ? {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Machu Picchu',
    description: 'Santuario Histórico de Machu Picchu, Maravilla del Mundo Moderno en Cusco, Perú.',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -13.1631,
      longitude: -72.5450
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Aguas Calientes',
      addressRegion: 'Cusco',
      addressCountry: 'PE'
    },
    isAccessibleForFree: false,
    touristType: ['History', 'Culture', 'Hiking', 'Adventure']
  } : null;

  return attractionSchema ? [articleSchema, attractionSchema] : [articleSchema];
}
