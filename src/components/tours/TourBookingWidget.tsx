"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaLock,
  FaFire,
  FaCheckCircle,
  FaTrain,
  FaMountain,
  FaHotel,
  FaWhatsapp,
} from "react-icons/fa";

interface TourBookingWidgetProps {
  tourTitle: string;
  basePrice: number;
  duration: string;
}

export const TourBookingWidget: React.FC<TourBookingWidgetProps> = ({
  tourTitle,
  basePrice,
  duration,
}) => {
  const [travelers, setTravelers] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>("");
  const [viewsCount, setViewsCount] = useState<number>(14);

  // Upgrades state
  const [includeVistadome, setIncludeVistadome] = useState<boolean>(false);
  const [includeHuaynaPicchu, setIncludeHuaynaPicchu] = useState<boolean>(false);
  const [includeHotel, setIncludeHotel] = useState<boolean>(false);

  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 14) + 12;
    setViewsCount(randomCount);
  }, []);

  // Determine relevance based on tour title & duration
  const titleLower = tourTitle.toLowerCase();
  const durationLower = (duration || "").toLowerCase();

  const includesMachuPicchu = titleLower.includes("machu") || titleLower.includes("inca");
  const includesTrain = titleLower.includes("tren") || titleLower.includes("machu") || titleLower.includes("inca");
  const isMultiDay = durationLower.includes("día") && !durationLower.includes("1 día") && !durationLower.includes("full day");

  // Upgrades prices per person
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

  const whatsappMessage = encodeURIComponent(
    `¡Hola Chullos Tours! 👋 Quisiera solicitar más información y reservar el tour:\n📌 *${tourTitle}*\n🗓️ Fecha estimada: ${
      travelDate || "Por definir"
    }\n👥 Viajeros: ${travelers} persona(s)${upgradesText}\n💰 Inversión estimada: $${totalPrice} USD`
  );

  const whatsappUrl = `https://wa.me/51992558512?text=${whatsappMessage}`;

  const hasAnyUpgrade = includesTrain || includesMachuPicchu || isMultiDay;

  return (
    <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5 relative overflow-hidden">
      {/* Urgency Ribbon */}
      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200/80">
        <FaFire className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
        <span>{viewsCount} personas consultaron este tour hoy</span>
      </div>

      {/* Header Price Tag */}
      <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Tu aventura desde
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-black text-[#6b0014] font-title">
              ${perPersonPrice}
            </span>
            <span className="text-xs font-bold text-slate-500">USD / pers</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-400/15 text-slate-900 text-xs font-black px-3 py-1.5 rounded-full border border-amber-300 shadow-2xs">
          <FaLock className="w-3 h-3 text-amber-700" />
          <span>Mejor Precio</span>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="flex flex-col gap-4">
        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
            <FaCalendarAlt className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>¿Cuándo quieres partir?</span>
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
          />
        </div>

        {/* Passengers */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
            <FaUsers className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>¿Cuántos viajan?</span>
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <button
              type="button"
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-sm"
            >
              -
            </button>
            <span className="font-extrabold text-slate-900 text-xs md:text-sm">
              {travelers} {travelers === 1 ? "Viajero" : "Viajeros"}
            </span>
            <button
              type="button"
              onClick={() => setTravelers(travelers + 1)}
              className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 shadow-xs flex items-center justify-center hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Optional Upgrades - Only rendered if relevant to this tour */}
        {hasAnyUpgrade && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Personaliza tu experiencia (Opcional)
            </span>

            {includesTrain && (
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeVistadome}
                    onChange={(e) => setIncludeVistadome(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
                  />
                  <FaTrain className="w-3.5 h-3.5 text-[#6b0014]" />
                  <span className="font-bold text-slate-800">Mejora a Tren Vistadome</span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px]">+$45/p</span>
              </label>
            )}

            {includesMachuPicchu && (
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeHuaynaPicchu}
                    onChange={(e) => setIncludeHuaynaPicchu(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
                  />
                  <FaMountain className="w-3.5 h-3.5 text-[#6b0014]" />
                  <span className="font-bold text-slate-800">Entrada Huayna Picchu</span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px]">+$20/p</span>
              </label>
            )}

            {isMultiDay && (
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeHotel}
                    onChange={(e) => setIncludeHotel(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
                  />
                  <FaHotel className="w-3.5 h-3.5 text-[#6b0014]" />
                  <span className="font-bold text-slate-800">Hotel 3★ Superior</span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px]">+$35/p</span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Price Summary Breakdown */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>${perPersonPrice} USD × {travelers} viajeros</span>
          <span className="font-semibold">${totalPrice} USD</span>
        </div>
        <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
          <span>Tu inversión total</span>
          <span className="text-[#6b0014] font-extrabold text-base">${totalPrice} USD</span>
        </div>
      </div>

      {/* Primary Action Button: WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-4 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 text-sm cursor-pointer group scale-100 active:scale-98"
      >
        <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Consultar y Reservar Ahora</span>
      </a>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
        <div className="flex items-center gap-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
          <FaShieldAlt className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-emerald-950">Reserva 100% asegurada con atención humana</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <FaClock className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium text-slate-700">Respuesta inmediata en minutos por WhatsApp</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <FaCheckCircle className="w-4 h-4 text-[#6b0014] shrink-0" />
          <span className="font-medium text-slate-700">Cancelación sin penalidad hasta 48h antes</span>
        </div>
      </div>
    </div>
  );
};

