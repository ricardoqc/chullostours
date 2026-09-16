"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Film,
  FolderOpen,
  FolderPlus,
  ImagePlus,
  Pencil,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminMediaThumb } from "@/components/admin/AdminMediaThumb";
import { adminApi } from "@/lib/admin/api";

type MediaFile = {
  src: string;
  name: string;
  folder: string;
  kind: "image" | "video" | "other";
  size: number;
  usedBy?: string[];
};

type MediaFolder = { name: string; folder: string };

type HomeHero = {
  kind: "image" | "video";
  src: string;
  poster: string;
  slides: Array<{ src: string; alt?: string }>;
};

const ROOT_FOLDERS = [
  { folder: "library", label: "Librería compartida", hint: "Fotos reutilizables (tours y destinos)" },
  { folder: "home", label: "Home / Hero", hint: "Video e imagen de portada" },
  { folder: "site", label: "Sitio", hint: "Banners, fondos y fotos generales" },
  { folder: "tours", label: "Tours (legacy)", hint: "Galerías antiguas por slug" },
  { folder: "destinos", label: "Destinos", hint: "Hero de cada destino" },
  { folder: "blog", label: "Blog", hint: "Imágenes de artículos" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isEditableFolder(folderPath: string) {
  return folderPath.includes("/");
}

export function MediaLibrary() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [folder, setFolder] = useState("library");
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [hero, setHero] = useState<HomeHero>({ kind: "image", src: "", poster: "", slides: [] });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const loadFolder = async (nextFolder: string) => {
    setLoading(true);
    try {
      const [mediaRes, heroRes] = await Promise.all([
        fetch(adminApi(`/api/admin/media?folder=${encodeURIComponent(nextFolder)}`)),
        fetch(adminApi("/api/admin/home-hero")),
      ]);

      if (mediaRes.status === 401 || heroRes.status === 401) {
        setAuth("login");
        return;
      }

      const mediaData = await mediaRes.json();
      const heroData = await heroRes.json();
      if (!mediaRes.ok) {
        showToast(mediaData.error || "No se pudo listar el volumen.", "error");
        setAuth("ok");
        return;
      }

      setFolders(mediaData.folders || []);
      setFiles(mediaData.files || []);
      if (heroData.hero) {
        setHero({
          kind: heroData.hero.kind === "video" ? "video" : "image",
          src: heroData.hero.src || "",
          poster: heroData.hero.poster || "",
          slides: Array.isArray(heroData.hero.slides) ? heroData.hero.slides : [],
        });
      }
      setFolder(nextFolder);
      setAuth("ok");
    } catch {
      setAuth("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolder(folder).catch(() => setAuth("login"));
    // Solo montaje inicial; la navegación de carpetas llama loadFolder a mano.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFiles = async (selected: FileList | File[], options?: { preservePaths?: boolean }) => {
    const list = Array.from(selected).filter((file) => file.size > 0);
    if (list.length === 0) return;

    setUploading(true);
    setUploadProgress(`Subiendo 0/${list.length}…`);

    let okCount = 0;
    let reusedCount = 0;
    const errors: string[] = [];

    try {
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        const relative =
          options?.preservePaths && "webkitRelativePath" in file && file.webkitRelativePath
            ? file.webkitRelativePath
            : "";
        setUploadProgress(`Subiendo ${i + 1}/${list.length}: ${relative || file.name}`);
        try {
          const body = new FormData();
          body.set("folder", folder);
          body.set("file", file);
          if (relative) body.set("relativePath", relative);
          const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
          const data = await res.json();
          if (!res.ok) {
            errors.push(data.error || file.name);
            continue;
          }
          okCount += 1;
          if (data.reused) reusedCount += 1;
        } catch {
          errors.push(file.name);
        }
      }

      await loadFolder(folder);

      if (okCount > 0 && errors.length === 0) {
        if (reusedCount === okCount) {
          showToast(
            okCount === 1
              ? "La imagen ya existía; se reutilizó sin duplicar."
              : `${okCount} imágenes ya existían; se reutilizaron sin duplicar.`
          );
        } else if (reusedCount > 0) {
          showToast(`${okCount} listas (${reusedCount} reutilizadas sin duplicar).`);
        } else {
          showToast(okCount === 1 ? "1 archivo subido." : `${okCount} archivos subidos.`);
        }
      } else if (okCount > 0) {
        showToast(`${okCount} subidos. Fallaron: ${errors.slice(0, 3).join(", ")}`, "error");
      } else {
        showToast(errors[0] || "No se pudo subir ningún archivo.", "error");
      }
    } finally {
      setUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    void uploadFiles(selected, { preservePaths: false });
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    void uploadFiles(selected, { preservePaths: true });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (uploading) return;
    const items = event.dataTransfer.files;
    if (!items || items.length === 0) return;
    const hasRelative = Array.from(items).some(
      (file) => "webkitRelativePath" in file && Boolean(file.webkitRelativePath)
    );
    void uploadFiles(items, { preservePaths: hasRelative });
  };

  const createFolder = async () => {
    const name = window.prompt("Nombre de la nueva carpeta:");
    if (!name?.trim()) return;
    const res = await fetch(adminApi("/api/admin/media"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create-folder", folder, name: name.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo crear la carpeta.", "error");
      return;
    }
    showToast(`Carpeta “${data.name}” creada.`);
    await loadFolder(folder);
  };

  const renameFolder = async (item: MediaFolder) => {
    const name = window.prompt("Nuevo nombre de carpeta:", item.name);
    if (!name?.trim() || name.trim() === item.name) return;
    const res = await fetch(adminApi("/api/admin/media"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename-folder", folder: item.folder, name: name.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo renombrar.", "error");
      return;
    }
    showToast("Carpeta renombrada.");
    await loadFolder(folder);
  };

  const removeFolder = async (item: MediaFolder) => {
    if (!window.confirm(`¿Borrar la carpeta “${item.name}”? Si tiene contenido, se borrará todo lo que no esté en uso.`)) {
      return;
    }
    const res = await fetch(
      adminApi(`/api/admin/media?folder=${encodeURIComponent(item.folder)}&recursive=1`),
      { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo borrar la carpeta.", "error");
      return;
    }
    showToast("Carpeta eliminada.");
    await loadFolder(folder);
  };

  const renameFile = async (file: MediaFile) => {
    const name = window.prompt("Nuevo nombre de archivo (con extensión):", file.name);
    if (!name?.trim() || name.trim() === file.name) return;
    const res = await fetch(adminApi("/api/admin/media"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename-file", src: file.src, name: name.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo renombrar.", "error");
      return;
    }
    showToast("Archivo renombrado.");
    if (preview?.src === file.src && data.src) {
      setPreview({ ...file, src: data.src, name: data.name });
    }
    await loadFolder(folder);
  };

  const copySrc = async (src: string) => {
    try {
      await navigator.clipboard.writeText(src);
      showToast("Ruta copiada.");
    } catch {
      showToast(src);
    }
  };

  const assignHero = async (file: MediaFile, asPoster = false) => {
    const payload = asPoster
      ? { poster: file.src }
      : { src: file.src, kind: file.kind === "video" ? "video" : "image" };
    const res = await fetch(adminApi("/api/admin/home-hero"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo asignar al hero.", "error");
      return;
    }
    setHero(data.hero);
    showToast(asPoster ? "Poster del hero actualizado." : "Hero de la HOME actualizado.");
  };

  const saveSlides = async (slides: Array<{ src: string; alt?: string }>) => {
    const res = await fetch(adminApi("/api/admin/home-hero"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides, kind: "image" }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo actualizar la galería del hero.", "error");
      return false;
    }
    setHero(data.hero);
    return true;
  };

  const addToHeroSlider = async (file: MediaFile) => {
    if (file.kind !== "image") {
      showToast("Solo las imágenes pueden entrar al slider del hero.", "error");
      return;
    }

    const exists = hero.slides.some((item) => item.src === file.src);
    if (exists) {
      showToast("Esta imagen ya está en el slider.");
      return;
    }

    const nextSlides = [...hero.slides, { src: file.src, alt: "Hero Chullos Tours" }];
    const ok = await saveSlides(nextSlides);
    if (ok) showToast("Imagen agregada al slider del hero.");
  };

  const removeFromHeroSlider = async (src: string) => {
    const nextSlides = hero.slides.filter((item) => item.src !== src);
    const ok = await saveSlides(nextSlides);
    if (ok) showToast("Imagen quitada del slider del hero.");
  };

  const updateSlideAlt = (src: string, alt: string) => {
    setHero((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) => (slide.src === src ? { ...slide, alt } : slide)),
    }));
  };

  const persistSlideAlt = async (src: string, alt: string) => {
    const trimmed = alt.trim();
    const nextSlides = hero.slides.map((slide) =>
      slide.src === src ? { src: slide.src, alt: trimmed } : { src: slide.src, alt: slide.alt || "" }
    );
    const ok = await saveSlides(nextSlides);
    if (ok) showToast("ALT actualizado.");
  };

  const clearHero = async () => {
    const res = await fetch(adminApi("/api/admin/home-hero"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clear: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo restablecer el hero.", "error");
      return;
    }
    setHero(data.hero);
    showToast("Hero restablecido al fondo por defecto.");
  };

  const removeFile = async (src: string) => {
    if (!window.confirm(`¿Borrar ${src} del volumen? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(adminApi(`/api/admin/media?src=${encodeURIComponent(src)}`), { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "No se pudo borrar.", "error");
      return;
    }
    showToast("Archivo eliminado.");
    if (preview?.src === src) setPreview(null);
    await loadFolder(folder);
  };

  if (auth === "checking") {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
        <span className="sr-only">Cargando mediateca</span>
      </div>
    );
  }

  if (auth === "login") {
    return <AdminLoginForm onSuccess={() => loadFolder(folder)} />;
  }

  const crumbs = folder.split("/").filter(Boolean);

  return (
    <AdminShell wide>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
            toast.type === "success"
              ? "bg-slate-900 text-emerald-400 border-emerald-500/30"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {preview ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa"
          onClick={() => setPreview(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setPreview(null);
          }}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{preview.name}</p>
                <p className="text-[11px] font-mono text-slate-500 truncate">{preview.src}</p>
              </div>
              <button type="button" className="admin-ghost-btn" onClick={() => setPreview(null)}>
                <X className="w-4 h-4" aria-hidden="true" />
                Cerrar
              </button>
            </div>
            <div className="relative bg-slate-950 aspect-[16/10] max-h-[70vh]">
              {preview.kind === "video" ? (
                <video src={preview.src} controls className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <AdminMediaThumb src={preview.src} alt={preview.name} className="object-contain" />
              )}
            </div>
            <div className="flex flex-wrap gap-2 p-4 border-t border-slate-200">
              <button type="button" onClick={() => copySrc(preview.src)} className="admin-ghost-btn">
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                Copiar ruta
              </button>
              <button type="button" onClick={() => renameFile(preview)} className="admin-ghost-btn">
                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                Renombrar
              </button>
              <button type="button" onClick={() => removeFile(preview.src)} className="admin-ghost-btn hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Borrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <header className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold text-[#6b0014] uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" aria-hidden="true" />
            Volumen persistente
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-title">Mediateca</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Sube archivos o carpetas completas a <code>/media/library</code>. Puedes crear, renombrar y borrar
            subcarpetas, previsualizar fotos y reutilizar sin duplicar.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Hero actual de la HOME</p>
          <p className="mt-1 font-mono text-xs break-all">{hero.src || "Fondo por defecto (galería de un tour)"}</p>
          {hero.poster ? <p className="mt-1 font-mono text-xs break-all">Poster: {hero.poster}</p> : null}
          <p className="mt-3 font-bold text-slate-800">Slider de imágenes</p>
          {hero.slides.length === 0 ? (
            <p className="mt-1 text-xs text-slate-500">Sin imágenes configuradas. Agrega desde los archivos de abajo.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {hero.slides.map((slide, index) => (
                <li
                  key={slide.src}
                  className="rounded-xl border border-slate-200 bg-white p-3 grid gap-3 sm:grid-cols-[88px_1fr_auto] sm:items-start"
                >
                  <button
                    type="button"
                    className="relative aspect-video sm:aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                    onClick={() =>
                      setPreview({
                        src: slide.src,
                        name: slide.alt || `Slide ${index + 1}`,
                        folder: folder,
                        kind: "image",
                        size: 0,
                      })
                    }
                  >
                    <AdminMediaThumb src={slide.src} alt={slide.alt || `Slide ${index + 1}`} />
                  </button>
                  <div className="min-w-0 space-y-2">
                    <p className="text-[11px] font-mono text-slate-500 break-all">{slide.src}</p>
                    <div className="admin-field">
                      <label htmlFor={`hero-slide-alt-${index}`} className="admin-label">
                        Texto ALT
                      </label>
                      <input
                        id={`hero-slide-alt-${index}`}
                        type="text"
                        value={slide.alt || ""}
                        onChange={(event) => updateSlideAlt(slide.src, event.target.value)}
                        onBlur={(event) => void persistSlideAlt(slide.src, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") event.currentTarget.blur();
                        }}
                        placeholder="Describe la imagen para SEO y accesibilidad"
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromHeroSlider(slide.src)} className="admin-ghost-btn justify-self-start">
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={clearHero} className="admin-ghost-btn mt-3">
            Restablecer hero
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {ROOT_FOLDERS.map((item) => (
          <button
            key={item.folder}
            type="button"
            onClick={() => loadFolder(item.folder)}
            className={`min-h-11 px-3 rounded-xl text-xs font-bold border ${
              folder === item.folder || folder.startsWith(`${item.folder}/`)
                ? "bg-[#6b0014] text-white border-[#6b0014]"
                : "bg-white text-slate-600 border-slate-200"
            }`}
            title={item.hint}
          >
            {item.label}
          </button>
        ))}
      </div>

      <nav aria-label="Ruta de carpeta" className="flex flex-wrap items-center gap-1 text-xs font-mono text-slate-500">
        <button type="button" className="hover:text-[#6b0014]" onClick={() => loadFolder(crumbs[0] || "library")}>
          /media/{crumbs[0] || "library"}
        </button>
        {crumbs.slice(1).map((part, index) => {
          const next = crumbs.slice(0, index + 2).join("/");
          return (
            <span key={next} className="inline-flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              <button type="button" className="hover:text-[#6b0014]" onClick={() => loadFolder(next)}>
                {part}
              </button>
            </span>
          );
        })}
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-slate-800">Subir a /media/{folder}/</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Archivos sueltos o carpetas completas (se conserva la estructura). Imágenes hasta 12 MB · Video hasta 80 MB.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={createFolder} className="admin-ghost-btn" disabled={uploading}>
              <FolderPlus className="w-3.5 h-3.5" aria-hidden="true" />
              Nueva carpeta
            </button>
            {uploading ? (
              <p className="text-xs font-semibold text-slate-600 inline-flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                {uploadProgress || "Subiendo…"}
              </p>
            ) : null}
          </div>
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed px-4 py-6 transition-colors ${
            dragOver
              ? "border-[#6b0014] bg-[#6b0014]/5"
              : uploading
                ? "border-slate-200 bg-slate-50 opacity-70"
                : "border-slate-300 bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-[#6b0014] shadow-sm">
              <Upload className="w-5 h-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-bold text-slate-800">
              {uploading ? "Subiendo…" : "Arrastra archivos aquí o elige una opción"}
            </p>
            <p className="text-xs text-slate-500">JPG, PNG, WebP, AVIF, GIF, MP4 o WebM</p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              <label
                htmlFor="media-file"
                className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                Elegir archivos
              </label>
              <label
                htmlFor="media-folder"
                className={`admin-ghost-btn cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" />
                Subir carpeta
              </label>
            </div>
          </div>
          <input
            ref={fileInputRef}
            id="media-file"
            name="file"
            type="file"
            multiple
            disabled={uploading}
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,.jpg,.jpeg,.png,.webp,.avif,.gif,.mp4,.webm"
            onChange={handleFileChange}
            className="sr-only"
          />
          <input
            ref={folderInputRef}
            id="media-folder"
            name="folder"
            type="file"
            multiple
            disabled={uploading}
            onChange={handleFolderChange}
            className="sr-only"
            {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
          Actualizando carpeta…
        </p>
      ) : null}

      <section aria-labelledby="media-folders-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="media-folders-heading" className="text-sm font-bold text-slate-800">
            Carpetas ({folders.length})
          </h2>
        </div>
        {folders.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl p-5">
            No hay subcarpetas. Crea una o sube una carpeta completa desde tu equipo.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {folders.map((item) => (
              <li key={item.folder} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => loadFolder(item.folder)}
                  className="w-full text-left p-4 hover:bg-slate-50 min-h-16"
                >
                  <FolderOpen className="w-5 h-5 text-[#6b0014]" aria-hidden="true" />
                  <span className="block mt-2 text-sm font-bold text-slate-800 truncate">{item.name}</span>
                  <span className="block text-[10px] font-mono text-slate-400 truncate mt-0.5">/media/{item.folder}</span>
                </button>
                {isEditableFolder(item.folder) ? (
                  <div className="flex gap-1 border-t border-slate-100 px-2 py-2">
                    <button type="button" onClick={() => renameFolder(item)} className="admin-ghost-btn flex-1 justify-center">
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      Renombrar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFolder(item)}
                      className="admin-ghost-btn flex-1 justify-center hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Borrar
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="media-files-heading" className="space-y-3">
        <h2 id="media-files-heading" className="text-sm font-bold text-slate-800">
          Archivos ({files.length})
        </h2>
        {files.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl p-6">
            Esta carpeta no tiene archivos. Sube fotos o entra a una subcarpeta.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <li key={file.src} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreview(file)}
                  className="relative aspect-video bg-slate-100 w-full text-left"
                  aria-label={`Ver ${file.name}`}
                >
                  {file.kind === "video" ? (
                    <video src={file.src} muted preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <AdminMediaThumb src={file.src} alt={file.name} />
                  )}
                </button>
                <div className="p-3 space-y-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 break-all">{file.src}</p>
                  <p className="text-[11px] text-slate-400">
                    {file.kind === "video" ? "Video" : "Imagen"} · {formatSize(file.size)}
                    {file.usedBy && file.usedBy.length > 0 ? ` · ${file.usedBy.length} uso(s)` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setPreview(file)} className="admin-ghost-btn">
                      Ver
                    </button>
                    <button type="button" onClick={() => copySrc(file.src)} className="admin-ghost-btn">
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copiar
                    </button>
                    <button type="button" onClick={() => renameFile(file)} className="admin-ghost-btn">
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      Renombrar
                    </button>
                    <button type="button" onClick={() => assignHero(file)} className="admin-ghost-btn">
                      {file.kind === "video" ? (
                        <Film className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {file.kind === "video" ? "Video hero" : "Portada hero"}
                    </button>
                    {file.kind === "image" ? (
                      <button type="button" onClick={() => addToHeroSlider(file)} className="admin-ghost-btn">
                        Slider
                      </button>
                    ) : null}
                    {file.kind === "image" ? (
                      <button type="button" onClick={() => assignHero(file, true)} className="admin-ghost-btn">
                        Poster
                      </button>
                    ) : null}
                    <button type="button" onClick={() => removeFile(file.src)} className="admin-ghost-btn hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Borrar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
