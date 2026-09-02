"use client";

import React from "react";
import {
  FaUserCheck,
  FaHotel,
  FaQuestionCircle,
  FaDollarSign,
  FaWhatsapp,
  FaTag,
  FaUsers,
  FaCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { HotelOpcion, DescuentosInfo } from "@/types/tour";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import { formatHotelOptionPrice, formatMoney, usdToDisplay } from "@/lib/pricing";

interface TourPricingDetailsProps {
  basePrice: number;
  duration: string;
  isMultiDay: boolean;
  tourTitle?: string;
  opcionesHotel?: HotelOpcion[];
  descuentos?: DescuentosInfo;
}

export const TourPricingDetails: React.FC<TourPricingDetailsProps> = ({
  basePrice,
  duration,
  isMultiDay,
  tourTitle = "este tour",
  opcionesHotel,
  descuentos,
}) => {
  const { currency, exchangeRate } = useDisplayCurrency();
  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);
  const firstHotel = hasHotelOptions ? opcionesHotel[0] : null;

  const displayBasePrice = firstHotel
    ? formatHotelOptionPrice(firstHotel, currency, exchangeRate)
    : formatMoney(usdToDisplay(basePrice, currency, exchangeRate), currency);

  const waMessage = `¡Hola Viajando con Chullos Tours! Me interesa conocer el precio especial para el tour: ${tourTitle}. ¿Tienen tarifas para grupos o niños?`;
  const waUrl = getPrimaryWhatsappUrl(waMessage);

  return (
    <div id="tarifas" className="bg-slate-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6 scroll-mt-20 md:scroll-mt-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
          <FaDollarSign className="w-3.5 h-3.5" />
          <span>Desglose Transparente de Tarifas 2026</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 font-title">
          Precios por Pasajero {hasHotelOptions ? "según Opción de Hospedaje" : ""}
        </h3>
        <p className="text-xs md:text-sm text-slate-600">
          Tarifas oficiales y verificadas sin cargos ocultos ni comisiones de intermediarios.
        </p>
      </div>

      <div className={`grid grid-cols-1 ${hasHotelOptions ? "lg:grid-cols-2" : "w-full"} gap-4 sm:gap-6`}>
        {/* 1. Tarifa Principal */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-4 w-full">
          <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center justify-between gap-2 font-title">
            <span className="flex items-center gap-2">
              <FaUserCheck className="w-4 h-4 text-[#6b0014]" />
              <span>Tarifa por Pasajero (pax)</span>
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Operador Directo
            </span>
          </h4>

          {/* Price highlight row */}
          <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200/60 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <FaUserCheck className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {hasHotelOptions ? "Tarifa Inicial (Desde)" : "Adulto General"}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500">Por persona</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 bg-[#6b0014] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <FaTag className="w-2.5 h-2.5" /> Oferta
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#6b0014] font-title">
                  {displayBasePrice}
                </span>
              </div>
            </div>
          </div>

          {/* Descuentos de menores si existen */}
          {descuentos?.menores && descuentos.menores.length > 0 && (
            <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/70 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                <FaUsers className="w-3 h-3 text-emerald-700" />
                <span>Descuentos para Menores:</span>
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs text-emerald-800">
                {descuentos.menores.map((m, idx) => (
                  <span key={idx} className="bg-white/80 px-2 py-1 rounded-md border border-emerald-200/60 font-medium text-[11px] sm:text-xs">
                    {m.rango_edad}: <strong>{m.nota}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp CTA for group/kids pricing */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-emerald-800 font-bold text-xs py-3 px-4 rounded-xl transition-all min-h-[44px]"
          >
            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
            <span>Consultar disponibilidad y tarifas grupales</span>
          </a>
        </div>

        {/* 2. Información Contextual de Alojamiento / Modalidad */}
        {hasHotelOptions ? (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-3">
            <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2 font-title">
              <FaHotel className="w-4 h-4 text-[#6b0014]" />
              <span>Planes & Hoteles Disponibles</span>
            </h4>

            {/* Mobile View: Vertical Cards (No horizontal scrolling needed) */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {opcionesHotel.map((opcion) => {
                const priceFormatted = formatHotelOptionPrice(opcion, currency, exchangeRate);

                const hotelsSummary =
                  opcion.hoteles && opcion.hoteles.length > 0
                    ? opcion.hoteles.map((h) => `${h.ciudad}: ${h.hotel}`).join(" • ")
                    : "Solo tours (sin estadía)";

                return (
                  <div
                    key={opcion.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{opcion.nombre}</span>
                      <span className="font-black text-xs text-[#6b0014] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {priceFormatted}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{hotelsSummary}</p>
                  </div>
                );
              })}
            </div>

            {/* Desktop / Tablet View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-2">Categoría / Plan</th>
                    <th className="py-2">Hoteles Incluidos</th>
                    <th className="py-2 text-right">Tarifa pax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opcionesHotel.map((opcion) => {
                    const priceFormatted = formatHotelOptionPrice(opcion, currency, exchangeRate);

                    const hotelsSummary =
                      opcion.hoteles && opcion.hoteles.length > 0
                        ? opcion.hoteles.map((h) => `${h.ciudad}: ${h.hotel}`).join(" • ")
                        : "Solo tours (sin estadía)";

                    return (
                      <tr key={opcion.id} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-900 align-top">
                          <div>{opcion.nombre}</div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {opcion.categoria}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 text-[11px] align-top">
                          {hotelsSummary}
                        </td>
                        <td className="py-3 text-right font-black text-[#6b0014] text-xs md:text-sm whitespace-nowrap align-top">
                          {priceFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2 font-title">
                <FaCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Modalidad de la Experiencia</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tourTitle.toLowerCase().includes("camino inca") || tourTitle.toLowerCase().includes("trek") || tourTitle.toLowerCase().includes("caminata")
                  ? "Esta expedición es una caminata de alta montaña con campamentos incluidos. El precio cubre carpas térmicas, colchonetas, porteadores, cocinero y equipo de montaña profesional (no requiere hospedaje de hotel)."
                  : "Este tour es una excursión guiada (Full Day o Medio Día) que inicia y finaliza en tu hotel en Cusco. Incluye transporte turístico oficial, guiado certificado y tickets de ingreso."}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-medium">
              ✨ <strong>Incluye:</strong> Recojo coordinado, traslados oficiales, guiado bilingüe y asistencia permanente.
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <FaQuestionCircle className="w-4 h-4 text-[#6b0014] shrink-0" />
        <span>
          <strong className="text-slate-900">Garantía de Transparencia:</strong> Todos los precios indicados son por persona en base a habitación compartida o según el plan especificado, con traslados oficiales, tickets e impuestos incluidos.
        </span>
      </div>
    </div>
  );
};

