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
  FaMountain,
  FaChartLine,
  FaUsers,
  FaCampground,
  FaCompass,
} from "react-icons/fa";
import { Tour, TourImagen } from "@/types/tour";
import { TourMetaDataBadges } from "./TourMetaDataBadges";
import { TourHeroGallery } from "./TourHeroGallery";

interface TourHeroProps {
  tour: Tour;
  galleryItems: TourImagen[];
  rating?: number;
  reviewCount?: number;
}

export const TourHero: React.FC<TourHeroProps> = ({
  tour,
  galleryItems,
  rating = 4.9,
  reviewCount = 48,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const isMultiDay =
    tour.atributos?.duracion?.includes("Día") &&
    !tour.atributos?.duracion?.includes("1 Día");

  return (
    <div className="w-full bg-white pt-4 pb-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 pt-2">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold truncate min-w-0 flex-1">
            <Link href="/" className="hover:text-[#6b0014] transition-colors shrink-0">
              Inicio
            </Link>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <Link href="/tours" className="hover:text-[#6b0014] transition-colors shrink-0">
              Tours
            </Link>
            <FaChevronRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-xs">
              {tour.titulo}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir tour"
              className="h-11 px-3.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer relative touch-manipulation"
            >
              <FaShareAlt className="w-3.5 h-3.5" />
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
              className="h-11 w-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer touch-manipulation"
            >
              <FaHeart
                className={`w-4 h-4 ${
                  isWishlisted ? "text-red-500" : "text-slate-700"
                }`}
              />
            </button>
          </div>
        </div>

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
              {tour.atributos?.idiomas ? tour.atributos.idiomas.join(" / ") : "Español / Inglés"}
            </span>
            {tour.atributos?.dificultad && (
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
                <FaChartLine className="w-3.5 h-3.5 text-[#6b0014]" />
                Dificultad: {tour.atributos.dificultad}
              </span>
            )}
            {tour.atributos?.altitud_maxima && (
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
                <FaMountain className="w-3.5 h-3.5 text-[#6b0014]" />
                {tour.atributos.altitud_maxima}
              </span>
            )}
            {tour.atributos?.grupo_max && (
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80">
                <FaUsers className="w-3.5 h-3.5 text-[#6b0014]" />
                Máx. {tour.atributos.grupo_max} personas
              </span>
            )}
          </div>

          {(tour.horarios_disponibles || tour.punto_inicio || tour.categoria) && (
            <div className="pt-2">
              <TourMetaDataBadges
                horarios={tour.horarios_disponibles}
                puntoInicio={tour.punto_inicio}
                categoria={tour.categoria}
              />
            </div>
          )}
        </div>

        <TourHeroGallery items={galleryItems} tourTitle={tour.titulo} />
      </div>
    </div>
  );
};
