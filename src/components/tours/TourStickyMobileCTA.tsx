"use client";

import React from "react";
import { FaWhatsapp, FaShieldAlt } from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

interface TourStickyMobileCTAProps {
  tourTitle: string;
  basePrice: number;
}

export const TourStickyMobileCTA: React.FC<TourStickyMobileCTAProps> = ({
  tourTitle,
  basePrice,
}) => {
  const whatsappUrl = getPrimaryWhatsappUrl(
    `¡Hola Chullos Tours! 👋 Quisiera solicitar información para reservar el tour: *${tourTitle}*`
  );

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Desde
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-[#6b0014] font-title">
            ${basePrice}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">USD</span>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#25D366] active:bg-[#20ba59] text-white font-black text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
      >
        <FaWhatsapp className="w-4 h-4" />
        <span>Reservar por WhatsApp</span>
      </a>
    </div>
  );
};
