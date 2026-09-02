import type { Tour } from "@/types/tour";
import { getTourBasePriceUsd, getExchangeRatePen } from "@/lib/pricing";
import type { DisplayCurrency } from "@/lib/pricing";

export type Market = "global" | "pe";

export function getMarketFromPath(pathname: string): Market {
  return pathname.startsWith("/pe") ? "pe" : "global";
}

export function resolveTourDisplayPrice(
  tour: Tour,
  currency: DisplayCurrency = "USD"
): { amount: number; currency: DisplayCurrency } {
  if (currency === "PEN") {
    if (typeof tour.precio_pen === "number" && tour.precio_pen > 0) {
      return { amount: tour.precio_pen, currency: "PEN" };
    }
    const rate = getExchangeRatePen();
    return {
      amount: Math.round(getTourBasePriceUsd(tour) * rate),
      currency: "PEN",
    };
  }
  return { amount: getTourBasePriceUsd(tour), currency: "USD" };
}

export function marketPath(path: string, market: Market): string {
  if (market === "pe") {
    if (path === "/") return "/pe/";
    if (path.startsWith("/pe")) return path;
    return `/pe${path.startsWith("/") ? path : `/${path}`}`;
  }
  return path.replace(/^\/pe/, "") || "/";
}
