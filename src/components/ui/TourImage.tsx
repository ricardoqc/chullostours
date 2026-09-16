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
  /** Desactiva la capa anti-descarga (p. ej. CMS). */
  unprotected?: boolean;
}

function fallbackForIndex(index: number): string {
  return galleryFallbackForIndex(index);
}

function joinClass(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

/** Imagen con fallback si el asset local no existe. /media usa unoptimized
 *  para no pasar por el optimizador de Next (evita ruido cuando falta el archivo
 *  o la ruta pasa por /api/serve-media). */
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
  unprotected = false,
}: TourImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const fallbackSrc = fallbackForIndex(fallbackIndex);
  const unoptimized =
    currentSrc.startsWith("/media/") || currentSrc.startsWith("data:");

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  const imageClass = joinClass(className, !unprotected && "media-protect-img");
  const protectProps = unprotected
    ? {}
    : {
        draggable: false as const,
        "data-media-protect": "true",
        onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
        onDragStart: (event: React.DragEvent) => event.preventDefault(),
      };

  if (fill) {
    const image = (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        className={imageClass}
        priority={priority}
        fetchPriority={fetchPriority}
        onError={handleError}
        unoptimized={unoptimized}
        style={contain ? { objectFit: "contain" } : undefined}
        {...protectProps}
      />
    );

    if (unprotected) return image;

    return (
      <span className="media-protect absolute inset-0 block" data-media-protect="true">
        {image}
        <span className="media-protect-shield" aria-hidden="true" />
      </span>
    );
  }

  const image = (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={imageClass}
      priority={priority}
      fetchPriority={fetchPriority}
      onError={handleError}
      unoptimized={unoptimized}
      {...protectProps}
    />
  );

  if (unprotected) return image;

  return (
    <span className="media-protect relative inline-block max-w-full" data-media-protect="true">
      {image}
      <span className="media-protect-shield" aria-hidden="true" />
    </span>
  );
}
