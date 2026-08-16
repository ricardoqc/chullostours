"use client";

import React from "react";
import { FaClock, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

interface TourMetaDataBadgesProps {
  horarios?: string[];
  puntoInicio?: string;
  duracion?: string;
  categoria?: string;
}

export const TourMetaDataBadges: React.FC<TourMetaDataBadgesProps> = ({
  horarios,
  puntoInicio,
  duracion,
  categoria,
}) => {
  const hasHorarios = horarios && horarios.length > 0;
  const hasPuntoInicio = Boolean(puntoInicio && puntoInicio.trim().length > 0);
  const hasDuracion = Boolean(duracion && duracion.trim().length > 0);
  const hasCategoria = Boolean(categoria && categoria.trim().length > 0);

  if (!hasHorarios && !hasPuntoInicio && !hasDuracion && !hasCategoria) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 py-2">
      {/* Horarios Disponibles */}
      {hasHorarios && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs">
          <FaClock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Salidas: {horarios.join(" | ")}</span>
        </div>
      )}

      {/* Punto de Inicio */}
      {hasPuntoInicio && (
        <div className="flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
          <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#6b0014] shrink-0" />
          <span className="truncate max-w-[280px]">Inicio: {puntoInicio}</span>
        </div>
      )}

      {/* Duración */}
      {hasDuracion && (
        <div className="flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
          <FaCalendarAlt className="w-3.5 h-3.5 text-[#6b0014] shrink-0" />
          <span>Duración: {duracion}</span>
        </div>
      )}

      {/* Categoría */}
      {hasCategoria && (
        <span className="bg-[#6b0014]/10 text-[#6b0014] border border-[#6b0014]/20 px-3 py-1.5 rounded-full text-xs font-bold">
          {categoria}
        </span>
      )}
    </div>
  );
};
