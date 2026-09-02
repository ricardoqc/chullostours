"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Globe,
  Mountain,
  Waves,
  Sun,
  Landmark,
  Trees,
  RotateCcw,
} from "lucide-react";
import { TRAVELER_PROFILES, DESTINATION_FILTERS } from "@/lib/tour-filters";
import { TravelerProfilePill } from "./TravelerProfilePill";
import { DayRangeSlider } from "./DayRangeSlider";
import { BudgetSelector, BudgetLevel } from "./BudgetSelector";

interface ToursFilterSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDestination: string;
  onDestinationChange: (dest: string) => void;
  selectedProfiles: string[];
  onToggleProfile: (id: string) => void;
  dayRange: [number, number];
  onDayRangeChange: (range: [number, number]) => void;
  budgetLevel: BudgetLevel;
  onBudgetChange: (level: BudgetLevel) => void;
  onResetAll: () => void;
  totalResultsCount: number;
  /** When true, render as mobile drawer content only */
  variant?: "sidebar" | "drawer";
  onCloseDrawer?: () => void;
}

const DEST_ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Mountain,
  Waves,
  Sun,
  Landmark,
  Trees,
};

export const ToursFilterSidebar: React.FC<ToursFilterSidebarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDestination,
  onDestinationChange,
  selectedProfiles,
  onToggleProfile,
  dayRange,
  onDayRangeChange,
  budgetLevel,
  onBudgetChange,
  onResetAll,
  totalResultsCount,
  variant = "sidebar",
  onCloseDrawer,
}) => {
  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-extrabold text-base text-slate-900 font-title flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#6b0014]" />
          Filtros
        </h3>
        <button
          type="button"
          onClick={onResetAll}
          className="text-[11px] font-bold text-slate-500 hover:text-[#6b0014] inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Limpiar
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tour..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pl-9 text-xs focus:outline-none focus:border-[#6b0014]"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-3 text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Destino
        </span>
        <div className="flex flex-col gap-1.5">
          {DESTINATION_FILTERS.map((dest) => {
            const isSelected = selectedDestination === dest.id;
            const DestIcon = DEST_ICON_MAP[dest.iconName] || MapPin;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => onDestinationChange(dest.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  isSelected
                    ? "bg-[#6b0014] text-white border-[#6b0014]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-[#6b0014]/40"
                }`}
              >
                <DestIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-amber-300" : "text-[#6b0014]"}`} />
                <span className="flex-1">{dest.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${isSelected ? "bg-amber-300" : "bg-slate-200"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Estilo de viaje
        </span>
        <div className="flex flex-wrap gap-2">
          {TRAVELER_PROFILES.map((profile) => (
            <TravelerProfilePill
              key={profile.id}
              profile={profile}
              isSelected={selectedProfiles.includes(profile.id)}
              onToggle={() => onToggleProfile(profile.id)}
            />
          ))}
        </div>
      </div>

      <DayRangeSlider
        minDays={1}
        maxDays={30}
        value={dayRange}
        onChange={onDayRangeChange}
      />

      <BudgetSelector selectedLevel={budgetLevel} onChange={onBudgetChange} />

      {variant === "drawer" && (
        <button
          type="button"
          onClick={onCloseDrawer}
          className="w-full py-3 rounded-xl bg-[#6b0014] text-white text-xs font-bold"
        >
          Ver {totalResultsCount} experiencias
        </button>
      )}
    </div>
  );

  if (variant === "drawer") return content;

  return (
    <aside className="w-full lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      {content}
    </aside>
  );
};

/** Mobile filter trigger + drawer */
export const ToursFilterMobileTrigger: React.FC<
  ToursFilterSidebarProps & { open: boolean; setOpen: (v: boolean) => void }
> = (props) => {
  const { open, setOpen, totalResultsCount, ...filterProps } = props;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 bg-[#6b0014] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        <span className="bg-[#ffc000] text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full">
          {totalResultsCount}
        </span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden">
          <div className="w-full max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold font-title">Filtros</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ToursFilterSidebar
              {...filterProps}
              totalResultsCount={totalResultsCount}
              variant="drawer"
              onCloseDrawer={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

/** @deprecated use ToursFilterSidebar — kept for imports */
export const ToursFilterBar = ToursFilterSidebar;
