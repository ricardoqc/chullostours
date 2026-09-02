import type { Tour } from "@/types/tour";
import type { TourProps } from "@/components/tours/tour-card";
import { getComparePrices } from "@/lib/pricing";
import type { DisplayCurrency } from "@/lib/pricing";
import { hasEntradasIncluidas, getEntradasIncluidasCopy } from "@/lib/tour-inclusions";
import { getMetrics } from "@/lib/site-config";
import { resolveTourDisplayPrice } from "@/lib/market";

function mapCardBadges(tour: Tour): TourProps["chips"] {
  return (tour.card_badges || [])
    .filter((b) => b.visible !== false)
    .map((b) => ({
      id: b.id,
      label: b.label,
      tone:
        b.tone === "brand"
          ? "brand"
          : b.tone === "success"
            ? "success"
            : b.tone === "warning"
              ? "warning"
              : "neutral",
    }));
}

export function toTourCardProps(
  tour: Tour,
  options?: { badge?: string; currency?: DisplayCurrency }
): TourProps {
  const currency = options?.currency ?? "USD";
  const metrics = getMetrics();
  const { amount: price, currency: resolvedCurrency } = resolveTourDisplayPrice(
    tour,
    currency
  );
  const compare = getComparePrices(tour);
  const originalPrice =
    resolvedCurrency === "USD" && compare.online > price ? compare.online : undefined;

  const firstImage =
    tour.galeria && tour.galeria.length > 0
      ? tour.galeria[0].src
      : "/media/tours/camino-inca-2-dias/01.jpg";

  const entradas = hasEntradasIncluidas(tour)
    ? getEntradasIncluidasCopy(tour)
    : undefined;

  return {
    id: tour.slug,
    slug: tour.slug,
    title: tour.titulo,
    location: tour.atributos?.ubicacion
      ? tour.atributos.ubicacion.split(",")[0]
      : "Cusco, Perú",
    duration: tour.atributos?.duracion || "1 Día",
    price,
    originalPrice,
    currency: resolvedCurrency,
    rating: metrics.tripadvisorRating,
    reviewCount: metrics.tripadvisorReviewsCount,
    imageUrl: firstImage,
    badge: options?.badge || tour.atributos?.tipo_tour || tour.categoria || "Popular",
    difficulty: tour.atributos?.dificultad,
    groupSize: tour.atributos?.grupo_max
      ? `Máx. ${tour.atributos.grupo_max} pax`
      : undefined,
    tripType: tour.categoria || tour.atributos?.tipo_tour,
    chips: mapCardBadges(tour),
    entradasIncluidas: entradas,
  };
}
