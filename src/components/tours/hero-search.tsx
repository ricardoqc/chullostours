"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSearchProps {
  totalTours: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ totalTours }) => {
  const router = useRouter();
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination) params.set("destino", selectedDestination);
    if (selectedType) params.set("tipo", selectedType);

    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="relative z-20 w-full mt-6">
      <form
        onSubmit={handleHeroSearch}
        className="bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
      >
        {/* Select Destino */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
          <MapPin className="w-5 h-5 text-[#6b0014] shrink-0" />
          <div className="flex flex-col w-full text-left">
            <label htmlFor="select-destino" className="text-[10px] uppercase font-bold text-slate-400">
              Destino
            </label>
            <select
              id="select-destino"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
            >
              <option value="">Todos los destinos</option>
              <option value="machu-picchu">Machu Picchu</option>
              <option value="valle-sagrado">Valle Sagrado</option>
              <option value="cusco">Cusco Ciudad</option>
              <option value="humantay">Laguna Humantay</option>
              <option value="vinicunca">Montaña 7 Colores</option>
            </select>
          </div>
        </div>

        {/* Select Tipo de Tour */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
          <Sparkles className="w-5 h-5 text-[#6b0014] shrink-0" />
          <div className="flex flex-col w-full text-left">
            <label htmlFor="select-tipo" className="text-[10px] uppercase font-bold text-slate-400">
              Tipo de Viaje
            </label>
            <select
              id="select-tipo"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
            >
              <option value="">Todas las experiencias</option>
              <option value="full-day">Full Day (1 Día)</option>
              <option value="paquete">Paquetes Varios Días</option>
              <option value="trekking">Trekking & Aventura</option>
              <option value="tren">Experiencia en Tren</option>
            </select>
          </div>
        </div>

        {/* Search Action Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full h-full py-3 flex items-center justify-center gap-2 shadow-lg"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Buscar Tours ({totalTours})</span>
        </Button>
      </form>
    </div>
  );
};
