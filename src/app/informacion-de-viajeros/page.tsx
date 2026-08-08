import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Información de Viajeros | Chullos Tours",
  description: "Información y recomendaciones esenciales para viajeros en Perú y Cusco.",
};

export default function InformacionViajerosPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Información para Viajeros</h1>
        <p className="text-slate-600 mb-6">
          Encuentra recomendaciones útiles sobre aclimatación en Cusco, documentos necesarios, equipaje recomendado y clima.
        </p>
      </div>
    </div>
  );
}
