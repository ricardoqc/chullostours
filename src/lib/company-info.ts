import companyData from "../../data/company-info.json";
import type { CompanyInfo } from "@/types/company";

export const companyInfo: CompanyInfo = companyData as CompanyInfo;

export function getCompanyInfo(): CompanyInfo {
  return companyInfo;
}

/**
 * Builds a dynamic WhatsApp URL for the primary phone number with an optional custom pre-filled message.
 */
export function getPrimaryWhatsappUrl(customMessage?: string): string {
  if (!customMessage) {
    return companyInfo.phones.primary.whatsappUrl;
  }
  return `https://wa.me/${companyInfo.phones.primary.raw}?text=${encodeURIComponent(customMessage)}`;
}

/**
 * Builds a dynamic WhatsApp URL for the secondary phone number with an optional custom pre-filled message.
 */
export function getSecondaryWhatsappUrl(customMessage?: string): string {
  if (!customMessage) {
    return companyInfo.phones.secondary.whatsappUrl;
  }
  return `https://wa.me/${companyInfo.phones.secondary.raw}?text=${encodeURIComponent(customMessage)}`;
}
