"use client";

import React, { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { SocialFacebook, SocialWhatsapp } from "@/components/ui/icons";

interface BlogShareBarProps {
  title: string;
  url: string;
}

export function BlogShareBar({ title, url }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-3 py-4 border-y border-gray-100 my-6">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <Share2 className="w-4 h-4 text-[#6b0014]" /> Compartir:
      </span>

      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
        title="Compartir en WhatsApp"
      >
        <SocialWhatsapp className="w-4 h-4 text-white" />
      </a>

      {/* Facebook Share */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
        title="Compartir en Facebook"
      >
        <SocialFacebook className="w-4 h-4 text-white" />
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all shadow-sm"
        title="Copiar enlace"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
      </button>

      {copied && (
        <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ¡Enlace copiado!
        </span>
      )}
    </div>
  );
}
