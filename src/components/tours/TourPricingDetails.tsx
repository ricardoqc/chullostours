"use client";

import React from "react";
import {
  FaUserCheck,
  FaGraduationCap,
  FaBaby,
  FaHotel,
  FaQuestionCircle,
  FaDollarSign,
} from "react-icons/fa";

interface TourPricingDetailsProps {
  basePrice: number;
  duration: string;
  isMultiDay: boolean;
}

export const TourPricingDetails: React.FC<TourPricingDetailsProps> = ({
  basePrice,
  duration,
  isMultiDay,
}) => {
  const adultPrice = basePrice;
  const studentPrice = Math.max(20, basePrice - 20);
  const childPrice = Math.max(15, basePrice - 35);

  const hotel3Star = basePrice;
  const hotel4Star = basePrice + 45;
  const hotel5Star = basePrice + 125;

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
          <FaDollarSign className="w-3.5 h-3.5" />
          <span>Desglose Transparente de Tarifas 2026</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 font-title">
          Precios por Tipo de Pasajero {isMultiDay ? "y Alojamiento" : ""}
        </h3>
        <p className="text-xs md:text-sm text-slate-600">
          Tarifas oficiales sin cargos ocultos ni sorpresas al momento del pago.
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isMultiDay ? "lg:grid-cols-2" : "grid-cols-1 max-w-2xl"} gap-6`}>
        {/* 1. Tarifas por Tipo de Pasajero */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-3">
          <h4 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2 font-title">
            <FaUserCheck className="w-4 h-4 text-[#6b0014]" />
            <span>Descuentos por Tipo de Pasajero</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="py-2">Categoría</th>
                  <th className="py-2">Requisito</th>
                  <th className="py-2 text-right">Precio USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                    <FaUserCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span>Adulto General</span>
                  </td>
                  <td className="py-3 text-slate-500">18+ años</td>
                  <td className="py-3 text-right font-black text-[#6b0014] text-sm">${adultPrice} USD</td>
                </tr>
                <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                  <td className="py-3 font-bold text-emerald-950 flex items-center gap-2">
                    <FaGraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Estudiante</span>
                  </td>
                  <td className="py-3 text-emerald-700">Carnet universitario vigente</td>
                  <td className="py-3 text-right font-black text-emerald-700 text-sm">${studentPrice} USD</td>
                </tr>
                <tr className="bg-emerald-50/40 hover:bg-emerald-50/70">
                  <td className="py-3 font-bold text-emerald-950 flex items-center gap-2">
                    <FaBaby className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Niños (3-11 años)</span>
                  </td>
                  <td className="py-3 text-emerald-700">DNI o Pasaporte original</td>
                  <td className="py-3 text-right font-black text-emerald-700 text-sm">${childPrice} USD</td>
                </tr>
              </tbody>
            </table>
          </div>
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
                    <th className="py-2 text-right">Precio USD</th>
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

