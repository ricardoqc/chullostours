import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "¡Gracias por tu reserva! | Chullos Tours",
  description: "Confirmación y detalles de tu reserva de tour en Cusco con Chullos Tours.",
};

export default function MuchasGraciasPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-slate-200 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">¡Muchas Gracias por tu Reserva!</h1>
        <p className="text-slate-600 mb-6">
          Hemos recibido tu solicitud correctamente. Te enviaremos un correo electrónico con los detalles y la confirmación de tu viaje.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/mis-viajes"
            className="px-6 py-2 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition"
          >
            Ver mis viajes
          </Link>
          <Link
            href="/tours"
            className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-100 transition"
          >
            Explorar más tours
          </Link>
        </div>
      </div>
    </div>
  );
}
