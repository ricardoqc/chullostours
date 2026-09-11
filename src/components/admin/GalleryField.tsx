"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import type { TourDraft } from "@/lib/admin/tour-schema";
import { adminApi } from "@/lib/admin/api";

type GalleryItem = TourDraft["galeria"][number];

type GalleryFieldProps = {
  slug: string;
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
};

type MediaFile = { src: string; name: string };

export function GalleryField({ slug, items, onChange }: GalleryFieldProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [existsMap, setExistsMap] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const refreshFiles = () => {
    fetch(adminApi(`/api/admin/media?slug=${encodeURIComponent(slug)}`))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) setFiles(data.files);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    refreshFiles();
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    const unique = [...new Set(items.map((item) => item.src).filter(Boolean))];
    Promise.all(
      unique.map(async (src) => {
        const res = await fetch(adminApi(`/api/admin/media?src=${encodeURIComponent(src)}`));
        const data = await res.json();
        return [src, Boolean(data.exists)] as const;
      })
    )
      .then((entries) => {
        if (!cancelled) setExistsMap(Object.fromEntries(entries));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [items]);

  const updateItem = (index: number, patch: Partial<GalleryItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [current] = next.splice(index, 1);
    next.splice(nextIndex, 0, current);
    onChange(next);
  };

  const openPicker = (index: number) => {
    setPickerIndex(index);
    dialogRef.current?.showModal();
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Galería y rutas de imagen</legend>
      <p className="text-xs text-slate-500">
        La primera imagen es la portada (cards, hero y Open Graph). Sube archivos al volumen
        <code className="mx-1">/media/tours/{slug}/</code>
        o pega una ruta local / URL https.
      </p>

      <div className="space-y-4">
        {items.map((item, index) => {
          const exists = item.src ? existsMap[item.src] : undefined;
          return (
            <article key={`${item.src}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-4 md:grid-cols-[140px_1fr_auto]">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {item.src ? (
                  <TourImage src={item.src} alt={item.alt || "Vista previa"} fill className="object-cover" sizes="140px" fallbackIndex={index} />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-slate-400 text-xs">Sin ruta</div>
                )}
              </div>

              <div className="grid gap-3 min-w-0">
                <div className="admin-field">
                  <label htmlFor={`gallery-src-${index}`} className="admin-label">
                    Ruta {index === 0 ? "(portada)" : `#${index + 1}`}
                  </label>
                  <input
                    id={`gallery-src-${index}`}
                    name={`galeria[${index}].src`}
                    type="text"
                    required
                    value={item.src}
                    onChange={(event) => updateItem(index, { src: event.target.value })}
                    className="admin-input font-mono text-xs"
                    aria-describedby={`gallery-src-status-${index}`}
                  />
                  <p id={`gallery-src-status-${index}`} className={`text-[11px] mt-1 ${exists === false ? "text-red-600" : "text-slate-500"}`}>
                    {exists === false
                      ? "No se encontró el archivo en /public. Revisa la ruta."
                      : exists
                        ? "Archivo encontrado o URL externa."
                        : "Comprobando ruta…"}
                  </p>
                </div>
                <div className="admin-field">
                  <label htmlFor={`gallery-alt-${index}`} className="admin-label">
                    Texto alternativo
                  </label>
                  <input
                    id={`gallery-alt-${index}`}
                    name={`galeria[${index}].alt`}
                    type="text"
                    required
                    value={item.alt}
                    onChange={(event) => updateItem(index, { alt: event.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor={`gallery-caption-${index}`} className="admin-label">
                    Pie de foto (opcional)
                  </label>
                  <input
                    id={`gallery-caption-${index}`}
                    name={`galeria[${index}].caption`}
                    type="text"
                    value={item.caption || ""}
                    onChange={(event) => updateItem(index, { caption: event.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-end">
                <button type="button" onClick={() => openPicker(index)} className="admin-ghost-btn">
                  <ImagePlus className="w-4 h-4" aria-hidden="true" />
                  Elegir
                </button>
                <button type="button" onClick={() => move(index, -1)} className="admin-ghost-btn" disabled={index === 0}>
                  <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  Subir
                </button>
                <button type="button" onClick={() => move(index, 1)} className="admin-ghost-btn" disabled={index === items.length - 1}>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  Bajar
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  className="admin-ghost-btn hover:text-red-600"
                  disabled={items.length <= 1}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Quitar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange([...items, { src: `/media/tours/${slug}/`, alt: "" }])}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar imagen
      </button>

      <dialog ref={dialogRef} className="admin-dialog rounded-2xl p-0 w-[min(640px,calc(100vw-2rem))] backdrop:bg-black/40">
        <form method="dialog" className="p-5 space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-title">Archivos del volumen</h3>
          <div className="grid gap-2">
            <label htmlFor="gallery-upload" className="admin-label">
              Subir a /media/tours/{slug}/
            </label>
            <input
              id="gallery-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif,.jpg,.jpeg,.png,.webp,.avif,.gif"
              className="admin-input"
              disabled={uploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                setUploading(true);
                setUploadError("");
                try {
                  const body = new FormData();
                  body.set("folder", `tours/${slug}`);
                  body.set("file", file);
                  const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
                  const data = await res.json();
                  if (!res.ok) {
                    setUploadError(data.error || "No se pudo subir.");
                    return;
                  }
                  refreshFiles();
                  if (pickerIndex !== null) updateItem(pickerIndex, { src: data.file.src });
                } catch {
                  setUploadError("Error de red al subir.");
                } finally {
                  setUploading(false);
                }
              }}
            />
            {uploading ? <p className="text-xs text-slate-500">Subiendo…</p> : null}
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </div>
          {files.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no hay archivos en <code>/media/tours/{slug}</code>. Súbelos aquí o escribe la ruta a mano.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-auto">
              {files.map((file) => (
                <li key={file.src}>
                  <button
                    type="button"
                    onClick={() => {
                      if (pickerIndex !== null) updateItem(pickerIndex, { src: file.src });
                      dialogRef.current?.close();
                    }}
                    className="w-full text-left rounded-xl border border-slate-200 overflow-hidden hover:border-[#6b0014]"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <TourImage src={file.src} alt={file.name} fill className="object-cover" sizes="180px" />
                    </div>
                    <span className="block p-2 text-[11px] font-mono text-slate-600 truncate">{file.src}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="submit" className="admin-ghost-btn">
            Cerrar
          </button>
        </form>
      </dialog>
    </fieldset>
  );
}
