"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Users,
  MapPin,
  Ticket,
} from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/admin/api";
import type { LeadRecord, LeadStatus } from "@/lib/leads-store";

type LeadsResponse = {
  ok: boolean;
  leads: LeadRecord[];
  stats: {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  converted: "Convertido",
  closed: "Cerrado",
};

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminLeadsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<LeadsResponse["stats"] | null>(null);
  const [filter, setFilter] = useState<"all" | "reservation" | "custom_trip">("all");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(adminApi("/api/admin/leads"));
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = (await res.json()) as LeadsResponse;
      if (!res.ok || !data.ok) {
        setError("No se pudieron cargar los leads.");
        return;
      }
      setIsAuthenticated(true);
      setLeads(data.leads || []);
      setStats(data.stats || null);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((l) => l.type === filter);
  }, [leads, filter]);

  const setStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(adminApi("/api/admin/leads"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) return;
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {
      /* ignore */
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminShell>
        <AdminLoginForm onSuccess={() => void load()} />
      </AdminShell>
    );
  }

  return (
    <AdminShell wide>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leads</h1>
            <p className="text-sm text-slate-500 mt-1">
              Reservas y viajes a medida enviados desde la web.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 min-h-11 px-3 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: stats.total, icon: Inbox },
              { label: "Reservas", value: stats.byType.reservation || 0, icon: Ticket },
              { label: "A medida", value: stats.byType.custom_trip || 0, icon: MapPin },
              { label: "Nuevos", value: stats.byStatus.new || 0, icon: Users },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                  <card.icon className="w-3.5 h-3.5" />
                  {card.label}
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">{card.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Todos"],
              ["reservation", "Reservas"],
              ["custom_trip", "Viaje a medida"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`min-h-10 px-3 rounded-xl text-xs font-bold border ${
                filter === key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold p-3">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {visible.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">
              {loading ? "Cargando…" : "Aún no hay leads guardados."}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visible.map((lead) => (
                <li key={lead.id} className="p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {lead.type === "reservation" ? "Reserva" : "A medida"}
                        </span>
                        {lead.ticketId && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                            {lead.ticketId}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{formatWhen(lead.createdAt)}</span>
                      </div>
                      <h2 className="text-base font-black text-slate-900 mt-1 truncate">
                        {lead.fullName}
                      </h2>
                      <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                        {lead.tourTitle || "Viaje personalizado"}
                        {lead.travelDate ? ` · ${lead.travelDate}` : ""}
                        {lead.travelers ? ` · ${lead.travelers} pax` : ""}
                        {lead.totalPrice != null
                          ? ` · ${lead.currency === "PEN" ? "S/" : "$"}${lead.totalPrice}`
                          : ""}
                      </p>
                    </div>
                    <select
                      value={lead.status}
                      onChange={(e) => void setStatus(lead.id, e.target.value as LeadStatus)}
                      className="min-h-10 rounded-xl border border-slate-200 px-3 text-xs font-bold bg-white"
                    >
                      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 font-semibold hover:text-slate-900"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {lead.email}
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold hover:text-slate-900"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {lead.phone}
                    </a>
                    {lead.country && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {lead.country}
                      </span>
                    )}
                    {lead.source && <span>Fuente: {lead.source}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
