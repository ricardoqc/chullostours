"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/I18nContext";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { trackWhatsAppClick } from "@/lib/analytics";

const MESSAGES: Record<string, { title: string; body: string; whatsapp: string; secondary: string }> = {
  es: {
    title: "¡Gracias por tu reserva!",
    body: "Recibimos tu solicitud correctamente. Nos comunicaremos contigo por WhatsApp o correo para confirmar disponibilidad y los siguientes pasos.",
    whatsapp: "Escríbenos ahora por WhatsApp",
    secondary: "Ver el tour",
  },
  en: {
    title: "Thank you for your booking request!",
    body: "We received your request successfully. We will contact you soon via WhatsApp or email to confirm availability and next steps.",
    whatsapp: "Message us now on WhatsApp",
    secondary: "View the tour",
  },
};

function GraciasInner() {
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  const slug = searchParams.get("tour") || "";
  const title = searchParams.get("title") || "";
  const lang = locale === "en" ? "en" : "es";
  const copy = MESSAGES[lang];

  const tourHref = useMemo(
    () => (slug ? `/tours/${slug}/?reservado=1` : "/tours/"),
    [slug]
  );

  const whatsappUrl = getPrimaryWhatsappUrl(
    title
      ? `Hola, acabo de enviar una solicitud de reserva para "${title}". ¿Podrían confirmarme la disponibilidad?`
      : "Hola, acabo de enviar una solicitud de reserva. ¿Podrían confirmarme la disponibilidad?"
  );

  useEffect(() => {
    if (slug && typeof window !== "undefined") {
      sessionStorage.setItem(`chullos_reserved_${slug}`, "1");
    }
  }, [slug]);

  return (
    <div className="min-h-[70vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-3xl border border-slate-200 text-center shadow-sm flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-black">
          ✓
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-title">
          {copy.title}
        </h1>
        {title && (
          <p className="text-sm font-bold text-[#6b0014]">{title}</p>
        )}
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">{copy.body}</p>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({ location: "muchas_gracias_page", tourSlug: slug, tourName: title })
            }
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold transition-colors"
          >
            {copy.whatsapp}
          </a>
          <Link
            href={tourHref}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-300 hover:border-[#6b0014] text-slate-700 hover:text-[#6b0014] text-sm font-bold transition-colors"
          >
            {copy.secondary}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MuchasGraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-500">Cargando...</div>
      }
    >
      <GraciasInner />
    </Suspense>
  );
}
