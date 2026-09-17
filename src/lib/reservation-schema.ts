import { z } from "zod";

export const reservationSubmitSchema = z.object({
  tourTitle: z.string().min(2),
  tourSlug: z.string().min(2),
  travelDate: z.string().min(8),
  selectedHorario: z.string().optional(),
  adults: z.number().int().min(1),
  withChildren: z.boolean().optional(),
  childrenByTarifa: z.record(z.string(), z.number()).optional(),
  selectedHotelOptionId: z.string().optional(),
  selectedExtraIds: z.array(z.string()).optional(),
  currency: z.enum(["USD", "PEN"]).optional(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  dialCode: z.string().optional(),
  dni: z.string().optional(),
  website: z.string().optional(),
  fillCompanions: z.boolean().optional(),
  companions: z
    .array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        passport: z.string().optional(),
        age: z.number().optional(),
      })
    )
    .optional(),
  totalPrice: z.number().optional(),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
  howDidYouFindUs: z.string().optional(),
  includeHuaynaPicchu: z.boolean().optional(),
  flightNumber: z.string().optional(),
  flightDate: z.string().optional(),
  arrivalDate: z.string().optional(),
  hotelOption: z.string().optional(),
  hotelName: z.string().optional(),
  otherCountry: z.string().optional(),
  termsAccepted: z.boolean().optional(),
  /** Timestamp ms cuando el usuario abrió el formulario (antibot). */
  formStartedAt: z.number().optional(),
  /** Token Cloudflare Turnstile (si está configurado). */
  captchaToken: z.string().optional(),
});

export type ReservationSubmitBody = z.infer<typeof reservationSubmitSchema>;
