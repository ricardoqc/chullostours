import siteConfigData from "../../data/site-config.json";
import type {
  SiteConfig,
  MetricsConfig,
  TrustBarConfig,
  CertificationItem,
  PaymentMethodItem,
  WhatsAppAgent,
  WhyChooseUsConfig,
  TravelerProfile,
  PricingConfig,
} from "@/types/site-config";

export const siteConfig: SiteConfig = siteConfigData as SiteConfig;

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function getMetrics(): MetricsConfig {
  return siteConfig.metrics;
}

export function getTrustBarConfig(): TrustBarConfig {
  return siteConfig.trustBar;
}

export function getCertifications(): CertificationItem[] {
  return siteConfig.certifications;
}

export function getPaymentMethods(): PaymentMethodItem[] {
  return siteConfig.paymentMethods;
}

export function getWhatsappAgents(): WhatsAppAgent[] {
  return siteConfig.whatsappAgents;
}

export function getWhyChooseUs(): WhyChooseUsConfig {
  return siteConfig.whyChooseUs;
}

export function getTravelerProfiles(): TravelerProfile[] {
  return siteConfig.travelerProfiles;
}

export function getPricingConfig(): PricingConfig | undefined {
  return siteConfig.pricing;
}

export function buildAgentWhatsappUrl(agentRawPhone: string, message?: string): string {
  if (!message) {
    return `https://wa.me/${agentRawPhone}`;
  }
  return `https://wa.me/${agentRawPhone}?text=${encodeURIComponent(message)}`;
}
