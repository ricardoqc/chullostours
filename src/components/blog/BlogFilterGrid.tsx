"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, Eye, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";

interface BlogFilterGridProps {
  posts: BlogPost[];
}

export function BlogFilterGrid({ posts }: BlogFilterGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Extract unique categories across all posts
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("Todos");
    posts.forEach((p) => {
      if (p.categories && Array.isArray(p.categories)) {
        p.categories.forEach((c) => set.add(c));
      }
    });
    return Array.from(set);
  }, [posts]);

  // Filter posts by search query and selected category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === "Todos" ||
        (post.categories && post.categories.includes(selectedCategory));

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

  return (
    <div className="flex flex-col gap-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 md:p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por palabra clave, destino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs md:text-sm text-gray-900 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-[#6b0014] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-2">
        <span>
          Mostrando <strong className="text-gray-900">{filteredPosts.length}</strong> artículos
          {selectedCategory !== "Todos" ? ` en "${selectedCategory}"` : ""}
        </span>
        {(searchQuery || selectedCategory !== "Todos") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
            }}
            className="text-[#6b0014] font-bold hover:underline"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Featured Hero Article Card (If unfiltered or has results) */}
      {featuredPost && !searchQuery && selectedCategory === "Todos" && (
        <Link href={`/blog/${featuredPost.slug}`} className="group">
          <article className="relative bg-[#6b0014] text-white rounded-3xl overflow-hidden shadow-xl border border-red-950 flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-300">
            {/* Image Side */}
            <div className="lg:w-1/2 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80"
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="primary" className="bg-[#ffc000] text-[#1C1C1C] font-extrabold border-none flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#1C1C1C]" /> Destacado
                </Badge>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 text-xs text-gray-200">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
                    {featuredPost.reading_time_minutes || 5} min de lectura
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-[#ffc000] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-xs md:text-sm text-gray-200 leading-relaxed line-clamp-3">
                  {featuredPost.seo?.description || featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs md:text-sm font-bold text-[#ffc000] group-hover:translate-x-1 transition-transform">
                <span>Leer Guía Completa Destacada</span>
                <ArrowRight className="w-5 h-5 text-[#ffc000]" />
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Grid of Remaining Posts */}
      {filteredPosts.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
          <BookOpen className="w-10 h-10 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-800">No se encontraron artículos</h3>
          <p className="text-xs text-gray-500 max-w-md">
            Intenta buscar con otros términos como "Machu Picchu", "Camino Inca", "Precios" o borra los filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
            }}
            className="mt-2 text-xs font-bold text-white bg-[#6b0014] px-4 py-2 rounded-full hover:bg-red-800 transition-colors"
          >
            Ver todos los artículos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(searchQuery || selectedCategory !== "Todos" ? filteredPosts : remainingPosts).map(
            (post) => {
              const categoryName =
                post.categories && post.categories.length > 0 ? post.categories[0] : "Guía de Viaje";

              return (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full">
                  <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80"
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="primary" className="bg-[#6b0014] text-white border-none">
                          {categoryName}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
                            {post.reading_time_minutes || 5} min
                          </span>
                          {post.page_views ? (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              {post.page_views}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-base font-bold text-[#1C1C1C] group-hover:text-[#6b0014] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                          {post.seo?.description || post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1C1C1C] group-hover:text-[#6b0014]">
                        <span>Leer Artículo</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
