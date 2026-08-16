"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLocale, DEFAULT_LOCALE } from "./config";
import { es } from "./locales/es";
import { en } from "./locales/en";
import { I18nContextType, TranslationDictionary } from "./types";

const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  es,
  en,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem("chullos_locale") as SupportedLocale;
    if (saved && (saved === "es" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("chullos_locale", newLocale);
  };

  const dictionary = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

  const t = (path: string): string => {
    const keys = path.split(".");
    let result: any = dictionary;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        // Fallback to Spanish if key missing
        let fallbackResult: any = dictionaries[DEFAULT_LOCALE];
        for (const fk of keys) {
          if (fallbackResult && typeof fallbackResult === "object" && fk in fallbackResult) {
            fallbackResult = fallbackResult[fk];
          } else {
            return path; // Return path string as last resort
          }
        }
        return typeof fallbackResult === "string" ? fallbackResult : path;
      }
    }

    return typeof result === "string" ? result : path;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dictionary }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // Return a safe fallback if used outside Provider
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (path: string) => path,
      dictionary: es,
    };
  }
  return context;
};
