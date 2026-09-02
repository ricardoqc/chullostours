"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Compass, RotateCcw } from "lucide-react";
import { Tour } from "@/types/tour";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import { toTourCardProps } from "@/lib/tour-card-mapper";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import {
  deriveExperienceTags,
  parseDurationDays,
  estimateTourPrice,
  tourMatchesDestination,
} from "@/lib/tour-filters";
import {
  ToursFilterSidebar,
  ToursFilterMobileTrigger,
} from "@/components/tours/ToursFilterBar";
import { BudgetLevel } from "@/components/tours/BudgetSelector";

interface ToursClientProps {
  initialTours: Tour[];
}

function syncUrl(params: {
  destino: string;
  tipo: string[];
  q: string;
}) {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams();
  if (params.destino && params.destino !== "all") sp.set("destino", params.destino);
  if (params.tipo.length === 1) sp.set("tipo", params.tipo[0]);
  if (params.q.trim()) sp.set("q", params.q.trim());
  const qs = sp.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  window.history.replaceState(null, "", next);
}

export const ToursClient: React.FC<ToursClientProps> = ({ initialTours }) => {
  const { currency } = useDisplayCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [dayRange, setDayRange] = useState<[number, number]>([1, 30]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("all");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get("destino");
    const tipoParam = params.get("tipo");
    const qParam = params.get("q");
    if (destParam) setSelectedDestination(destParam);
    if (tipoParam) setSelectedProfiles([tipoParam]);
    if (qParam) setSearchQuery(qParam);
  }, []);

  useEffect(() => {
    syncUrl({
      destino: selectedDestination,
      tipo: selectedProfiles,
      q: searchQuery,
    });
  }, [selectedDestination, selectedProfiles, searchQuery]);

  const handleToggleProfile = useCallback((id: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedDestination("all");
    setSelectedProfiles([]);
    setDayRange([1, 30]);
    setBudgetLevel("all");
  };

  const filteredTours = useMemo(() => {
    return initialTours.filter((tour) => {
      if (!tourMatchesDestination(tour, selectedDestination)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tour.titulo.toLowerCase().includes(q);
        const matchesLocation = tour.atributos?.ubicacion?.toLowerCase().includes(q);
        const matchesResumen = tour.resumen?.toLowerCase().includes(q);
        const matchesSlug = tour.slug.toLowerCase().includes(q);
        const matchesCat = tour.categoria?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesResumen && !matchesSlug && !matchesCat) {
          return false;
        }
      }

      if (selectedProfiles.length > 0) {
        const tourTags = deriveExperienceTags(tour);
        const hasMatchingProfile = selectedProfiles.some((profileId) =>
          tourTags.includes(profileId)
        );
        if (!hasMatchingProfile) return false;
      }

      const tourDays = parseDurationDays(tour.atributos?.duracion);
      if (tourDays < dayRange[0] || tourDays > dayRange[1]) return false;

      if (budgetLevel !== "all") {
        const estimatedPrice = estimateTourPrice(tour);
        if (budgetLevel === "budget" && estimatedPrice >= 100) return false;
        if (budgetLevel === "mid" && (estimatedPrice < 100 || estimatedPrice > 300))
          return false;
        if (budgetLevel === "premium" && estimatedPrice <= 300) return false;
      }

      return true;
    });
  }, [initialTours, searchQuery, selectedDestination, selectedProfiles, dayRange, budgetLevel]);

  const adaptTourToCardProps = (tour: Tour): TourProps =>
    toTourCardProps(tour, { currency });

  const filterProps = {
    searchQuery,
    onSearchChange: setSearchQuery,
    selectedDestination,
    onDestinationChange: setSelectedDestination,
    selectedProfiles,
    onToggleProfile: handleToggleProfile,
    dayRange,
    onDayRangeChange: setDayRange,
    budgetLevel,
    onBudgetChange: setBudgetLevel,
    onResetAll: handleResetAll,
    totalResultsCount: filteredTours.length,
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-16">
      <div className="relative bg-[#6b0014] py-16 md:py-20 px-4 text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
            Catálogo Perú 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white font-title tracking-tight">
            Descubre Perú a Tu Medida
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl font-normal leading-relaxed">
            Filtra por destino, estilo de viaje, duración o presupuesto y encuentra tu próxima experiencia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex items-center justify-between gap-3 mb-6 lg:hidden">
          <p className="text-sm font-bold text-slate-700">
            {filteredTours.length} experiencias
          </p>
          <ToursFilterMobileTrigger
            {...filterProps}
            open={mobileOpen}
            setOpen={setMobileOpen}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3">
            <ToursFilterSidebar {...filterProps} />
          </div>

          <div className="lg:col-span-9 flex flex-col gap-6">
            <p className="hidden lg:block text-sm text-slate-600">
              Mostrando <strong className="text-[#6b0014]">{filteredTours.length}</strong> de{" "}
              {initialTours.length} experiencias
            </p>

            {filteredTours.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center flex flex-col items-center gap-4 border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-title">
                  No encontramos tours con este filtro
                </h3>
                <button
                  onClick={handleResetAll}
                  className="mt-2 bg-[#6b0014] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Ver todos los tours
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.slug} tour={adaptTourToCardProps(tour)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
