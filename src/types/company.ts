export interface PhoneContact {
  number: string;
  raw: string;
  agent: string;
  whatsappUrl: string;
}

export interface CompanyPhones {
  primary: PhoneContact;
  secondary: PhoneContact;
}

export interface CompanyEmails {
  info: string;
  reservas: string;
  soporte: string;
}

export interface CompanyAddress {
  street: string;
  office: string;
  city: string;
  country: string;
  full: string;
  googleMapsEmbedUrl: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  tripadvisor: string;
}

export interface BusinessHours {
  weekdays: string;
  weekends: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  ruc: string;
  tagline: string;
  description: string;
  phones: CompanyPhones;
  emails: CompanyEmails;
  address: CompanyAddress;
  social: SocialLinks;
  hours: BusinessHours;
  copyright: string;
}
