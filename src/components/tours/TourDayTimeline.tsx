"use client";

import React from "react";
import { FaClock, FaMapMarkerAlt, FaCompass, FaCamera, FaMountain, FaSun } from "react-icons/fa";

interface TourDayTimelineProps {
  highlights: string[];
}

export const TourDayTimeline: React.FC<TourDayTimelineProps> = ({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  const stageTitles = [
    "Punto de Encuentro y Partida",
    "Ruta Panorámica y Paisajes",
    "Llegada al Destino Principal",
    "Caminata Guiada y Misticismo",
    "Tiempo para Fotografías y Relax",
    "Retorno a la Ciudad de Cusco",
  ];

  const stageIcons = [FaClock, FaCompass, FaMountain, FaMapMarkerAlt, FaCamera, FaSun];

  return (
    <div className="flex flex-col gap-5 sm:gap-6 bg-slate-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-100">
      <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div className="w-8 h-8 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0">
          <FaClock className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold font-title leading-tight">
            Cronograma del Día (Full Day)
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Recorrido paso a paso diseñado para aprovechar cada minuto al máximo
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 sm:gap-4">
        {highlights.map((item, idx) => {
          const title = stageTitles[idx] || `Etapa ${idx + 1}`;
          const IconComp = stageIcons[idx % stageIcons.length];
          const isLast = idx === highlights.length - 1;

          return (
            <div key={idx} className="flex items-start gap-2.5 sm:gap-4 group">
              {/* Left Step Node & Connector Line Outside Card */}
              <div className="flex flex-col items-center shrink-0 w-7 sm:w-8 pt-1 self-stretch">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#6b0014] text-white text-xs font-black flex items-center justify-center shadow-xs z-10">
                  {idx + 1}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-[#6b0014] via-[#6b0014]/30 to-slate-200 my-1 rounded-full min-h-[1.5rem]" />
                )}
              </div>

              {/* Right Stage Content Card */}
              <div className="flex-1 min-w-0 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-[#6b0014]/40 hover:shadow-xs transition-all flex flex-col gap-1.5">
                <span className="text-xs font-extrabold text-[#6b0014] flex items-center gap-1.5 uppercase tracking-wide">
                  <IconComp className="w-3.5 h-3.5 text-[#ffc000]" />
                  <span>{title}</span>
                </span>
                <p className="text-xs sm:text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                  {item}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
