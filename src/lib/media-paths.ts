/**
 * Rutas públicas consistentes para assets en /public.
 * Ver data/media-structure.json y public/MEDIA-ESTRUCTURA.txt
 */

export function tourImagePath(slug: string, file = "01.jpg"): string {
  return `/media/tours/${slug}/${file}`;
}

export function tourOgImagePath(slug: string, file = "og/og.jpg"): string {
  return `/media/tours/${slug}/${file}`;
}

export function tourGalleryPath(slug: string, index: number, ext = "jpg"): string {
  const num = String(index).padStart(2, "0");
  return `/media/tours/${slug}/${num}.${ext}`;
}

export function hotelImagePath(hotelSlug: string, file = "01-fachada.jpg"): string {
  return `/hoteles/${hotelSlug}/${file}`;
}

export function hotelImageSet(
  hotelSlug: string,
  files = ["01-fachada.jpg", "02-habitacion.jpg"]
): string[] {
  return files.map((f) => hotelImagePath(hotelSlug, f));
}

export function destinoImagePath(placeId: string, file = "hero.jpg"): string {
  return `/media/destinos/${placeId}/${file}`;
}

export function blogImagePath(slug: string, file = "hero.jpg"): string {
  return `/media/blog/${slug}/${file}`;
}

export function homeMediaPath(file: string): string {
  return `/media/home/${file}`;
}

export function siteMediaPath(file: string): string {
  return `/media/site/${file}`;
}

export function brandImagePath(file: string): string {
  return `/img/brand/${file}`;
}

export function marketingImagePath(file: string): string {
  return `/img/marketing/${file}`;
}

export function placeholderImagePath(file = "placeholder.jpg"): string {
  return `/img/placeholders/${file}`;
}

/** Mapeo nombre de hotel (JSON) → slug de carpeta en public/hoteles/ */
export const HOTEL_FOLDER_SLUGS: Record<string, string> = {
  "auri boutique hotel": "auri-boutique-hotel",
  "machupicchu inn": "machupicchu-inn",
  "hotel intiwatana": "hotel-intiwatana",
  "hotel intiwatana aguas calientes": "hotel-intiwatana-aguas-calientes",
  "hotel rojas inn": "hotel-rojas-inn",
  "rojas inn aguas calientes": "rojas-inn-aguas-calientes",
  "hotel aury": "hotel-aury",
  "hotel panaka": "hotel-panaka",
  "hotel san pedro plaza": "hotel-san-pedro-plaza",
  "hotel intiwatana lima": "hotel-intiwatana-lima",
  "hotel intiwatana cusco": "hotel-intiwatana-cusco",
  "hotel rojas inn lima": "hotel-rojas-inn-lima",
  "hotel rojas inn cusco": "hotel-rojas-inn-cusco",
};

export function hotelSlugFromName(hotelName: string): string | undefined {
  return HOTEL_FOLDER_SLUGS[hotelName.trim().toLowerCase()];
}

export function defaultHotelImages(hotelName: string): string[] {
  const slug = hotelSlugFromName(hotelName);
  if (!slug) return [];
  return hotelImageSet(slug);
}
