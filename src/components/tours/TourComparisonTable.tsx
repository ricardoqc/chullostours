"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Scale, Hotel, Calendar, Compass, Sparkles } from "lucide-react";
import { Tour } from "@/types/tour";
import { parseDurationDays, estimateTourPrice, deriveExperienceTags, TRAVELER_PROFILES } from "@/lib/tour-filters";

interface TourComparisonTableProps {
  currentTour: Tour;
  allTours: Tour[];
}

export const TourComparisonTable: React.FC<TourComparisonTableProps> = ({
  currentTour,
  allTours,
}) => {
  const currentDays = parseDurationDays(currentTour.atributos?.duracion);
  const isCurrentFullDay = currentDays === 1;
  const currentTags = deriveExperienceTags(currentTour);

  const matchingDurationTours = allTours.filter((t) => {
    if (t.slug === currentTour.slug) return false;
    const tourDays = parseDurationDays(t.atributos?.duracion);
    return (tourDays === 1) === isCurrentFullDay;
  });

  const sorted = [...matchingDurationTours].sort((a, b) => {
    const aTags = deriveExperienceTags(a);
    const bTags = deriveExperienceTags(b);
    const aOverlap = aTags.filter((tag) => currentTags.includes(tag)).length;
    const bOverlap = bTags.filter((tag) => currentTags.includes(tag)).length;
    if (bOverlap !== aOverlap) return bOverlap - aOverlap;
    const currentTitleLower = currentTour.titulo.toLowerCase();
    const aTitle = a.titulo.toLowerCase();
    const bTitle = b.titulo.toLowerCase();
    const aSharesKeyword = currentTitleLower.split(" ").some((kw) => kw.length > 4 && aTitle.includes(kw));
    const bSharesKeyword = currentTitleLower.split(" ").some((kw) => kw.length > 4 && bTitle.includes(kw));
    if (aSharesKeyword && !bSharesKeyword) return -1;
    if (!aSharesKeyword && bSharesKeyword) return 1;
    return 0;
  });

  const related = sorted.slice(0, 3);
  if (related.length === 0) return null;

  const compareTours = [currentTour, ...related];

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#6b0014]" />
          <span className="text-[#6b0014] text-xs font-bold uppercase tracking-wider">
            Compara Otras Opciones
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-title">
          Compara este tour con otras opciones similares ({isCurrentFullDay ? "1 Día" : "Varios Días"})
        </h3>
      </div>

      {/* Mobile: Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {compareTours.map((t) => {
          const isCurrent = t.slug === currentTour.slug;
          const price = estimateTourPrice(t);
          const tags = deriveExperienceTags(t);
          const tagMeta = TRAVELER_PROFILES.find((p) => p.id === tags[0]) || TRAVELER_PROFILES[1];
          const tourDays = parseDurationDays(t.atributos?.duracion);
          const isMulti = tourDays > 1;
          const hasEntrance = t.incluye?.some((i) =>
            i.toLowerCase().includes("ingreso") || i.toLowerCase().includes("entrada") || i.toLowerCase().includes("machu")
          );
          return (
            <div
              key={t.slug}
              className={`rounded-2xl border p-4 flex flex-col gap-3 ${
                isCurrent
                  ? "border-[#6b0014]/40 bg-[#6b0014]/5 ring-1 ring-[#6b0014]/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              {isCurrent && (
                <span className="text-[10px] font-black text-[#6b0014] uppercase tracking-wider">
                  Viendo Actualmente
                </span>
              )}
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug font-title">{t.titulo}</h4>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Compass className="w-3 h-3 text-[#6b0014]" /> Estilo</span>
                  <span className="font-bold text-slate-800">{tagMeta.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3 text-[#6b0014]" /> Duración</span>
                  <span className="font-bold text-slate-800">{t.atributos?.duracion || "Full Day"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ingreso</span>
                  {hasEntrance ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold"><Check className="w-3.5 h-3.5" /> Incluido</span>
                  ) : (
                    <span className="text-slate-400">Parcial</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Hotel className="w-3 h-3 text-[#6b0014]" /> Alojam.</span>
                  <span className="font-bold text-slate-800">{isMulti ? "Hotel 3★" : "No Aplica"}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Precio Desde</span>
                  <span className="font-black text-[#6b0014] text-sm">${price} USD</span>
                </div>
              </div>
              {!isCurrent && (
                <Link
                  href={`/tours/${t.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6b0014] hover:underline mt-1"
                >
                  <span>Ver detalles</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-3 font-extrabold text-slate-400 uppercase text-[11px] w-1/4">Característica</th>
              {compareTours.map((t) => {
                const isCurrent = t.slug === currentTour.slug;
                return (
                  <th key={t.slug} className={`p-3 font-bold text-slate-900 w-1/4 ${isCurrent ? "bg-[#6b0014]/5 rounded-t-xl border-x border-t border-[#6b0014]/20" : ""}` }>
                    <div className="flex flex-col gap-1">
                      {isCurrent && (<span className="text-[10px] font-black text-[#6b0014] uppercase tracking-wider">Viendo Actualmente</span>)}
                      <span className="font-extrabold text-sm line-clamp-2 font-title">{t.titulo}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50"><div className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-[#6b0014]" /><span>Estilo de Viaje</span></div></td>
              {compareTours.map((t) => {
                const tags = deriveExperienceTags(t);
                const tagMeta = TRAVELER_PROFILES.find((p) => p.id === tags[0]) || TRAVELER_PROFILES[1];
                return (<td key={t.slug} className={`p-3 ${t.slug === currentTour.slug ? "bg-[#6b0014]/5 border-x border-[#6b0014]/20" : ""}`}><span className="inline-flex items-center gap-1.5 bg-slate-200/70 text-slate-900 px-2.5 py-1 rounded-full text-[11px] font-bold"><Sparkles className="w-3 h-3 text-[#6b0014]" /><span>{tagMeta.label}</span></span></td>);
              })}
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#6b0014]" /><span>Duración</span></div></td>
              {compareTours.map((t) => (<td key={t.slug} className={`p-3 font-semibold text-slate-800 ${t.slug === currentTour.slug ? "bg-[#6b0014]/5 border-x border-[#6b0014]/20" : ""}`}>{t.atributos?.duracion || "Full Day"}</td>))}
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50">Ingreso Incluido</td>
              {compareTours.map((t) => {
                const hasEntrance = t.incluye?.some((i) => i.toLowerCase().includes("ingreso") || i.toLowerCase().includes("entrada") || i.toLowerCase().includes("machu"));
                return (<td key={t.slug} className={`p-3 ${t.slug === currentTour.slug ? "bg-[#6b0014]/5 border-x border-[#6b0014]/20" : ""}`}>{hasEntrance ? (<span className="flex items-center gap-1 text-emerald-700 font-bold"><Check className="w-4 h-4 text-emerald-600" /> Sí Incluye</span>) : (<span className="text-slate-500">Parcial / Opcional</span>)}</td>);
              })}
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50"><div className="flex items-center gap-1.5"><Hotel className="w-3.5 h-3.5 text-[#6b0014]" /><span>Alojamiento</span></div></td>
              {compareTours.map((t) => {
                const tourDays = parseDurationDays(t.atributos?.duracion);
                const isMulti = tourDays > 1;
                return (<td key={t.slug} className={`p-3 ${t.slug === currentTour.slug ? "bg-[#6b0014]/5 border-x border-[#6b0014]/20" : ""}`}>{isMulti ? (<span className="text-amber-800 font-bold">Hotel 3★ Incluido</span>) : (<span className="text-slate-400 font-medium">No Aplica (1 Día)</span>)}</td>);
              })}
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50">Precio Desde</td>
              {compareTours.map((t) => { const price = estimateTourPrice(t); return (<td key={t.slug} className={`p-3 font-black text-[#6b0014] text-sm ${t.slug === currentTour.slug ? "bg-[#6b0014]/5 border-x border-[#6b0014]/20" : ""}`}>${price} USD</td>); })}
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-700 bg-slate-100/50 rounded-bl-xl">Acción</td>
              {compareTours.map((t) => {
                const isCurrent = t.slug === currentTour.slug;
                return (<td key={t.slug} className={`p-3 ${isCurrent ? "bg-[#6b0014]/5 border-x border-b border-[#6b0014]/20 rounded-br-xl" : ""}`}>{isCurrent ? (<span className="text-xs font-bold text-[#6b0014]">Opción Actual</span>) : (<Link href={`/tours/${t.slug}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6b0014] hover:underline"><span>Ver detalles</span><ArrowRight className="w-3.5 h-3.5" /></Link>)}</td>);
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
