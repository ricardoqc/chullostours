"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Star, Heart, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { EntradasIncluidasBanner } from "./EntradasIncluidasBanner";
import { TourImage } from "@/components/ui/TourImage";
import type { Tour } from "@/types/tour";

export interface TourCardChip {
  id: string;
  label: string;
  tone?: "brand" | "neutral" | "success" | "warning";
}

export interface TourProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  currency?: "USD" | "PEN";
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  badge?: string;
  difficulty?: string;
  groupSize?: string;
  tripType?: string;
  chips?: TourCardChip[];
  entradasIncluidas?: {
    titulo: string;
    detalle: string;
    variant: "emerald" | "gold" | "brand";
  };
}

const chipToneClasses: Record<NonNullable<TourCardChip["tone"]>, string> = {
  brand: "bg-[#6b0014]/8 text-[#6b0014] border-[#6b0014]/15",
  neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200/70",
  warning: "bg-amber-50 text-amber-900 border-amber-200/70",
};

export const TourCard: React.FC<{ tour: TourProps }> = ({ tour }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const currency = tour.currency || "USD";
  const currencyLabel = currency === "PEN" ? "PEN" : "USD";
  const moneyPrefix = currency === "PEN" ? "S/ " : "$";

  const entradasTourStub: Tour | null = tour.entradasIncluidas
    ? ({
        entradas_incluidas: { destacado: true, ...tour.entradasIncluidas },
      } as Tour)
    : null;

  const attributeChips: TourCardChip[] = [
    ...(tour.chips || []),
    ...(tour.difficulty
      ? [{ id: "difficulty", label: tour.difficulty, tone: "neutral" as const }]
      : []),
    ...(tour.groupSize
      ? [{ id: "group", label: tour.groupSize, tone: "neutral" as const }]
      : []),
    ...(tour.tripType && !tour.badge
      ? [{ id: "type", label: tour.tripType, tone: "brand" as const }]
      : []),
  ];

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5">
      <div className="relative aspect-[5/4] overflow-hidden bg-slate-100">
        <TourImage
          src={tour.imageUrl || "/media/tours/city-tour-cusco/01.jpg"}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {tour.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="primary">{tour.badge}</Badge>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Guardar en la lista de deseos"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 flex items-center justify-center hover:bg-white transition-all shadow-md active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-slate-700"
            }`}
          />
        </button>

        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-[#ffc000]" />
          <span>{tour.duration}</span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <MapPin className="w-3 h-3 text-[#6b0014] shrink-0" />
              <span className="truncate">{tour.location}</span>
            </span>
            {tour.rating && (
              <span className="flex items-center gap-0.5 font-bold text-slate-800 shrink-0">
                <Star className="w-3 h-3 fill-[#ffc000] text-[#ffc000]" />
                {tour.rating.toFixed(1)}
                {tour.reviewCount ? ` (${tour.reviewCount})` : ""}
              </span>
            )}
          </div>

          <Link href={`/tours/${tour.slug}`}>
            <h3 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-[#6b0014] transition-colors line-clamp-2 leading-snug font-title">
              {tour.title}
            </h3>
          </Link>

          {(entradasTourStub || attributeChips.length > 0) && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {entradasTourStub && (
                <EntradasIncluidasBanner tour={entradasTourStub} size="chip" />
              )}
              {attributeChips.map((chip) => (
                <span
                  key={chip.id}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    chipToneClasses[chip.tone || "neutral"]
                  }`}
                >
                  {chip.id === "group" && <Users className="w-2.5 h-2.5 shrink-0" />}
                  {chip.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 font-medium">Desde</span>
            <div className="flex items-baseline gap-1 flex-wrap">
              {tour.originalPrice && tour.originalPrice > tour.price && (
                <span className="text-[10px] line-through text-slate-400 font-medium">
                  {moneyPrefix}
                  {tour.originalPrice}
                </span>
              )}
              <span className="text-base md:text-lg font-extrabold text-[#6b0014] font-title">
                {moneyPrefix}
                {tour.price}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {currencyLabel}
              </span>
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="px-3.5 py-2 bg-[#6b0014] text-white text-[11px] font-bold rounded-lg hover:bg-[#850019] transition-all shadow-sm flex items-center gap-1 shrink-0 font-title"
          >
            <span>Ver Tour</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
