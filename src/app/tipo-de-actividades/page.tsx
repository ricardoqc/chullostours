import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Actividades | Chullos Tours",
  description: "Descubre las diferentes actividades turísticas disponibles: Trekking, Cuatrimoto, City Tour y más.",
};

const actividades = [
  { name: "Caminata / Hiking", slug: "caminata-hiking" },
  { name: "Camping", slug: "camping" },
  { name: "City Tour", slug: "city-tour" },
  { name: "Cuatrimoto", slug: "cuatrimoto" },
  { name: "Outdoor", slug: "outdoor" },
  { name: "Trekking", slug: "trekking" },
];

export default function TipoDeActividadesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Tipos de Actividades</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {actividades.map((act) => (
            <Link
              key={act.slug}
              href={`/actividades/${act.slug}`}
              className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-400 transition"
            >
              <h2 className="text-lg font-semibold text-slate-900">{act.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
