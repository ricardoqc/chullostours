"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";

export interface GalleryImageItem {
  src: string;
  alt?: string;
}

interface TourGalleryGridProps {
  images: string[] | GalleryImageItem[];
  tourTitle: string;
}

function normalize(images: string[] | GalleryImageItem[]): GalleryImageItem[] {
  return images.map((img, i) =>
    typeof img === "string"
      ? { src: img, alt: undefined }
      : { src: img.src, alt: img.alt }
  );
}

export const TourGalleryGrid: React.FC<TourGalleryGridProps> = ({
  images: rawImages,
  tourTitle,
}) => {
  const images = normalize(rawImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mainImage = images[0];
  const sideImages = images.slice(1, 5);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, images.length]);

  const altFor = (item: GalleryImageItem | undefined, index: number) =>
    item?.alt || `${tourTitle} — foto ${index + 1}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] relative bg-slate-900">
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 h-full relative group overflow-hidden cursor-pointer rounded-2xl"
        >
          <TourImage
            src={mainImage?.src || "/img/placeholder.jpg"}
            alt={altFor(mainImage, 0)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow">
              {altFor(mainImage, 0)}
            </p>
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
              <Camera className="w-3 h-3" />
              {images.length}
            </span>
          </div>
        </div>

        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {sideImages.map((img, idx) => {
            const realIndex = idx + 1;
            const isLast = idx === 3 && images.length > 5;
            return (
              <div
                key={idx}
                onClick={() => openLightbox(realIndex)}
                className="overflow-hidden relative group cursor-pointer h-full rounded-2xl border border-white/10"
              >
                <TourImage
                  src={img.src}
                  alt={altFor(img, realIndex)}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                {isLast && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      +{images.length - 5} fotos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div
            className="max-w-5xl w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <TourImage
              src={images[lightboxIndex].src}
              alt={altFor(images[lightboxIndex], lightboxIndex)}
              width={1600}
              height={1067}
              sizes="(max-width: 768px) 100vw, 896px"
              className="max-h-[78vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/90 text-sm text-center px-4">
              {altFor(images[lightboxIndex], lightboxIndex)}
            </p>
            <p className="text-white/50 text-xs">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
          <button
            type="button"
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
