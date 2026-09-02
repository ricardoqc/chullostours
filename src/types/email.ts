export interface ReservationEmailData {
  tourTitle: string;
  travelDate: string;
  selectedHorario?: string;
  travelers: number;
  totalPrice: number;
  isSoles?: boolean;

  // Traveler info
  fullName: string;
  email: string;
  phone: string;
  country?: string;

  // Hotel & Extras
  hotelOption?: string;
  hotelName?: string;
  includeHuaynaPicchu?: boolean;

  // Flight & Logistics
  flightNumber?: string;
  flightDate?: string;
  arrivalDate?: string;
  allergies?: string;
  specialNeeds?: string;
  howDidYouFindUs?: string;
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
