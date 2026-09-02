"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";
import { getBlogCoverImage } from "@/lib/blog-images";
import { TourImage } from "@/components/ui/TourImage";

interface BlogMagazineCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogMagazineCard({ post, featured = false }: BlogMagazineCardProps) {
  const category =
    post.categories && post.categories.length > 0 ? post.categories[0] : "Guía de viaje";
  const cover = getBlogCoverImage(post);

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative min-h-[320px] md:min-h-[380px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
          <TourImage
            src={cover}
            alt={post.title}
            fill
            sizes="100vw"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0008] via-[#6b0014]/55 to-transparent" />
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end gap-3">
            <Badge variant="primary" className="w-fit bg-[#ffc000] text-[#1c1c1c] border-none">
              Destacado
            </Badge>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
                {post.reading_time_minutes || 5} min
              </span>
              <span className="bg-white/15 px-2 py-0.5 rounded-full">{category}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white font-title leading-tight group-hover:text-[#ffc000] transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-slate-200 line-clamp-2 max-w-3xl">
              {post.seo?.description || post.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#ffc000] pt-1">
              Leer guía completa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="relative h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300">
        <TourImage
          src={cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-[#6b0014]/90 transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="bg-white/90 text-[#6b0014] border-none text-[10px]">
            {category}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col gap-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#ffc000]" />
              {post.date}
            </span>
            <span>·</span>
            <span>{post.reading_time_minutes || 5} min</span>
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-white font-title leading-snug line-clamp-3 group-hover:text-[#ffc000] transition-colors">
            {post.title}
          </h3>
          <p className="text-[11px] text-slate-300 line-clamp-2 opacity-90 group-hover:opacity-100">
            {post.seo?.description || post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
