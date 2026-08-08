"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Sparkles, X, ChevronDown } from "lucide-react";
import { TRAVELER_PROFILES } from "@/lib/tour-filters";
import { TravelerProfilePill } from "./TravelerProfilePill";
import { DayRangeSlider } from "./DayRangeSlider";
import { BudgetSelector, BudgetLevel } from "./BudgetSelector";
import { ActiveFilterTags } from "./ActiveFilterTags";

interface ToursFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProfiles: string[];
  onToggleProfile: (id: string) => void;
  dayRange: [number, number];
  onDayRangeChange: (range: [number, number]) => void;
  budgetLevel: BudgetLevel;
  onBudgetChange: (level: BudgetLevel) => void;
  onResetAll: () => void;
  totalResultsCount: number;
}

export const ToursFilterBar: React.FC<ToursFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedProfiles,
  onToggleProfile,
  dayRange,
  onDayRangeChange,
  budgetLevel,
  onBudgetChange,
  onResetAll,
  totalResultsCount,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const activeFiltersCount =
    selectedProfiles.length +
    (dayRange[0] > 1 || dayRange[1] < 6 ? 1 : 0) +
    (budgetLevel !== "all" ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-4 bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 md:p-6 transition-all">
      {/* Top Header Row inside Filter Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#6b0014]/10 flex items-center justify-center text-[#6b0014]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-slate-900 font-title">
              ¿Qué experiencia estás buscando?
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona tu estilo de viaje para personalizar los resultados
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar destino o tour..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2 pl-9 text-xs md:text-sm focus:outline-none focus:border-[#6b0014] text-slate-900 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Archetype Pills Row */}
      <div className="flex flex-wrap items-center gap-2 py-1">
        {TRAVELER_PROFILES.map((profile) => (
          <TravelerProfilePill
            key={profile.id}
            profile={profile}
            isSelected={selectedProfiles.includes(profile.id)}
            onToggle={() => onToggleProfile(profile.id)}
          />
        ))}
      </div>

      {/* Advanced Filters Toggle Button (Desktop & Mobile trigger) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        {/* Mobile Filter Drawer Button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden flex items-center gap-2 text-xs font-bold bg-[#6b0014] text-white px-4 py-2 rounded-xl shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros Avanzados</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#ffc000] text-slate-900 w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Desktop Collapsible Toggle */}
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#6b0014] cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Filtros por Duración y Presupuesto</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              advancedOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <span className="text-xs font-bold text-slate-500">
          Encontrados: <strong className="text-[#6b0014]">{totalResultsCount}</strong> tours
        </span>
      </div>

      {/* Collapsible Advanced Filters Row (Desktop) */}
      {advancedOpen && (
        <div className="hidden md:grid grid-cols-2 gap-8 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl animate-slideDown">
          <DayRangeSlider
            minDays={1}
            maxDays={6}
            value={dayRange}
            onChange={onDayRangeChange}
          />
          <BudgetSelector
            selectedLevel={budgetLevel}
            onChange={onBudgetChange}
          />
        </div>
      )}

      {/* Active Filter Chips */}
      <ActiveFilterTags
        selectedProfiles={selectedProfiles}
        onRemoveProfile={onToggleProfile}
        dayRange={dayRange}
        onResetDayRange={() => onDayRangeChange([1, 6])}
        budgetLevel={budgetLevel}
        onResetBudget={() => onBudgetChange("all")}
        searchQuery={searchQuery}
        onResetSearch={() => onSearchChange("")}
        onResetAll={onResetAll}
      />

      {/* Mobile Drawer (Modal) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeInUp">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 font-title">
                <SlidersHorizontal className="w-5 h-5 text-[#6b0014]" />
                <span>Filtros de Búsqueda</span>
              </h4>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Traveler Profiles in Mobile Drawer */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-400">
                Estilo de Viaje
              </label>
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

            {/* Duration Slider in Mobile Drawer */}
            <DayRangeSlider
              minDays={1}
              maxDays={6}
              value={dayRange}
              onChange={onDayRangeChange}
            />

            {/* Budget Selector in Mobile Drawer */}
            <BudgetSelector
              selectedLevel={budgetLevel}
              onChange={onBudgetChange}
            />

            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onResetAll}
                className="flex-1 py-3 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                Limpiar todo
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-white bg-[#6b0014] rounded-xl hover:bg-[#850019] transition-colors shadow-md"
              >
                Aplicar Filtros ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
