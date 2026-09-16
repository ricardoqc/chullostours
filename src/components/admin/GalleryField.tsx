"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FolderOpen,
  ImagePlus,
  Plus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import type { TourDraft } from "@/lib/admin/tour-schema";
import { adminApi } from "@/lib/admin/api";
import {
  MediaPickerModal,
  type MediaPickerFile,
} from "@/components/admin/MediaPickerModal";

type GalleryItem = TourDraft["galeria"][number];

type GalleryFieldProps = {
  slug: string;
  items: GalleryItem[];
  mainSrc: string;
  onChange: (items: GalleryItem[]) => void;
  onMainChange: (src: string) => void;
  /** Initial mediateca folder (e.g. tours/{slug}, destinos/{slug}). */
  mediaFolder?: string;
};

function altFromName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/^[a-f0-9]{8}-/i, "");
  const cleaned = base.replace(/[-_]+/g, " ").trim();
  return cleaned || "Foto del tour";
}

function mergeUploadsIntoGallery(
  current: GalleryItem[],
  uploaded: Array<{ src: string; name: string }>,
  pickerIndex: number | null
): GalleryItem[] {
  const existing = new Set(current.map((item) => item.src).filter(Boolean));
  const unique = uploaded.filter((file) => file.src && !existing.has(file.src));
  if (unique.length === 0) return current;

  const next = current.map((item) => ({ ...item }));
  const queue = [...unique];

  if (pickerIndex !== null && pickerIndex < next.length && queue.length > 0) {
    const first = queue.shift()!;
    next[pickerIndex] = {
      ...next[pickerIndex],
      src: first.src,
      alt: next[pickerIndex].alt?.trim() || altFromName(first.name),
    };
  }

  for (let i = 0; i < next.length && queue.length > 0; i += 1) {
    if (!next[i].src?.trim()) {
      const file = queue.shift()!;
      next[i] = {
        ...next[i],
        src: file.src,
        alt: next[i].alt?.trim() || altFromName(file.name),
      };
    }
  }

  for (const file of queue) {
    next.push({ src: file.src, alt: altFromName(file.name) });
  }

  const withSrc = next.filter((item) => Boolean(item.src?.trim()));
  return withSrc.length > 0 ? withSrc : [{ src: "", alt: "" }];
}

