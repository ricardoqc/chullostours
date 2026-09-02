export interface MetricsConfig {
  yearsExperience: number;
  travelersServed: string;
  tripadvisorRating: number;
  tripadvisorReviewsCount: number;
  activeToursCount: number;
  satisfactionRate: string;
}

export interface TrustBarItem {
  id: string;
  icon: string;
  text: string;
  highlight?: boolean;
}

export interface TrustBarConfig {
  enabled: boolean;
  items: TrustBarItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  logo: string;
  alt: string;
  href: string | null;
  isModal?: boolean;
  modalImage?: string;
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  icon: string;
}

export interface WhatsAppAgent {
  id: string;
  name: string;
  role: string;
  number: string;
  raw: string;
  status: string;
  defaultMessage: string;
}

export interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUsConfig {
  tagline: string;
  title: string;
  description: string;
  teamImage: string;
  items: WhyChooseUsItem[];
}

export interface TravelerProfile {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  image: string;
  href: string;
}

export interface TarifaPersonaConfig {
  id: string;
  label: string;
  rango_edad: string;
  edad_min: number;
  edad_max: number;
  tipo: "free" | "discount" | "fixed";
  descuento_usd: number;
}

export interface PricingConfig {
  monedaBase: "USD";
  exchangeRatePen: number;
  tramosEdadPorDefecto: TarifaPersonaConfig[];
}

export interface SiteConfig {
  metrics: MetricsConfig;
  trustBar: TrustBarConfig;
  certifications: CertificationItem[];
  paymentMethods: PaymentMethodItem[];
  whatsappAgents: WhatsAppAgent[];
  whyChooseUs: WhyChooseUsConfig;
  travelerProfiles: TravelerProfile[];
  pricing?: PricingConfig;
}
