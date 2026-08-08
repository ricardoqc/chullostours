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
    <div className="flex flex-col gap-6 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
      <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200/80 pb-4">
        <div className="w-8 h-8 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
          <FaClock className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold font-title leading-tight">
            Cronograma del Día (Full Day)
          </h3>
          <p className="text-xs text-slate-500">
            Recorrido paso a paso diseñado para aprovechar cada minuto al máximo
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#6b0014] before:via-[#6b0014]/40 before:to-slate-300">
        {highlights.map((item, idx) => {
          const title = stageTitles[idx] || `Etapa ${idx + 1}`;
          const IconComp = stageIcons[idx % stageIcons.length];

          return (
            <div key={idx} className="relative flex items-start gap-4 group">
              {/* Dot step marker */}
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#6b0014] text-white text-[10px] font-black flex items-center justify-center ring-4 ring-slate-50 shadow-xs">
                {idx + 1}
              </div>

              <div className="flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs w-full hover:border-[#6b0014]/30 transition-all">
                <span className="text-xs font-extrabold text-[#6b0014] flex items-center gap-1.5 uppercase tracking-wide">
                  <IconComp className="w-3 h-3 text-[#ffc000]" />
                  <span>{title}</span>
                </span>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
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
