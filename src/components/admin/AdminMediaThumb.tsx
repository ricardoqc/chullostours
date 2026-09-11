"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type AdminMediaThumbProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Miniatura CMS sin next/image ni fallback Unsplash (evita miniaturas falsas idénticas). */
export function AdminMediaThumb({ src, alt, className = "object-cover" }: AdminMediaThumbProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-slate-200 text-slate-500 px-3 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <ImageOff className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] font-semibold leading-tight">No se pudo cargar</span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
