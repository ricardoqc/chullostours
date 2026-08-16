import React from "react";
import { FaLightbulb, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { GEOOptimization } from "@/types/tour";

interface TourQuickFactsProps {
  geoData?: GEOOptimization;
}

export const TourQuickFacts: React.FC<TourQuickFactsProps> = ({ geoData }) => {
  if (!geoData) return null;

  const { ai_direct_answer_summary, key_facts_for_ai, primary_destination } = geoData;

  const hasSummary = !!ai_direct_answer_summary;
  const hasFacts = Array.isArray(key_facts_for_ai) && key_facts_for_ai.length > 0;

  if (!hasSummary && !hasFacts) return null;

  return (
    <section className="bg-amber-50/60 border border-amber-200/70 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0">
            <FaLightbulb className="w-5 h-5 text-[#6b0014]" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black font-title tracking-tight text-slate-900 flex items-center gap-2">
              <span>Datos Rápidos del Tour</span>
            </h3>
            {primary_destination?.name && (
              <p className="text-xs text-slate-500 font-medium">
                Destino Principal: {primary_destination.name}, {primary_destination.region || "Perú"}
              </p>
            )}
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#6b0014]/10 text-[#6b0014] border border-[#6b0014]/20 hidden sm:inline-block">
          Resumen Express
        </span>
      </div>

      {/* AI Direct Answer Summary */}
      {hasSummary && (
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-200/60 text-xs md:text-sm text-slate-700 leading-relaxed flex items-start gap-3 shadow-sm">
          <FaInfoCircle className="w-4 h-4 text-[#6b0014] shrink-0 mt-0.5" />
          <p>{ai_direct_answer_summary}</p>
        </div>
      )}

      {/* Key Facts Grid */}
      {hasFacts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {key_facts_for_ai.map((item, idx) => {
            const factName = typeof item === "string" ? "Dato relevante" : item.fact;
            const factVal = typeof item === "string" ? item : item.value;

            return (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-amber-200/50 flex flex-col gap-1 hover:border-[#6b0014]/30 hover:shadow-sm transition-all shadow-xs"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b0014] flex items-center gap-1.5">
                  <FaCheckCircle className="w-3 h-3 text-[#ffc000]" />
                  <span>{factName}</span>
                </span>
                <span className="text-xs md:text-sm font-semibold text-slate-800 leading-snug">
                  {factVal}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
