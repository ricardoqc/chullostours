"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { TRAVELER_PROFILES } from "@/lib/tour-filters";
import { BudgetLevel } from "./BudgetSelector";

interface ActiveFilterTagsProps {
  selectedProfiles: string[];
  onRemoveProfile: (id: string) => void;
  dayRange: [number, number];
  onResetDayRange: () => void;
  budgetLevel: BudgetLevel;
  onResetBudget: () => void;
  searchQuery: string;
  onResetSearch: () => void;
  onResetAll: () => void;
}

export const ActiveFilterTags: React.FC<ActiveFilterTagsProps> = ({
  selectedProfiles,
  onRemoveProfile,
  dayRange,
  onResetDayRange,
  budgetLevel,
  onResetBudget,
  searchQuery,
  onResetSearch,
  onResetAll,
}) => {
  const hasProfiles = selectedProfiles.length > 0;
  const hasDayFilter = dayRange[0] > 1 || dayRange[1] < 6;
  const hasBudgetFilter = budgetLevel !== "all";
  const hasSearch = searchQuery.trim().length > 0;

  const hasAnyFilter = hasProfiles || hasDayFilter || hasBudgetFilter || hasSearch;

  if (!hasAnyFilter) return null;

  const getBudgetLabel = (level: BudgetLevel) => {
    switch (level) {
      case "budget":
        return "< $100";
      case "mid":
        return "$100 - $300";
      case "premium":
        return "> $300";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Filtros activos:
      </span>

      {/* Search tag */}
      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
          <span>"{searchQuery}"</span>
          <button
            type="button"
            onClick={onResetSearch}
            className="hover:text-red-500 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Profiles tags */}
      {selectedProfiles.map((id) => {
        const prof = TRAVELER_PROFILES.find((p) => p.id === id);
        if (!prof) return null;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6b0014]/10 text-[#6b0014] text-xs font-semibold border border-[#6b0014]/20"
          >
            <span>
              {prof.emoji} {prof.label}
            </span>
            <button
              type="button"
              onClick={() => onRemoveProfile(id)}
              className="hover:text-red-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        );
      })}

      {/* Days tag */}
      {hasDayFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffc000]/20 text-slate-900 text-xs font-semibold border border-[#ffc000]/40">
          <span>
            {dayRange[0] === dayRange[1]
              ? `${dayRange[0]} día`
              : `${dayRange[0]}-${dayRange[1]} días`}
          </span>
          <button
            type="button"
            onClick={onResetDayRange}
            className="hover:text-red-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Budget tag */}
      {hasBudgetFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
          <span>Presupuesto: {getBudgetLabel(budgetLevel)}</span>
          <button
            type="button"
            onClick={onResetBudget}
            className="hover:text-red-500 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Clear all */}
      <button
        type="button"
        onClick={onResetAll}
        className="inline-flex items-center gap-1 text-xs text-red-600 font-bold hover:underline ml-auto cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Limpiar todo</span>
      </button>
    </div>
  );
};
