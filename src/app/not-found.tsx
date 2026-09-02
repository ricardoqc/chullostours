import React from "react";
import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { HelpLinksPanel, HELP_PANEL_PRIMARY_BUTTON_CLASS } from "@/components/layout/HelpLinksPanel";

export const metadata = {
  title: "Página no encontrada (404) | Chullos Tours",
  description: "Lo sentimos, la ruta que buscas no existe o ha sido movida. Explora nuestros tours a Machu Picchu y Cusco.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />

        {/* 404 Badge & Icon */}
        <div className="w-20 h-20 rounded-3xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-4xl sm:text-6xl font-black text-[#6b0014] font-title tracking-tight">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-title leading-snug">
            ¡Te has adentrado en un camino inca desconocido!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            La página que buscas no existe, cambió de nombre o fue movida durante la actualización de nuestra plataforma.
          </p>
        </div>

        {/* Search Quick Bar */}
        <form
          action="/resultados-de-busqueda"
          method="GET"
          className="w-full max-w-md flex items-center gap-2 bg-slate-50 border-2 border-slate-200 focus-within:border-[#6b0014] rounded-2xl p-1.5 pl-4 transition-all"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            name="q"
            placeholder="¿Qué tour o destino buscabas?"
            className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 font-title"
          >
            Buscar
          </button>
        </form>

        <HelpLinksPanel
          primaryAction={
            <Link href="/" className={HELP_PANEL_PRIMARY_BUTTON_CLASS}>
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          }
        />
      </div>
    </div>
  );
}
