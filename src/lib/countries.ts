export interface CountryOption {
  code: string;
  name: string;
  dial: string;
  flag?: string;
}

/** Países latinoamericanos, hispanohablantes y opción Otro */
export const LATAM_COUNTRIES: CountryOption[] = [
  { code: "PE", name: "Perú", dial: "+51", flag: "🇵🇪" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "BO", name: "Bolivia", dial: "+591", flag: "🇧🇴" },
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { code: "CU", name: "Cuba", dial: "+53", flag: "🇨🇺" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨" },
  { code: "SV", name: "El Salvador", dial: "+503", flag: "🇸🇻" },
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹" },
  { code: "GQ", name: "Guinea Ecuatorial", dial: "+240", flag: "🇬🇶" },
  { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮" },
  { code: "PA", name: "Panamá", dial: "+507", flag: "🇵🇦" },
  { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
  { code: "DO", name: "República Dominicana", dial: "+1", flag: "🇩🇴" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },
  { code: "OTHER", name: "Otro (fuera de Latinoamérica)", dial: "", flag: "🌎" },
];

export function getCountryByCode(code: string): CountryOption | undefined {
  return LATAM_COUNTRIES.find((c) => c.code === code);
}

export function formatCountryLabel(c: CountryOption): string {
  return `${c.flag ? `${c.flag} ` : ""}${c.name}`;
}
