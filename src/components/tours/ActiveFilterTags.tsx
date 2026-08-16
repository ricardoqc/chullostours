"use client";

import React from "react";
import {
  X,
  RotateCcw,
  Globe,
  Mountain,
  Waves,
  Sun,
  Footprints,
  Landmark,
  Train,
  CalendarDays,
  Zap,
  Trees,
  Sparkles,
  MapPin,
} from "lucide-react";
import { TRAVELER_PROFILES, DESTINATION_FILTERS } from "@/lib/tour-filters";
import { BudgetLevel } from "./BudgetSelector";

interface ActiveFilterTagsProps {
  selectedDestination: string;
  onResetDestination: () => void;
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

const DEST_ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Mountain,
  Waves,
  Sun,
};

const PROFILE_ICON_MAP: Record<string, React.ElementType> = {
  Footprints,
  Landmark,
  Train,
  CalendarDays,
  Zap,
  Trees,
  Sparkles,
};

export const ActiveFilterTags: React.FC<ActiveFilterTagsProps> = ({
  selectedDestination,
  onResetDestination,
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
  const hasDestination = selectedDestination !== "all";
  const hasProfiles = selectedProfiles.length > 0;
  const hasDayFilter = dayRange[0] > 1 || dayRange[1] < 30;
  const hasBudgetFilter = budgetLevel !== "all";
  const hasSearch = searchQuery.trim().length > 0;

  const hasAnyFilter = hasDestination || hasProfiles || hasDayFilter || hasBudgetFilter || hasSearch;

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

  const destObj = DESTINATION_FILTERS.find((d) => d.id === selectedDestination);
  const DestIcon = destObj ? DEST_ICON_MAP[destObj.iconName] || MapPin : MapPin;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Filtros activos:
      </span>

      {/* Destination tag */}
      {hasDestination && destObj && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6b0014]/10 text-[#6b0014] text-xs font-bold border border-[#6b0014]/20">
          <DestIcon className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>{destObj.label}</span>
          <button
            type="button"
            onClick={onResetDestination}
            className="hover:text-red-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}

      {/* Search tag */}
      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
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
        const ProfIcon = PROFILE_ICON_MAP[prof.iconName] || Sparkles;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-semibold border border-slate-200"
          >
            <ProfIcon className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>{prof.label}</span>
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
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
        className="inline-flex items-center gap-1.5 text-xs text-red-600 font-bold hover:underline ml-auto cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Limpiar todos</span>
      </button>
    </div>
  );
};


