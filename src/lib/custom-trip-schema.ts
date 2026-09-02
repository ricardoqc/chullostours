import { z } from "zod";

export const customTripSubmitSchema = z.object({
  destinations: z
    .array(z.string().min(1))
    .min(1, "Selecciona al menos un destino de interés."),
  fullName: z.string().min(2, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un correo electrónico válido."),
  phone: z.string().min(6, "Ingresa un WhatsApp válido con código de país."),
  travelers: z
    .number()
    .int()
    .min(1, "Indica al menos 1 viajero.")
    .max(60, "Para grupos de más de 60 viajeros escríbenos por WhatsApp."),
  nights: z
    .number()
    .int()
    .min(1, "Indica al menos 1 noche.")
    .max(60, "Indica un número de noches válido."),
  datesFlexible: z.boolean(),
  startDate: z.string().optional(),
  style: z.string().min(2, "Selecciona un estilo de viaje."),
  budget: z.string().min(2, "Selecciona un rango de presupuesto."),
  fitness: z.string().min(2, "Selecciona un nivel de esfuerzo físico."),
  hasFlights: z.enum(["si", "no", "proceso"]),
  notes: z.string().max(2000, "Las notas son demasiado largas.").optional(),
  termsAccepted: z.boolean().optional(),
  website: z.string().optional(),
});

export type CustomTripSubmitBody = z.infer<typeof customTripSubmitSchema>;
