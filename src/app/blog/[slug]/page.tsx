import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/data/blog", `${slug}.json`);
  if (!fs.existsSync(filePath)) return { title: "Post no encontrado" };
  const post = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return { title: `${post.title} | Chullos Tours`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), "src/data/blog", `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  
  const post = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return (
    <article className="flex flex-col gap-10 pb-16 bg-white">
      {/* Header Banner */}
      <div className="bg-[#6b0014] py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <Link
            href="/blog"
            className="text-xs text-[#ffc000] font-bold flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Blog
          </Link>
          <Badge variant="primary" className="w-fit bg-[#ffc000] text-[#1C1C1C] border-none">
            {post.category || "Guía de Viaje"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-gray-200 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#ffc000]" />
              {post.date || "2025"}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#ffc000]" />
              {post.author || "Equipo Chullos Tours"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 w-full flex flex-col gap-8 text-[#1C1C1C] leading-relaxed">
        {post.imageUrl && (
          <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-md">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Prose Content */}
        <div 
          className="max-w-none text-[#1C1C1C] [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-[#6b0014] [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-2 [&>a]:text-[#6b0014] [&>a]:font-semibold [&>img]:rounded-xl [&>img]:shadow-md [&>img]:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Call to action inside blog */}
        <div className="bg-[#6b0014] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">¿Listo para vivir esta aventura?</h3>
            <p className="text-sm text-gray-200">Reserva tu tour con la garantía de Chullos Tours.</p>
          </div>
          <Link href="/tours">
            <Button variant="primary" size="md" className="bg-[#ffc000] text-[#1C1C1C] hover:bg-yellow-500">
              Ver Catálogo de Tours
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
