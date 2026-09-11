"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Film,
  FolderOpen,
  ImagePlus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { TourImage } from "@/components/ui/TourImage";
import { adminApi } from "@/lib/admin/api";

type MediaFile = {
  src: string;
  name: string;
  folder: string;
  kind: "image" | "video" | "other";
  size: number;
};

type MediaFolder = { name: string; folder: string };

type HomeHero = {
  kind: "image" | "video";
  src: string;
  poster: string;
};

const ROOT_FOLDERS = [
  { folder: "home", label: "Home / Hero", hint: "Video e imagen de portada" },
  { folder: "site", label: "Sitio", hint: "Banners, fondos y fotos generales" },
  { folder: "tours", label: "Tours", hint: "Galerías por slug de tour" },
  { folder: "destinos", label: "Destinos", hint: "Hero de cada destino" },
  { folder: "blog", label: "Blog", hint: "Imágenes de artículos" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [folder, setFolder] = useState("home");
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [hero, setHero] = useState<HomeHero>({ kind: "image", src: "", poster: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      if (heroData.hero) setHero(heroData.hero);
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

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      showToast("Elige un archivo primero.", "error");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.set("folder", folder);
      body.set("file", file);
      const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No se pudo subir el archivo.", "error");
        return;
      }
      form.reset();
      showToast(`Guardado en ${data.file.src}`);
      await loadFolder(folder);
    } catch {
      showToast("Error de red al subir.", "error");
    } finally {
      setUploading(false);
    }
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

      <header className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold text-[#6b0014] uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" aria-hidden="true" />
            Volumen persistente
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-title">Mediateca</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Los archivos se guardan en <code>/media</code> (volumen de Coolify) y se sirven como rutas locales. Sube el
            video del hero a <code>home/</code>, fotos generales a <code>site/</code> y las de cada tour a{" "}
            <code>tours/slug/</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Hero actual de la HOME</p>
          <p className="mt-1 font-mono text-xs break-all">{hero.src || "Fondo por defecto (galería de un tour)"}</p>
          {hero.poster ? <p className="mt-1 font-mono text-xs break-all">Poster: {hero.poster}</p> : null}
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
        <button type="button" className="hover:text-[#6b0014]" onClick={() => loadFolder(crumbs[0] || "home")}>
          /media/{crumbs[0] || "home"}
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

      <form
        onSubmit={handleUpload}
        className="bg-white rounded-2xl border border-slate-200 p-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end"
      >
        <div className="admin-field">
          <label htmlFor="media-file" className="admin-label">
            Subir a /media/{folder}/
          </label>
          <input
            id="media-file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,.jpg,.jpeg,.png,.webp,.avif,.gif,.mp4,.webm"
            className="admin-input"
          />
          <p className="text-[11px] text-slate-500 mt-1">Imágenes hasta 12 MB. Video (mp4/webm) hasta 80 MB.</p>
        </div>
        <button type="submit" disabled={uploading} className="admin-ghost-btn min-h-12 px-5 bg-slate-900 text-white border-slate-900">
          <Upload className="w-4 h-4" aria-hidden="true" />
          {uploading ? "Subiendo…" : "Subir archivo"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500 inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
          Actualizando carpeta…
        </p>
      ) : null}

      {folders.length > 0 && (
        <section aria-labelledby="media-folders-heading" className="space-y-3">
          <h2 id="media-folders-heading" className="text-sm font-bold text-slate-800">
            Subcarpetas
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {folders.map((item) => (
              <li key={item.folder}>
                <button
                  type="button"
                  onClick={() => loadFolder(item.folder)}
                  className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 hover:border-[#6b0014] min-h-16"
                >
                  <FolderOpen className="w-4 h-4 text-[#6b0014]" aria-hidden="true" />
                  <span className="block mt-2 text-xs font-bold text-slate-800 truncate">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="media-files-heading" className="space-y-3">
        <h2 id="media-files-heading" className="text-sm font-bold text-slate-800">
          Archivos
        </h2>
        {files.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl p-6">
            Esta carpeta está vacía. Sube el video del hero o las fotos del sitio para que el CMS las pueda elegir.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <li key={file.src} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="relative aspect-video bg-slate-100">
                  {file.kind === "video" ? (
                    <video src={file.src} muted preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <TourImage src={file.src} alt={file.name} fill className="object-cover" sizes="320px" />
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-[11px] font-mono text-slate-600 break-all">{file.src}</p>
                  <p className="text-[11px] text-slate-400">
                    {file.kind === "video" ? "Video" : "Imagen"} · {formatSize(file.size)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => copySrc(file.src)} className="admin-ghost-btn">
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copiar ruta
                    </button>
                    <button type="button" onClick={() => assignHero(file)} className="admin-ghost-btn">
                      {file.kind === "video" ? <Film className="w-3.5 h-3.5" aria-hidden="true" /> : <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />}
                      Usar en hero
                    </button>
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
