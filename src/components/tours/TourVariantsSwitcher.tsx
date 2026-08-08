"use client";

import React from "react";
import Link from "next/link";
import { Train, Sparkles, ArrowRight, Check } from "lucide-react";

export interface TrainVariant {
  slug: string;
  name: string;
  type: "expedition" | "vistadome" | "observatory" | "mixed";
  badge: string;
  price: number;
  description: string;
  features: string[];
}

const TRAIN_VARIANTS: TrainVariant[] = [
  {
    slug: "machu-picchu-full-day-tren-expedition",
    name: "Tren Expedition / Voyager",
    type: "expedition",
    badge: "Más Popular",
    price: 299,
    description: "Vagones cómodos con asientos de cuero andino y ventanas panorámicas superiores.",
    features: ["Asientos ejecutivos reclinables", "Música ambiental andina", "Espacio para equipaje de mano"],
  },
  {
    slug: "machupicchu-full-day-con-tren-vistadome",
    name: "Tren Vistadome Panorámico",
    type: "vistadome",
    badge: "Experiencia 180°",
    price: 344,
    description: "Vagones rodeados de cristal de piso a techo, show de danza Saqra y snack de ingredientes locales.",
    features: ["Ventanas panorámicas 180°", "Show cultural de danza a bordo", "Snack & bebida andina gourmet"],
  },
  {
    slug: "machupicchu-full-day-con-tren-observatory",
    name: "Tren Observatory 360°",
    type: "observatory",
    badge: "Vagón Abierto",
    price: 389,
    description: "Vagón observatorio al aire libre con lounge bar, música en vivo y vistas panorámicas sin filtro.",
    features: ["Vagón balcón al aire libre", "Música en vivo a bordo", "Lounge bar & coctelería peruana"],
  },
];

interface TourVariantsSwitcherProps {
  currentSlug: string;
}

export const TourVariantsSwitcher: React.FC<TourVariantsSwitcherProps> = ({ currentSlug }) => {
  // Check if current tour is one of the Machu Picchu train tours
  const isTrainTour = TRAIN_VARIANTS.some((v) => v.slug === currentSlug);

  if (!isTrainTour) return null;

  const currentVariant = TRAIN_VARIANTS.find((v) => v.slug === currentSlug) || TRAIN_VARIANTS[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#6b0014] text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#ffc000]/20 text-[#ffc000] flex items-center justify-center shrink-0">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[#ffc000] text-[11px] font-extrabold uppercase tracking-widest block">
              Variantes de Tren Disponibles
            </span>
            <h3 className="text-xl font-extrabold text-white font-title">
              Selecciona tu Tipo de Experiencia en Tren
            </h3>
          </div>
        </div>
        <span className="text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-slate-300 self-start sm:self-auto">
          Compara servicios y diferencias
        </span>
      </div>

      {/* Grid of Variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRAIN_VARIANTS.map((v) => {
          const isSelected = v.slug === currentSlug;
          const diff = v.price - currentVariant.price;
          const diffText =
            diff === 0
              ? "Opción Actual"
              : diff > 0
              ? `+$${diff} USD`
              : `-$${Math.abs(diff)} USD`;

          return (
            <Link
              key={v.slug}
              href={`/tours/${v.slug}`}
              className={`p-5 rounded-2xl transition-all relative flex flex-col justify-between gap-4 border text-left cursor-pointer ${
                isSelected
                  ? "bg-white text-slate-900 border-[#ffc000] ring-4 ring-[#ffc000]/30 shadow-2xl scale-[1.02]"
                  : "bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/30"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                      isSelected
                        ? "bg-[#6b0014] text-white"
                        : "bg-[#ffc000] text-slate-900"
                    }`}
                  >
                    {v.badge}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-[#6b0014]" : "text-[#ffc000]"
                    }`}
                  >
                    {diffText}
                  </span>
                </div>

                <h4 className={`font-black text-base font-title ${isSelected ? "text-slate-900" : "text-white"}`}>
                  {v.name}
                </h4>

                <p className={`text-xs leading-relaxed ${isSelected ? "text-slate-600" : "text-slate-300"}`}>
                  {v.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/40">
                <ul className="flex flex-col gap-1.5 text-[11px]">
                  {v.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-600" : "text-[#ffc000]"}`} />
                      <span className={isSelected ? "text-slate-700" : "text-slate-200"}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-2 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? "bg-[#6b0014] text-white"
                      : "bg-white/10 text-white group-hover:bg-white/20"
                  }`}
                >
                  <span>{isSelected ? "Seleccionado Actualmente" : "Cambiar a este Tren"}</span>
                  {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
