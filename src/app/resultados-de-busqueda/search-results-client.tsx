"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import { Search, Compass, MapPin, Sparkles, RotateCcw } from "lucide-react";
import { Tour } from "@/types/tour";
import { toTourCardProps } from "@/lib/tour-card-mapper";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";

interface SearchResultsClientProps {
  tours: Tour[];
}

export function SearchResultsClient({ tours }: SearchResultsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency } = useDisplayCurrency();
  const initialQ = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQ);

  const queryTerms = (initialQ.trim().toLowerCase().split(/\s+/)).filter((t) => t.length > 1);

  const filtered = tours.filter((t) => {
    if (queryTerms.length === 0) return true;
    const title = t.titulo.toLowerCase();
    const resumen = (t.resumen || "").toLowerCase();
    const ubicacion = (t.atributos?.ubicacion || "").toLowerCase();
    const tipo = (t.atributos?.tipo_tour || "").toLowerCase();
    const slug = t.slug.toLowerCase();
    const highlights = (t.destacados_highlights || []).join(" ").toLowerCase();

    // Check if all search terms match somewhere in the tour text
    return queryTerms.every(
      (term) =>
        title.includes(term) ||
        resumen.includes(term) ||
        ubicacion.includes(term) ||
        tipo.includes(term) ||
        slug.includes(term) ||
        highlights.includes(term)
    );
  });

  const adaptTourToCardProps = (tour: Tour): TourProps =>
    toTourCardProps(tour, { currency });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/resultados-de-busqueda?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/tours");
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-20 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#6b0014] text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <span className="bg-[#ffc000] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-title">
            <Search className="w-3.5 h-3.5" />
            Buscador Oficial
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white font-title tracking-tight">
            {initialQ ? `Resultados para: "${initialQ}"` : "Explora Todos los Tours"}
          </h1>
          <p className="text-slate-200 text-xs md:text-sm max-w-xl font-medium">
            Encuentra paquetes completos, trekkings clásicos y excursiones diarias garantizadas por operadores locales.
          </p>

          {/* In-Page Refined Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-xl flex items-center gap-2 bg-white p-1.5 pl-4 rounded-2xl shadow-xl border border-white/20 mt-2"
          >
            <Search className="w-4 h-4 text-[#6b0014] shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Refina tu búsqueda (ej. Laguna Humantay, Tren...)"
              className="w-full text-xs md:text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400 bg-transparent py-1.5"
            />
            <button
              type="submit"
              className="bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer shadow-md active:scale-95 font-title"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        {/* Results Counter & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-slate-600 font-semibold">
              Se encontraron{" "}
              <strong className="text-[#6b0014] font-black text-base">{filtered.length}</strong> tours disponibles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] bg-[#6b0014]/10 hover:bg-[#6b0014]/20 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver Catálogo Completo con Filtros</span>
            </Link>
          </div>
        </div>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((tour) => (
              <TourCard key={tour.slug} tour={adaptTourToCardProps(tour)} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 shadow-sm border border-slate-200 max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-title">
              No encontramos coincidencias exactas para &quot;{initialQ}&quot;
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Intenta con palabras más generales como &quot;Machu Picchu&quot;, &quot;Cusco&quot;, &quot;Trekking&quot; o explora nuestros tours más recomendados.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  router.push("/resultados-de-busqueda");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ver todos los tours</span>
              </button>
              <Link
                href="/tours"
                className="inline-flex items-center gap-1.5 text-xs font-black bg-[#6b0014] hover:bg-[#850019] text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm font-title"
              >
                <span>Ir al Catálogo</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

