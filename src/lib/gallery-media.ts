import fs from "fs";
import path from "path";
import type { Tour, TourImagen } from "@/types/tour";
import { getGalleryItems } from "@/lib/tour-detail-utils";
import { galleryFallbackForIndex } from "@/lib/gallery-fallbacks";
import { publicSrcExists } from "@/lib/admin/media-store";

/**
 * Comprueba assets en /public y también en el volumen MEDIA_ROOT (/media).
 * En Coolify las fotos del CMS viven fuera de public/; no deben caer a Unsplash.
 */
export function publicAssetExists(src: string): boolean {
  if (!src.startsWith("/")) return true;
  if (publicSrcExists(src)) return true;

  const relative = src.replace(/^\//, "").split("?")[0];
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

export function resolveGallerySrc(src: string, index: number): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (publicAssetExists(src)) return src;
  return galleryFallbackForIndex(index);
}

export function resolveGalleryImages(tour: Tour): string[] {
  return getGalleryItems(tour).map((item, index) => resolveGallerySrc(item.src, index));
}

export function resolveGalleryItems(tour: Tour): TourImagen[] {
  return getGalleryItems(tour).map((item, index) => ({
    src: resolveGallerySrc(item.src, index),
    alt: item.alt,
    caption: item.caption,
    credito: item.credito,
  }));
}
