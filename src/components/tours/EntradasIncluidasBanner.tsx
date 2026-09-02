"use client";

import React from "react";
import { Ticket, CheckCircle2 } from "lucide-react";
import type { Tour } from "@/types/tour";
import { hasEntradasIncluidas, getEntradasIncluidasCopy } from "@/lib/tour-inclusions";

export type EntradasBannerSize = "full" | "compact" | "chip";

interface EntradasIncluidasBannerProps {
  tour: Tour;
  /** @deprecated Use `size="compact"` */
  compact?: boolean;
  size?: EntradasBannerSize;
}

const variantStyles = {
  emerald: {
    wrap: "border-emerald-300/60 bg-gradient-to-r from-emerald-50/90 to-white",
    icon: "text-emerald-600 bg-emerald-100",
    title: "text-emerald-950",
    chip: "border-emerald-300/70 bg-emerald-50 text-emerald-900",
  },
  gold: {
    wrap: "border-[#ffc000]/50 bg-gradient-to-r from-amber-50/90 to-white",
    icon: "text-[#6b0014] bg-[#ffc000]/25",
    title: "text-[#6b0014]",
    chip: "border-[#ffc000]/60 bg-amber-50 text-[#6b0014]",
  },
  brand: {
    wrap: "border-[#6b0014]/20 bg-gradient-to-r from-[#6b0014]/5 to-white",
    icon: "text-[#6b0014] bg-[#6b0014]/10",
    title: "text-[#6b0014]",
    chip: "border-[#6b0014]/25 bg-[#6b0014]/5 text-[#6b0014]",
  },
};

export const EntradasIncluidasBanner: React.FC<EntradasIncluidasBannerProps> = ({
  tour,
  compact = false,
  size: sizeProp,
}) => {
  if (!hasEntradasIncluidas(tour)) return null;

  const size: EntradasBannerSize = sizeProp ?? (compact ? "compact" : "full");
  const copy = getEntradasIncluidasCopy(tour);
  const styles = variantStyles[copy.variant] || variantStyles.gold;

  if (size === "chip") {
    return (
      <span
        className={`inline-flex items-center gap-1 max-w-full text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${styles.chip}`}
        title={copy.detalle}
      >
        <Ticket className="w-3 h-3 shrink-0" aria-hidden />
        <span className="truncate">{copy.titulo}</span>
      </span>
    );
  }

  if (size === "compact") {
    return (
      <div
        className={`rounded-lg border px-2.5 py-1.5 flex items-center gap-2 ${styles.wrap}`}
      >
        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${styles.icon}`} />
        <div className="min-w-0">
          <p className={`text-[10px] font-black uppercase tracking-wide leading-tight ${styles.title}`}>
            {copy.titulo}
          </p>
          <p className="text-[10px] text-slate-600 leading-snug line-clamp-1">
            {copy.detalle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`rounded-xl border px-4 py-3 md:px-5 md:py-3.5 shadow-xs ${styles.wrap}`}
      aria-label={copy.titulo}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}
        >
          <Ticket className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h3 className={`text-sm md:text-base font-black font-title leading-tight ${styles.title}`}>
            {copy.titulo}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-snug line-clamp-2 md:line-clamp-none">
            {copy.detalle}
          </p>
        </div>
      </div>
    </section>
  );
};
