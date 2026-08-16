"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Compass, Sparkles } from "lucide-react";

interface HeroSearchProps {
  totalTours?: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = () => {
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
    <div className="relative z-20 w-full mt-6 md:mt-8">
      <form
        onSubmit={handleHeroSearch}
        className="bg-white/95 backdrop-blur-2xl p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
      >
        {/* Select Destino / Lugares */}
        <div className="sm:col-span-5 flex items-center gap-3 bg-slate-50/90 hover:bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 transition-colors">
          <MapPin className="w-5 h-5 text-[#6b0014] shrink-0" />
          <div className="flex flex-col w-full text-left">
            <label htmlFor="select-destino" className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              ¿A dónde quieres ir?
            </label>
            <select
              id="select-destino"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer w-full"
            >
              <option value="">Todos los destinos</option>
              <option value="cusco">Cusco Ciudad & Alrededores</option>
              <option value="machu-picchu">Machu Picchu & Trenes</option>
              <option value="valle-sagrado">Valle Sagrado de los Incas</option>
              <option value="vinicunca">Montaña de 7 Colores (Vinicunca)</option>
              <option value="humantay">Laguna Humantay & Glaciares</option>
              <option value="puno">Puno & Lago Titicaca</option>
              <option value="lima">Lima & Ica (Oasis / Paracas)</option>
            </select>
          </div>
        </div>

        {/* Select Tipo de Viaje / Experiencias */}
        <div className="sm:col-span-4 flex items-center gap-3 bg-slate-50/90 hover:bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 transition-colors">
          <Compass className="w-5 h-5 text-[#6b0014] shrink-0" />
          <div className="flex flex-col w-full text-left">
            <label htmlFor="select-tipo" className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Estilo de Viaje
            </label>
            <select
              id="select-tipo"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer w-full"
            >
              <option value="">Todas las experiencias</option>
              <option value="adventurer">Trekking & Caminatas</option>
              <option value="history">Historia & Cultura Inca</option>
              <option value="train">Experiencia en Tren</option>
              <option value="multiday">Paquetes Varios Días</option>
              <option value="adrenaline">Adrenalina & Cuatrimotos</option>
              <option value="nature">Naturaleza & Lagos</option>
              <option value="mystic">Místico & Turismo Vivencial</option>
            </select>
          </div>
        </div>

        {/* Search Action Button */}
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full h-full py-3.5 px-5 bg-[#6b0014] hover:bg-[#850019] text-white text-xs md:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6b0014]/25 cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Buscar Tours</span>
          </button>
        </div>
      </form>
    </div>
  );
};

