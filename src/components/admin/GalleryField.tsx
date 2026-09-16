"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
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

type GalleryItem = TourDraft["galeria"][number];

type GalleryFieldProps = {
  slug: string;
  items: GalleryItem[];
  mainSrc: string;
  onChange: (items: GalleryItem[]) => void;
  onMainChange: (src: string) => void;
};

type MediaFile = { src: string; name: string; folder?: string; usedBy?: string[]; kind?: string };
type MediaFolder = { name: string; folder: string };

function altFromName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/^[a-f0-9]{8}-/i, "");
  const cleaned = base.replace(/[-_]+/g, " ").trim();
  return cleaned || "Foto del tour";
}

/** Inserta fotos subidas/elegidas en la galería del tour (rellena huecos y agrega el resto). */
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

export function GalleryField({ slug, items, mainSrc, onChange, onMainChange }: GalleryFieldProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [browseFolder, setBrowseFolder] = useState("library");
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [allReusable, setAllReusable] = useState<MediaFile[]>([]);
  const [mode, setMode] = useState<"browse" | "all">("browse");
  const [query, setQuery] = useState("");
  const [existsMap, setExistsMap] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const directFileRef = useRef<HTMLInputElement>(null);
  const directFolderRef = useRef<HTMLInputElement>(null);

  const loadBrowse = (nextFolder: string) => {
    fetch(adminApi(`/api/admin/media?folder=${encodeURIComponent(nextFolder)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFolders(data.folders || []);
          setFiles((data.files || []).filter((file: MediaFile) => file.kind !== "video"));
          setBrowseFolder(nextFolder);
        }
      })
      .catch(() => undefined);
  };

  const refreshReusable = () => {
    fetch(adminApi("/api/admin/media?reusable=1"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) setAllReusable(data.files);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    loadBrowse("library");
    refreshReusable();
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

  const visibleFiles = useMemo(() => {
    const source = mode === "all" ? allReusable : files;
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (file) =>
        file.name.toLowerCase().includes(q) ||
        file.src.toLowerCase().includes(q) ||
        (file.folder || "").toLowerCase().includes(q)
    );
  }, [mode, allReusable, files, query]);

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
    slotIndex: number | null,
    options?: { closeDialog?: boolean }
  ) => {
    if (uploaded.length === 0) return 0;
    const before = new Set(items.map((item) => item.src).filter(Boolean));
    const next = mergeUploadsIntoGallery(items, uploaded, slotIndex);
    const added = next.filter((item) => item.src && !before.has(item.src)).length;
    onChange(next);
    if (!mainSrc && next[0]?.src) onMainChange(next[0].src);
    if (options?.closeDialog) dialogRef.current?.close();
    return added;
  };

  const openPicker = (index: number) => {
    setPickerIndex(index);
    setUploadError("");
    setUploadNote("");
    setQuery("");
    setMode("browse");
    loadBrowse(browseFolder || "library");
    refreshReusable();
    dialogRef.current?.showModal();
  };

  const applySrc = (src: string, name = "") => {
    if (pickerIndex === null) {
      applyUploadsToGallery([{ src, name: name || src.split("/").pop() || "foto" }], null);
      return;
    }
    updateItem(pickerIndex, {
      src,
      alt: items[pickerIndex]?.alt?.trim() || altFromName(name || src.split("/").pop() || "foto"),
    });
    if (!mainSrc || items.length === 0) onMainChange(src);
    dialogRef.current?.close();
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
    setUploadNote("Portada actualizada. Guarda el tour para verla en la web.");
  };

  const uploadSelected = async (
    selected: FileList | null,
    preservePaths: boolean,
    options?: { slotIndex?: number | null; fromDialog?: boolean }
  ) => {
    if (!selected || selected.length === 0) return;
    const list = Array.from(selected);
    const slotIndex = options?.slotIndex !== undefined ? options.slotIndex : pickerIndex;
    setUploading(true);
    setUploadError("");
    setUploadNote("");
    const uploaded: Array<{ src: string; name: string }> = [];
    let reused = 0;
    try {
      for (const file of list) {
        const body = new FormData();
        body.set("folder", browseFolder || "library");
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

      loadBrowse(browseFolder || "library");
      refreshReusable();
      setMode("all");

      const added = applyUploadsToGallery(uploaded, slotIndex ?? null, {
        closeDialog: Boolean(options?.fromDialog) && uploaded.length > 0,
      });

      if (uploaded.length > 0) {
        setUploadNote(
          `${added} foto(s) agregada(s) a la galería del tour` +
            (reused > 0 ? ` (${reused} reutilizada(s) sin duplicar en disco).` : ".") +
            " Guarda el tour para publicarlas."
        );
      } else if (!uploadError) {
        setUploadError("No se pudo obtener la ruta de ninguna imagen.");
      }
    } catch {
      setUploadError("Error de red al subir.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
      if (directFileRef.current) directFileRef.current.value = "";
      if (directFolderRef.current) directFolderRef.current.value = "";
    }
  };

  const addVisibleToGallery = () => {
    const batch = visibleFiles.map((file) => ({ src: file.src, name: file.name }));
    const added = applyUploadsToGallery(batch, pickerIndex);
    setUploadNote(
      added > 0
        ? `${added} foto(s) agregada(s) a la galería. Guarda el tour para publicarlas.`
        : "Esas fotos ya estaban en la galería."
    );
  };

  const crumbs = browseFolder.split("/").filter(Boolean);

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Galería y portada</legend>
      <p className="text-xs text-slate-500">
        Sube fotos o carpetas y se añaden solas a la galería de este tour. Luego pulsa{" "}
        <strong>Guardar</strong> para publicarlas en la web.
      </p>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Upload className="w-4 h-4 text-[#6b0014]" aria-hidden="true" />
          <p className="text-sm font-bold text-slate-800">Subir e incluir en esta galería</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          onChange={(event) => void uploadSelected(event.target.files, false, { slotIndex: null })}
        />
        <input
          ref={directFolderRef}
          id="gallery-direct-folder"
          type="file"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void uploadSelected(event.target.files, true, { slotIndex: null })}
          {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        />
        {uploading ? <p className="text-xs text-slate-500">Subiendo e incluyendo en la galería…</p> : null}
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
                isMain ? "border-[#6b0014]/40 ring-1 ring-[#6b0014]/20" : "border-slate-200"
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
                  <div className="absolute inset-0 grid place-items-center text-slate-400 text-xs">Sin ruta</div>
                )}
                {isMain ? (
                  <span className="absolute left-2 top-2 rounded-md bg-[#6b0014] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
                    aria-describedby={`gallery-src-status-${index}`}
                  />
                  <p
                    id={`gallery-src-status-${index}`}
                    className={`text-[11px] mt-1 ${exists === false ? "text-red-600" : "text-slate-500"}`}
                  >
                    {exists === false
                      ? "No se encontró el archivo. Revisa la ruta o vuelve a subirla."
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
                  Elegir / reusar
                </button>
                <button
                  type="button"
                  onClick={() => setAsMain(index)}
                  className="admin-ghost-btn"
                  disabled={!item.src || isMain}
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  {isMain ? "Es portada" : "Usar como portada"}
                </button>
                <button type="button" onClick={() => move(index, -1)} className="admin-ghost-btn" disabled={index === 0}>
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar fila vacía
      </button>

      <dialog ref={dialogRef} className="admin-dialog rounded-2xl p-0 w-[min(780px,calc(100vw-2rem))] backdrop:bg-black/40">
        <form method="dialog" className="p-5 space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-title">Mediateca compartida</h3>
          <p className="text-xs text-slate-500">
            Al subir, las fotos se agregan a la galería de este tour. También puedes elegir fotos ya existentes.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`admin-ghost-btn ${mode === "browse" ? "border-[#6b0014] text-[#6b0014]" : ""}`}
              onClick={() => setMode("browse")}
            >
              Por carpetas
            </button>
            <button
              type="button"
              className={`admin-ghost-btn ${mode === "all" ? "border-[#6b0014] text-[#6b0014]" : ""}`}
              onClick={() => {
                setMode("all");
                refreshReusable();
              }}
            >
              Todas las fotos
            </button>
            <button type="button" className="admin-ghost-btn" onClick={addVisibleToGallery} disabled={visibleFiles.length === 0}>
              Añadir visibles a la galería
            </button>
          </div>

          {mode === "browse" ? (
            <nav aria-label="Carpeta actual" className="flex flex-wrap items-center gap-1 text-[11px] font-mono text-slate-500">
              {crumbs.map((part, index) => {
                const next = crumbs.slice(0, index + 1).join("/");
                return (
                  <span key={next} className="inline-flex items-center gap-1">
                    {index > 0 ? <ChevronRight className="w-3 h-3" aria-hidden="true" /> : null}
                    <button type="button" className="hover:text-[#6b0014]" onClick={() => loadBrowse(next)}>
                      {part}
                    </button>
                  </span>
                );
              })}
            </nav>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="gallery-upload" className="admin-label">
                Subir archivos
              </label>
              <input
                ref={fileInputRef}
                id="gallery-upload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,.jpg,.jpeg,.png,.webp,.avif,.gif"
                className="admin-input"
                disabled={uploading}
                onChange={(event) =>
                  void uploadSelected(event.target.files, false, { fromDialog: true, slotIndex: pickerIndex })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="gallery-upload-folder" className="admin-label">
                Subir carpeta
              </label>
              <input
                ref={folderInputRef}
                id="gallery-upload-folder"
                type="file"
                multiple
                className="admin-input"
                disabled={uploading}
                onChange={(event) =>
                  void uploadSelected(event.target.files, true, { fromDialog: true, slotIndex: pickerIndex })
                }
                {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
              />
            </div>
          </div>
          {uploading ? <p className="text-xs text-slate-500">Subiendo…</p> : null}
          {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          {uploadNote ? <p className="text-xs text-emerald-700">{uploadNote}</p> : null}

          <div className="admin-field">
            <label htmlFor="gallery-search" className="admin-label">
              Buscar
            </label>
            <input
              id="gallery-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre, ruta o carpeta…"
              className="admin-input"
            />
          </div>

          {mode === "browse" && folders.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {folders.map((item) => (
                <li key={item.folder}>
                  <button
                    type="button"
                    onClick={() => loadBrowse(item.folder)}
                    className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:border-[#6b0014]"
                  >
                    <FolderOpen className="w-4 h-4 text-[#6b0014]" aria-hidden="true" />
                    <span className="block mt-1 text-xs font-bold text-slate-800 truncate">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {visibleFiles.length === 0 ? (
            <p className="text-sm text-slate-500">No hay imágenes aquí. Sube archivos/carpeta o navega a otra carpeta.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-auto">
              {visibleFiles.map((file) => (
                <li key={file.src}>
                  <button
                    type="button"
                    onClick={() => applySrc(file.src, file.name)}
                    className="w-full text-left rounded-xl border border-slate-200 overflow-hidden hover:border-[#6b0014]"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <TourImage src={file.src} alt={file.name} fill className="object-cover" sizes="180px" unprotected />
                    </div>
                    <span className="block px-2 pt-2 text-[11px] font-mono text-slate-600 truncate">{file.name}</span>
                    <span className="block px-2 pb-2 text-[10px] text-slate-400 truncate">
                      {file.folder || "library"}
                      {file.usedBy && file.usedBy.length > 0 ? ` · ${file.usedBy.length} uso(s)` : ""}
                    </span>
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
