import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock, Eye, Compass, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogAuthorCard } from "@/components/blog/BlogAuthorCard";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import { notFound, redirect } from "next/navigation";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogRedirect,
  generateBlogSchema,
  getBlogIndex
} from "@/lib/blogs";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  const index = getBlogIndex();
  
  const postParams = posts.map((post) => ({
    slug: post.slug,
  }));

  const redirectParams = index.redirects.map((r) => ({
    slug: r.from_slug,
  }));

  return [...postParams, ...redirectParams];
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  
  const redirectInfo = getBlogRedirect(slug);
  if (redirectInfo) {
    const targetPost = getBlogPostBySlug(redirectInfo.to_slug);
    if (targetPost) {
      return {
        title: targetPost.seo.title || targetPost.title,
        description: targetPost.seo.description || targetPost.excerpt,
      };
    }
  }

  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Post no encontrado | Chullos Tours" };
  }

  const canonicalUrl = `https://chullostours.com/blog/${post.slug}`;

  return {
    title: post.seo.title || `${post.title} | Chullos Tours`,
    description: post.seo.description || post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      url: canonicalUrl,
      siteName: "Chullos Tours",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      authors: ["Alexandra Gamboa", "Chullos Tours"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;

  const redirectInfo = getBlogRedirect(slug);
  if (redirectInfo) {
    redirect(`/blog/${redirectInfo.to_slug}`);
  }

  const post = getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const schemas = generateBlogSchema(post);
  const mainCategory = post.categories && post.categories.length > 0 ? post.categories[0] : "Guía de Viaje";
  const postUrl = `https://chullostours.com/blog/${post.slug}`;

  return (
    <>
      {/* Schema.org Structured Data for GEO & AI Engines */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <article className="flex flex-col gap-10 pb-16 bg-white">
        {/* Header Banner */}
        <div className="bg-[#6b0014] py-14 px-4 text-white">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-amber-200/90 overflow-x-auto no-scrollbar py-1">
              <Link href="/" className="hover:underline shrink-0">Inicio</Link>
              <ChevronRight className="w-3 h-3 shrink-0 text-[#ffc000]" />
              <Link href="/blog" className="hover:underline shrink-0">Blog</Link>
              <ChevronRight className="w-3 h-3 shrink-0 text-[#ffc000]" />
              <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-[300px]">{post.title}</span>
            </nav>

            <div className="flex items-center gap-2 pt-1">
              <Badge variant="primary" className="bg-[#ffc000] text-[#1C1C1C] font-extrabold border-none">
                {mainCategory}
              </Badge>
              {post.categories.slice(1).map((cat) => (
                <Badge key={cat} variant="secondary" className="bg-white/10 text-white border-white/20">
                  {cat}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-200 pt-3 border-t border-white/20">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ffc000]" />
                Publicado: {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#ffc000]" />
                Por: {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ffc000]" />
                Tiempo de lectura: {post.reading_time_minutes || 5} min
              </span>
              {post.page_views ? (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#ffc000]" />
                  {post.page_views} lecturas
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-4xl mx-auto px-4 w-full flex flex-col gap-8 text-[#1C1C1C] leading-relaxed">
          {/* Social Share Bar */}
          <BlogShareBar title={post.title} url={postUrl} />

          {/* Excerpt Box / Executive Summary */}
          {post.excerpt && (
            <div className="bg-amber-50/60 border-l-4 border-[#ffc000] p-6 rounded-r-2xl text-gray-800 text-sm md:text-base leading-relaxed font-medium shadow-sm">
              <div className="flex items-center gap-2 text-[#6b0014] font-bold mb-1 text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#6b0014]" /> Resumen Guía de Viaje
              </div>
              <p>{post.excerpt}</p>
            </div>
          )}

          {/* HTML Markdown Content */}
          <div
            className="prose max-w-none text-[#1C1C1C] [&>p]:mb-5 [&>p]:leading-relaxed [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:mt-10 [&>h2]:mb-5 [&>h2]:text-[#6b0014] [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-gray-200 [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-[#6b0014] [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>li]:mb-2 [&>a]:text-[#6b0014] [&>a]:font-semibold [&>a]:underline [&>a]:decoration-[#ffc000] [&>a]:underline-offset-4 [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:my-6"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-gray-500">Etiquetas:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* E-E-A-T Author Card */}
          <BlogAuthorCard authorName={post.author || "Alexandra Gamboa"} />

          {/* Call to action inside blog */}
          <div className="bg-[#6b0014] text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffc000]" /> Operador Directo Autorizado
              </span>
              <h3 className="text-2xl font-extrabold text-white">¿Listo para vivir la experiencia en Machu Picchu?</h3>
              <p className="text-sm text-gray-200 max-w-lg">
                Diseñamos tu itinerario personalizado con boletos garantizados, guías expertos y transporte de primera clase.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/viaje-personalizado" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full bg-[#ffc000] text-[#1C1C1C] hover:bg-amber-400 font-bold border-none shadow-md">
                  Personalizar Mi Viaje
                </Button>
              </Link>
              <Link href="/tours" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full border-white text-white hover:bg-white/10 font-bold">
                  Ver Paquetes Turísticos
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          <BlogRelatedPosts currentSlug={post.slug} />
        </div>
      </article>
    </>
  );
}
