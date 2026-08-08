"use client";

import React, { useState } from "react";
import { Images, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface TourGalleryGridProps {
  images: string[];
  tourTitle: string;
}

export const TourGalleryGrid: React.FC<TourGalleryGridProps> = ({
  images,
  tourTitle,
}) => {
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

  return (
    <div className="flex flex-col gap-3">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[21/9] shadow-xs relative">
        {/* Main large image */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 h-full bg-slate-100 relative group overflow-hidden cursor-pointer rounded-2xl"
        >
          <img
            src={mainImage}
            alt={tourTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* 4 Thumbnails Grid */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {sideImages.map((img, idx) => {
            const realIndex = idx + 1;
            const isLast = idx === 3 && images.length > 5;
            return (
              <div
                key={idx}
                onClick={() => openLightbox(realIndex)}
                className="bg-slate-100 overflow-hidden relative group cursor-pointer h-full rounded-2xl border border-slate-100"
              >
                <img
                  src={img}
                  alt={`${tourTitle} - ${realIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white font-extrabold text-sm group-hover:bg-slate-950/80 transition-colors">
                    <Camera className="w-5 h-5 mb-1 text-[#ffc000]" />
                    <span>Ver las {images.length} fotos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View all photos button (Mobile overlay) */}
        <button
          onClick={() => openLightbox(0)}
          className="md:hidden absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md"
        >
          <Camera className="w-3.5 h-3.5 text-[#ffc000]" />
          <span>Ver {images.length} fotos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#ffc000] p-2 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-[#ffc000] p-3 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image display */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3">
            <img
              src={images[lightboxIndex]}
              alt={`${tourTitle} - ${lightboxIndex + 1}`}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <span className="text-xs font-bold text-slate-300 font-mono bg-black/50 px-3 py-1 rounded-full">
              Foto {lightboxIndex + 1} de {images.length}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-[#ffc000] p-3 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
