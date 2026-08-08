"use client";

import React, { useState } from "react";
import {
  Compass,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  MapPin,
  Mountain,
  Star,
  Clock,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  "Cusco Ciudad",
  "Machu Picchu",
  "El Valle Sagrado de Los Incas",
  "Maras & Moray",
  "Lugares Místicos",
  "Montaña Salkantay",
  "Montaña Ausangate",
  "Montaña Pikoll",
  "Laguna Humantay",
  "7 Lagunas de Ausangate",
  "Montaña de Colores",
  "Waqrapucara",
  "Valle Rojo de Palccoyo",
  "Chincheros y Poc poc",
  "Chincheros y Urquillos",
  "Huchuy Qosqo",
  "Camino Inca a Machu Picchu",
  "Lima Ciudad",
  "Arequipa Ciudad",
  "Ica Ciudad",
  "Puno Ciudad",
  "Lago Titicaca",
  "Cañon del Colca",
  "Ruta del Sillar",
  "Oasis La Huacachina",
  "Isla Ballestas",
];

export default function CustomTripPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);

  const toggleDest = (dest: string) => {
    setSelectedDests((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 my-10">
        <div className="w-20 h-20 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1c1c1c]">
          ¡Solicitud Recibida con Éxito!
        </h1>
        <p className="text-gray-600 text-base max-w-lg leading-relaxed">
          Un especialista en viajes de Chullos Tours diseñará tu itinerario ideal y te contactará en menos de 24 horas vía WhatsApp o correo electrónico.
        </p>
        <Button variant="primary" size="lg" onClick={() => setSubmitted(false)}>
          Enviar otra consulta
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest">
            A tu Medida
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Personaliza tu Aventura
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl font-light leading-relaxed">
            Bienvenido a tu espacio de viajes personalizados, donde cada itinerario es tan único como tú.
            En Chullos Tours, diseñamos experiencias a la medida que se adaptan a tus intereses y sueños.
            Aquí tendrás la libertad de elegir cada detalle de tu aventura.
          </p>
        </div>
      </div>

      {/* Benefits strip */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Star className="w-5 h-5 text-[#6b0014]" />, label: "Itinerarios Exclusivos" },
            { icon: <Users className="w-5 h-5 text-[#6b0014]" />, label: "Grupos Pequeños" },
            { icon: <Mountain className="w-5 h-5 text-[#6b0014]" />, label: "25+ Destinos" },
            { icon: <Clock className="w-5 h-5 text-[#6b0014]" />, label: "Respuesta en 24h" },
          ].map((item, i) => (
            <div key={i} className="bg-[#f7f7f7] rounded-3xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-[#6b0014]/10 rounded-2xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-[#1c1c1c]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-[#f7f7f7] p-8 md:p-12 rounded-3xl border border-gray-200 flex flex-col gap-8 shadow-sm"
        >
          {/* Step 1: Destinations */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#1c1c1c] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6b0014]" />
              1. ¿Qué lugares te gustaría visitar en Perú?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-[#1c1c1c]">
              {DESTINATIONS.map((dest) => (
                <label
                  key={dest}
                  className={`bg-white p-3 rounded-2xl border cursor-pointer transition-colors flex items-center gap-2 ${
                    selectedDests.includes(dest)
                      ? "border-[#6b0014] bg-[#6b0014]/5"
                      : "border-gray-200 hover:border-[#6b0014]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-[#6b0014] shrink-0"
                    checked={selectedDests.includes(dest)}
                    onChange={() => toggleDest(dest)}
                  />
                  <span>{dest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Trip Details */}
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-[#1c1c1c]">2. Detalles de tu Viaje</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c]">Categoría de Viaje</label>
                <select
                  id="custom-trip-category"
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
                >
                  <option value="Standard">Standard</option>
                  <option value="Privado">Privado</option>
                  <option value="Lujoso">Lujoso</option>
                  <option value="Ahorrador">Ahorrador</option>
                  <option value="Extendido">Extendido (Varios días)</option>
                  <option value="Acelerado">Acelerado (Pocos días)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c]">Tipo de Aventura</label>
                <select
                  id="custom-trip-type"
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
                >
                  <option value="Tradicional">Tradicional</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Trekking">Trekking</option>
                  <option value="Vivencial">Vivencial</option>
                  <option value="Gastronómico">Gastronómico</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Con Actividades">Con Actividades</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c]">Tiempo de Viaje</label>
                <select
                  id="custom-trip-duration"
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
                >
                  <option value="1 Día">1 Día</option>
                  <option value="2 Días">2 Días</option>
                  <option value="3 a 5 Días">3 a 5 Días</option>
                  <option value="6 a 10 Días">6 a 10 Días</option>
                  <option value="11 a 14 Días">11 a 14 Días</option>
                  <option value="+15 Días">+15 Días</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Fecha próxima de viaje
                </label>
                <input
                  id="custom-trip-date"
                  type="date"
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c] flex items-center gap-1">
                  <Users className="w-3 h-3" /> ¿Cuántos viajarán?
                </label>
                <input
                  id="custom-trip-travelers"
                  type="number"
                  min="1"
                  defaultValue="2"
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1c1c1c] flex items-center gap-1">
                  <Home className="w-3 h-3" /> ¿Deseas alojamiento?
                </label>
                <div className="flex gap-4 mt-1">
                  {["Sí", "No", "No sé"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input type="radio" name="accommodation" value={opt} className="accent-[#6b0014]" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Contact */}
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-[#1c1c1c]">3. Tus Datos de Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                id="custom-trip-firstname"
                type="text"
                required
                placeholder="Nombre *"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
              />
              <input
                id="custom-trip-lastname"
                type="text"
                required
                placeholder="Apellidos *"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
              />
              <input
                id="custom-trip-phone"
                type="tel"
                placeholder="Teléfono o WhatsApp"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
              />
              <input
                id="custom-trip-email"
                type="email"
                required
                placeholder="Correo Electrónico *"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014]"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-[#1c1c1c]">Mensaje Adicional</label>
              <textarea
                id="custom-trip-message"
                rows={4}
                placeholder="Cuéntanos más sobre tu aventura o menciona algún lugar o actividad que te gustaría. Ej. Viajo con niños, prefiero hoteles de 4 estrellas, interés en caminatas moderadas..."
                className="bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#6b0014]"
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Solicitud Personalizada</span>
          </Button>

          <p className="text-xs text-center text-gray-400">
            Al enviar este formulario acepta nuestros{" "}
            <a href="/terminos-y-condiciones" className="underline hover:text-[#6b0014]">
              Términos y Condiciones
            </a>{" "}
            y{" "}
            <a href="/politicas-de-privacidad" className="underline hover:text-[#6b0014]">
              Políticas de Privacidad
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
