import { SupportedLocale, DEFAULT_LOCALE } from "./config";
import { es } from "./locales/es";
import { en } from "./locales/en";
import { TranslationDictionary } from "./types";

const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  es,
  en,
};

export function getDictionary(locale: SupportedLocale = DEFAULT_LOCALE): TranslationDictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
