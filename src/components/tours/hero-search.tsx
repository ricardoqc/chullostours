"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Compass, ChevronDown, Check, Mountain, Footprints, Landmark, Train, CalendarDays, Zap, Trees, Sparkles, Waves, Sun } from "lucide-react";

const DESTINATION_OPTIONS = [
  { id: "", label: "Todos los destinos", icon: MapPin, count: "34 Tours" },
  { id: "cusco", label: "Cusco & Alrededores", icon: Mountain, count: "25+" },
  { id: "machu-picchu", label: "Machu Picchu", icon: Landmark, count: "10+" },
  { id: "valle-sagrado", label: "Valle Sagrado", icon: Trees, count: "6+" },
  { id: "puno", label: "Puno & Lago Titicaca", icon: Waves, count: "3 Tours" },
  { id: "lima", label: "Lima & Ica (Costa)", icon: Sun, count: "2 Tours" },
];

const STYLE_OPTIONS = [
  { id: "", label: "Todas las experiencias", icon: Compass },
  { id: "adventurer", label: "Trekking & Caminatas", icon: Footprints },
  { id: "history", label: "Historia & Cultura Inca", icon: Landmark },
  { id: "train", label: "Experiencia en Tren", icon: Train },
  { id: "multiday", label: "Paquetes Varios Días", icon: CalendarDays },
  { id: "adrenaline", label: "Adrenalina & Motor", icon: Zap },
  { id: "nature", label: "Naturaleza & Lagos", icon: Trees },
  { id: "mystic", label: "Místico & Vivencial", icon: Sparkles },
];

interface HeroSearchProps {
  totalTours?: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ totalTours }) => {
  const router = useRouter();
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [destOpen, setDestOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination) params.set("destino", selectedDestination);
    if (selectedType) params.set("tipo", selectedType);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const currentDest = DESTINATION_OPTIONS.find((d) => d.id === selectedDestination) || DESTINATION_OPTIONS[0];
  const currentStyle = STYLE_OPTIONS.find((s) => s.id === selectedType) || STYLE_OPTIONS[0];

  const DestIcon = currentDest.icon;
  const StyleIcon = currentStyle.icon;

  return (
    <div className="relative z-30 w-full mt-6 md:mt-8">
      <form
        onSubmit={handleHeroSearch}
        className="bg-white/95 backdrop-blur-2xl p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl border border-white/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center relative z-40"
      >
        {/* Custom Dropdown 1: Destino */}
        <div ref={destRef} className="sm:col-span-4 relative z-50">
          <button
            type="button"
            onClick={() => {
              setDestOpen(!destOpen);
              setTypeOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 px-4 py-3 rounded-2xl border border-slate-200/80 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <DestIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Destino
                </span>
                <span className="text-xs md:text-sm font-extrabold text-slate-900 truncate">
                  {currentDest.label}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${destOpen ? "rotate-180 text-[#6b0014]" : ""}`} />
          </button>

          {/* Options Dropdown Panel */}
          {destOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[70] flex flex-col gap-1 animate-slideDown">
              {DESTINATION_OPTIONS.map((dest) => {
                const Icon = dest.icon;
                const isSelected = selectedDestination === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setSelectedDestination(dest.id);
                      setDestOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#6b0014] text-white shadow-sm font-black"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#6b0014]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-[#6b0014]"}`} />
                      <span>{dest.label}</span>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-amber-300" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold">{dest.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Dropdown 2: Estilo de Viaje */}
        <div ref={typeRef} className="sm:col-span-5 relative z-50">
          <button
            type="button"
            onClick={() => {
              setTypeOpen(!typeOpen);
              setDestOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 px-4 py-3 rounded-2xl border border-slate-200/80 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <StyleIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Experiencia
                </span>
                <span className="text-xs md:text-sm font-extrabold text-slate-900 truncate">
                  {currentStyle.label}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${typeOpen ? "rotate-180 text-[#6b0014]" : ""}`} />
          </button>

          {/* Options Dropdown Panel */}
          {typeOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 max-h-64 overflow-y-auto flex flex-col gap-1 animate-slideDown [scrollbar-width:thin]">
              {STYLE_OPTIONS.map((st) => {
                const Icon = st.icon;
                const isSelected = selectedType === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(st.id);
                      setTypeOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#6b0014] text-white shadow-sm font-black"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#6b0014]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-[#6b0014]"}`} />
                      <span>{st.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search CTA Button */}
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full h-full py-3.5 px-5 bg-[#6b0014] hover:bg-[#850019] text-white text-xs md:text-sm font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6b0014]/25 cursor-pointer active:scale-95 touch-manipulation font-title"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Buscar Tours</span>
          </button>
        </div>
      </form>
    </div>
  );
};


