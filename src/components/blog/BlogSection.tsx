import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { TourImage } from "@/components/ui/TourImage";

const BLOG_THUMBNAILS: Record<string, string> = {
  "camino-inca-4-dias-guia-definitiva": "/media/tours/camino-inca-4-dias/01.jpg",
  "como-comprar-tu-boleto-a-machu-picchu-guia-completa": "/media/tours/machu-picchu-full-day-tren-expedition/01.jpg",
  "como-llegar-a-machu-picchu-guia-completa-para-tu-visita": "/media/tours/tour-machu-picchu-2-dias/01.jpg",
  "cuanto-cuesta-viajar-a-machu-picchu-2026": "/media/tours/cusco-magico-5-dias/01.jpg",
  "explora-las-maravillas-de-machu-picchu-vacaciones-inolvidables-en-el-corazon-de-los-andes": "/media/tours/descubre-cusco-3-dias/01.jpg",
  "guia-completa-para-visitar-machu-picchu-en-un-dia": "/media/tours/machupicchu-full-day-con-tren-vistadome/01.jpg",
  "guia-para-viajar-a-machu-picchu-por-tu-cuenta": "/media/tours/machupicchu-full-day-con-tren-observatory/01.jpg",
  "la-guia-definitiva-para-visitar-la-montana-de-7-colores-vinicunca": "/media/tours/montana-colores-vinicunca-tour/01.jpg",
  "laguna-humantay-todo-lo-que-necesitas-saber-antes-de-ir": "/media/tours/laguna-humantay-tour-cusco/01.jpg",
  "machu-picchu-todo-lo-que-necesitas-saber-para-tu-viaje": "/media/tours/tour-machu-picchu-2-dias/01.jpg",
  "que-llevar-en-la-mochila-a-machu-picchu-lista-esencial": "/media/tours/camino-inca-2-dias/01.jpg",
  "valle-sagrado-de-los-incas-itinerario-y-que-ver": "/media/tours/valle-sagrado-vip-tour-cusco/01.jpg",
};

export function BlogSection() {
  const postsList = getAllBlogPosts();
  
  const featuredPosts = postsList
    .slice(0, 3)
    .map((item) => getBlogPostBySlug(item.slug))
    .filter((post): post is NonNullable<typeof post> => post !== null);

  if (featuredPosts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 w-full py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[#6b0014] font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#ffc000]" /> Guías & Consejos de Viaje 2026
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-title">
            Blog de Viajes por Cusco y Perú
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
            Inspiración, itinerarios día a día y consejos de guías locales para planificar la mejor aventura de tu vida.
          </p>
        </div>

        <Link href="/blog">
          <Button
            variant="outline"
            className="!text-[#6b0014] hover:!text-white hover:bg-[#6b0014] flex items-center gap-2 border-[#6b0014] font-bold"
          >
            Ver más blogs
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {featuredPosts.map((post) => {
          const categoryName =
            post.categories && post.categories.length > 0 ? post.categories[0] : "Guía de Viaje";
          const imageUrl =
            BLOG_THUMBNAILS[post.slug] ||
            "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80";

          return (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full">
              <article className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <TourImage
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary" className="bg-[#6b0014] text-white border-none shadow-sm font-bold text-[10px]">
                      {categoryName}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
                        {post.reading_time_minutes || 5} min de lectura
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#6b0014] transition-colors leading-snug line-clamp-2 font-title">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.seo?.description || post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#6b0014] group-hover:translate-x-1 transition-transform">
                    <span>Leer Artículo Completo</span>
                    <ArrowRight className="w-4 h-4 text-[#ffc000]" />
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

