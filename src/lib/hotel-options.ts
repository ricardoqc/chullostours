import { HotelOpcion } from "@/types/tour";

/** Whether the hotel tier includes lodging nights in the package. */
export function hotelOpcionIncludesLodging(opcion: HotelOpcion): boolean {
  if (opcion.incluye_alojamiento === false) return false;
  if (opcion.incluye_alojamiento === true) return true;
  return (opcion.hoteles?.length ?? 0) > 0;
}

/** Human-readable label for reservation review / emails. */
export function formatHotelOptionSummary(opcion: HotelOpcion): string {
  if (!hotelOpcionIncludesLodging(opcion)) {
    return `${opcion.nombre} (sin estadía incluida)`;
  }
  const hotels = opcion.hoteles
    ?.map((h) => `${h.ciudad}: ${h.hotel}`)
    .join(", ");
  return hotels ? `${opcion.nombre} (${hotels})` : opcion.nombre;
}
