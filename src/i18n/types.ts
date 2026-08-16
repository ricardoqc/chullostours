import { es } from "./locales/es";
import { SupportedLocale } from "./config";

export type TranslationDictionary = typeof es;

export type TranslationPath = 
  | `common.${keyof typeof es.common}`
  | `header.${keyof typeof es.header}`
  | `header.nav.${keyof typeof es.header.nav}`
  | `footer.${keyof typeof es.footer}`
  | `tour.${keyof typeof es.tour}`
  | `home.${keyof typeof es.home}`;

export interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (path: string) => string;
  dictionary: TranslationDictionary;
}
