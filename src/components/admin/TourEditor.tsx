"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, RefreshCw, Save } from "lucide-react";
import { DESTINO_OPTIONS, type TourDraft } from "@/lib/admin/tour-schema";
import { StringListField } from "@/components/admin/StringListField";
import { GalleryField } from "@/components/admin/GalleryField";
import { ItineraryField } from "@/components/admin/ItineraryField";
import { FaqsField } from "@/components/admin/FaqsField";
import { adminApi } from "@/lib/admin/api";

const TABS = [
  { id: "general", label: "General" },
  { id: "precios", label: "Precios" },
  { id: "contenido", label: "Detalles" },
  { id: "itinerario", label: "Itinerario" },
  { id: "galeria", label: "Imágenes" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type TourEditorProps = {
  slug: string;
  file: string;
  initialDraft: TourDraft;
};

export function TourEditor({ slug, file, initialDraft }: TourEditorProps) {
  const [draft, setDraft] = useState<TourDraft>(initialDraft);
  const [savedDraft, setSavedDraft] = useState<TourDraft>(initialDraft);
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [errorSummary, setErrorSummary] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateSlug, setDuplicateSlug] = useState(`${slug}-copia`);
  const [duplicateTitle, setDuplicateTitle] = useState(`${initialDraft.titulo} (copia)`);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedDraft), [draft, savedDraft]);

  const patch = <K extends keyof TourDraft>(key: K, value: TourDraft[K]) => {
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
      const res = await fetch(adminApi(`/api/admin/tours/${encodeURIComponent(slug)}`), {
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
      showToast("Tour guardado. Las páginas públicas se revalidaron.");
    } catch {
      showToast("Error de conexión al guardar.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(adminApi(`/api/admin/tours/${encodeURIComponent(slug)}/duplicate`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: duplicateSlug, titulo: duplicateTitle }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No se pudo duplicar.", "error");
        return;
      }
      window.location.href = `/admin/tours/${data.slug}/`;
    } catch {
      showToast("Error de conexión al duplicar.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
    <form onSubmit={handleSubmit} method="post" className="space-y-6" noValidate>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
            toast.type === "success" ? "bg-slate-900 text-emerald-400 border-emerald-500/30" : "bg-red-900 text-white border-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#6b0014] uppercase tracking-wider">Editor de tour</p>
          <h1 className="text-2xl font-black text-slate-900 font-title">{draft.titulo}</h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {file} · /tours/{slug}/
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {draft.visible && (
            <Link href={`/tours/${slug}/`} target="_blank" className="admin-ghost-btn">
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Ver en web
            </Link>
          )}
          <button type="button" onClick={() => setDuplicateOpen((open) => !open)} className="admin-ghost-btn">
            <Copy className="w-4 h-4" aria-hidden="true" />
            Duplicar
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 min-h-12 rounded-xl bg-[#6b0014] text-white text-xs font-bold">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </button>
        </div>
      </div>

      {dirty && (
        <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          Tienes cambios sin guardar.
        </p>
      )}

      {errorSummary && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2" role="alert">
          {errorSummary}
        </div>
      )}

      <div role="tablist" aria-label="Secciones del tour" className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 min-h-11 ${
              tab === item.id ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div className="admin-field">
            <label htmlFor="titulo" className="admin-label">
              Título
            </label>
            <input
              id="titulo"
              name="titulo"
              required
              value={draft.titulo}
              onChange={(event) => patch("titulo", event.target.value)}
              className="admin-input"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label htmlFor="categoria" className="admin-label">
                Categoría
              </label>
              <input
                id="categoria"
                name="categoria"
                value={draft.categoria || ""}
                onChange={(event) => patch("categoria", event.target.value)}
                className="admin-input"
              />
            </div>
            <fieldset>
              <legend className="admin-label">Publicación</legend>
              <label className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="visible"
                  checked={draft.visible}
                  onChange={(event) => patch("visible", event.target.checked)}
                  className="w-4 h-4 accent-[#6b0014]"
                />
                Visible en la web, catálogo y sitemap
              </label>
            </fieldset>
          </div>
          <fieldset>
            <legend className="admin-label mb-2">Destinos</legend>
            <div className="flex flex-wrap gap-3">
              {DESTINO_OPTIONS.map((option) => (
                <label key={option.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="destino_ids"
                    value={option.id}
                    checked={draft.destino_ids.includes(option.id)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...draft.destino_ids, option.id]
                        : draft.destino_ids.filter((id) => id !== option.id);
                      patch("destino_ids", next);
                    }}
                    className="accent-[#6b0014]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label htmlFor="duracion" className="admin-label">
                Duración
              </label>
              <input
                id="duracion"
                name="duracion"
                required
                value={draft.atributos.duracion}
                onChange={(event) => patch("atributos", { ...draft.atributos, duracion: event.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="ubicacion" className="admin-label">
                Ubicación
              </label>
              <input
                id="ubicacion"
                name="ubicacion"
                required
                value={draft.atributos.ubicacion}
                onChange={(event) => patch("atributos", { ...draft.atributos, ubicacion: event.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="tipo_tour" className="admin-label">
                Tipo de tour
              </label>
              <input
                id="tipo_tour"
                name="tipo_tour"
                required
                value={draft.atributos.tipo_tour}
                onChange={(event) => patch("atributos", { ...draft.atributos, tipo_tour: event.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="dificultad" className="admin-label">
                Dificultad
              </label>
              <input
                id="dificultad"
                name="dificultad"
                value={draft.atributos.dificultad || ""}
                onChange={(event) => patch("atributos", { ...draft.atributos, dificultad: event.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="altitud_maxima" className="admin-label">
                Altitud máxima
              </label>
              <input
                id="altitud_maxima"
                name="altitud_maxima"
                value={draft.atributos.altitud_maxima || ""}
                onChange={(event) => patch("atributos", { ...draft.atributos, altitud_maxima: event.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="grupo_max" className="admin-label">
                Grupo máximo
              </label>
              <input
                id="grupo_max"
                name="grupo_max"
                type="number"
                min={1}
                inputMode="numeric"
                value={draft.atributos.grupo_max ?? ""}
                onChange={(event) =>
                  patch("atributos", {
                    ...draft.atributos,
                    grupo_max: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
          <StringListField
            id="idiomas"
            label="Idiomas"
            values={draft.atributos.idiomas}
            onChange={(idiomas) => patch("atributos", { ...draft.atributos, idiomas })}
            placeholder="Español"
          />
          <div className="admin-field">
            <label htmlFor="resumen" className="admin-label">
              Resumen
            </label>
            <textarea
              id="resumen"
              name="resumen"
              required
              rows={4}
              value={draft.resumen}
              onChange={(event) => patch("resumen", event.target.value)}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="descripcion_completa" className="admin-label">
              Descripción completa
            </label>
            <textarea
              id="descripcion_completa"
              name="descripcion_completa"
              rows={8}
              value={draft.descripcion_completa || ""}
              onChange={(event) => patch("descripcion_completa", event.target.value)}
              className="admin-input"
            />
          </div>
        </section>
      )}

      {tab === "precios" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-field">
              <label htmlFor="precio_usd" className="admin-label">
                Precio USD
              </label>
              <input
                id="precio_usd"
                name="precio_usd"
                type="number"
                min={0}
                step="1"
                inputMode="decimal"
                required
                value={draft.precio_usd}
                onChange={(event) => patch("precio_usd", Number(event.target.value) || 0)}
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="precio_pen" className="admin-label">
                Precio PEN
              </label>
              <input
                id="precio_pen"
                name="precio_pen"
                type="number"
                min={0}
                step="1"
                inputMode="decimal"
                value={draft.precio_pen ?? ""}
                onChange={(event) => patch("precio_pen", event.target.value ? Number(event.target.value) : undefined)}
                className="admin-input"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Al guardar se sincroniza `precio`, la oferta de Schema.org y la imagen OG si cambiaste la galería.
          </p>
        </section>
      )}

      {tab === "contenido" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-8">
          <StringListField id="incluye" label="Incluye" values={draft.incluye} onChange={(values) => patch("incluye", values)} />
          <StringListField id="no_incluye" label="No incluye" values={draft.no_incluye} onChange={(values) => patch("no_incluye", values)} />
          <StringListField
            id="recomendaciones"
            label="Recomendaciones"
            values={draft.recomendaciones}
            onChange={(values) => patch("recomendaciones", values)}
            multiline
          />
          <StringListField
            id="destacados"
            label="Destacados"
            values={draft.destacados_highlights}
            onChange={(values) => patch("destacados_highlights", values)}
            multiline
          />
          <StringListField
            id="propuesta"
            label="Propuesta de valor"
            values={draft.propuesta_de_valor}
            onChange={(values) => patch("propuesta_de_valor", values)}
            multiline
          />
          <FaqsField faqs={draft.faqs} onChange={(faqs) => patch("faqs", faqs)} />
        </section>
      )}

      {tab === "itinerario" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6">
          <ItineraryField days={draft.itinerario} onChange={(itinerario) => patch("itinerario", itinerario)} />
        </section>
      )}

      {tab === "galeria" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6">
          <GalleryField
            slug={slug}
            items={draft.galeria}
            mainSrc={draft.imagen_principal || draft.galeria[0]?.src || ""}
            onChange={(galeria) => patch("galeria", galeria)}
            onMainChange={(src) => patch("imagen_principal", src)}
          />
        </section>
      )}

      {tab === "seo" && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="admin-field">
            <label htmlFor="meta_title" className="admin-label">
              Meta title
            </label>
            <input
              id="meta_title"
              name="meta_title"
              required
              value={draft.seo.meta_title}
              onChange={(event) => patch("seo", { ...draft.seo, meta_title: event.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="meta_description" className="admin-label">
              Meta description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              required
              rows={3}
              value={draft.seo.meta_description}
              onChange={(event) => patch("seo", { ...draft.seo, meta_description: event.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="focus_keyword" className="admin-label">
              Palabra clave
            </label>
            <input
              id="focus_keyword"
              name="focus_keyword"
              required
              value={draft.seo.focus_keyword}
              onChange={(event) => patch("seo", { ...draft.seo, focus_keyword: event.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="canonical" className="admin-label">
              Canonical
            </label>
            <input
              id="canonical"
              name="canonical"
              required
              value={draft.seo.canonical}
              onChange={(event) => patch("seo", { ...draft.seo, canonical: event.target.value })}
              className="admin-input font-mono text-xs"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="og_title" className="admin-label">
              OG title
            </label>
            <input
              id="og_title"
              name="og_title"
              required
              value={draft.metas.og_title}
              onChange={(event) => patch("metas", { ...draft.metas, og_title: event.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="og_description" className="admin-label">
              OG / meta corta
            </label>
            <textarea
              id="og_description"
              name="og_description"
              required
              rows={3}
              value={draft.metas.description}
              onChange={(event) => patch("metas", { ...draft.metas, description: event.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="og_image" className="admin-label">
              Imagen Open Graph
            </label>
            <input
              id="og_image"
              name="og_image"
              value={draft.seo.og_image || ""}
              onChange={(event) => patch("seo", { ...draft.seo, og_image: event.target.value })}
              className="admin-input font-mono text-xs"
            />
          </div>
        </section>
      )}
    </form>

      {duplicateOpen && (
        <form onSubmit={handleDuplicate} method="post" className="bg-white rounded-2xl border border-slate-200 p-4 grid gap-3 sm:grid-cols-2">
          <div className="admin-field">
            <label htmlFor="duplicate-slug" className="admin-label">
              Nuevo slug
            </label>
            <input
              id="duplicate-slug"
              name="duplicate-slug"
              required
              value={duplicateSlug}
              onChange={(event) => setDuplicateSlug(event.target.value)}
              className="admin-input font-mono"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="duplicate-title" className="admin-label">
              Nuevo título
            </label>
            <input
              id="duplicate-title"
              name="duplicate-title"
              required
              value={duplicateTitle}
              onChange={(event) => setDuplicateTitle(event.target.value)}
              className="admin-input"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800">
              Crear copia oculta
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
