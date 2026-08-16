"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Star, Heart } from "lucide-react";
import { Badge } from "../ui/badge";

export interface TourProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  badge?: string;
}

export const TourCard: React.FC<{ tour: TourProps }> = ({ tour }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={tour.imageUrl || "/images/placeholder-tour.jpg"}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Badge */}
        {tour.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="primary">{tour.badge}</Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Guardar en la lista de deseos"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 flex items-center justify-center hover:bg-white transition-all shadow-md active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-slate-700"
            }`}
          />
        </button>

        {/* Duration Chip */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
          <span>{tour.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6b0014]" />
              {tour.location}
            </span>
            {tour.rating && (
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-[#ffc000] text-[#ffc000]" />
                {tour.rating.toFixed(1)} {tour.reviewCount ? `(${tour.reviewCount})` : ""}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/tours/${tour.slug}`}>
            <h3 className="font-bold text-base md:text-lg text-slate-900 group-hover:text-[#6b0014] transition-colors line-clamp-2 leading-snug font-title">
              {tour.title}
            </h3>
          </Link>
        </div>

        {/* Footer: Price & CTA Button */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Desde</span>
            <div className="flex items-baseline gap-1">
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <span className="text-xs line-through text-slate-400 font-medium">
                  ${tour.originalPrice}
                </span>
              )}
              <span className="text-lg md:text-xl font-extrabold text-[#6b0014] font-title">
                ${tour.price}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">USD</span>
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="px-4 py-2.5 bg-[#6b0014] text-white text-xs font-bold rounded-xl hover:bg-[#850019] transition-all shadow-sm flex items-center gap-1 shrink-0 font-title"
          >
            <span>Explorar</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
