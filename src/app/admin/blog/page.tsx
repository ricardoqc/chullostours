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

type AdminBlogItem = {
  file: string;
  slug: string;
  title: string;
  status: string;
  date: string;
  image: string;
  reading_time: string;
};

export default function AdminBlogListPage() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [posts, setPosts] = useState<AdminBlogItem[]>([]);
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(adminApi("/api/admin/blogs"));
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
      setPosts(data.posts || []);
      setAuth("ok");
    } catch {
      setAuth("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts().catch(() => setAuth("login"));
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (!q) return true;
      return post.title.toLowerCase().includes(q) || post.slug.toLowerCase().includes(q);
    });
  }, [posts, searchQuery, statusFilter]);

  const toggleStatus = async (slug: string, current: string) => {
    const next = current === "publish" ? "draft" : "publish";
    setActionLoading(slug);
    try {
      const res = await fetch(adminApi("/api/admin/blogs"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No se pudo cambiar el estado.", "error");
        return;
      }
      setPosts((prev) => prev.map((p) => (p.slug === slug ? { ...p, status: next } : p)));
      showToast(next === "publish" ? "Post publicado." : "Post en borrador.");
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
    return <AdminLoginForm onSuccess={fetchPosts} />;
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
          <h1 className="text-2xl font-black font-title text-slate-900">Blog</h1>
          <p className="text-sm text-slate-500 mt-1">Edita posts, SEO, GEO e imágenes destacadas.</p>
        </div>
        <button type="button" className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800" onClick={() => setCreateOpen(true)}>
          <FilePlus2 className="w-4 h-4" aria-hidden="true" />
          Nuevo post
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="admin-input pl-9"
            placeholder="Buscar por título o slug…"
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
          {filtered.map((post) => (
            <li
              key={post.slug}
              className="bg-white rounded-2xl border border-slate-200 p-4 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <TourImage src={post.image} alt={post.title} fill className="object-cover" sizes="120px" unprotected />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{post.title}</p>
                <p className="text-[11px] font-mono text-slate-500 truncate">/blog/{post.slug}/</p>
                <p className="text-xs text-slate-500 mt-1">
                  {post.date} · {post.reading_time} min · {post.status === "publish" ? "Publicado" : "Borrador"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/blog/${post.slug}/`} className="admin-ghost-btn">
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-ghost-btn"
                  disabled={actionLoading === post.slug}
                  onClick={() => toggleStatus(post.slug, post.status)}
                >
                  {post.status === "publish" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {post.status === "publish" ? "A borrador" : "Publicar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4 border border-slate-200">
            <h2 className="text-lg font-black font-title">Nuevo post</h2>
            <div className="admin-field">
              <label className="admin-label" htmlFor="new-title">
                Título
              </label>
              <input
                id="new-title"
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
              <label className="admin-label" htmlFor="new-slug">
                Slug
              </label>
              <input
                id="new-slug"
                className="admin-input font-mono text-xs"
                value={newSlug}
                onChange={(event) => setNewSlug(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="admin-ghost-btn" onClick={() => setCreateOpen(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="admin-ghost-btn bg-slate-900 text-white hover:bg-slate-800"
                onClick={async () => {
                  const res = await fetch(adminApi("/api/admin/blogs"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: newTitle, slug: newSlug }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    showToast(data.error || "No se pudo crear.", "error");
                    return;
                  }
                  window.location.href = `/admin/blog/${data.slug}/`;
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
