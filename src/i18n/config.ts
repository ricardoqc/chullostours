export type SupportedLocale = 'es' | 'en';

export const DEFAULT_LOCALE: SupportedLocale = 'es';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  shortName: string;
  flag: string;
}

export const LOCALES_INFO: Record<SupportedLocale, LocaleInfo> = {
  es: {
    code: 'es',
    name: 'Español',
    shortName: 'ES',
    flag: '🇪🇸',
  },
  en: {
    code: 'en',
    name: 'English',
    shortName: 'EN',
    flag: '🇺🇸',
  },
};
