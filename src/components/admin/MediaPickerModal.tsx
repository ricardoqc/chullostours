"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  FolderOpen,
  Images,
  Search,
  Upload,
  X,
} from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import { adminApi } from "@/lib/admin/api";

export type MediaPickerFile = {
  src: string;
  name: string;
  folder?: string;
  usedBy?: string[];
  kind?: string;
};

type MediaFolder = { name: string; folder: string };

export type MediaPickerModalProps = {
  open: boolean;
  onClose: () => void;
  /** If true, user can pick several images and confirm. */
  multiple?: boolean;
  title?: string;
  /** Folder opened first in browse mode. */
  initialFolder?: string;
  /** Folder used when uploading (defaults to current browse folder). */
  uploadFolder?: string;
  onSelect: (files: MediaPickerFile[]) => void;
};

const ROOT_SHORTCUTS = [
  { id: "library", label: "Librería" },
  { id: "tours", label: "Tours" },
  { id: "destinos", label: "Destinos" },
  { id: "blog", label: "Blog" },
  { id: "home", label: "Home" },
  { id: "site", label: "Site" },
] as const;

export function MediaPickerModal({
  open,
  onClose,
  multiple = false,
  title = "Mediateca",
  initialFolder = "library",
  uploadFolder,
  onSelect,
}: MediaPickerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"browse" | "all">("browse");
  const [browseFolder, setBrowseFolder] = useState(initialFolder);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaPickerFile[]>([]);
  const [allReusable, setAllReusable] = useState<MediaPickerFile[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Map<string, MediaPickerFile>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const loadBrowse = useCallback((nextFolder: string) => {
    fetch(adminApi(`/api/admin/media?folder=${encodeURIComponent(nextFolder)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFolders(data.folders || []);
          setFiles(
            (data.files || []).filter((file: MediaPickerFile) => file.kind !== "video")
          );
          setBrowseFolder(nextFolder);
        }
      })
      .catch(() => undefined);
  }, []);

  const refreshReusable = useCallback(() => {
    fetch(adminApi("/api/admin/media?reusable=1"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) {
          setAllReusable(
            data.files.filter((file: MediaPickerFile) => file.kind !== "video")
          );
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setQuery("");
      setError("");
      setNote("");
      setSelected(new Map());
      setMode("browse");
      const start = initialFolder || "library";
      loadBrowse(start);
      refreshReusable();
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, initialFolder, loadBrowse, refreshReusable]);

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

  const crumbs = browseFolder.split("/").filter(Boolean);
  const targetUploadFolder = uploadFolder || browseFolder || "library";

  const toggleSelect = (file: MediaPickerFile) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(file.src)) next.delete(file.src);
      else {
        if (!multiple) next.clear();
        next.set(file.src, file);
      }
      return next;
    });
  };

  const confirmSelection = (filesToUse?: MediaPickerFile[]) => {
    const list = filesToUse || [...selected.values()];
    if (list.length === 0) return;
    onSelect(list);
    onClose();
  };

  const handleFileClick = (file: MediaPickerFile) => {
    if (multiple) {
      toggleSelect(file);
      return;
    }
    confirmSelection([file]);
  };

  const uploadSelected = async (list: FileList | null, preservePaths: boolean) => {
    if (!list || list.length === 0) return;
    setUploading(true);
    setError("");
    setNote("");
    const uploaded: MediaPickerFile[] = [];
    let reused = 0;
    try {
      for (const file of Array.from(list)) {
        const body = new FormData();
        body.set("folder", targetUploadFolder);
        body.set("file", file);
        const relative =
          preservePaths && "webkitRelativePath" in file && file.webkitRelativePath
            ? file.webkitRelativePath
            : "";
        if (relative) body.set("relativePath", relative);
        const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "No se pudo subir.");
          continue;
        }
        if (data.reused) reused += 1;
        if (data.file?.src) {
          uploaded.push({
            src: data.file.src,
            name: data.file.name || file.name,
            folder: data.file.folder,
          });
        }
      }
      loadBrowse(browseFolder || "library");
      refreshReusable();
      if (uploaded.length > 0) {
        setNote(
          `${uploaded.length} archivo(s) subido(s)` +
            (reused > 0 ? ` (${reused} reutilizado(s)).` : ".")
        );
        if (multiple) {
          setSelected((prev) => {
            const next = new Map(prev);
            for (const file of uploaded) next.set(file.src, file);
            return next;
          });
          setMode("browse");
        } else {
          confirmSelection(uploaded.slice(0, 1));
        }
      }
    } catch {
      setError("Error de red al subir.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  const selectAllVisible = () => {
    if (!multiple) return;
    setSelected((prev) => {
      const next = new Map(prev);
      for (const file of visibleFiles) next.set(file.src, file);
      return next;
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="admin-dialog rounded-2xl p-0 w-[min(920px,calc(100vw-1.5rem))] max-h-[min(90vh,880px)] backdrop:bg-black/45"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex flex-col max-h-[min(90vh,880px)]">
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {multiple
                ? "Explora carpetas, marca varias fotos y confirma."
                : "Explora carpetas o elige una foto."}
            </p>
          </div>
          <button
            type="button"
            className="admin-ghost-btn shrink-0"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="px-5 py-3 space-y-3 border-b border-slate-100">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`admin-ghost-btn ${mode === "browse" ? "bg-slate-900 text-white border-slate-900" : ""}`}
              onClick={() => setMode("browse")}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Carpetas
            </button>
            <button
              type="button"
              className={`admin-ghost-btn ${mode === "all" ? "bg-slate-900 text-white border-slate-900" : ""}`}
              onClick={() => {
                setMode("all");
                refreshReusable();
              }}
            >
              <Images className="w-3.5 h-3.5" />
              Todas
            </button>
            {multiple ? (
              <button
                type="button"
                className="admin-ghost-btn"
                onClick={selectAllVisible}
                disabled={visibleFiles.length === 0}
              >
                Seleccionar visibles ({visibleFiles.length})
              </button>
            ) : null}
          </div>

          {mode === "browse" ? (
            <div className="flex flex-wrap gap-1.5">
              {ROOT_SHORTCUTS.map((root) => (
                <button
                  key={root.id}
                  type="button"
                  onClick={() => loadBrowse(root.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    browseFolder === root.id || browseFolder.startsWith(`${root.id}/`)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {root.label}
                </button>
              ))}
            </div>
          ) : null}

          {mode === "browse" ? (
            <nav
              aria-label="Ruta de carpeta"
              className="flex flex-wrap items-center gap-1 text-[11px] font-mono text-slate-500"
            >
              <button
                type="button"
                className="hover:text-slate-900 font-bold"
                onClick={() => loadBrowse(crumbs[0] || "library")}
              >
                /media
              </button>
              {crumbs.map((part, index) => {
                const next = crumbs.slice(0, index + 1).join("/");
                return (
                  <span key={next} className="inline-flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    <button
                      type="button"
                      className="hover:text-slate-900"
                      onClick={() => loadBrowse(next)}
                    >
                      {part}
                    </button>
                  </span>
                );
              })}
            </nav>
          ) : null}

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, ruta o carpeta…"
              className="admin-input pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="media-picker-files"
              className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              <Upload className="w-3.5 h-3.5" />
              Subir archivos
            </label>
            <label
              htmlFor="media-picker-folder"
              className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Subir carpeta
            </label>
            <span className="text-[11px] text-slate-400 font-mono truncate">
              → /media/{targetUploadFolder}/
            </span>
          </div>
          <input
            ref={fileInputRef}
            id="media-picker-files"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,.jpg,.jpeg,.png,.webp,.avif,.gif"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void uploadSelected(event.target.files, false)}
          />
          <input
            ref={folderInputRef}
            id="media-picker-folder"
            type="file"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void uploadSelected(event.target.files, true)}
            {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
          />
          {uploading ? <p className="text-xs text-slate-500">Subiendo…</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {note ? <p className="text-xs text-emerald-700">{note}</p> : null}
        </div>

        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          {mode === "browse" && folders.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {folders.map((item) => (
                <li key={item.folder}>
                  <button
                    type="button"
                    onClick={() => loadBrowse(item.folder)}
                    className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 hover:border-slate-400 hover:bg-white transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-slate-700" aria-hidden="true" />
                    <span className="block mt-1 text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 truncate">
                      {item.folder}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {visibleFiles.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              No hay imágenes aquí. Entra a otra carpeta o sube archivos.
            </p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {visibleFiles.map((file) => {
                const isSelected = selected.has(file.src);
                return (
                  <li key={file.src}>
                    <button
                      type="button"
                      onClick={() => handleFileClick(file)}
                      className={`relative w-full text-left rounded-xl border overflow-hidden transition-all ${
                        isSelected
                          ? "border-slate-900 ring-2 ring-slate-900/30"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <div className="relative aspect-[4/3] bg-slate-100">
                        <TourImage
                          src={file.src}
                          alt={file.name}
                          fill
                          className="object-cover"
                          sizes="180px"
                          unprotected
                        />
                        {multiple ? (
                          <span
                            className={`absolute top-2 right-2 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "bg-white/90 border-white text-transparent"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : null}
                      </div>
                      <span className="block px-2 pt-2 text-[11px] font-mono text-slate-600 truncate">
                        {file.name}
                      </span>
                      <span className="block px-2 pb-2 text-[10px] text-slate-400 truncate">
                        {file.folder || "library"}
                        {file.usedBy && file.usedBy.length > 0
                          ? ` · ${file.usedBy.length} uso(s)`
                          : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            {multiple
              ? selected.size > 0
                ? `${selected.size} seleccionada(s)`
                : "Ninguna seleccionada"
              : "Clic en una imagen para usarla"}
          </p>
          <div className="flex flex-wrap gap-2">
            {multiple && selected.size > 0 ? (
              <button
                type="button"
                className="admin-ghost-btn"
                onClick={() => setSelected(new Map())}
              >
                Limpiar
              </button>
            ) : null}
            <button type="button" className="admin-ghost-btn" onClick={onClose}>
              Cancelar
            </button>
            {multiple ? (
              <button
                type="button"
                className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
                disabled={selected.size === 0}
                onClick={() => confirmSelection()}
              >
                Usar {selected.size || ""} foto{selected.size === 1 ? "" : "s"}
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </dialog>
  );
}
