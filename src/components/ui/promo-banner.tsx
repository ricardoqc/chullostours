import React from "react";
import Link from "next/link";

export interface PromoBannerProps {
  subtitle?: string;
  duration?: string;
  title?: string;
  price?: number;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  subtitle = "Oferta destacada 2026",
  duration = "5 Días / 4 Noches",
  title = "Cusco Mágico 5 Días",
  price = 450,
  buttonText = "Ver Oferta Especial",
  buttonLink = "/tours/cusco-magico-5-dias",
  backgroundImage = "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=80",
  className = "",
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100 min-h-[300px] md:min-h-[360px] lg:min-h-[400px] flex items-center bg-slate-900 group ${className}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      {/* Gradient Overlay for Optimal Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-12 lg:p-14 flex flex-col items-start gap-3 md:gap-4 max-w-2xl">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {subtitle && (
            <span className="bg-[#ffc000] text-[#1C1C1C] font-extrabold text-xs px-3 py-1 rounded-md shadow-sm">
              {subtitle}
            </span>
          )}
          {duration && (
            <div className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-md border border-white/30">
              {duration}
            </div>
          )}
          <span className="bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-sm animate-pulse">
            ● Cupos Confirmados
          </span>
        </div>

        {/* Main Title */}
        <h2 className="text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight leading-tight font-title drop-shadow-lg">
          {title}
        </h2>

        {/* Included Features Bullets */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-slate-200 font-medium pt-1">
          <span className="flex items-center gap-1.5"><strong className="text-[#ffc000]">✓</strong> Machu Picchu + Valle Sagrado</span>
          <span className="flex items-center gap-1.5"><strong className="text-[#ffc000]">✓</strong> Trenes & Traslados</span>
          <span className="flex items-center gap-1.5"><strong className="text-[#ffc000]">✓</strong> Guía Oficial Bilingüe</span>
        </div>

        {/* Price and CTA */}
        <div className="pt-3 flex items-center gap-4 flex-wrap">
          {price && (
            <div className="flex flex-col text-white">
              <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">Precio Especial</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-[#ffc000] font-title">${price}</span>
                <span className="text-xs text-slate-300">USD / persona</span>
              </div>
            </div>
          )}

          {buttonText && (
            <Link
              href={buttonLink}
              className="bg-[#6b0014] hover:bg-[#850019] text-white font-bold text-sm md:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center active:scale-95 border border-white/20 font-title"
            >
              {buttonText} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
