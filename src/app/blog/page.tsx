import React from "react";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { BlogFilterGrid } from "@/components/blog/BlogFilterGrid";

export const metadata = {
  title: "Blog y Guías de Viaje a Machu Picchu, Cusco y Perú 2026 | Chullos Tours",
  description: "Descubre las mejores guías de viaje, consejos de expertos, circuitos de Machu Picchu, itinerarios y precios actualizados para tu aventura en Perú.",
};

export default async function BlogIndexPage() {
  const postsList = getAllBlogPosts();

  // Load full details for each post
  const fullPosts = postsList
    .map((item) => getBlogPostBySlug(item.slug))
    .filter((post): post is NonNullable<typeof post> => post !== null);

  return (
    <div className="flex flex-col gap-10 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#6b0014] py-14 md:py-16 px-4 text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Magazine · Guías 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-title">
            Blog de viajes por Perú
          </h1>
          <p className="text-gray-200 text-sm md:text-base max-w-xl font-light">
            Itinerarios, precios y consejos de nuestros guías oficiales en Cusco.
          </p>
        </div>
      </div>

      {/* Main Blog Filter Grid Section */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <BlogFilterGrid posts={fullPosts} />
      </div>
    </div>
  );
}
