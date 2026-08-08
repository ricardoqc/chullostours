"use client";

import React from "react";
import { FaMapMarkerAlt, FaMountain, FaLightbulb, FaCompass } from "react-icons/fa";
import { PuntoDeInteres } from "@/types/tour";

interface TourPuntosDeInteresProps {
  puntos: PuntoDeInteres[];
}

export const TourPuntosDeInteres: React.FC<TourPuntosDeInteresProps> = ({ puntos }) => {
  if (!puntos || puntos.length === 0) return null;

  return (
    <section id="puntos-de-interes" className="flex flex-col gap-6 scroll-mt-32">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
          <FaCompass className="w-3.5 h-3.5" />
          <span>Atractivos Principales</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-title tracking-tight">
          Puntos de Interés que Visitarás
        </h2>
        <p className="text-slate-600 text-sm md:text-base">
          Conoce los destinos y monumentos más emblemáticos incluidos durante este recorrido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {puntos.map((pt, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-[#6b0014]/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg font-title leading-snug">
                    {pt.nombre}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                    {pt.tipo}
                  </span>
                </div>
              </div>

              {pt.altitud && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full shrink-0">
                  <FaMountain className="w-3 h-3 text-amber-600" />
                  <span>{pt.altitud}</span>
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm text-slate-700 leading-relaxed pt-1">
              {pt.descripcion}
            </p>

            {pt.datos_curiosos && pt.datos_curiosos.length > 0 && (
              <div className="mt-1 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FaLightbulb className="w-3 h-3 text-[#ffc000]" />
                  <span>Dato Curioso</span>
                </span>
                <ul className="text-xs text-slate-600 flex flex-col gap-1">
                  {pt.datos_curiosos.map((dc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#6b0014] font-bold">•</span>
                      <span>{dc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
