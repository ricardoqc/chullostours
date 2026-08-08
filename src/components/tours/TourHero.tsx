"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
  FaStar,
  FaShareAlt,
  FaHeart,
  FaChevronRight,
  FaShieldAlt,
  FaCamera,
  FaTimes,
  FaChevronLeft,
  FaMountain,
  FaChartLine,
  FaUsers,
  FaCampground,
  FaCompass,
} from "react-icons/fa";
import { Tour } from "@/types/tour";

interface TourHeroProps {
  tour: Tour;
  galleryImages: string[];
  rating?: number;
  reviewCount?: number;
}

export const TourHero: React.FC<TourHeroProps> = ({
  tour,
  galleryImages,
  rating = 4.9,
  reviewCount = 48,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = galleryImages && galleryImages.length > 0
    ? galleryImages
    : [
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=800&q=80",
      ];

  const mainImage = images[0];
  const sideImages = images.slice(1, 5);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.titulo,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  const isMultiDay = tour.atributos?.duracion?.includes("Día") && !tour.atributos?.duracion?.includes("1 Día");

  return (
    <div className="w-full bg-white pt-4 pb-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-5">
        {/* Top Header: Breadcrumb & Share/Wishlist */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold truncate">
            <Link href="/" className="hover:text-[#6b0014] transition-colors">
              Inicio
            </Link>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <Link href="/tours" className="hover:text-[#6b0014] transition-colors">
              Tours
            </Link>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-xs">
              {tour.titulo}
            </span>
          </nav>

          {/* Share & Wishlist Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir tour"
              className="h-9 px-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer relative"
            >
              <FaShareAlt className="w-3 h-3" />
              <span className="hidden sm:inline">Compartir</span>
              {copied && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow z-20">
                  ¡Copiado!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Guardar en favoritos"
              className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <FaHeart
                className={`w-3.5 h-3.5 ${
                  isWishlisted ? "text-red-500" : "text-slate-700"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title & Metadata Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-[#6b0014]/10 text-[#6b0014] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              {isMultiDay ? <FaCampground className="w-3 h-3" /> : <FaCompass className="w-3 h-3" />}
              <span>{isMultiDay ? "Trekking & Expedición" : "Tour & Excursión"}</span>
            </span>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-slate-900">
              <FaStar className="w-3 h-3 text-[#ffc000]" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({reviewCount} opiniones)</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <FaShieldAlt className="w-3 h-3 text-emerald-600" />
              Garantía Chullos Tours
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-title tracking-tight leading-tight">
            {tour.titulo}
          </h1>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-slate-700 pt-1">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#6b0014]" />
              {tour.atributos?.ubicacion || "Cusco, Perú"}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
              <FaClock className="w-3.5 h-3.5 text-[#6b0014]" />
              {tour.atributos?.duracion || "Full Day"}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
              <FaGlobe className="w-3.5 h-3.5 text-[#6b0014]" />
              {tour.atributos?.idiomas?.join(", ") || "Español, Inglés"}
            </span>
            {tour.atributos?.altitud_maxima && (
              <span className="flex items-center gap-1.5 bg-amber-50 text-slate-800 px-3.5 py-1.5 rounded-full border border-amber-200/80 font-bold">
                <FaMountain className="w-3.5 h-3.5 text-amber-600" />
                <span>Altitud: {tour.atributos.altitud_maxima}</span>
              </span>
            )}
            {tour.atributos?.dificultad && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-900 px-3.5 py-1.5 rounded-full border border-blue-200/80 font-bold">
                <FaChartLine className="w-3.5 h-3.5 text-blue-600" />
                <span>Dificultad: {tour.atributos.dificultad}</span>
              </span>
            )}
            {tour.atributos?.grupo_max && (
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-200/80 font-bold">
                <FaUsers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Máx: {tour.atributos.grupo_max} personas</span>
              </span>
            )}
          </div>
        </div>

        {/* Bento Grid Gallery Container (Contained & Crisp) */}
        <div className="relative mt-2">
          {/* Desktop/Tablet 5-Photo Bento Grid */}
          <div className="hidden md:grid grid-cols-4 gap-3 md:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
            {/* Main Featured Photo (2 cols) */}
            <div
              onClick={() => openLightbox(0)}
              className="col-span-2 row-span-2 h-full relative group overflow-hidden cursor-pointer"
            >
              <img
                src={mainImage}
                alt={tour.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 4 Side Grid Photos (2 cols) */}
            <div className="col-span-2 grid grid-cols-2 gap-3 h-full">
              {sideImages.map((img, idx) => {
                const realIndex = idx + 1;
                const isLastTile = idx === 3 && images.length > 5;
                const extraCount = images.length - 5;

                return (
                  <div
                    key={idx}
                    onClick={() => openLightbox(realIndex)}
                    className="relative bg-slate-200 overflow-hidden group cursor-pointer h-full rounded-xl border border-slate-100"
                  >
                    <img
                      src={img}
                      alt={`${tour.titulo} - ${realIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {isLastTile && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white font-extrabold text-sm group-hover:bg-slate-950/80 transition-colors">
                        <FaCamera className="w-5 h-5 mb-1 text-[#ffc000]" />
                        <span>Ver +{extraCount} fotos</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* View All Photos Button Overlay (Desktop bottom right) */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg transition-all border border-white/20 cursor-pointer"
            >
              <FaCamera className="w-3.5 h-3.5 text-[#ffc000]" />
              <span>Ver todas las fotos ({images.length})</span>
            </button>
          </div>

          {/* Mobile Single Photo Card (Crisp & Touch-Friendly) */}
          <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
            <img
              src={mainImage}
              alt={tour.titulo}
              onClick={() => openLightbox(0)}
              className="w-full h-full object-cover cursor-pointer"
            />
            {/* Mobile Photo Count Badge */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-white/20 cursor-pointer"
            >
              <FaCamera className="w-3.5 h-3.5 text-[#ffc000]" />
              <span>Ver {images.length} fotos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal Overlay */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#ffc000] p-2.5 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-3 sm:left-6 text-white hover:text-[#ffc000] p-3 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          {/* Image display */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3">
            <img
              src={images[lightboxIndex]}
              alt={`${tour.titulo} - ${lightboxIndex + 1}`}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <span className="text-xs font-bold text-slate-300 font-mono bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/10">
              Foto {lightboxIndex + 1} de {images.length}
            </span>
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 sm:right-6 text-white hover:text-[#ffc000] p-3 rounded-full bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
