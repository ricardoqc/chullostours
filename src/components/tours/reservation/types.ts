import { Tour, HotelOpcion, DescuentosInfo, TourExtra, TarifaPersona } from "@/types/tour";
import type { DisplayCurrency } from "@/lib/pricing";

export interface CompanionEntry {
  firstName: string;
  lastName: string;
  passport?: string;
  age?: number;
  tarifaId?: string;
}

export interface ReservationFormData {
  tourTitle: string;
  tourSlug: string;
  travelDate: string;
  selectedHorario: string;
  adults: number;
  withChildren: boolean;
  childrenByTarifa: Record<string, number>;
  childAges: Record<string, number[]>;
  selectedExtraIds: string[];
  includeHuaynaPicchu: boolean;
  includeHotel: boolean;
  selectedHotelOptionId?: string;
  currency: DisplayCurrency;

  fullName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  dialCode: string;
  otherCountry: string;
  dni: string;
  website: string; // honeypot

  fillCompanions: boolean;
  companions: CompanionEntry[];

  arrivalDate: string;
  noFlightYet: boolean;
  flightDate: string;
  flightNumber: string;
  noHotelYet: boolean;
  hotelName: string;
  allergies: string;
  specialNeeds: string;
  howDidYouFindUs: string;
  termsAccepted: boolean;

  totalPrice: number;
}

export interface ReservationInitialSelection {
  travelDate?: string;
  selectedHorario?: string;
  adults?: number;
  withChildren?: boolean;
  childrenByTarifa?: Record<string, number>;
  selectedHotelId?: string;
  selectedExtraIds?: string[];
  currency?: DisplayCurrency;
}

export interface StepComponentProps {
  formData: ReservationFormData;
  updateFormData: (updates: Partial<ReservationFormData>) => void;
  errors: Record<string, string>;
}

export interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour;
  initialSelection?: ReservationInitialSelection;
  /** @deprecated legacy */
  tourTitle?: string;
  basePrice?: number;
  duration?: string;
  horarios?: string[];
  puntoInicio?: string;
  categoria?: string;
  slug?: string;
  opcionesHotel?: HotelOpcion[];
  descuentos?: DescuentosInfo;
  extras?: TourExtra[];
  tarifasPersonas?: TarifaPersona[];
}

export const COUNTRIES = [
  "Perú",
  "Estados Unidos",
  "España",
  "Argentina",
  "Brasil",
  "Chile",
  "Colombia",
  "Ecuador",
  "México",
  "Alemania",
  "Francia",
  "Italia",
  "Reino Unido",
  "Australia",
  "Canadá",
  "Japón",
  "China",
  "Otro",
];

export const SOURCES = [
  "Instagram",
  "Facebook",
  "Google",
  "TripAdvisor",
  "YouTube",
  "Recomendación de amigo/familiar",
  "Agencia de viajes",
  "Blog / Artículo",
  "TikTok",
  "Otro",
];
