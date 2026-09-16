"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import { adminApi } from "@/lib/admin/api";

type FeaturedImageFieldProps = {
  slug: string;
  src: string;
  alt: string;
  caption: string;
  credito: string;
  onChange: (patch: {
    featured_image?: string;
    featured_image_alt?: string;
    featured_image_caption?: string;
    featured_image_credito?: string;
  }) => void;
};

type MediaFile = { src: string; name: string };

export function FeaturedImageField({
  slug,
  src,
  alt,
  caption,
  credito,
  onChange,
}: FeaturedImageFieldProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const refresh = () => {
    fetch(adminApi("/api/admin/media?reusable=1"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) setFiles(data.files);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    refresh();
  }, [slug]);

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Imagen destacada (portada del post)</legend>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          {src ? (
            <TourImage src={src} alt={alt || "Portada"} fill className="object-cover" sizes="220px" unprotected />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-slate-400">Sin imagen</div>
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
            <button type="button" className="admin-ghost-btn" onClick={() => dialogRef.current?.showModal()}>
              <ImagePlus className="w-4 h-4" aria-hidden="true" />
              Elegir / subir
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

      <dialog ref={dialogRef} className="admin-dialog rounded-2xl p-0 w-[min(720px,calc(100vw-2rem))] backdrop:bg-black/40">
        <form method="dialog" className="p-5 space-y-4">
          <h3 className="text-lg font-black font-title text-slate-900">Mediateca</h3>
          <input
            type="file"
            accept="image/*"
            className="admin-input"
            disabled={uploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setUploading(true);
              setError("");
              try {
                const body = new FormData();
                body.set("folder", `blog/${slug}`);
                body.set("file", file);
                const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error || "Error al subir.");
                  return;
                }
                onChange({
                  featured_image: data.file.src,
                  featured_image_alt: alt || file.name,
                });
                refresh();
                dialogRef.current?.close();
              } catch {
                setError("Error de red.");
              } finally {
                setUploading(false);
              }
            }}
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-auto">
            {files.map((file) => (
              <li key={file.src}>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 overflow-hidden hover:border-[#6b0014] text-left"
                  onClick={() => {
                    onChange({ featured_image: file.src, featured_image_alt: alt || file.name });
                    dialogRef.current?.close();
                  }}
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <TourImage src={file.src} alt={file.name} fill className="object-cover" sizes="160px" unprotected />
                  </div>
                  <span className="block p-2 text-[10px] font-mono truncate">{file.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="submit" className="admin-ghost-btn">
            Cerrar
          </button>
        </form>
      </dialog>
    </fieldset>
  );
}
