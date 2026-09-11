"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

interface ReservedBannerProps {
  tourSlug: string;
}

/**
 * Aislado en su propio componente + Suspense boundary: `useSearchParams()` obliga a Next
 * a sacar del prerender estático todo lo que esté dentro de su límite de Suspense más cercano.
 * Antes vivía en TourDetailClient y arrastraba con él toda la página (hero, galería, precios) a
 * renderizarse solo en el cliente después de hidratar — de ahí el retraso de LCP.
 */
export const ReservedBanner: React.FC<ReservedBannerProps> = ({ tourSlug }) => {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("reservado") === "1";
  const fromSession =
    typeof window !== "undefined" &&
    sessionStorage.getItem(`chullos_reserved_${tourSlug}`) === "1";
  const show = fromQuery || fromSession;

  if (!show) return null;

  return (
    <div className="bg-emerald-600 text-white text-center text-xs sm:text-sm font-bold py-2.5 px-4">
      Ya reservaste esta experiencia — un asesor te contactará pronto.
    </div>
  );
};
