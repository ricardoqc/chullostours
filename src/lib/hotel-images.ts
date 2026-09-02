import localCatalog from "../../data/hotel-images.json";
import unsplashCatalog from "../../data/hotel-images-unsplash.json";
import type { HotelCiudad } from "@/types/tour";

type ImageCatalog = Record<string, string[]>;

const catalogRaw = localCatalog as unknown as ImageCatalog & { _nota?: string };
const { _nota: _catalogNota, ...catalogBuckets } = catalogRaw;
const catalog = catalogBuckets as ImageCatalog;

type UnsplashCatalog = ImageCatalog & { _nota?: string };
const unsplashRaw = unsplashCatalog as unknown as UnsplashCatalog;
const { _nota: _unsplashNota, ...unsplashBuckets } = unsplashRaw;
const unsplash = unsplashBuckets as ImageCatalog;

export type HotelImageSource = "json" | "catalog" | "unsplash";

export interface ResolvedHotelImages {
  images: string[];
  source: HotelImageSource;
  /** true cuando las fotos son referenciales (Unsplash) y deben reemplazarse en JSON */
  isReferential: boolean;
}

function normalizeHotelName(name: string): string {
  return name.trim().toLowerCase();
}

function cityBucket(ciudad: string): string {
  const c = ciudad.toLowerCase();
  if (c.includes("lima")) return "default_lima";
  if (c.includes("aguas calientes") || c.includes("machu picchu pueblo")) {
    return "default_aguas_calientes";
  }
  return "default_cusco";
}

function pickUnsplash(hotel: HotelCiudad): string[] {
  const key = normalizeHotelName(hotel.hotel);
  if (unsplash[key]?.length) return unsplash[key];
  const bucket = cityBucket(hotel.ciudad);
  if (unsplash[bucket]?.length) return unsplash[bucket];
  return unsplash.default_cusco || [];
}

export function resolveHotelImagesWithMeta(hotel: HotelCiudad): ResolvedHotelImages {
  if (hotel.imagenes && hotel.imagenes.length > 0) {
    const referential =
      hotel.imagenes_referenciales === true ||
      hotel.imagenes.some((url) => url.includes("images.unsplash.com"));
    return {
      images: hotel.imagenes,
      source: "json",
      isReferential: referential,
    };
  }

  const key = normalizeHotelName(hotel.hotel);
  if (catalog[key]?.length) {
    return {
      images: catalog[key],
      source: "catalog",
      isReferential: false,
    };
  }

  return {
    images: pickUnsplash(hotel),
    source: "unsplash",
    isReferential: true,
  };
}

/** Compat: solo URLs */
export function resolveHotelImages(hotel: HotelCiudad): string[] {
  return resolveHotelImagesWithMeta(hotel).images;
}

export function hotelHasPhotos(hotel: HotelCiudad): boolean {
  return resolveHotelImages(hotel).length > 0;
}

export function hotelNeedsJsonImages(hotel: HotelCiudad): boolean {
  return !(hotel.imagenes && hotel.imagenes.length > 0);
}
