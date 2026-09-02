"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  Compass,
  DollarSign,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";

interface AdminTourItem {
  file: string;
  slug: string;
  title: string;
  duration: string;
  price_usd: number;
  visible: boolean;
  image: string;
  destinations: string[];
}

export default function AdminToursPage() {
  const [key, setKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tours, setTours] = useState<AdminTourItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");

  useEffect(() => {
    const savedKey = sessionStorage.getItem("chullos_admin_key");
    if (savedKey) {
      setKey(savedKey);
      fetchTours(savedKey);
    }
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const fetchTours = async (adminKey: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/tours?key=${encodeURIComponent(adminKey)}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();

      if (!res.ok) {
        setIsAuthenticated(false);
        setErrorMsg(data.error || "Clave administrativa incorrecta.");
        sessionStorage.removeItem("chullos_admin_key");
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem("chullos_admin_key", adminKey);
        setTours(data.tours || []);
      }
    } catch {
      setErrorMsg("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    fetchTours(key.trim());
  };

  const handleToggleVisibility = async (slug: string, currentVisible: boolean) => {
    const newVisible = !currentVisible;
    setActionLoading(slug);

    try {
      const res = await fetch("/api/admin/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ slug, visible: newVisible, key }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state
        setTours((prev) =>
          prev.map((t) => (t.slug === slug ? { ...t, visible: newVisible } : t))
        );
        showToast(
          newVisible
            ? `Tour '${slug}' publicado y visible en la web.`
            : `Tour '${slug}' desactivado y oculto de la web.`,
          "success"
        );
      } else {
        showToast(data.error || "Error al actualizar tour.", "error");
      }
    } catch {
      showToast("Error de conexión al actualizar.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered tours
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "published") return tour.visible;
    if (statusFilter === "hidden") return !tour.visible;
    return true;
  });

  const totalCount = tours.length;
  const publishedCount = tours.filter((t) => t.visible).length;
  const hiddenCount = tours.filter((t) => !t.visible).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-title">
              Panel Mini-CMS de Tours
            </h1>
            <p className="text-xs text-slate-500 max-w-xs">
              Ingresa la clave de administración para gestionar la visibilidad y publicación de tours.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clave Administrativa
              </label>
              <input
                type="password"
                placeholder="Clave (por defecto: chullos2026)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6b0014] text-sm"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6b0014] hover:bg-[#850019] text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-900/10"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Acceder al Panel"}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Chullos Tours CMS • Control de Visibilidad en Producción
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Toast Notification */}
        {toastMsg && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all border ${
              toastMsg.type === "success"
                ? "bg-slate-900 text-emerald-400 border-emerald-500/30"
                : "bg-red-900 text-white border-red-700"
            }`}
          >
            {toastMsg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-300" />
            )}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Top Header & Stats */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6b0014] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Gestión de Catálogo
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-title">
              Control de Publicación de Tours
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Activa o desactiva tours al instante. Los tours desactivados se ocultan de inmediato del catálogo, la portada, los destinos y el sitemap.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => fetchTours(key)}
              disabled={loading}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Refrescar catálogo"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("chullos_admin_key");
                setIsAuthenticated(false);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl text-xs font-bold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`p-5 rounded-2xl border text-left transition-all ${
              statusFilter === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Total de Tours</div>
            <div className="text-3xl font-black mt-1">{totalCount}</div>
            <div className="text-[11px] mt-1 opacity-70">Catálogo completo en el sistema</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`p-5 rounded-2xl border text-left transition-all ${
              statusFilter === "published"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Publicados (Visibles)</div>
            <div className="text-3xl font-black mt-1 text-emerald-500 group-hover:text-emerald-600">
              {publishedCount}
            </div>
            <div className="text-[11px] mt-1 opacity-70">Disponibles para reserva y en Google</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("hidden")}
            className={`p-5 rounded-2xl border text-left transition-all ${
              statusFilter === "hidden"
                ? "bg-red-600 text-white border-red-600 shadow-lg"
                : "bg-white text-slate-800 border-slate-200 hover:border-red-300"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Desactivados (Ocultos)</div>
            <div className="text-3xl font-black mt-1 text-red-500">
              {hiddenCount}
            </div>
            <div className="text-[11px] mt-1 opacity-70">Ocultos de la web y sitemap (404 seguro)</div>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b0014]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                statusFilter === "published" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Visibles ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter("hidden")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                statusFilter === "hidden" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ocultos ({hiddenCount})
            </button>
          </div>
        </div>

        {/* Tours List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredTours.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-semibold">No se encontraron tours con los filtros actuales.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTours.map((tour) => {
                const isOperating = actionLoading === tour.slug;
                return (
                  <div
                    key={tour.slug}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                      tour.visible ? "hover:bg-slate-50/70" : "bg-red-50/20 hover:bg-red-50/40"
                    }`}
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <TourImage
                          src={tour.image}
                          alt={tour.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        {!tour.visible && (
                          <div className="absolute inset-0 bg-red-900/60 backdrop-blur-[1px] flex items-center justify-center text-white">
                            <EyeOff className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              tour.visible
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tour.visible ? "● Visible en Web" : "✕ Oculto"}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {tour.file}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 font-title truncate">
                          {tour.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {tour.duration}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            USD ${tour.price_usd}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Switch */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {tour.visible && (
                        <Link
                          href={`/tours/${tour.slug}/`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-[#6b0014] rounded-xl hover:bg-slate-100 transition-colors"
                          title="Ver en la web pública"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(tour.slug, tour.visible)}
                        disabled={isOperating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          tour.visible
                            ? "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                        }`}
                      >
                        {isOperating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : tour.visible ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
                            <span>Desactivar Tour</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Publicar Tour</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
