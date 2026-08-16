"use client";

import React, { useState, useMemo } from "react";
import { Compass, RotateCcw } from "lucide-react";
import { Tour } from "@/types/tour";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import {
  deriveExperienceTags,
  parseDurationDays,
  estimateTourPrice,
  getTourDestination,
} from "@/lib/tour-filters";
import { ToursFilterBar } from "@/components/tours/ToursFilterBar";
import { BudgetLevel } from "@/components/tours/BudgetSelector";

interface ToursClientProps {
  initialTours: Tour[];
}

export const ToursClient: React.FC<ToursClientProps> = ({ initialTours }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [dayRange, setDayRange] = useState<[number, number]>([1, 30]);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("all");

  // Read URL query parameters from HeroSearch if present
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const destParam = params.get("destino");
      const tipoParam = params.get("tipo");
      const qParam = params.get("q");

      if (destParam) setSelectedDestination(destParam);
      if (tipoParam) setSelectedProfiles([tipoParam]);
      if (qParam) setSearchQuery(qParam);
    }
  }, []);

  const handleToggleProfile = (id: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedDestination("all");
    setSelectedProfiles([]);
    setDayRange([1, 30]);
    setBudgetLevel("all");
  };

  // Filter tours dynamically with multi-dimensional criteria
  const filteredTours = useMemo(() => {
    return initialTours.filter((tour) => {
      // 1. Destination Filter
      if (selectedDestination !== "all") {
        const dest = getTourDestination(tour);
        if (dest !== selectedDestination) {
          return false;
        }
      }

      // 2. Search Query
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

      // 3. Traveler Profiles (OR logic among selected tags)
      if (selectedProfiles.length > 0) {
        const tourTags = deriveExperienceTags(tour);
        const hasMatchingProfile = selectedProfiles.some((profileId) =>
          tourTags.includes(profileId)
        );
        if (!hasMatchingProfile) return false;
      }

      // 4. Duration Days Range
      const tourDays = parseDurationDays(tour.atributos?.duracion);
      if (tourDays < dayRange[0] || tourDays > dayRange[1]) {
        return false;
      }

      // 5. Budget Level
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

  // Adapt Tour model to TourCard props
  const adaptTourToCardProps = (tour: Tour): TourProps => {
    const firstImage =
      tour.galeria && tour.galeria.length > 0
        ? tour.galeria[0].src
        : "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80";

    const estimatedPrice = estimateTourPrice(tour);

    return {
      id: tour.slug,
      slug: tour.slug,
      title: tour.titulo,
      location: tour.atributos?.ubicacion || "Cusco, Perú",
      duration: tour.atributos?.duracion || "Full Day",
      price: estimatedPrice,
      rating: 4.9,
      reviewCount: 48,
      imageUrl: firstImage,
      badge: tour.atributos?.duracion || "Popular",
    };
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-16">
      {/* Page Header Banner */}
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
            Filtra por destino (Cusco, Puno, Lima), estilo de viaje, duración o presupuesto y encuentra la aventura perfecta.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
        {/* Interactive Client-Centric Smart Filter Bar */}
        <ToursFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDestination={selectedDestination}
          onDestinationChange={setSelectedDestination}
          selectedProfiles={selectedProfiles}
          onToggleProfile={handleToggleProfile}
          dayRange={dayRange}
          onDayRangeChange={setDayRange}
          budgetLevel={budgetLevel}
          onBudgetChange={setBudgetLevel}
          onResetAll={handleResetAll}
          totalResultsCount={filteredTours.length}
        />

        {/* Results Grid */}
        {filteredTours.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-12 text-center flex flex-col items-center gap-4 border border-slate-200 shadow-sm my-4">
            <div className="w-16 h-16 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-title">
              No encontramos tours con este filtro
            </h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md leading-relaxed">
              Intenta combinar diferentes opciones de experiencia o restablece los filtros para ver la lista completa de tours disponibles.
            </p>
            <button
              onClick={handleResetAll}
              className="mt-2 bg-[#6b0014] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#850019] transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver todos los tours ({initialTours.length})</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.slug} tour={adaptTourToCardProps(tour)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

