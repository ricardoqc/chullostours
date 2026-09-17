export interface ReservationCompanion {
  firstName: string;
  lastName: string;
  passport?: string;
  age?: number;
}

export interface ReservationEmailData {
  ticketId: string;
  tourTitle: string;
  tourSlug?: string;
  travelDate: string;
  selectedHorario?: string;
  travelers: number;
  adults?: number;
  childrenCount?: number;
  totalPrice: number;
  isSoles?: boolean;
  currencyLabel?: string;

  fullName: string;
  email: string;
  phone: string;
  country?: string;
  dni?: string;

  hotelOption?: string;
  hotelName?: string;
  extrasLabels?: string[];
  includeHuaynaPicchu?: boolean;

  flightNumber?: string;
  flightDate?: string;
  arrivalDate?: string;
  allergies?: string;
  specialNeeds?: string;
  howDidYouFindUs?: string;
  companions?: ReservationCompanion[];
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
