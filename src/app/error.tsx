"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MountainSnow, RotateCw, Home } from "lucide-react";
import { HelpLinksPanel, HELP_PANEL_PRIMARY_BUTTON_CLASS } from "@/components/layout/HelpLinksPanel";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ChullosTours] Error de aplicación:", error.digest ? `digest=${error.digest}` : "sin digest", error);
  }, [error]);

  const whatsappMessage = error.digest
    ? `Hola, tuve un problema al navegar en la web de Chullos Tours (código de referencia: ${error.digest}). ¿Me pueden ayudar?`
    : "Hola, tuve un problema al navegar en la web de Chullos Tours. ¿Me pueden ayudar?";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />

        <div className="w-20 h-20 rounded-3xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
          <MountainSnow className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-2xl sm:text-4xl font-black text-[#6b0014] font-title tracking-tight">
            ¡Neblina en la ruta!
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-title leading-snug">
            Nuestro chaski tropezó al traerte esta página
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Algo falló de nuestro lado y no pudimos mostrarte el contenido. Igual que en la montaña, lo mejor es tomar aire e intentarlo otra vez: casi siempre el camino se despeja al segundo intento.
          </p>
        </div>

        <HelpLinksPanel
          linksTitle="Mientras tanto, puedes seguir explorando:"
          whatsappLabel="Escríbenos por WhatsApp"
          whatsappMessage={whatsappMessage}
          primaryAction={
            <>
              <button type="button" onClick={reset} className={`${HELP_PANEL_PRIMARY_BUTTON_CLASS} cursor-pointer`}>
                <RotateCw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-[#6b0014]/30 text-xs font-black px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 font-title"
              >
                <Home className="w-4 h-4" />
                <span>Ir al Inicio</span>
              </Link>
            </>
          }
        />

        {error.digest && (
          <span className="text-[10px] text-slate-400 tracking-wide">
            Código de referencia: {error.digest}
          </span>
        )}
      </div>
    </div>
  );
}
