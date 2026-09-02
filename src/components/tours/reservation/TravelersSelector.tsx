"use client";

import React from "react";
import { FaUsers, FaChild } from "react-icons/fa";
import type { TarifaPersona } from "@/types/tour";

interface TravelersSelectorProps {
  adults: number;
  childrenByTarifa: Record<string, number>;
  tarifas: TarifaPersona[];
  onAdultsChange: (count: number) => void;
  onTarifaChange: (tarifaId: string, count: number) => void;
  error?: string;
}

function CounterRow({
  label,
  subtitle,
  value,
  onDecrement,
  onIncrement,
  min = 0,
}: {
  label: string;
  subtitle?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        {subtitle ? (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors"
          aria-label={`Menos ${label}`}
        >
          −
        </button>
        <span className="w-6 text-center font-extrabold text-sm tabular-nums">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-9 h-9 rounded-xl bg-[#6b0014]/10 hover:bg-[#6b0014]/20 font-bold text-[#6b0014] transition-colors"
          aria-label={`Más ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/** Tarifas distintas al contador principal de adultos */
export function getChildTarifas(tarifas: TarifaPersona[]): TarifaPersona[] {
  return tarifas.filter((t) => t.id !== "adulto");
}

export function countNonAdultTravelers(childrenByTarifa: Record<string, number>): number {
  return Object.entries(childrenByTarifa)
    .filter(([id]) => id !== "adulto")
    .reduce((sum, [, count]) => sum + count, 0);
}

export function formatTravelersSummary(
  adults: number,
  childrenByTarifa: Record<string, number>,
  tarifas: TarifaPersona[]
): string {
  const parts: string[] = [];
  parts.push(`${adults} adulto${adults !== 1 ? "s" : ""}`);

  for (const tarifa of getChildTarifas(tarifas)) {
    const count = childrenByTarifa[tarifa.id] || 0;
    if (count > 0) {
      const shortLabel = tarifa.label.split("(")[0].trim();
      parts.push(`${count} ${shortLabel.toLowerCase()}${count !== 1 ? "s" : ""}`);
    }
  }

  return parts.join(" · ");
}

export const TravelersSelector: React.FC<TravelersSelectorProps> = ({
  adults,
  childrenByTarifa,
  tarifas,
  onAdultsChange,
  onTarifaChange,
  error,
}) => {
  const childTarifas = getChildTarifas(tarifas);
  const total =
    adults + countNonAdultTravelers(childrenByTarifa);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold uppercase flex items-center gap-1.5 text-slate-800">
          <FaUsers className="text-[#6b0014]" />
          Viajeros
        </label>
        <span className="text-[11px] font-bold text-slate-500">
          {total} en total
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-1">
        <CounterRow
          label="Adultos"
          subtitle="18 años o más"
          value={adults}
          min={1}
          onDecrement={() => onAdultsChange(Math.max(1, adults - 1))}
          onIncrement={() => onAdultsChange(adults + 1)}
        />

        {childTarifas.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 pt-2 pb-1 border-t border-slate-100 mt-1">
              <FaChild className="w-3 h-3 text-[#6b0014]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                Menores de edad
              </span>
            </div>
            {childTarifas.map((tarifa) => (
              <CounterRow
                key={tarifa.id}
                label={tarifa.label.split("(")[0].trim()}
                subtitle={
                  tarifa.rango_edad
                    ? `${tarifa.rango_edad} años${tarifa.nota ? ` · ${tarifa.nota}` : ""}`
                    : tarifa.nota
                }
                value={childrenByTarifa[tarifa.id] || 0}
                onDecrement={() =>
                  onTarifaChange(
                    tarifa.id,
                    Math.max(0, (childrenByTarifa[tarifa.id] || 0) - 1)
                  )
                }
                onIncrement={() =>
                  onTarifaChange(tarifa.id, (childrenByTarifa[tarifa.id] || 0) + 1)
                }
              />
            ))}
          </>
        )}
      </div>

      {error ? (
        <span className="text-[11px] text-rose-600 font-semibold">{error}</span>
      ) : null}
    </div>
  );
};
