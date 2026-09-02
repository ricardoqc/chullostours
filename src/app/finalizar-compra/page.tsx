import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CreditCard, MessageCircle } from "lucide-react";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "Checkout | Chullos Tours",
  description: "El pago se coordina con tu asesor de viajes.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const wa = getPrimaryWhatsappUrl(
    "¡Hola Chullos Tours! Quiero confirmar una reserva y coordinar el pago."
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
        <CreditCard className="w-8 h-8" />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-title">
        Pago con tu asesor
      </h1>
      <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed">
        La pasarela de pago online estará disponible pronto. Por ahora, un
        asesor te enviará las opciones (transferencia, tarjeta u otros medios)
        después de confirmar disponibilidad.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">Visa</span>
        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">Mastercard</span>
        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">Yape</span>
        <span className="px-3 py-1 rounded-full border border-slate-200 bg-white">Transferencia</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Coordinar por WhatsApp
        </a>
        <Link
          href="/tours/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50"
        >
          Explorar experiencias
        </Link>
      </div>
    </div>
  );
}
