import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { User, MessageCircle } from "lucide-react";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "Mi cuenta | Chullos Tours",
  description: "Área de clientes próximamente.",
  robots: { index: false, follow: false },
};

export default function MyAccountPage() {
  const wa = getPrimaryWhatsappUrl(
    "¡Hola Chullos Tours! Necesito ayuda con una reserva existente."
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
        <User className="w-8 h-8" />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-title">
        Área de clientes pronto
      </h1>
      <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed">
        El inicio de sesión aún no está disponible. Si ya reservaste, tu asesor
        te atenderá por WhatsApp o correo con todos los detalles de tu viaje.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Contactar soporte
        </a>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
