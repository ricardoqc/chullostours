"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { BlogMagazineCard } from "./BlogMagazineCard";

interface BlogFilterGridProps {
  posts: BlogPost[];
}

export function BlogFilterGrid({ posts }: BlogFilterGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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

  const showFeatured = !searchQuery && selectedCategory === "Todos";
  const featuredPost = showFeatured && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200/80">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar destino, consejo, precio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-[#6b0014] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          <strong className="text-slate-900">{filteredPosts.length}</strong> artículos
          {selectedCategory !== "Todos" ? ` · ${selectedCategory}` : ""}
        </span>
        {(searchQuery || selectedCategory !== "Todos") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
            }}
            className="text-[#6b0014] font-bold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
          <BookOpen className="w-10 h-10 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800">No se encontraron artículos</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Prueba con &quot;Machu Picchu&quot;, &quot;Camino Inca&quot; o &quot;precios&quot;.
          </p>
        </div>
      ) : (
        <>
          {featuredPost && <BlogMagazineCard post={featuredPost} featured />}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridPosts.map((post) => (
              <BlogMagazineCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}

      <div className="text-center pt-2">
        <Link
          href="/viaje-personalizado/"
          className="inline-flex text-sm font-bold text-[#6b0014] hover:underline"
        >
          ¿No encuentras lo que buscas? Diseña tu viaje a medida →
        </Link>
      </div>
    </div>
  );
}
