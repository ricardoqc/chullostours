"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { HotelCiudad } from "@/types/tour";

interface HotelPhotoModalProps {
  hotel: HotelCiudad;
  images: string[];
  isReferential?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function HotelPhotoModal({
  hotel,
  images,
  isReferential = false,
  isOpen,
  onClose,
}: HotelPhotoModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, scrollPrev, scrollNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${hotel.hotel}`}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#6b0014]">{hotel.ciudad}</p>
            <h3 className="font-black text-slate-900 font-title">{hotel.hotel}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isReferential && (
          <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-950">
            <strong>Fotos referenciales (Unsplash).</strong> Sustituye las URLs en{" "}
            <code className="text-[10px] bg-white px-1 py-0.5 rounded border">
              data/tours/…json → hoteles[].imagenes
            </code>{" "}
            y marca <code className="text-[10px]">imagenes_referenciales: false</code>.
          </div>
        )}

        <div className="relative bg-slate-900 mt-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((src, i) => (
                <div key={`${src}-${i}`} className="relative min-w-full aspect-[16/10]">
                  <Image
                    src={src}
                    alt={`${hotel.hotel} — foto ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="px-5 py-3 text-center text-xs font-semibold text-slate-500">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
