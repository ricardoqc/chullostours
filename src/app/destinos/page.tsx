import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { getAllTours } from "@/lib/tours";
import { getDestinationsWithTours } from "@/lib/places";
import { TourImage } from "@/components/ui/TourImage";

export const metadata: Metadata = {
  title: "Destinos Turísticos en Perú | Chullos Tours",
  description:
    "Explora nuestros destinos con tours disponibles: Cusco, Machu Picchu, Valle Sagrado, Puno y Lima. Salidas garantizadas con guías locales.",
  alternates: {
    canonical: "https://chullostours.com/destinos/",
  },
};

export default function DestinationsPage() {
  const tours = getAllTours();
  const destinations = getDestinationsWithTours(tours);

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-extrabold uppercase tracking-widest">
            Lugares increíbles
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white font-title">
            Destinos turísticos del Perú
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl font-light">
            Explora las maravillas naturales e históricas más icónicas del sur
            del Perú y elige tu próxima experiencia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest) => (
          <Link
            key={dest.slug}
            href={`/destinos/${dest.slug}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-[#6b0014]/30 transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <TourImage
                src={dest.imagen}
                alt={dest.nombre}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 bg-[#6b0014] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                {dest.toursCount} {dest.toursCount === 1 ? "tour" : "tours"}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5 text-[#ffc000]" />
                  {dest.region}
                </span>
                <h2 className="text-xl font-black text-slate-900 font-title group-hover:text-[#6b0014] transition-colors">
                  {dest.nombre}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  {dest.descripcion}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-900 group-hover:text-[#6b0014] transition-colors">
                <span>Ver tours disponibles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 font-title">
                ¿Buscas otro destino del Perú?
              </span>
              <span className="text-xs text-slate-500">
                Revisa el catálogo completo o pídenos un itinerario a medida.
              </span>
            </div>
          </div>
          <Link
            href="/tours/"
            className="inline-flex items-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title shrink-0"
          >
            Ver todos los tours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
