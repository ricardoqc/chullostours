"use client";

import React from "react";
import { StepComponentProps } from "./types";

export const StepCompanions: React.FC<
  StepComponentProps & { onNext: () => void; onBack: () => void; onSkip: () => void }
> = ({ formData, updateFormData, onNext, onBack, onSkip }) => {
  const totalSlots =
    formData.adults +
    Object.values(formData.childrenByTarifa).reduce((a, b) => a + b, 0);

  const companions =
    formData.companions.length >= totalSlots
      ? formData.companions
      : [
          ...formData.companions,
          ...Array.from({ length: totalSlots - formData.companions.length }, () => ({
            firstName: "",
            lastName: "",
            passport: "",
            age: undefined as number | undefined,
          })),
        ].slice(0, totalSlots);

  const updateCompanion = (index: number, field: string, value: string | number) => {
    const next = [...companions];
    next[index] = { ...next[index], [field]: value };
    updateFormData({ companions: next });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Opcional: registra nombres y pasaportes de los viajeros. Puedes completarlo después con tu
        asesor.
      </p>
      {companions.map((c, i) => (
        <fieldset
          key={i}
          className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2 text-xs"
        >
          <legend className="font-bold text-[#6b0014] px-1">
            Viajero {i + 1}
            {i >= formData.adults ? " (menor)" : ""}
          </legend>
          <input
            placeholder="Nombre"
            value={c.firstName}
            onChange={(e) => updateCompanion(i, "firstName", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2"
          />
          <input
            placeholder="Apellido"
            value={c.lastName}
            onChange={(e) => updateCompanion(i, "lastName", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2"
          />
          <input
            placeholder="Pasaporte (opcional)"
            value={c.passport || ""}
            onChange={(e) => updateCompanion(i, "passport", e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2"
          />
          {i >= formData.adults && (
            <input
              type="number"
              min={0}
              max={17}
              placeholder="Edad"
              value={c.age ?? ""}
              onChange={(e) =>
                updateCompanion(i, "age", e.target.value ? parseInt(e.target.value, 10) : "")
              }
              className="border border-slate-200 rounded-lg px-3 py-2"
            />
          )}
        </fieldset>
      ))}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-slate-300 rounded-xl py-3 font-bold text-sm"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold text-sm text-slate-600"
        >
          Omitir este paso
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[#6b0014] text-white rounded-xl py-3 font-bold text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
