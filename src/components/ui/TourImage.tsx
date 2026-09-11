"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { galleryFallbackForIndex } from "@/lib/gallery-fallbacks";

interface TourImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  /** Next.js no infiere fetchpriority="high" a partir de `priority` en esta versión — hay que pedirlo explícito para imágenes candidatas a LCP. */
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
  /** Lightbox: imagen contenida sin recortar */
  contain?: boolean;
  /** Índice para variar el fallback Unsplash si la imagen falla */
  fallbackIndex?: number;
}

function fallbackForIndex(index: number): string {
  return galleryFallbackForIndex(index);
}

/** Imagen optimizada con fallback si el asset local aún no existe en /public. */
export function TourImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
  fetchPriority,
  width = 1200,
  height = 800,
  contain = false,
  fallbackIndex = 0,
}: TourImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const fallbackSrc = fallbackForIndex(fallbackIndex);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        className={className}
        priority={priority}
        fetchPriority={fetchPriority}
        onError={handleError}
        style={contain ? { objectFit: "contain" } : undefined}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      fetchPriority={fetchPriority}
      onError={handleError}
    />
  );
}
