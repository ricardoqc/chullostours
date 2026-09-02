import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "Carrito | Chullos Tours",
  description: "Las reservas se confirman con un asesor de Chullos Tours.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  const wa = getPrimaryWhatsappUrl(
    "¡Hola Chullos Tours! Quiero reservar un tour y me gustaría hablar con un asesor."
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-title">
        Reserva con un asesor
      </h1>
      <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed">
        El carrito online aún no está activo. Todas las reservas se confirman por
        WhatsApp o correo con nuestro equipo. El pago se coordina directamente
        con tu asesor.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Hablar por WhatsApp
        </a>
        <Link
          href="/tours/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50"
        >
          Ver tours
        </Link>
      </div>
    </div>
  );
}
