"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import type { Market } from "@/lib/market";
import { getMarketFromPath } from "@/lib/market";
import type { DisplayCurrency } from "@/lib/pricing";
import { getExchangeRateClient } from "@/lib/geo-currency";

const COUNTRY_KEY = "chullos_geo_country";
const CURRENCY_KEY = "chullos_currency";

interface MarketContextValue {
  market: Market;
  currency: DisplayCurrency;
  isPeru: boolean;
  ready: boolean;
  exchangeRate: number;
  setDisplayCurrency: (next: DisplayCurrency) => void;
  toggleCurrency: () => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);

function guessCountryFallback(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Lima") || tz.includes("Peru")) return "PE";
    const lang = (navigator.language || "").toLowerCase();
    if (lang.includes("-pe") || lang === "es-pe") return "PE";
  } catch {
    /* ignore */
  }
  return "XX";
}

async function detectCountry(): Promise<string> {
  if (typeof window === "undefined") return "XX";
  const cached = sessionStorage.getItem(COUNTRY_KEY);
  if (cached) return cached;

  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = (await res.json()) as { country_code?: string };
      const code = (data.country_code || "XX").toUpperCase();
      sessionStorage.setItem(COUNTRY_KEY, code);
      return code;
    }
  } catch {
    /* fallback */
  }

  const fallback = guessCountryFallback();
  sessionStorage.setItem(COUNTRY_KEY, fallback);
  return fallback;
}

export function MarketProvider({
  children,
  initialMarket,
}: {
  children: React.ReactNode;
  initialMarket?: Market;
}) {
  const pathname = usePathname() || "/";
  const market = initialMarket ?? getMarketFromPath(pathname);

  const [country, setCountry] = useState("XX");
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");
  const [ready, setReady] = useState(false);

  const isPeru = country === "PE";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = await detectCountry();
      if (cancelled) return;
      setCountry(code);

      const saved = sessionStorage.getItem(CURRENCY_KEY) as DisplayCurrency | null;
      if (code === "PE" && saved === "PEN") {
        setCurrency("PEN");
      } else {
        setCurrency("USD");
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setDisplayCurrency = useCallback(
    (next: DisplayCurrency) => {
      if (!isPeru && next === "PEN") return;
      setCurrency(next);
      sessionStorage.setItem(CURRENCY_KEY, next);
    },
    [isPeru]
  );

  const toggleCurrency = useCallback(() => {
    if (!isPeru) return;
    setDisplayCurrency(currency === "USD" ? "PEN" : "USD");
  }, [currency, isPeru, setDisplayCurrency]);

  const value = useMemo<MarketContextValue>(
    () => ({
      market,
      currency,
      isPeru,
      ready,
      exchangeRate: getExchangeRateClient(),
      setDisplayCurrency,
      toggleCurrency,
    }),
    [market, currency, isPeru, ready, setDisplayCurrency, toggleCurrency]
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): Market {
  const ctx = useContext(MarketContext);
  return ctx?.market ?? "global";
}

export function useDisplayCurrency(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    return {
      market: "global",
      currency: "USD",
      isPeru: false,
      ready: false,
      exchangeRate: getExchangeRateClient(),
      setDisplayCurrency: () => {},
      toggleCurrency: () => {},
    };
  }
  return ctx;
}
