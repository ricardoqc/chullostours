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
    { id: "all", label: "Cualquiera", range: "Todos" },
    { id: "budget", label: "Económico", range: "< $100" },
    { id: "mid", label: "Estándar", range: "$100-$300" },
    { id: "premium", label: "Premium", range: "> $300" },
  ];

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-slate-800">
          <DollarSign className="w-4 h-4 text-[#6b0014]" />
          <span>Presupuesto</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {options.map((opt) => {
          const isSelected = selectedLevel === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#6b0014] text-white border-[#6b0014] shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] ${
                  isSelected ? "text-white/80" : "text-slate-400"
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
