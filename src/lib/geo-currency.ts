"use client";

import { useCallback, useEffect, useState } from "react";
import { companyInfo } from "@/lib/company-info";
import type { DisplayCurrency } from "@/lib/pricing";

const COUNTRY_KEY = "chullos_geo_country";
const CURRENCY_KEY = "chullos_currency";

export function getExchangeRateClient(): number {
  return companyInfo.exchangeRatePen || 3.75;
}

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
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
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

export function useGeoCurrency() {
  const [country, setCountry] = useState<string>("XX");
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

  return {
    country,
    isPeru,
    currency,
    setDisplayCurrency,
    toggleCurrency,
    ready,
    exchangeRate: getExchangeRateClient(),
  };
}
