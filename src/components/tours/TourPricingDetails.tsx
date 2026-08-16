"use client";

import React from "react";
import {
  FaUserCheck,
  FaHotel,
  FaQuestionCircle,
  FaDollarSign,
  FaWhatsapp,
  FaTag,
} from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

interface TourPricingDetailsProps {
  basePrice: number;
  duration: string;
  isMultiDay: boolean;
  tourTitle?: string;
}

export const TourPricingDetails: React.FC<TourPricingDetailsProps> = ({
  basePrice,
  duration,
  isMultiDay,
  tourTitle = "este tour",
}) => {
  const adultPrice = basePrice;
  const hotel3Star = basePrice;
  const hotel4Star = basePrice + 45;
  const hotel5Star = basePrice + 125;

  const waMessage = `¡Hola Viajando con Chullos Tours! Me interesa conocer el precio especial para el tour: ${tourTitle}. ¿Tienen tarifas para grupos o niños?`;
  const waUrl = getPrimaryWhatsappUrl(waMessage);

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
          <FaDollarSign className="w-3.5 h-3.5" />
          <span>Desglose Transparente de Tarifas 2026</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 font-title">
          Precios por Pasajero {isMultiDay ? "y Alojamiento" : ""}
        </h3>
        <p className="text-xs md:text-sm text-slate-600">
          Tarifas oficiales sin cargos ocultos ni sorpresas al momento del pago.
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isMultiDay ? "lg:grid-cols-2" : "w-full"} gap-6`}>
        {/* 1. Tarifa Principal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-4 w-full">
          <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center justify-between gap-2 font-title">
            <span className="flex items-center gap-2">
              <FaUserCheck className="w-4 h-4 text-[#6b0014]" />
              <span>Tarifa por Pasajero (pax)</span>
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Precio Final
            </span>
          </h4>

          {/* Price highlight row */}
          <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200/60 rounded-2xl px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <FaUserCheck className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-slate-900 text-sm">Adulto General</span>
              </div>
              <span className="text-xs text-slate-500">Por pax</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#6b0014] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <FaTag className="w-2.5 h-2.5" /> Oferta
                </span>
                <span className="text-2xl font-black text-[#6b0014] font-title">${adultPrice} <span className="text-sm font-bold text-slate-500">USD</span></span>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA for group/kids pricing */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-emerald-800 font-bold text-xs py-3 px-4 rounded-xl transition-all"
          >
            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
            <span>Consultar precio para grupos o niños</span>
          </a>
        </div>

        {/* 2. Categorías de Alojamiento (SOLO para Paquetes Multi-Día) */}
        {isMultiDay && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-3">
            <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2 font-title">
              <FaHotel className="w-4 h-4 text-[#6b0014]" />
              <span>Categorías de Alojamiento</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-2">Categoría</th>
                    <th className="py-2">Servicios incluidos</th>
                    <th className="py-2 text-right">Precio USD / pax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">Hotel 3★ Estándar</td>
                    <td className="py-3 text-slate-500">Desayuno buffet + WiFi</td>
                    <td className="py-3 text-right font-black text-[#6b0014] text-sm">${hotel3Star} USD</td>
                  </tr>
                  <tr className="bg-amber-50/40 hover:bg-amber-50/70">
                    <td className="py-3 font-bold text-slate-900">Hotel 4★ Superior</td>
                    <td className="py-3 text-amber-800">Céntrico + Calefacción</td>
                    <td className="py-3 text-right font-black text-slate-900 text-sm">${hotel4Star} USD</td>
                  </tr>
                  <tr className="bg-amber-50/40 hover:bg-amber-50/70">
                    <td className="py-3 font-bold text-slate-900">Hotel 5★ Lujo</td>
                    <td className="py-3 text-amber-800">Alta gama + Spa</td>
                    <td className="py-3 text-right font-black text-slate-900 text-sm">${hotel5Star} USD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <FaQuestionCircle className="w-4 h-4 text-[#6b0014] shrink-0" />
        <span>
          <strong className="text-slate-900">Transparencia Total:</strong> Todos los precios incluyen impuestos locales, gestión de ingresos a parques arqueológicos y traslados indicados.
        </span>
      </div>
    </div>
  );
};
