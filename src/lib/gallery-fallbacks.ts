/** Referenciales hasta subir assets a /public/tours/{slug}/ */
export const GALLERY_UNSPLASH_FALLBACKS = [
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
] as const;

export function galleryFallbackForIndex(index: number): string {
  return GALLERY_UNSPLASH_FALLBACKS[index % GALLERY_UNSPLASH_FALLBACKS.length];
}
