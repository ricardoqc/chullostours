import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Blog y Guías de Viaje a Cusco y Perú | Chullos Tours",
  description: "Consejos, itinerarios y guías completas para tu aventura en Perú.",
};

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), "src/data/blog");
  let filenames = [];
  try {
    filenames = fs.readdirSync(postsDirectory);
  } catch (e) {
    return [];
  }
  
  const posts = filenames
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContents);
    });
    
  return posts;
}

export default async function BlogIndexPage() {
  const POSTS = await getPosts();

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest">
            Artículos y Consejos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Blog de Viajes por Perú
          </h1>
          <p className="text-gray-200 text-sm md:text-base max-w-xl font-light">
            Inspiración, guías detalladas e información útil para planificar tu viaje.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full">
            <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary" className="bg-[#6b0014] text-white border-none">{post.category}</Badge>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#ffc000]" />
                      {post.author || "Equipo Chullos"}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#1C1C1C] group-hover:text-[#6b0014] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1C1C1C] group-hover:text-[#6b0014]">
                  <span>Leer Artículo</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
