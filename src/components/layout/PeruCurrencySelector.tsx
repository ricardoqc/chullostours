"use client";

import React, { useEffect, useRef, useState } from "react";
import { Coins } from "lucide-react";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";

export function PeruCurrencySelector() {
  const { isPeru, ready, currency, setDisplayCurrency } = useDisplayCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!ready || !isPeru) return null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Cambiar moneda de precios"
        title={currency === "USD" ? "Precios en dólares" : "Precios en soles"}
        className="h-8 px-2.5 rounded-full bg-white/15 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#ffc000] hover:text-[#6b0014] transition-all duration-300"
      >
        <Coins className="w-3.5 h-3.5 shrink-0 opacity-90" />
        <span>{currency === "USD" ? "USD" : "PEN"}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.4rem)] z-50 w-52 rounded-xl border border-slate-200 bg-white shadow-xl p-1.5 flex flex-col gap-0.5"
        >
          {currency === "USD" ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setDisplayCurrency("PEN");
                setOpen(false);
              }}
              className="text-left rounded-lg px-3 py-2 text-[11px] text-slate-800 hover:bg-[#ffc000]/15 transition-colors"
            >
              <span className="block font-extrabold text-[#6b0014]">Ver en soles (PEN)</span>
              <span className="block mt-0.5 text-slate-500 leading-snug">
                Para visitantes en Perú
              </span>
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setDisplayCurrency("USD");
                setOpen(false);
              }}
              className="text-left rounded-lg px-3 py-2 text-[11px] text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span className="block font-extrabold text-[#6b0014]">Ver en USD</span>
              <span className="block mt-0.5 text-slate-500 leading-snug">
                Dólares americanos
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
