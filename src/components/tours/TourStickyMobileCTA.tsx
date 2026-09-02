"use client";

import React from "react";
import { FaWhatsapp, FaClipboardCheck } from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { useTourReservation } from "./TourReservationProvider";
import { Tour } from "@/types/tour";
import { formatMoney } from "@/lib/pricing";
import { resolveTourDisplayPrice } from "@/lib/market";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";

interface TourStickyMobileCTAProps {
  tour: Tour;
}

export const TourStickyMobileCTA: React.FC<TourStickyMobileCTAProps> = ({ tour }) => {
  const { openReservation } = useTourReservation();
  const { currency } = useDisplayCurrency();
  const { amount, currency: resolvedCurrency } = resolveTourDisplayPrice(tour, currency);
  const displayPrice = formatMoney(amount, resolvedCurrency);
  const whatsappUrl = getPrimaryWhatsappUrl(
    `¡Hola Chullos Tours! Quisiera información para reservar: *${tour.titulo}*`
  );

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-2xl flex items-center justify-between gap-2.5">
      <div className="flex flex-col shrink-0">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Desde
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-[#6b0014] font-title">{displayPrice}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <button
          type="button"
          onClick={() => openReservation()}
          className="flex-1 max-w-[200px] bg-[#6b0014] text-white font-black text-xs py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <FaClipboardCheck className="w-3.5 h-3.5" />
          Reservar
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-11 h-11 bg-[#25D366] text-white rounded-xl flex items-center justify-center min-h-[44px]"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
