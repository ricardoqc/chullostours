import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Viajes y Tours | Chullos Tours",
  description: "Explora los tipos de tours disponibles: Full Day, Paquetes Cusco Todo Incluido y Paquetes Turísticos en Perú.",
};

const tiposDeTours = [
  { name: "Tours Full Day", slug: "tours-full-day" },
  { name: "Paquete Cusco Todo Incluido", slug: "paquete-cusco-todo-incluido" },
  { name: "Paquetes Turísticos Perú", slug: "paquetes-turisticos-peru" },
  { name: "Trekking", slug: "trekking" },
];

export default function TiposDeViajesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Tipos de Viajes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiposDeTours.map((tipo) => (
            <Link
              key={tipo.slug}
              href={`/tipos-de-tours/${tipo.slug}`}
              className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-400 transition"
            >
              <h2 className="text-lg font-semibold text-slate-900">{tipo.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
