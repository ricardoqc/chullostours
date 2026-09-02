import { Tour, TourExtra, TarifaPersona, HotelOpcion } from "@/types/tour";
import { companyInfo } from "@/lib/company-info";

export type DisplayCurrency = "USD" | "PEN";

export interface PricingSelection {
  adults: number;
  /** counts keyed by tarifas_personas id */
  childrenByTarifa?: Record<string, number>;
  selectedHotelId?: string;
  /** extra ids that are selected (must be enabled on tour) */
  selectedExtraIds?: string[];
  currency?: DisplayCurrency;
  exchangeRatePen?: number;
}

export interface PricingBreakdown {
  currency: DisplayCurrency;
  perAdult: number;
  adultsSubtotal: number;
  childrenSubtotal: number;
  extrasSubtotal: number;
  total: number;
  hotel?: HotelOpcion | null;
  enabledExtras: TourExtra[];
  selectedExtras: TourExtra[];
}

function schemaProductPrice(tour: Tour): number | null {
  if (tour.seo_schema && Array.isArray(tour.seo_schema["@graph"])) {
    const prod = tour.seo_schema["@graph"].find(
      (g: { "@type"?: string }) => g && g["@type"] === "Product"
    ) as { offers?: { price?: string | number } } | undefined;
    if (prod?.offers?.price != null) {
      const parsed = parseFloat(String(prod.offers.price));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return null;
}

/** Canonical base USD price from JSON only (no title heuristics). */
export function getTourBasePriceUsd(tour: Tour): number {
  if (typeof tour.precio_usd === "number" && tour.precio_usd > 0) {
    return tour.precio_usd;
  }
  if (typeof tour.precio === "number" && tour.precio > 0) {
    return tour.precio;
  }
  if (tour.opciones_hotel && tour.opciones_hotel.length > 0) {
    const solo = tour.opciones_hotel.find((h) => h.id === "solo_tour");
    if (solo && solo.precio_usd > 0) return solo.precio_usd;
    const minHotel = Math.min(...tour.opciones_hotel.map((h) => h.precio_usd));
    if (minHotel > 0) return minHotel;
  }
  const fromSchema = schemaProductPrice(tour);
  if (fromSchema) return fromSchema;
  return 0;
}

export function getExchangeRatePen(override?: number): number {
  if (typeof override === "number" && override > 0) return override;
  const env = process.env.NEXT_PUBLIC_EXCHANGE_RATE_PEN || process.env.EXCHANGE_RATE_PEN;
  if (env) {
    const n = parseFloat(env);
    if (!isNaN(n) && n > 0) return n;
  }
  return companyInfo.exchangeRatePen || 3.75;
}

export function usdToDisplay(
  amountUsd: number,
  currency: DisplayCurrency,
  rate?: number
): number {
  if (currency === "PEN") {
    return Math.round(amountUsd * getExchangeRatePen(rate));
  }
  return amountUsd;
}

export function getEnabledExtras(tour: Tour): TourExtra[] {
  return (tour.extras || []).filter((e) => e.enabled);
}

export function getExtraById(tour: Tour, id: string): TourExtra | undefined {
  return getEnabledExtras(tour).find((e) => e.id === id);
}

function childUnitUsd(adultUsd: number, tarifa: TarifaPersona): number {
  if (tarifa.tipo === "free") return 0;
  if (typeof tarifa.precio_usd === "number") return Math.max(0, tarifa.precio_usd);
  if (typeof tarifa.descuento_usd === "number") {
    return Math.max(0, adultUsd - tarifa.descuento_usd);
  }
  // Fallback: if only soles discount known, approximate with rate
  if (typeof tarifa.descuento_soles === "number") {
    const discUsd = tarifa.descuento_soles / getExchangeRatePen();
    return Math.max(0, adultUsd - discUsd);
  }
  return adultUsd;
}

export function calculateTourTotal(
  tour: Tour,
  selection: PricingSelection
): PricingBreakdown {
  const currency = selection.currency || "USD";
  const rate = selection.exchangeRatePen;
  const adults = Math.max(1, selection.adults || 1);
  const enabledExtras = getEnabledExtras(tour);

  const hotel =
    tour.opciones_hotel && selection.selectedHotelId
      ? tour.opciones_hotel.find((h) => h.id === selection.selectedHotelId) ||
        tour.opciones_hotel[0]
      : tour.opciones_hotel?.[0] || null;

  let perAdultUsd = hotel ? hotel.precio_usd : getTourBasePriceUsd(tour);

  const selectedExtras = enabledExtras.filter((e) =>
    (selection.selectedExtraIds || []).includes(e.id)
  );
  const extrasPerPersonUsd = selectedExtras.reduce((sum, e) => sum + e.precio_usd, 0);
  perAdultUsd += extrasPerPersonUsd;

  const adultsSubtotalUsd = perAdultUsd * adults;

  let childrenSubtotalUsd = 0;
  const tarifas = tour.tarifas_personas || [];
  const counts = selection.childrenByTarifa || {};
  for (const tarifa of tarifas) {
    const count = counts[tarifa.id] || 0;
    if (count <= 0) continue;
    const baseAdult = hotel ? hotel.precio_usd : getTourBasePriceUsd(tour);
    const unit = childUnitUsd(baseAdult, tarifa) + extrasPerPersonUsd;
    childrenSubtotalUsd += unit * count;
  }

  const extrasSubtotalUsd = extrasPerPersonUsd * (adults + Object.values(counts).reduce((a, b) => a + b, 0));
  // extras already included in adult/child lines; report line for UI clarity as per-person * pax
  const totalUsd = adultsSubtotalUsd + childrenSubtotalUsd;

  return {
    currency,
    perAdult: usdToDisplay(perAdultUsd, currency, rate),
    adultsSubtotal: usdToDisplay(adultsSubtotalUsd, currency, rate),
    childrenSubtotal: usdToDisplay(childrenSubtotalUsd, currency, rate),
    extrasSubtotal: usdToDisplay(extrasSubtotalUsd, currency, rate),
    total: usdToDisplay(totalUsd, currency, rate),
    hotel,
    enabledExtras,
    selectedExtras,
  };
}

export function formatMoney(amount: number, currency: DisplayCurrency): string {
  if (currency === "PEN") {
    return `S/ ${amount.toLocaleString("es-PE")}`;
  }
  return `$${amount.toLocaleString("en-US")} USD`;
}

/** Precio por pax de una opción de hotel según moneda activa (siempre desde precio_usd). */
export function formatHotelOptionPrice(
  opcion: Pick<HotelOpcion, "precio_usd">,
  currency: DisplayCurrency,
  rate?: number
): string {
  return formatMoney(usdToDisplay(opcion.precio_usd, currency, rate), currency);
}

/** Compare prices from JSON; falls back to modest markup only if missing */
export function getComparePrices(tour: Tour): { agencias: number; online: number } {
  const base = getTourBasePriceUsd(tour);
  if (tour.precios_comparacion) {
    return {
      agencias: tour.precios_comparacion.agencias_usd,
      online: tour.precios_comparacion.online_usd,
    };
  }
  return {
    agencias: Math.round(base * 1.2),
    online: Math.round(base * 1.12),
  };
}
