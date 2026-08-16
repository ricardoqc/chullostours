import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";

interface BlogRelatedPostsProps {
  currentSlug: string;
}

export function BlogRelatedPosts({ currentSlug }: BlogRelatedPostsProps) {
  const allPosts = getAllBlogPosts();

  // Filter out current post
  const relatedList = allPosts
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  const relatedPosts = relatedList
    .map((item) => getBlogPostBySlug(item.slug))
    .filter((post): post is NonNullable<typeof post> => post !== null);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <div className="flex items-center gap-2 text-[#6b0014] font-extrabold text-xl md:text-2xl mb-6">
        <BookOpen className="w-5 h-5 text-[#ffc000]" />
        <h2>Artículos Relacionados que Te Pueden Interesar</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const categoryName =
            post.categories && post.categories.length > 0 ? post.categories[0] : "Guía de Viaje";

          return (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full">
              <article className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80"
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="primary" className="bg-[#6b0014] text-white text-[10px] border-none">
                      {categoryName}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#ffc000]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ffc000]" />
                        {post.reading_time_minutes || 5} min
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#6b0014] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#6b0014]">
                    <span>Leer Más</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ffc000]" />
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
