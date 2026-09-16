"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

type FeaturedImageFieldProps = {
  slug: string;
  src: string;
  alt: string;
  caption: string;
  credito: string;
  /** Upload folder under /media (default blog/{slug}). */
  mediaFolder?: string;
  legend?: string;
  onChange: (patch: {
    featured_image?: string;
    featured_image_alt?: string;
    featured_image_caption?: string;
    featured_image_credito?: string;
  }) => void;
};

export function FeaturedImageField({
  slug,
  src,
  alt,
  caption,
  credito,
  mediaFolder,
  legend = "Imagen destacada (portada)",
  onChange,
}: FeaturedImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const folder = mediaFolder || `blog/${slug}`;

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">{legend}</legend>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          {src ? (
            <TourImage
              src={src}
              alt={alt || "Portada"}
              fill
              className="object-cover"
              sizes="220px"
              unprotected
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-slate-400">
              Sin imagen
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="admin-field">
            <label htmlFor="featured_image" className="admin-label">
              Ruta
            </label>
            <input
              id="featured_image"
              className="admin-input font-mono text-xs"
              value={src}
              onChange={(event) => onChange({ featured_image: event.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={() => setPickerOpen(true)}
            >
              <ImagePlus className="w-4 h-4" aria-hidden="true" />
              Explorar mediateca
            </button>
          </div>
          <div className="admin-field">
            <label htmlFor="featured_image_alt" className="admin-label">
              ALT
            </label>
            <input
              id="featured_image_alt"
              className="admin-input"
              value={alt}
              onChange={(event) => onChange({ featured_image_alt: event.target.value })}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="featured_image_caption" className="admin-label">
              Pie de foto
            </label>
            <input
              id="featured_image_caption"
              className="admin-input"
              value={caption}
              onChange={(event) => onChange({ featured_image_caption: event.target.value })}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="featured_image_credito" className="admin-label">
              Crédito
            </label>
            <input
              id="featured_image_credito"
              className="admin-input"
              value={credito}
              onChange={(event) => onChange({ featured_image_credito: event.target.value })}
            />
          </div>
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple={false}
        title="Elegir imagen de portada"
        initialFolder={folder.split("/")[0] || "library"}
        uploadFolder={folder}
        onSelect={(files) => {
          const file = files[0];
          if (!file) return;
          onChange({
            featured_image: file.src,
            featured_image_alt: alt || file.name,
          });
        }}
      />
    </fieldset>
  );
}
