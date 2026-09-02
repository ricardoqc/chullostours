"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Camera, X, Expand } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";

interface TourGallerySliderProps {
  images: string[];
  tourTitle: string;
  /** Si true, muestra aunque haya pocas fotos (hero secundario) */
  alwaysShow?: boolean;
}

export function TourGallerySlider({
  images,
  tourTitle,
  alwaysShow = false,
}: TourGallerySliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: images.length > 2,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    thumbApi?.scrollTo(idx);
  }, [emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length]);

  if (images.length === 0) return null;
  if (!alwaysShow && images.length < 2) return null;

  return (
    <>
      <section id="galeria" className="flex flex-col gap-4 scroll-mt-28">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6b0014]">
              Galería
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 font-title">
              Fotos de la experiencia
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Camera className="w-3.5 h-3.5" />
            {images.length} fotos
          </span>
        </div>

        <div className="relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative flex-[0_0_100%] aspect-[4/3] sm:aspect-[16/10] min-h-[220px] sm:min-h-[280px]"
                >
                  <button
                    type="button"
                    className="absolute inset-0 z-[1] cursor-zoom-in"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`Ampliar foto ${index + 1}`}
                  />
                  <TourImage
                    src={src}
                    alt={`${tourTitle} — foto ${index + 1}`}
                    fill
                    fallbackIndex={index}
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <span className="absolute bottom-3 left-3 z-[2] inline-flex items-center gap-1 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                    <Expand className="w-3 h-3" />
                    Ampliar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:bg-white border border-slate-200"
              >
                <ChevronLeft className="w-5 h-5 text-slate-800" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:bg-white border border-slate-200"
              >
                <ChevronRight className="w-5 h-5 text-slate-800" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div ref={thumbRef} className="overflow-hidden -mx-1 px-1">
            <div className="flex gap-2">
              {images.map((src, i) => (
                <button
                  key={`thumb-${i}`}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedIndex
                      ? "border-[#6b0014] ring-2 ring-[#6b0014]/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <TourImage
                    src={src}
                    alt=""
                    fill
                    fallbackIndex={i}
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a foto ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-6 bg-[#6b0014]" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div
            className="relative w-full max-w-5xl h-[70dvh] sm:h-[80dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <TourImage
              src={images[lightboxIndex]}
              alt={`${tourTitle} — foto ${lightboxIndex + 1}`}
              fill
              contain
              fallbackIndex={lightboxIndex}
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
            className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-semibold">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
