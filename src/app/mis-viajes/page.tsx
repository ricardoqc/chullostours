import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Viajes | Chullos Tours",
  description: "Consulta tus reservas e itinerarios contratados con Chullos Tours.",
};

export default function MisViajesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Mis Viajes y Reservas</h1>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-4">No tienes reservas activas en este momento.</p>
          <Link
            href="/tours"
            className="inline-block px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition"
          >
            Explorar Tours Disponibles
          </Link>
        </div>
      </div>
    </div>
  );
}
