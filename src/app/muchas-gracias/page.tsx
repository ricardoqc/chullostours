"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/I18nContext";

const MESSAGES: Record<string, { title: string; body: string; redirect: string }> = {
  es: {
    title: "¡Gracias por tu reserva!",
    body: "Recibimos tu solicitud correctamente. Pronto nos comunicaremos contigo por WhatsApp o correo para confirmar disponibilidad y los siguientes pasos.",
    redirect: "Te llevamos de vuelta a tu experiencia en",
  },
  en: {
    title: "Thank you for your booking request!",
    body: "We received your request successfully. We will contact you soon via WhatsApp or email to confirm availability and next steps.",
    redirect: "Taking you back to your experience in",
  },
};

function GraciasInner() {
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  const slug = searchParams.get("tour") || "";
  const title = searchParams.get("title") || "";
  const lang = locale === "en" ? "en" : "es";
  const copy = MESSAGES[lang];
  const [seconds, setSeconds] = useState(3);

  const tourHref = useMemo(
    () => (slug ? `/tours/${slug}/?reservado=1` : "/tours/"),
    [slug]
  );

  useEffect(() => {
    if (slug && typeof window !== "undefined") {
      sessionStorage.setItem(`chullos_reserved_${slug}`, "1");
    }
  }, [slug]);

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = tourHref;
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, tourHref]);

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
        <p className="text-xs text-slate-500">
          {copy.redirect}{" "}
          <strong className="text-slate-800">{seconds}s</strong>
        </p>
        <Link
          href={tourHref}
          className="mt-2 px-6 py-3 rounded-full bg-[#6b0014] text-white text-sm font-bold"
        >
          {lang === "en" ? "Go to tour now" : "Ir al tour ahora"}
        </Link>
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
