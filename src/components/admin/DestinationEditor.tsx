"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import {
  DESTINO_TIPO_OPTIONS,
  type DestinoDraft,
} from "@/lib/admin/destino-schema";
import { StringListField } from "@/components/admin/StringListField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FeaturedImageField } from "@/components/admin/FeaturedImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { adminApi } from "@/lib/admin/api";

const TABS = [
  { id: "general", label: "General" },
  { id: "contenido", label: "Contenido" },
  { id: "lugares", label: "Lugares" },
  { id: "galeria", label: "Galería" },
  { id: "geo", label: "GEO" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type DestinationEditorProps = {
  slug: string;
  file: string;
  initialDraft: DestinoDraft;
};

export function DestinationEditor({ slug, file, initialDraft }: DestinationEditorProps) {
  const [draft, setDraft] = useState<DestinoDraft>(initialDraft);
  const [savedDraft, setSavedDraft] = useState<DestinoDraft>(initialDraft);
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [errorSummary, setErrorSummary] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateSlug, setDuplicateSlug] = useState(`${slug}-copia`);
  const [duplicateTitle, setDuplicateTitle] = useState(`${initialDraft.title} (copia)`);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedDraft),
    [draft, savedDraft]
  );

  const patch = <K extends keyof DestinoDraft>(key: K, value: DestinoDraft[K]) => {
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
      const res = await fetch(adminApi(`/api/admin/destinos/${encodeURIComponent(slug)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        const issues = Array.isArray(data.issues)
          ? data.issues
              .map((issue: { path: string; message: string }) => `${issue.path}: ${issue.message}`)
              .join(" · ")
          : "";
        setErrorSummary(issues || data.error || "No se pudo guardar.");
        showToast(data.error || "Error al guardar.", "error");
        return;
      }
      setDraft(data.draft);
      setSavedDraft(data.draft);
      showToast("Destino guardado.");
      if (data.slug && data.slug !== slug) {
        window.location.href = `/admin/destinos/${data.slug}/`;
      }
    } catch {
      showToast("Error de conexión al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  const galleryItems = draft.gallery.map((src) => ({
    src,
    alt: draft.title,
  }));

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
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Editor de destino
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">{draft.title}</h1>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              {file} · /destinos/{draft.slug}/
              {dirty ? " · cambios sin guardar" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/destinos/${draft.slug}/`} target="_blank" className="admin-ghost-btn">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Ver
            </Link>
            <button type="button" className="admin-ghost-btn" onClick={() => setDuplicateOpen(true)}>
              <Copy className="w-4 h-4" aria-hidden="true" />
              Duplicar
            </button>
            <button
              type="submit"
              className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
              disabled={saving}
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              Guardar
            </button>
          </div>
        </header>

        {errorSummary ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {errorSummary}
          </p>
        ) : null}

        <nav className="flex flex-wrap gap-2" aria-label="Secciones del editor">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-h-11 px-3 rounded-xl text-xs font-bold border ${
                tab === item.id
                  ? "bg-slate-900 text-white border-slate-900"
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
              <label className="admin-label" htmlFor="dest-title">
                Título
              </label>
              <input
                id="dest-title"
                className="admin-input"
                value={draft.title}
                onChange={(e) => patch("title", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="dest-subtitle">
                Subtítulo
              </label>
              <input
                id="dest-subtitle"
                className="admin-input"
                value={draft.subtitle || ""}
                onChange={(e) => patch("subtitle", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label className="admin-label" htmlFor="dest-slug">
                  Slug
                </label>
                <input
                  id="dest-slug"
                  className="admin-input font-mono text-sm"
                  value={draft.slug}
                  onChange={(e) => patch("slug", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="dest-status">
                  Estado
                </label>
                <select
                  id="dest-status"
                  className="admin-input"
                  value={draft.status}
                  onChange={(e) =>
                    patch("status", e.target.value === "publish" ? "publish" : "draft")
                  }
                >
                  <option value="publish">Publicado</option>
                  <option value="draft">Borrador (no público)</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label className="admin-label" htmlFor="dest-region">
                  Región
                </label>
                <input
                  id="dest-region"
                  className="admin-input"
                  value={draft.region}
                  onChange={(e) => patch("region", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="dest-tipo">
                  Tipo
                </label>
                <select
                  id="dest-tipo"
                  className="admin-input"
                  value={draft.tipo}
                  onChange={(e) => patch("tipo", e.target.value)}
                >
                  {DESTINO_TIPO_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="dest-excerpt">
                Extracto (cards / listados)
              </label>
              <textarea
                id="dest-excerpt"
                className="admin-input min-h-[88px]"
                value={draft.excerpt}
                onChange={(e) => patch("excerpt", e.target.value)}
              />
            </div>
          </section>
        )}

        {tab === "contenido" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <div>
              <p className="text-sm font-bold text-slate-800 mb-2">Descripción principal</p>
              <RichTextEditor
                value={draft.body_html}
                onChange={(html) => patch("body_html", html)}
                slug={draft.slug}
                mediaFolder={`destinos/${draft.slug}`}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-2">Otra información turística</p>
              <RichTextEditor
                value={draft.info_html || ""}
                onChange={(html) => patch("info_html", html)}
                slug={draft.slug}
                mediaFolder={`destinos/${draft.slug}`}
              />
            </div>
            <StringListField
              id="dest-tips"
              label="Tips prácticos"
              values={draft.tips}
              onChange={(tips) => patch("tips", tips)}
              placeholder="Ej. Mejor época: abril–octubre"
            />
          </section>
        )}

        {tab === "lugares" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-800">Lugares turísticos</p>
              <button
                type="button"
                className="admin-ghost-btn"
                onClick={() =>
                  patch("lugares", [
                    ...draft.lugares,
                    {
                      id: `lugar-${Date.now()}`,
                      nombre: "",
                      descripcion: "",
                      imagen: "",
                    },
                  ])
                }
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Añadir
              </button>
            </div>
            {draft.lugares.length === 0 ? (
              <p className="text-sm text-slate-500">Sin lugares. Añade sitios destacados del destino.</p>
            ) : null}
            {draft.lugares.map((lugar, index) => (
              <div
                key={lugar.id}
                className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50"
              >
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-bold text-slate-500">Lugar {index + 1}</p>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() =>
                      patch(
                        "lugares",
                        draft.lugares.filter((_, i) => i !== index)
                      )
                    }
                    aria-label="Eliminar lugar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  className="admin-input"
                  placeholder="Nombre"
                  value={lugar.nombre}
                  onChange={(e) => {
                    const next = [...draft.lugares];
                    next[index] = { ...lugar, nombre: e.target.value };
                    patch("lugares", next);
                  }}
                />
                <textarea
                  className="admin-input min-h-[72px]"
                  placeholder="Descripción breve"
                  value={lugar.descripcion || ""}
                  onChange={(e) => {
                    const next = [...draft.lugares];
                    next[index] = { ...lugar, descripcion: e.target.value };
                    patch("lugares", next);
                  }}
                />
                <input
                  className="admin-input font-mono text-xs"
                  placeholder="/media/... o URL"
                  value={lugar.imagen || ""}
                  onChange={(e) => {
                    const next = [...draft.lugares];
                    next[index] = { ...lugar, imagen: e.target.value };
                    patch("lugares", next);
                  }}
                />
              </div>
            ))}
          </section>
        )}

        {tab === "galeria" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
            <FeaturedImageField
              slug={draft.slug}
              src={draft.featured_image}
              alt={draft.featured_image_alt || ""}
              caption=""
              credito=""
              mediaFolder={`destinos/${draft.slug}`}
              legend="Imagen de portada"
              onChange={(p) => {
                if (p.featured_image !== undefined) patch("featured_image", p.featured_image);
                if (p.featured_image_alt !== undefined) {
                  patch("featured_image_alt", p.featured_image_alt);
                }
              }}
            />
            <GalleryField
              slug={draft.slug}
              items={galleryItems}
              mainSrc={draft.featured_image}
              mediaFolder={`destinos/${draft.slug}`}
              onChange={(items) =>
                patch(
                  "gallery",
                  items.map((i) => i.src).filter(Boolean)
                )
              }
              onMainChange={(src) => patch("featured_image", src)}
            />
          </section>
        )}

        {tab === "geo" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label className="admin-label" htmlFor="geo-lat">
                  Latitud
                </label>
                <input
                  id="geo-lat"
                  type="number"
                  step="any"
                  className="admin-input"
                  value={draft.geo.lat}
                  onChange={(e) =>
                    patch("geo", { ...draft.geo, lat: Number(e.target.value) })
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="geo-lng">
                  Longitud
                </label>
                <input
                  id="geo-lng"
                  type="number"
                  step="any"
                  className="admin-input"
                  value={draft.geo.lng}
                  onChange={(e) =>
                    patch("geo", { ...draft.geo, lng: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label className="admin-label" htmlFor="geo-alt">
                  Altitud (m)
                </label>
                <input
                  id="geo-alt"
                  type="number"
                  className="admin-input"
                  value={draft.geo.altitude_m ?? ""}
                  onChange={(e) =>
                    patch("geo", {
                      ...draft.geo,
                      altitude_m: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="geo-country">
                  País (ISO)
                </label>
                <input
                  id="geo-country"
                  className="admin-input"
                  value={draft.geo.country}
                  onChange={(e) => patch("geo", { ...draft.geo, country: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="geo-region">
                Región (GEO)
              </label>
              <input
                id="geo-region"
                className="admin-input"
                value={draft.geo.region_label || ""}
                onChange={(e) =>
                  patch("geo", { ...draft.geo, region_label: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="geo-season">
                Mejor temporada
              </label>
              <input
                id="geo-season"
                className="admin-input"
                value={draft.geo.best_season || ""}
                onChange={(e) =>
                  patch("geo", { ...draft.geo, best_season: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="geo-climate">
                Clima (resumen)
              </label>
              <textarea
                id="geo-climate"
                className="admin-input min-h-[72px]"
                value={draft.geo.climate_summary || ""}
                onChange={(e) =>
                  patch("geo", { ...draft.geo, climate_summary: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="geo-wikidata">
                Wikidata sameAs (URL)
              </label>
              <input
                id="geo-wikidata"
                className="admin-input font-mono text-xs"
                value={draft.geo.same_as_wikidata || ""}
                onChange={(e) =>
                  patch("geo", { ...draft.geo, same_as_wikidata: e.target.value })
                }
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(draft.geo.schema_tourist_attraction)}
                onChange={(e) =>
                  patch("geo", {
                    ...draft.geo,
                    schema_tourist_attraction: e.target.checked,
                  })
                }
              />
              Schema.org TouristAttraction
            </label>
          </section>
        )}

        {tab === "seo" && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="admin-field">
              <label className="admin-label" htmlFor="seo-title">
                Meta title
              </label>
              <input
                id="seo-title"
                className="admin-input"
                value={draft.seo.title}
                onChange={(e) => patch("seo", { ...draft.seo, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="seo-desc">
                Meta description
              </label>
              <textarea
                id="seo-desc"
                className="admin-input min-h-[88px]"
                value={draft.seo.description}
                onChange={(e) =>
                  patch("seo", { ...draft.seo, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field">
                <label className="admin-label" htmlFor="seo-kw">
                  Focus keyword
                </label>
                <input
                  id="seo-kw"
                  className="admin-input"
                  value={draft.seo.focus_keyword || ""}
                  onChange={(e) =>
                    patch("seo", { ...draft.seo, focus_keyword: e.target.value })
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="seo-syn">
                  Synonyms
                </label>
                <input
                  id="seo-syn"
                  className="admin-input"
                  value={draft.seo.synonyms || ""}
                  onChange={(e) =>
                    patch("seo", { ...draft.seo, synonyms: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="seo-canonical">
                Canonical
              </label>
              <input
                id="seo-canonical"
                className="admin-input font-mono text-xs"
                value={draft.seo.canonical || ""}
                onChange={(e) =>
                  patch("seo", { ...draft.seo, canonical: e.target.value })
                }
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="seo-og">
                OG image
              </label>
              <input
                id="seo-og"
                className="admin-input font-mono text-xs"
                value={draft.seo.og_image || ""}
                onChange={(e) =>
                  patch("seo", { ...draft.seo, og_image: e.target.value })
                }
              />
            </div>
          </section>
        )}
      </form>

      {duplicateOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Duplicar destino</h2>
            <div className="admin-field">
              <label className="admin-label">Título</label>
              <input
                className="admin-input"
                value={duplicateTitle}
                onChange={(e) => setDuplicateTitle(e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug</label>
              <input
                className="admin-input font-mono text-sm"
                value={duplicateSlug}
                onChange={(e) => setDuplicateSlug(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="admin-ghost-btn"
                onClick={() => setDuplicateOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-ghost-btn bg-slate-900 text-white"
                onClick={async () => {
                  const res = await fetch(
                    adminApi(`/api/admin/destinos/${encodeURIComponent(slug)}/duplicate`),
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ title: duplicateTitle, slug: duplicateSlug }),
                    }
                  );
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || "No se pudo duplicar.", "error");
                    return;
                  }
                  window.location.href = `/admin/destinos/${data.slug}/`;
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
