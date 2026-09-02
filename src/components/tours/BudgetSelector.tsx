"use client";

import React from "react";
import { DollarSign } from "lucide-react";

export type BudgetLevel = "all" | "budget" | "mid" | "premium";

interface BudgetSelectorProps {
  selectedLevel: BudgetLevel;
  onChange: (level: BudgetLevel) => void;
}

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  selectedLevel,
  onChange,
}) => {
  const options: { id: BudgetLevel; label: string; range: string }[] = [
    { id: "all", label: "Todos", range: "Cualquier precio" },
    { id: "budget", label: "Económico", range: "< $100 USD" },
    { id: "mid", label: "Estándar", range: "$100 - $300 USD" },
    { id: "premium", label: "Exclusivo", range: "> $300 USD" },
  ];

  return (
    <div className="flex flex-col gap-2.5 min-w-[200px]">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-slate-900 font-extrabold uppercase tracking-wider text-[11px]">
          <DollarSign className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Rango de Presupuesto</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedLevel === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-start justify-center transition-all cursor-pointer border active:scale-95 touch-manipulation relative overflow-hidden ${
                isSelected
                  ? "bg-[#6b0014] text-white border-[#6b0014] shadow-md shadow-[#6b0014]/20 scale-[1.02]"
                  : "bg-white text-slate-800 border-slate-200/90 hover:border-[#6b0014]/40 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold">{opt.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.9)]" : "bg-slate-200"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isSelected ? "text-amber-200" : "text-slate-500"
                }`}
              >
                {opt.range}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
