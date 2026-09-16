"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FilePlus2,
  Pencil,
  RefreshCw,
  Search,
} from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/admin/api";

type AdminDestinoItem = {
  file: string;
  slug: string;
  title: string;
  status: string;
  region: string;
  tipo: string;
  image: string;
};

export default function AdminDestinosListPage() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [items, setItems] = useState<AdminDestinoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "publish" | "draft">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(adminApi("/api/admin/destinos"));
      if (res.status === 401) {
        setAuth("login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No se pudo listar.", "error");
        setAuth("ok");
        return;
      }
      setItems(data.destinations || []);
      setAuth("ok");
    } catch {
      setAuth("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems().catch(() => setAuth("login"));
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery, statusFilter]);

  const toggleStatus = async (slug: string, current: string) => {
    const next = current === "publish" ? "draft" : "publish";
    setActionLoading(slug);
    try {
      const res = await fetch(adminApi("/api/admin/destinos"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No se pudo cambiar el estado.", "error");
        return;
      }
      setItems((prev) => prev.map((p) => (p.slug === slug ? { ...p, status: next } : p)));
      showToast(next === "publish" ? "Destino publicado." : "Destino en borrador.");
    } finally {
      setActionLoading(null);
    }
  };

  if (auth === "checking") {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (auth === "login") {
    return <AdminLoginForm onSuccess={fetchItems} />;
  }

  return (
    <AdminShell wide>
      {toast ? (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
            toast.type === "success"
              ? "bg-slate-900 text-emerald-400 border-emerald-500/30"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.text}</span>
        </div>
      ) : null}

      <header className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Destinos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Páginas de destino: contenido, lugares, GEO, galería y publicar/borrador.
          </p>
        </div>
        <button
          type="button"
          className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
          onClick={() => setCreateOpen(true)}
        >
          <FilePlus2 className="w-4 h-4" aria-hidden="true" />
          Nuevo destino
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="admin-input pl-9"
            placeholder="Buscar por título, slug o región…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <select
          className="admin-input sm:w-44"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
        >
          <option value="all">Todos</option>
          <option value="publish">Publicados</option>
          <option value="draft">Borradores</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Cargando…
        </p>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((item) => (
            <li
              key={item.slug}
              className="bg-white rounded-2xl border border-slate-200 p-4 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <TourImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unprotected
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{item.title}</p>
                <p className="text-[11px] font-mono text-slate-500 truncate">
                  /destinos/{item.slug}/
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {item.region} · {item.tipo} ·{" "}
                  {item.status === "publish" ? "Publicado" : "Borrador"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/destinos/${item.slug}/`} className="admin-ghost-btn">
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-ghost-btn"
                  disabled={actionLoading === item.slug}
                  onClick={() => toggleStatus(item.slug, item.status)}
                >
                  {item.status === "publish" ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  {item.status === "publish" ? "A borrador" : "Publicar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4 border border-slate-200">
            <h2 className="text-lg font-black">Nuevo destino</h2>
            <div className="admin-field">
              <label className="admin-label" htmlFor="new-dest-title">
                Título
              </label>
              <input
                id="new-dest-title"
                className="admin-input"
                value={newTitle}
                onChange={(event) => {
                  setNewTitle(event.target.value);
                  setNewSlug(
                    event.target.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  );
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="new-dest-slug">
                Slug
              </label>
              <input
                id="new-dest-slug"
                className="admin-input font-mono text-xs"
                value={newSlug}
                onChange={(event) => setNewSlug(event.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500">Se crea como borrador. Publícalo cuando esté listo.</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="admin-ghost-btn" onClick={() => setCreateOpen(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
                onClick={async () => {
                  const res = await fetch(adminApi("/api/admin/destinos"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: newTitle, slug: newSlug }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || "No se pudo crear.", "error");
                    return;
                  }
                  window.location.href = `/admin/destinos/${data.slug}/`;
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