export function GalleryField({
  slug,
  items,
  mainSrc,
  onChange,
  onMainChange,
  mediaFolder,
}: GalleryFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [existsMap, setExistsMap] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const directFileRef = useRef<HTMLInputElement>(null);
  const directFolderRef = useRef<HTMLInputElement>(null);

  const defaultFolder = mediaFolder || `tours/${slug}`;

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

  const applyUploadsToGallery = (
    uploaded: Array<{ src: string; name: string }>,
    slotIndex: number | null
  ) => {
    if (uploaded.length === 0) return 0;
    const before = new Set(items.map((item) => item.src).filter(Boolean));
    const next = mergeUploadsIntoGallery(items, uploaded, slotIndex);
    const added = next.filter((item) => item.src && !before.has(item.src)).length;
    onChange(next);
    if (!mainSrc && next[0]?.src) onMainChange(next[0].src);
    return added;
  };

  const openPicker = (index: number | null) => {
    setPickerIndex(index);
    setUploadError("");
    setUploadNote("");
    setPickerOpen(true);
  };

  const setAsMain = (index: number) => {
    const item = items[index];
    if (!item?.src) return;
    onMainChange(item.src);
    if (index !== 0) {
      const next = [...items];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      onChange(next);
    }
    setUploadNote("Portada actualizada. Guarda para verla en la web.");
  };

  const uploadSelected = async (selected: FileList | null, preservePaths: boolean) => {
    if (!selected || selected.length === 0) return;
    const list = Array.from(selected);
    setUploading(true);
    setUploadError("");
    setUploadNote("");
    const uploaded: Array<{ src: string; name: string }> = [];
    let reused = 0;
    try {
      for (const file of list) {
        const body = new FormData();
        body.set("folder", defaultFolder);
        body.set("file", file);
        const relative =
          preservePaths && "webkitRelativePath" in file && file.webkitRelativePath
            ? file.webkitRelativePath
            : "";
        if (relative) body.set("relativePath", relative);
        const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error || "No se pudo subir.");
          continue;
        }
        if (data.reused) reused += 1;
        if (data.file?.src) {
          uploaded.push({ src: data.file.src, name: data.file.name || file.name });
        }
      }
      const added = applyUploadsToGallery(uploaded, null);
      if (uploaded.length > 0) {
        setUploadNote(
          `${added} foto(s) agregada(s)` +
            (reused > 0 ? ` (${reused} reutilizada(s)).` : ".") +
            " Guarda para publicarlas."
        );
      }
    } catch {
      setUploadError("Error de red al subir.");
    } finally {
      setUploading(false);
      if (directFileRef.current) directFileRef.current.value = "";
      if (directFolderRef.current) directFolderRef.current.value = "";
    }
  };

  const onPickerSelect = (files: MediaPickerFile[]) => {
    const added = applyUploadsToGallery(
      files.map((f) => ({ src: f.src, name: f.name })),
      pickerIndex
    );
    setUploadNote(
      added > 0
        ? `${added} foto(s) agregada(s) desde mediateca. Guarda para publicarlas.`
        : "Esas fotos ya estaban en la galería."
    );
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Galería y portada</legend>
      <p className="text-xs text-slate-500">
        Sube fotos o elige varias desde la mediateca (carpetas library / tours / destinos / blog).
        Luego pulsa <strong>Guardar</strong>.
      </p>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Upload className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <p className="text-sm font-bold text-slate-800">Añadir a esta galería</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="admin-ghost-btn" onClick={() => openPicker(null)}>
            <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
            Explorar mediateca
          </button>
          <label
            htmlFor="gallery-direct-files"
            className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            Elegir archivos
          </label>
          <label
            htmlFor="gallery-direct-folder"
            className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Subir carpeta
          </label>
        </div>
        <input
          ref={directFileRef}
          id="gallery-direct-files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,.jpg,.jpeg,.png,.webp,.avif,.gif"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void uploadSelected(event.target.files, false)}
        />
        <input
          ref={directFolderRef}
          id="gallery-direct-folder"
          type="file"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void uploadSelected(event.target.files, true)}
          {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        />
        {uploading ? <p className="text-xs text-slate-500">Subiendo…</p> : null}
        {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
        {uploadNote ? <p className="text-xs text-emerald-700">{uploadNote}</p> : null}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const exists = item.src ? existsMap[item.src] : undefined;
          const isMain = Boolean(item.src) && item.src === mainSrc;
          return (
            <article
              key={`${item.src}-${index}`}
              className={`rounded-2xl border bg-white p-4 grid gap-4 md:grid-cols-[140px_1fr_auto] ${
                isMain ? "border-slate-400 ring-1 ring-slate-300" : "border-slate-200"
              }`}
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {item.src ? (
                  <TourImage
                    src={item.src}
                    alt={item.alt || "Vista previa"}
                    fill
                    className="object-cover"
                    sizes="140px"
                    fallbackIndex={index}
                    unprotected
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-slate-400 text-xs">
                    Sin ruta
                  </div>
                )}
                {isMain ? (
                  <span className="absolute left-2 top-2 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Portada
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3 min-w-0">
                <div className="admin-field">
                  <label htmlFor={`gallery-src-${index}`} className="admin-label">
                    Ruta #{index + 1}
                  </label>
                  <input
                    id={`gallery-src-${index}`}
                    name={`galeria[${index}].src`}
                    type="text"
                    required
                    value={item.src}
                    onChange={(event) => updateItem(index, { src: event.target.value })}
                    className="admin-input font-mono text-xs"
                  />
                  <p
                    className={`text-[11px] mt-1 ${exists === false ? "text-red-600" : "text-slate-500"}`}
                  >
                    {exists === false
                      ? "No se encontró el archivo."
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
                <button
                  type="button"
                  onClick={() => setAsMain(index)}
                  className="admin-ghost-btn"
                  disabled={!item.src || isMain}
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  {isMain ? "Es portada" : "Portada"}
                </button>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  className="admin-ghost-btn"
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  Subir
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  className="admin-ghost-btn"
                  disabled={index === items.length - 1}
                >
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  Bajar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = items.filter((_, i) => i !== index);
                    onChange(next.length > 0 ? next : [{ src: "", alt: "" }]);
                    if (isMain && next[0]?.src) onMainChange(next[0].src);
                  }}
                  className="admin-ghost-btn hover:text-red-600"
                  disabled={items.length <= 1 && !item.src}
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
        onClick={() => onChange([...items, { src: "", alt: "" }])}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar fila vacía
      </button>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple
        title="Elegir imágenes para la galería"
        initialFolder={defaultFolder.split("/")[0] || "library"}
        uploadFolder={defaultFolder}
        onSelect={onPickerSelect}
      />
    </fieldset>
  );
}
