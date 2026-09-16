"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, RefreshCw, Save } from "lucide-react";
import { DESTINO_OPTIONS, type BlogDraft } from "@/lib/admin/blog-schema";
import { StringListField } from "@/components/admin/StringListField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FeaturedImageField } from "@/components/admin/FeaturedImageField";
import { adminApi } from "@/lib/admin/api";

const TABS = [
  { id: "general", label: "General" },
  { id: "contenido", label: "Contenido" },
  { id: "imagenes", label: "Imágenes" },
  { id: "seo", label: "SEO" },
  { id: "geo", label: "GEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type BlogEditorProps = {
  slug: string;
  file: string;
  initialDraft: BlogDraft;
};

export function BlogEditor({ slug, file, initialDraft }: BlogEditorProps) {
  const [draft, setDraft] = useState<BlogDraft>(initialDraft);
  const [savedDraft, setSavedDraft] = useState<BlogDraft>(initialDraft);
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [errorSummary, setErrorSummary] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateSlug, setDuplicateSlug] = useState(`${slug}-copia`);
  const [duplicateTitle, setDuplicateTitle] = useState(`${initialDraft.title} (copia)`);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedDraft), [draft, savedDraft]);

  const patch = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorSummary("");
    try {
      const res = await fetch(adminApi(`/api/admin/blogs/${encodeURIComponent(slug)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        const issues = Array.isArray(data.issues)
          ? data.issues.map((issue: { path: string; message: string }) => `${issue.path}: ${issue.message}`).join(" · ")
          : "";
        setErrorSummary(issues || data.error || "No se pudo guardar.");
        showToast(data.error || "Error al guardar.", "error");
        return;
      }
      setDraft(data.draft);
      setSavedDraft(data.draft);
      showToast("Post guardado. Páginas del blog revalidadas.");
      if (data.slug && data.slug !== slug) {
        window.location.href = `/admin/blog/${data.slug}/`;
      }
    } catch {
      showToast("Error de conexión al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {toast ? (
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
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <header className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b0014]">Editor de blog</p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-title truncate">{draft.title}</h1>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              {file} · /blog/{draft.slug}/
              {dirty ? " · cambios sin guardar" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/blog/${draft.slug}/`} target="_blank" className="admin-ghost-btn">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Ver
            </Link>
            <button type="button" className="admin-ghost-btn" onClick={() => setDuplicateOpen(true)}>
              <Copy className="w-4 h-4" aria-hidden="true" />
              Duplicar
            </button>
            <button type="submit" className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800" disabled={saving}>
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4" aria-hidden="true" />}
              Guardar
            </button>
          </div>
        </header>

        {errorSummary ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errorSummary}</p>
        ) : null}

        <nav className="flex flex-wrap gap-2" aria-label="Secciones del editor">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-h-11 px-3 rounded-xl text-xs font-bold border ${
                tab === item.id
                  ? "bg-[#6b0014] text-white border-[#6b0014]"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {tab === "general" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="admin-field">
              <label htmlFor="title" className="admin-label">
                Título
              </label>
              <input
                id="title"
                required
                className="admin-input"
                value={draft.title}
                onChange={(event) => patch("title", event.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label htmlFor="slug" className="admin-label">
                  Slug
                </label>
                <input
                  id="slug"
                  required
                  className="admin-input font-mono text-xs"
                  value={draft.slug}
                  onChange={(event) => patch("slug", event.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="status" className="admin-label">
                  Estado
                </label>
                <select
                  id="status"
                  className="admin-input"
                  value={draft.status}
                  onChange={(event) => patch("status", event.target.value as "publish" | "draft")}
                >
                  <option value="publish">Publicado</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label htmlFor="date" className="admin-label">
                  Fecha
                </label>
                <input
                  id="date"
                  type="date"
                  className="admin-input"
                  value={draft.date.slice(0, 10)}
                  onChange={(event) => patch("date", event.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="author" className="admin-label">
                  Autor
                </label>
                <input
                  id="author"
                  className="admin-input"
                  value={draft.author}
                  onChange={(event) => patch("author", event.target.value)}
                />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="excerpt" className="admin-label">
                Extracto
              </label>
              <textarea
                id="excerpt"
                required
                rows={3}
                className="admin-input"
                value={draft.excerpt}
                onChange={(event) => patch("excerpt", event.target.value)}
              />
            </div>
            <StringListField
              id="categories"
              label="Categorías"
              values={draft.categories}
              onChange={(values) => patch("categories", values)}
            />
            <StringListField id="tags" label="Tags" values={draft.tags} onChange={(values) => patch("tags", values)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label htmlFor="reading_time_minutes" className="admin-label">
                  Minutos de lectura
                </label>
                <input
                  id="reading_time_minutes"
                  type="number"
                  min={1}
                  className="admin-input"
                  value={draft.reading_time_minutes ?? 5}
                  onChange={(event) => patch("reading_time_minutes", Number(event.target.value) || 5)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="video_url" className="admin-label">
                  Video URL (opcional)
                </label>
                <input
                  id="video_url"
                  className="admin-input"
                  value={draft.video_url || ""}
                  onChange={(event) => patch("video_url", event.target.value)}
                />
              </div>
            </div>
          </section>
        )}

        {tab === "contenido" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <p className="text-xs text-slate-500">
              Editor visual profesional. El HTML se guarda en el JSON del post (listo para Directus).
            </p>
            <RichTextEditor
              slug={draft.slug}
              value={draft.body_html}
              onChange={(html) => patch("body_html", html)}
            />
          </section>
        )}

        {tab === "imagenes" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6">
            <FeaturedImageField
              slug={draft.slug}
              src={draft.featured_image || ""}
              alt={draft.featured_image_alt || ""}
              caption={draft.featured_image_caption || ""}
              credito={draft.featured_image_credito || ""}
              onChange={(patchFields) => setDraft((prev) => ({ ...prev, ...patchFields }))}
            />
          </section>
        )}

        {tab === "seo" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="admin-field">
              <label htmlFor="seo_title" className="admin-label">
                Meta title
              </label>
              <input
                id="seo_title"
                required
                className="admin-input"
                value={draft.seo.title}
                onChange={(event) => patch("seo", { ...draft.seo, title: event.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="seo_description" className="admin-label">
                Meta description
              </label>
              <textarea
                id="seo_description"
                required
                rows={3}
                className="admin-input"
                value={draft.seo.description}
                onChange={(event) => patch("seo", { ...draft.seo, description: event.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="focus_keyword" className="admin-label">
                Focus keyword
              </label>
              <input
                id="focus_keyword"
                className="admin-input"
                value={draft.seo.focus_keyword || ""}
                onChange={(event) => patch("seo", { ...draft.seo, focus_keyword: event.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="synonyms" className="admin-label">
                Sinónimos
              </label>
              <input
                id="synonyms"
                className="admin-input"
                value={draft.seo.synonyms || ""}
                onChange={(event) => patch("seo", { ...draft.seo, synonyms: event.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="canonical" className="admin-label">
                Canonical
              </label>
              <input
                id="canonical"
                className="admin-input font-mono text-xs"
                value={draft.seo.canonical || ""}
                onChange={(event) => patch("seo", { ...draft.seo, canonical: event.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="og_image" className="admin-label">
                OG image
              </label>
              <input
                id="og_image"
                className="admin-input font-mono text-xs"
                value={draft.seo.og_image || ""}
                onChange={(event) => patch("seo", { ...draft.seo, og_image: event.target.value })}
                placeholder="Por defecto usa la imagen destacada"
              />
            </div>
          </section>
        )}

        {tab === "geo" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <p className="text-xs text-slate-500">
              Destinos asociados al artículo para schema.org / landings. Preparado para mapear a Directus.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {DESTINO_OPTIONS.map((option) => {
                const checked = draft.geo.place_ids.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...draft.geo.place_ids, option.id]
                          : draft.geo.place_ids.filter((id) => id !== option.id);
                        patch("geo", { ...draft.geo, place_ids: next });
                      }}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
            <div className="admin-field">
              <label htmlFor="primary_place_id" className="admin-label">
                Destino principal (schema)
              </label>
              <select
                id="primary_place_id"
                className="admin-input"
                value={draft.geo.primary_place_id || ""}
                onChange={(event) => patch("geo", { ...draft.geo, primary_place_id: event.target.value })}
              >
                <option value="">—</option>
                {DESTINO_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(draft.geo.schema_tourist_attraction)}
                onChange={(event) =>
                  patch("geo", { ...draft.geo, schema_tourist_attraction: event.target.checked })
                }
              />
              Incluir schema TouristAttraction
            </label>
          </section>
        )}
      </form>

      {duplicateOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full max-w-md space-y-4">
            <h2 className="text-lg font-black font-title">Duplicar post</h2>
            <div className="admin-field">
              <label className="admin-label" htmlFor="dup-title">
                Título
              </label>
              <input
                id="dup-title"
                className="admin-input"
                value={duplicateTitle}
                onChange={(event) => setDuplicateTitle(event.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="dup-slug">
                Slug
              </label>
              <input
                id="dup-slug"
                className="admin-input font-mono text-xs"
                value={duplicateSlug}
                onChange={(event) => setDuplicateSlug(event.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="admin-ghost-btn" onClick={() => setDuplicateOpen(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
                onClick={async () => {
                  const res = await fetch(adminApi(`/api/admin/blogs/${encodeURIComponent(slug)}/duplicate`), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug: duplicateSlug, title: duplicateTitle }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || "No se pudo duplicar.", "error");
                    return;
                  }
                  window.location.href = `/admin/blog/${data.slug}/`;
                }}
              >
                Crear copia
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
