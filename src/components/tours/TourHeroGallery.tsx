"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import type { TourImagen } from "@/types/tour";

interface TourHeroGalleryProps {
  items: TourImagen[];
  tourTitle: string;
}

export function TourHeroGallery({ items, tourTitle }: TourHeroGalleryProps) {
  const images =
    items.length > 0
      ? items
      : [
          {
            src: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
            alt: `${tourTitle} — vista principal`,
          },
        ];

  const main = images[0];
  const rest = images.slice(1);
  const gridRest = rest.slice(0, 4);
  const extraCount = Math.max(0, rest.length - 4);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, prevImage, nextImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) nextImage();
      else prevImage();
    }
    setTouchStartX(null);
  };

  const current = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <div className="relative mt-2">
        <div
          className={`grid gap-2 sm:gap-3 ${
            gridRest.length > 0
              ? "md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:h-[460px] lg:h-[520px]"
              : "grid-cols-1"
          }`}
        >
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className={`relative w-full overflow-hidden rounded-2xl bg-slate-200 cursor-zoom-in group border border-slate-200/80 shadow-sm ${
              gridRest.length > 0 ? "aspect-[4/5] md:aspect-auto md:h-full" : "aspect-[4/5] md:aspect-[5/4] md:max-h-[520px]"
            }`}
            aria-label={main.alt}
          >
            <TourImage
              src={main.src}
              alt={main.alt}
              fill
              fallbackIndex={0}
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
            <span className="absolute bottom-3 left-3 right-3 z-[1] text-left text-xs font-semibold text-white drop-shadow-md line-clamp-2 pointer-events-none">
              {main.alt}
            </span>
            <span className="absolute top-3 right-3 z-[1] inline-flex items-center gap-1.5 bg-slate-900/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 pointer-events-none">
              <Camera className="w-3 h-3 text-[#ffc000]" />
              {images.length} fotos
            </span>
          </button>

          {gridRest.length > 0 && (
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 h-full min-h-0">
              {gridRest.map((img, idx) => {
                const realIndex = idx + 1;
                const isLastTile = idx === gridRest.length - 1 && extraCount > 0;
                return (
                  <button
                    type="button"
                    key={`${img.src}-${realIndex}`}
                    onClick={() => openLightbox(realIndex)}
                    className="relative overflow-hidden rounded-2xl bg-slate-200 cursor-zoom-in group border border-slate-200/80 min-h-[120px]"
                    aria-label={img.alt}
                  >
                    <TourImage
                      src={img.src}
                      alt={img.alt}
                      fill
                      fallbackIndex={realIndex}
                      sizes="25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {isLastTile && (
                      <span className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-white font-extrabold text-sm">
                        <Camera className="w-5 h-5 mb-1 text-[#ffc000]" />
                        Ver +{extraCount} fotos
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {rest.length > 0 && (
          <div className="md:hidden mt-2">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-2">
                {rest.map((img, idx) => (
                  <button
                    type="button"
                    key={`m-${img.src}-${idx}`}
                    onClick={() => openLightbox(idx + 1)}
                    className="relative shrink-0 w-[42%] aspect-square rounded-xl overflow-hidden bg-slate-200 cursor-zoom-in border border-slate-200"
                    aria-label={img.alt}
                  >
                    <TourImage
                      src={img.src}
                      alt={img.alt}
                      fill
                      fallbackIndex={idx + 1}
                      sizes="42vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="hidden md:inline-flex absolute bottom-4 right-4 items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-2xl border border-white/20 shadow-lg"
        >
          <Camera className="w-3.5 h-3.5 text-[#ffc000]" />
          Ver todas las fotos ({images.length})
        </button>
      </div>

      {current && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 text-white w-11 h-11 rounded-full bg-white/10 flex items-center justify-center z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Foto anterior"
              className="absolute left-2 sm:left-6 text-white w-11 h-11 rounded-full bg-white/10 flex items-center justify-center z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl h-[68dvh] sm:h-[72dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <TourImage
              src={current.src}
              alt={current.alt}
              fill
              contain
              fallbackIndex={lightboxIndex}
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div
            className="mt-3 max-w-2xl text-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm sm:text-base text-white font-semibold leading-snug">
              {current.alt}
            </p>
            {current.caption && (
              <p className="mt-1 text-xs text-slate-300">
                {current.caption}
              </p>
            )}
            {current.credito && (
              <p className="mt-1 text-[11px] text-[#ffc000] font-medium">
                Fuente / Crédito: {current.credito}
              </p>
            )}
            <p className="mt-1 text-[11px] font-mono text-slate-400">
              Foto {lightboxIndex + 1} de {images.length}
            </p>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Siguiente foto"
              className="absolute right-2 sm:right-6 text-white w-11 h-11 rounded-full bg-white/10 flex items-center justify-center z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
