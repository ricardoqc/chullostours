"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface ReservedBannerProps {
  tourSlug: string;
}

const AUTO_HIDE_MS = 10_000;

/**
 * Banner post-reserva. Se oculta solo a los 10s o al cerrar manualmente.
 */
export const ReservedBanner: React.FC<ReservedBannerProps> = ({ tourSlug }) => {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("reservado") === "1";
  const storageKey = `chullos_reserved_${tourSlug}`;
  const dismissedKey = `chullos_reserved_${tourSlug}_dismissed`;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = sessionStorage.getItem(dismissedKey) === "1";
    const fromSession = sessionStorage.getItem(storageKey) === "1";
    const shouldShow = !dismissed && (fromQuery || fromSession);
    if (!shouldShow) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(dismissedKey, "1");
      setVisible(false);
    }, AUTO_HIDE_MS);

    return () => window.clearTimeout(timer);
  }, [fromQuery, storageKey, dismissedKey]);

  if (!visible) return null;

  return (
    <div className="bg-emerald-600 text-white text-center text-xs sm:text-sm font-bold py-2.5 px-4 relative">
      <span className="pr-8 block">
        Ya reservaste esta experiencia — un asesor te contactará pronto.
      </span>
      <button
        type="button"
        aria-label="Cerrar aviso"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center"
        onClick={() => {
          sessionStorage.setItem(dismissedKey, "1");
          setVisible(false);
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
