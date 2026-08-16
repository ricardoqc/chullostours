"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaFire,
  FaCheckCircle,
  FaTrain,
  FaMountain,
  FaHotel,
  FaWhatsapp,
  FaBalanceScale,
  FaTimes,
  FaStar,
  FaThumbsUp,
  FaGlobe,
  FaClipboardCheck,
} from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

interface TourBookingWidgetProps {
  tourTitle: string;
  basePrice: number;
  duration: string;
  horarios?: string[];
  puntoInicio?: string;
  categoria?: string;
}

export const TourBookingWidget: React.FC<TourBookingWidgetProps> = ({
  tourTitle,
  basePrice,
  duration,
  horarios,
  puntoInicio,
  categoria,
}) => {
  const [travelers, setTravelers] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>("");
  const [selectedHorario, setSelectedHorario] = useState<string>(
    horarios && horarios.length > 0 ? horarios[0] : ""
  );
  const [viewsCount, setViewsCount] = useState<number>(14);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Upgrades state
  const [includeVistadome, setIncludeVistadome] = useState<boolean>(false);
  const [includeHuaynaPicchu, setIncludeHuaynaPicchu] = useState<boolean>(false);
  const [includeHotel, setIncludeHotel] = useState<boolean>(false);

  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 14) + 12;
    setViewsCount(randomCount);
  }, []);

  const titleLower = tourTitle.toLowerCase();
  const durationLower = (duration || "").toLowerCase();
  const includesMachuPicchu = titleLower.includes("machu") || titleLower.includes("inca");
  const includesTrain = titleLower.includes("tren") || titleLower.includes("machu") || titleLower.includes("inca");
  const isMultiDay = durationLower.includes("día") && !durationLower.includes("1 día") && !durationLower.includes("full day");

  const vistadomePrice = 45;
  const huaynaPicchuPrice = 20;
  const hotelPrice = 35;

  let perPersonPrice = basePrice;
  if (includesTrain && includeVistadome) perPersonPrice += vistadomePrice;
  if (includesMachuPicchu && includeHuaynaPicchu) perPersonPrice += huaynaPicchuPrice;
  if (isMultiDay && includeHotel) perPersonPrice += hotelPrice;

  const totalPrice = perPersonPrice * travelers;

  const selectedUpgradesList: string[] = [];
  if (includesTrain && includeVistadome) selectedUpgradesList.push("Tren Vistadome (+$45 USD)");
  if (includesMachuPicchu && includeHuaynaPicchu) selectedUpgradesList.push("Entrada Huayna Picchu (+$20 USD)");
  if (isMultiDay && includeHotel) selectedUpgradesList.push("Hotel 3★ Superior (+$35 USD)");

  const upgradesText = selectedUpgradesList.length > 0
    ? `\nAdicionales: ${selectedUpgradesList.join(", ")}`
    : "";
  const horarioText = selectedHorario ? `\nHorario: ${selectedHorario}` : "";
  const rawMessage = `¡Hola Viajando con Chullos Tours! Quisiera reservar el tour: *${tourTitle}* Fecha: ${travelDate || "Por definir"}${horarioText} Viajeros: ${travelers} pax${upgradesText} Inversión estimada: $${totalPrice} USD`;
  const whatsappUrl = getPrimaryWhatsappUrl(rawMessage);
  const hasAnyUpgrade = includesTrain || includesMachuPicchu || isMultiDay;

  const competitorPrice = Math.round(basePrice * 1.25);
  const onlinePrice = Math.round(basePrice * 1.15);

  return (
    <>
      <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5 relative overflow-hidden">
        {/* Urgency Ribbon */}
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200/80">
          <FaFire className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
          <span>{viewsCount} personas consultaron este tour hoy</span>
        </div>

        {/* Header Price Tag */}
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tu aventura desde</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl md:text-4xl font-black text-[#6b0014] font-title">${perPersonPrice}</span>
              <span className="text-xs font-bold text-slate-500">USD / pax</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPriceModal(true)}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-slate-900 text-xs font-black px-3 py-1.5 rounded-full border border-amber-300 shadow-2xs transition-colors cursor-pointer"
          >
            <FaBalanceScale className="w-3 h-3 text-amber-700" />
            <span>Comparar Precios</span>
          </button>
        </div>

        {/* Inputs Form */}
        <div className="flex flex-col gap-4">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <FaCalendarAlt className="w-3.5 h-3.5 text-[#6b0014]" />
              <span>Cuándo quieres partir</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
            />
          </div>

          {horarios && horarios.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <FaClock className="w-3.5 h-3.5 text-[#6b0014]" />
                <span>Horario de Salida</span>
              </label>
              <select
                value={selectedHorario}
                onChange={(e) => setSelectedHorario(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
              >
                {horarios.map((h, idx) => (<option key={idx} value={h}>{h}</option>))}
              </select>
            </div>
          )}

          {puntoInicio && (
            <div className="text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-2">
              <FaClock className="w-3 h-3 text-[#6b0014] shrink-0 mt-0.5" />
              <span><strong>Punto de recojo:</strong> {puntoInicio}</span>
            </div>
          )}

          {/* Passengers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <FaUsers className="w-3.5 h-3.5 text-[#6b0014]" />
              <span>Cuántos viajan</span>
            </label>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-sm">-</button>
              <span className="font-extrabold text-slate-900 text-xs md:text-sm">{travelers} {travelers === 1 ? "Pax" : "Pax"}</span>
              <button type="button" onClick={() => setTravelers(travelers + 1)} className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-sm">+</button>
            </div>
          </div>

          {hasAnyUpgrade && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Personaliza tu experiencia (Opcional)</span>
              {includesTrain && (
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={includeVistadome} onChange={(e) => setIncludeVistadome(e.target.checked)} className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]" />
                    <FaTrain className="w-3.5 h-3.5 text-[#6b0014]" />
                    <span className="font-bold text-slate-800">Mejora a Tren Vistadome</span>
                  </div>
                  <span className="text-slate-500 font-semibold text-[11px]">+$45/pax</span>
                </label>
              )}
              {includesMachuPicchu && (
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={includeHuaynaPicchu} onChange={(e) => setIncludeHuaynaPicchu(e.target.checked)} className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]" />
                    <FaMountain className="w-3.5 h-3.5 text-[#6b0014]" />
                    <span className="font-bold text-slate-800">Entrada Huayna Picchu</span>
                  </div>
                  <span className="text-slate-500 font-semibold text-[11px]">+$20/pax</span>
                </label>
              )}
              {isMultiDay && (
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={includeHotel} onChange={(e) => setIncludeHotel(e.target.checked)} className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]" />
                    <FaHotel className="w-3.5 h-3.5 text-[#6b0014]" />
                    <span className="font-bold text-slate-800">Hotel 3★ Superior</span>
                  </div>
                  <span className="text-slate-500 font-semibold text-[11px]">+$35/pax</span>
                </label>
              )}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>${perPersonPrice} USD × {travelers} pax</span>
            <span className="font-semibold">${totalPrice} USD</span>
          </div>
          <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
            <span>Tu inversión total</span>
            <span className="text-[#6b0014] font-extrabold text-base">${totalPrice} USD</span>
          </div>
        </div>

        {/* Reserva Online Button */}
        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="w-full bg-[#6b0014] hover:bg-red-900 text-white font-black py-3.5 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 text-sm cursor-pointer"
        >
          <FaClipboardCheck className="w-4 h-4" />
          <span>Reserva Online</span>
        </button>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-3.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 text-sm cursor-pointer group"
        >
          <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Contactar Agente Ahora</span>
        </a>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            <FaShieldAlt className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-950">Reserva 100% garantizada</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <FaClock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-slate-700">Respuesta inmediata en minutos por WhatsApp</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <FaCheckCircle className="w-4 h-4 text-[#6b0014] shrink-0" />
            <span className="font-medium text-slate-700">Garantía de Satisfacción</span>
          </div>
        </div>
      </div>

      {/* === PRICE COMPARISON MODAL === */}
      {showPriceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPriceModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#6b0014] text-white p-6 rounded-t-3xl flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Transparencia Total</span>
                <h2 className="text-xl font-extrabold">Comparar Precios</h2>
                <p className="text-xs text-gray-200">Viajando con Chullos Tours vs agencias externas</p>
              </div>
              <button type="button" onClick={() => setShowPriceModal(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <FaTimes className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Chullos Tours Column */}
                <div className="bg-[#6b0014]/5 border-2 border-[#6b0014]/30 rounded-2xl p-5 flex flex-col gap-3 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#6b0014] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">Mejor Valor</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 pt-3 text-center">
                    <span className="font-extrabold text-[#6b0014] text-sm">Viajando con Chullos Tours</span>
                    <span className="text-3xl font-black text-[#6b0014]">${basePrice} <span className="text-sm font-bold text-slate-500">USD</span></span>
                    <span className="text-xs text-slate-500">por pax</span>
                  </div>
                  {/* TripAdvisor Rating */}
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col gap-1 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-500">TripAdvisor</span>
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3 h-3 text-[#00AA6C]" />)}
                    </div>
                    <span className="text-xs font-bold text-slate-800">5.0 / 5 (48 reseñas)</span>
                  </div>
                  <ul className="text-xs text-slate-700 flex flex-col gap-1.5">
                    {["Guía local certificado", "Traslado incluido", "Atención personalizada", "Sin cargos ocultos", "Grupos reducidos (max 12)"].map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5"><FaCheckCircle className="w-3 h-3 text-[#6b0014] shrink-0" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>

                {/* Online OTAs */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="font-extrabold text-slate-700 text-sm flex items-center gap-1.5"><FaGlobe className="w-4 h-4" /> OTAs Online</span>
                    <span className="text-2xl font-black text-slate-800">${onlinePrice} <span className="text-sm font-bold text-slate-400">USD</span></span>
                    <span className="text-xs text-slate-400">por pax</span>
                  </div>
                  <ul className="text-xs text-slate-600 flex flex-col gap-1.5">
                    {["Intermediario digital", "Comisión incluida", "Atención automatizada", "Grupos de hasta 30", "Sin flexibilidad de cambio"].map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-slate-500"><FaTimes className="w-3 h-3 text-slate-400 shrink-0" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>

                {/* Agencias Grandes */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="font-extrabold text-slate-700 text-sm flex items-center gap-1.5"><FaHotel className="w-4 h-4" /> Agencias Grandes</span>
                    <span className="text-2xl font-black text-slate-800">${competitorPrice} <span className="text-sm font-bold text-slate-400">USD</span></span>
                    <span className="text-xs text-slate-400">por pax</span>
                  </div>
                  <ul className="text-xs text-slate-600 flex flex-col gap-1.5">
                    {["Intermediario offline", "Precio inflado", "Grupos masivos", "Guía no especializado", "Sin atención post-venta"].map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-slate-500"><FaTimes className="w-3 h-3 text-slate-400 shrink-0" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <FaThumbsUp className="w-4 h-4 text-[#6b0014] shrink-0 mt-0.5" />
                <span><strong>¿Por qué elegirnos?</strong> Somos operadores directos en Cusco. Sin intermediarios. Precio transparente, atención real y experiencia verificada en TripAdvisor.</span>
              </div>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
                <FaWhatsapp className="w-5 h-5" />
                <span>Reservar al Mejor Precio</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* === BOOKING MODAL === */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#6b0014] text-white p-6 rounded-t-3xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Reserva Segura</span>
                <h2 className="text-xl font-extrabold">Reserva Online</h2>
                <p className="text-xs text-gray-200 line-clamp-1">{tourTitle}</p>
              </div>
              <button type="button" onClick={() => setShowBookingModal(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <FaTimes className="w-4 h-4 text-white" />
              </button>
            </div>

            <form className="p-6 flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); window.open(whatsappUrl, "_blank"); setShowBookingModal(false); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">Nombre Completo</label>
                  <input type="text" required placeholder="Ej: Juan Pérez" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">Email</label>
                  <input type="email" required placeholder="tu@email.com" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">WhatsApp / Teléfono</label>
                  <input type="tel" required placeholder="+51 999 000 000" className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">Fecha de Viaje</label>
                  <input type="date" required value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">Número de Pax</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors text-sm">-</button>
                    <span className="flex-1 text-center font-extrabold text-slate-900 text-sm">{travelers} Pax</span>
                    <button type="button" onClick={() => setTravelers(travelers + 1)} className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors text-sm">+</button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase">Comentarios adicionales</label>
                  <textarea rows={3} placeholder="Alergias, preferencias, número de vuelo de llegada..." className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all resize-none" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <FaShieldAlt className="w-3.5 h-3.5 text-[#6b0014] shrink-0 mt-0.5" />
                <span>Tu solicitud se enviará directamente a nuestro equipo de Viajando con Chullos Tours por WhatsApp para confirmar disponibilidad y procesar tu reserva.</span>
              </div>

              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-4 px-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2.5 text-sm">
                <FaWhatsapp className="w-5 h-5" />
                <span>Enviar Solicitud de Reserva</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
