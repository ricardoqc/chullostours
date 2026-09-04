"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  MapPin,
  Mountain,
  Wallet,
  Plane,
  Activity,
  ShieldCheck,
  Award,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DESTINATION_FILTERS } from "@/lib/tour-filters";
import { getWhatsappAgents, buildAgentWhatsappUrl } from "@/lib/site-config";
import { trackGenerateLead, trackWhatsAppClick } from "@/lib/analytics";

const TRAVEL_STYLES = [
  "Cultural / Historia",
  "Trekking / Aventura",
  "Relax y paisajes",
  "Familiar",
  "Luna de miel / Pareja",
  "Fotografía",
];

const BUDGETS = [
  "Económico (hasta $80/día)",
  "Intermedio ($80–150/día)",
  "Confort ($150–250/día)",
  "Premium ($250+/día)",
  "Aún no lo sé",
];

const FITNESS = ["Suave", "Moderado", "Exigente", "Muy exigente"];

export default function CustomTripPage() {
  const destinations = useMemo(
    () =>
      DESTINATION_FILTERS.filter((d) => d.id !== "all").map((d) => ({
        id: d.id,
        label: d.label,
      })),
    []
  );

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    nights: "5",
    datesFlexible: true,
    startDate: "",
    style: TRAVEL_STYLES[0],
    budget: BUDGETS[1],
    fitness: FITNESS[1],
    hasFlights: "no",
    notes: "",
    termsAccepted: false,
    website: "",
  });

  const agents = getWhatsappAgents();
  const primaryAgent = agents[0] || { name: "Lucía", raw: "51992558512" };

  const selectedDestLabels = selectedDests.map(
    (id) => destinations.find((d) => d.id === id)?.label || id
  );

  const toggleDest = (id: string) => {
    setSelectedDests((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    setErrors((prev) => ({ ...prev, destinations: "" }));
  };

  const getWaFormattedMessage = () => {
    const destsStr = selectedDestLabels.join(", ") || "Por definir";
    const dateStr = form.datesFlexible ? "Fechas flexibles" : form.startDate || "Por definir";
    return `¡Hola ${primaryAgent.name}! Acabo de solicitar un itinerario a medida en la web de Chullos Tours:\n\n👤 *Nombre:* ${form.name || "Viajero"}\n🗺️ *Destinos:* ${destsStr}\n👥 *Viajeros:* ${form.travelers} personas\n🌙 *Noches:* ${form.nights} noches\n📅 *Fecha:* ${dateStr}\n🎒 *Estilo:* ${form.style}\n💰 *Presupuesto:* ${form.budget}\n\n¿Podrías brindarme más detalles y cotización personalizada?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) {
      setSubmitted(true);
      return;
    }

    const newErrors: Record<string, string> = {};
    if (selectedDests.length === 0) {
      newErrors.destinations = "Selecciona al menos un destino de tu interés.";
    }
    if (!form.termsAccepted) {
      newErrors.termsAccepted = "Debes aceptar los términos para continuar.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSending(true);
    setErrors({});

    try {
      const res = await fetch("/api/send-custom-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinations: selectedDestLabels,
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          travelers: parseInt(form.travelers, 10) || 1,
          nights: parseInt(form.nights, 10) || 1,
          datesFlexible: form.datesFlexible,
          startDate: form.startDate,
          style: form.style,
          budget: form.budget,
          fitness: form.fitness,
          hasFlights: form.hasFlights,
          notes: form.notes,
          termsAccepted: form.termsAccepted,
          website: form.website,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setErrors({
          submit: data.error || "No se pudo enviar la solicitud. Intenta de nuevo.",
        });
        return;
      }

      trackGenerateLead({
        formName: "viaje_personalizado",
        method: "custom_trip_wizard",
        contactEmail: form.email,
        contactPhone: form.phone,
      });

      setSubmitted(true);
    } catch {
      setErrors({
        submit:
          "No pudimos conectar con nuestro servidor. Revisa tu conexión e inténtalo otra vez.",
      });
    } finally {
      setSending(false);
    }
  };

  const waUrl = buildAgentWhatsappUrl(primaryAgent.raw, getWaFormattedMessage());

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 my-10 animate-fadeInUp">
        <div className="w-20 h-20 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-[#6b0014]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1c1c] font-title">
          ¡Solicitud enviada con éxito!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg leading-relaxed">
          Un especialista de nuestro equipo cusqueño diseñará tu propuesta a medida y te responderá en breve.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-title text-sm"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>Hablar ahora con {primaryAgent.name} en WhatsApp</span>
          </a>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSubmitted(false)}
            className="w-full sm:w-auto font-title text-sm"
          >
            Modificar consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-slate-50">
      <div className="bg-[#6b0014] text-white py-12 md:py-16 px-4 text-center relative overflow-hidden">
        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-2 z-10">
          <span className="text-[#ffc000] text-xs font-extrabold uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20 font-title">
            Itinerarios 100% personalizados
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-title mt-1 tracking-tight">
            Diseña tu viaje a los Andes
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl mx-auto mt-2 leading-relaxed">
            Cuéntanos fechas, destinos y ritmo. Un asesor en Cusco te envía una propuesta sin costo
            ni compromiso.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-8 relative z-20">
        <form
          id="gtm-custom-trip-form"
          data-gtm-action="custom_trip_form_submit"
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 md:p-8 flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs text-slate-600 lg:hidden">
            <ShieldCheck className="w-5 h-5 text-[#6b0014] shrink-0" />
            <span>Cotización gratuita · Agencia autorizada MINCETUR</span>
          </div>

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-1.5 font-title">
              <MapPin className="w-3.5 h-3.5 text-[#6b0014]" /> Destinos de interés
            </label>
            <div className="flex flex-wrap gap-2">
              {destinations.map((d) => {
                const on = selectedDests.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDest(d.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      on
                        ? "bg-[#6b0014] text-white border-[#6b0014]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {on ? "✓ " : ""}
                    {d.label}
                  </button>
                );
              })}
            </div>
            {errors.destinations && (
              <span className="text-[11px] text-rose-600 font-semibold">{errors.destinations}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600 flex gap-1.5 items-center">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Nombre completo
              </label>
              <input
                required
                placeholder="Ej. Carlos Mendoza"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6b0014]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">WhatsApp</label>
              <input
                required
                placeholder="+51 999 000 000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6b0014]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input
                required
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6b0014]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Viajeros</label>
              <input
                type="number"
                min={1}
                value={form.travelers}
                onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Noches</label>
              <input
                type="number"
                min={1}
                value={form.nights}
                onChange={(e) => setForm({ ...form, nights: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold"
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 flex gap-1 items-center">
                <Calendar className="w-3 h-3" /> Fecha estimada
              </label>
              <input
                type="date"
                disabled={form.datesFlexible}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm disabled:bg-slate-100"
              />
              <label className="text-[11px] text-slate-600 flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.datesFlexible}
                  onChange={(e) => setForm({ ...form, datesFlexible: e.target.checked })}
                  className="rounded text-[#6b0014]"
                />
                Fechas flexibles
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex gap-1.5 items-center">
                <Compass className="w-3.5 h-3.5 text-slate-400" /> Estilo
              </label>
              <select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
              >
                {TRAVEL_STYLES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex gap-1.5 items-center">
                <Wallet className="w-3.5 h-3.5 text-slate-400" /> Presupuesto
              </label>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
              >
                {BUDGETS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex gap-1.5 items-center">
                <Activity className="w-3.5 h-3.5 text-slate-400" /> Esfuerzo físico
              </label>
              <select
                value={form.fitness}
                onChange={(e) => setForm({ ...form, fitness: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
              >
                {FITNESS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex gap-1.5 items-center">
                <Plane className="w-3.5 h-3.5 text-slate-400" /> Vuelos
              </label>
              <select
                value={form.hasFlights}
                onChange={(e) => setForm({ ...form, hasFlights: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white"
              >
                <option value="no">Aún no</option>
                <option value="si">Ya comprados</option>
                <option value="proceso">En búsqueda</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
            <label className="text-xs font-extrabold uppercase text-slate-700 flex gap-1.5 items-center font-title">
              <Mountain className="w-3.5 h-3.5 text-[#6b0014]" /> Notas para el asesor
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Niños, aniversario, hoteles boutique, restricciones..."
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-[#6b0014]"
            />
          </div>

          <label className="flex items-start gap-2 text-xs cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => {
                setForm({ ...form, termsAccepted: e.target.checked });
                if (e.target.checked) setErrors((prev) => ({ ...prev, termsAccepted: "" }));
              }}
              className="mt-0.5"
            />
            <span>
              Acepto los{" "}
              <a href="/terminos-y-condiciones/" target="_blank" rel="noopener noreferrer" className="text-[#6b0014] font-bold underline">
                términos
              </a>{" "}
              y autorizo contacto por WhatsApp.
            </span>
          </label>
          {errors.termsAccepted && (
            <span className="text-[11px] text-rose-600 font-semibold">{errors.termsAccepted}</span>
          )}

          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex flex-col gap-2.5">
              <p className="text-[11px] text-rose-600 font-semibold">{errors.submit}</p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                Enviar por WhatsApp
              </a>
            </div>
          )}

          <Button
            id="gtm-custom-trip-submit-btn"
            data-gtm-action="submit_custom_trip_button"
            type="submit"
            variant="primary"
            size="lg"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white font-title font-bold py-4 rounded-xl cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {sending ? "Enviando..." : "Solicitar itinerario a medida"}
          </Button>
        </form>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#6b0014] text-xs font-extrabold uppercase">
              <ShieldCheck className="w-4 h-4" />
              Por qué Chullos
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Cotización sin compromiso en 24–48 h
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Operador directo en Cusco (sin intermediarios)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Itinerarios flexibles: cultura, trek o confort
              </li>
            </ul>
          </div>

          <div className="bg-[#6b0014]/5 border border-[#6b0014]/15 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-xs font-extrabold uppercase text-[#6b0014]">¿Prefieres WhatsApp?</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Escríbenos directamente a {primaryAgent.name}. Te atendemos en español e inglés.
            </p>
            <a
              href={buildAgentWhatsappUrl(primaryAgent.raw, "¡Hola! Quiero armar un viaje personalizado a Perú.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-xl"
            >
              <FaWhatsapp className="w-4 h-4" />
              Chatear con {primaryAgent.name}
            </a>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-[11px] text-amber-950 flex gap-2">
            <Award className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Sin pago online: confirmamos disponibilidad contigo antes de cualquier anticipo.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
