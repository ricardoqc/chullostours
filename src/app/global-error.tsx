"use client";

import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[ChullosTours] Error global:", error.digest ? `digest=${error.digest}` : "sin digest", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 overflow-hidden">
            <div className="w-full h-2 -mt-8 sm:-mt-12 bg-[#6b0014]" />

            <div className="w-16 h-16 rounded-2xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center text-3xl font-black">
              !
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-black leading-snug">
                Se nos cortó el camino
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tuvimos un problema inesperado y no pudimos cargar la página. Vuelve a intentarlo en unos segundos; si el problema continúa, escríbenos y te atendemos de inmediato.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-6 py-3 rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Reintentar
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-xs font-black px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Ir al Inicio
              </a>
            </div>

            {error.digest && (
              <span className="text-[10px] text-slate-400 tracking-wide">
                Código de referencia: {error.digest}
              </span>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
