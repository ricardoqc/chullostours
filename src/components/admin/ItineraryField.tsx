"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TourDraft } from "@/lib/admin/tour-schema";

type ItineraryFieldProps = {
  days: TourDraft["itinerario"];
  onChange: (days: TourDraft["itinerario"]) => void;
};

export function ItineraryField({ days, onChange }: ItineraryFieldProps) {
  const updateDay = (index: number, patch: Partial<TourDraft["itinerario"][number]>) => {
    onChange(days.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Itinerario</legend>
      <p className="text-xs text-slate-500">Una actividad por línea. El orden se conserva al guardar.</p>

      {days.map((day, index) => (
        <article key={`day-${index}`} className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900">Día {day.dia || index + 1}</h3>
            <button
              type="button"
              onClick={() => onChange(days.filter((_, i) => i !== index))}
              className="admin-ghost-btn hover:text-red-600"
              disabled={days.length <= 1}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Quitar día
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="admin-field">
              <label htmlFor={`itinerario-dia-${index}`} className="admin-label">
                Número de día
              </label>
              <input
                id={`itinerario-dia-${index}`}
                name={`itinerario[${index}].dia`}
                type="number"
                min={1}
                inputMode="numeric"
                value={day.dia ?? index + 1}
                onChange={(event) => updateDay(index, { dia: Number(event.target.value) || undefined })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor={`itinerario-titulo-${index}`} className="admin-label">
                Título del día
              </label>
              <input
                id={`itinerario-titulo-${index}`}
                name={`itinerario[${index}].titulo`}
                type="text"
                required
                value={day.titulo}
                onChange={(event) => updateDay(index, { titulo: event.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor={`itinerario-desc-${index}`} className="admin-label">
              Descripción
            </label>
            <textarea
              id={`itinerario-desc-${index}`}
              name={`itinerario[${index}].descripcion`}
              rows={3}
              value={day.descripcion || ""}
              onChange={(event) => updateDay(index, { descripcion: event.target.value })}
              className="admin-input"
            />
          </div>

          <div className="admin-field">
            <label htmlFor={`itinerario-acts-${index}`} className="admin-label">
              Actividades (una por línea)
            </label>
            <textarea
              id={`itinerario-acts-${index}`}
              name={`itinerario[${index}].actividades`}
              rows={6}
              value={day.actividades.join("\n")}
              onChange={(event) =>
                updateDay(index, {
                  actividades: event.target.value.split("\n"),
                })
              }
              className="admin-input"
            />
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange([
            ...days,
            { dia: days.length + 1, titulo: `Día ${days.length + 1}`, descripcion: "", actividades: [""] },
          ])
        }
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar día
      </button>
    </fieldset>
  );
}
