"use client";

import React from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaTrain,
  FaMountain,
  FaHotel,
  FaMapMarkerAlt,
  FaCheck,
  FaStar,
} from "react-icons/fa";
import { StepComponentProps } from "./types";
import { HotelOpcion, DescuentosInfo } from "@/types/tour";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { hotelOpcionIncludesLodging } from "@/lib/hotel-options";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import {
  formatHotelOptionPrice,
  formatMoney,
  usdToDisplay,
} from "@/lib/pricing";

interface StepTourDetailsProps extends StepComponentProps {
  basePrice: number;
  duration: string;
  horarios?: string[];
  puntoInicio?: string;
  // Flags to conditionally show upgrades
  includesMachuPicchu?: boolean;
  isMultiDay?: boolean;
  opcionesHotel?: HotelOpcion[];
  descuentos?: DescuentosInfo;
}

export const StepTourDetails: React.FC<StepTourDetailsProps> = ({
  formData,
  updateFormData,
  errors,
  basePrice,
  duration,
  horarios,
  puntoInicio,
  includesMachuPicchu,
  isMultiDay,
  opcionesHotel,
  descuentos,
}) => {
  const { exchangeRate } = useDisplayCurrency();
  const currency = formData.currency || "USD";
  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);
  const activeHotelId = formData.selectedHotelOptionId || (hasHotelOptions ? opcionesHotel[0].id : "");
  const selectedHotel = hasHotelOptions
    ? opcionesHotel.find((opt) => opt.id === activeHotelId) || opcionesHotel[0]
    : null;

  const huaynaPicchuPrice = 20;

  let perPersonUsd = selectedHotel ? selectedHotel.precio_usd : basePrice;
  if (includesMachuPicchu && formData.includeHuaynaPicchu) perPersonUsd += huaynaPicchuPrice;

  const perPersonDisplay = usdToDisplay(perPersonUsd, currency, exchangeRate);
  const totalDisplay = usdToDisplay(perPersonUsd * formData.adults, currency, exchangeRate);

  const priceTag = formatMoney(perPersonDisplay, currency);
  const totalTag = formatMoney(totalDisplay, currency);

  return (
    <div className="flex flex-col gap-4">
      {/* Tour Summary Card */}
      <div className="bg-[#6b0014]/5 border border-[#6b0014]/20 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b0014]">
            Tour seleccionado
          </span>
          <span className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
            {formData.tourTitle}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {duration}
          </span>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xl font-black text-[#6b0014] font-title">
            {priceTag}
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {currency} / pax
          </span>
        </div>
      </div>

      {puntoInicio && (
        <div className="text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-2">
          <FaMapMarkerAlt className="w-3 h-3 text-[#6b0014] shrink-0 mt-0.5" />
          <span>
            <strong>Punto de recojo:</strong> {puntoInicio}
          </span>
        </div>
      )}

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>Fecha de Inicio del Tour</span>
            <span className="text-rose-500">*</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Salidas Diarias 2026
          </span>
        </label>
        <div className="relative">
          <CustomDatePicker
            value={formData.travelDate}
            onChange={(dateStr) => updateFormData({ travelDate: dateStr })}
            placeholder="Selecciona la fecha de tu tour"
            className={errors.travelDate ? "ring-2 ring-rose-400 rounded-2xl" : ""}
          />
        </div>
        {errors.travelDate && (
          <span className="text-[11px] font-semibold text-rose-600">{errors.travelDate}</span>
        )}
      </div>

      {/* Horario de inicio (SOLO para tours diarios que tienen múltiples turnos de salida) */}
      {!isMultiDay && !hasHotelOptions && horarios && horarios.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
            <FaClock className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>Turno / Horario de Partida</span>
          </label>
          <select
            value={formData.selectedHorario}
            onChange={(e) => updateFormData({ selectedHorario: e.target.value })}
            className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#6b0014] focus:ring-4 focus:ring-[#6b0014]/10 rounded-2xl px-4 py-3 text-base sm:text-sm text-slate-900 font-semibold focus:outline-none transition-all cursor-pointer min-h-[44px]"
          >
            {horarios.map((h, idx) => (
              <option key={idx} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Travelers */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <FaUsers className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Cantidad de Viajeros</span>
          <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center justify-between bg-white border-2 border-slate-200 rounded-2xl px-3 py-2 shadow-2xs">
          <button
            type="button"
            onClick={() => updateFormData({ adults: Math.max(1, formData.adults - 1) })}
            className="w-11 h-11 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-base flex items-center justify-center active:scale-95 touch-manipulation"
            aria-label="Disminuir cantidad de viajeros"
          >
            -
          </button>
          <span className="font-extrabold text-slate-900 text-sm sm:text-base px-2">
            {formData.adults} {formData.adults === 1 ? "Adulto" : "Adultos"}
          </span>
          <button
            type="button"
            onClick={() => updateFormData({ adults: formData.adults + 1 })}
            className="w-11 h-11 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-[#6b0014] hover:text-white transition-colors cursor-pointer text-base flex items-center justify-center active:scale-95 touch-manipulation"
            aria-label="Aumentar cantidad de viajeros"
          >
            +
          </button>
        </div>
      </div>

      {/* Hotel Options Section (when available) */}
      {hasHotelOptions && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FaHotel className="w-3.5 h-3.5 text-[#6b0014]" />
              <span>Categoría de Hotel / Hospedaje</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">Selecciona tu opción</span>
          </label>

          <div className="flex flex-col gap-2">
            {opcionesHotel.map((opcion) => {
              const isSelected = activeHotelId === opcion.id;
              return (
                <button
                  key={opcion.id}
                  type="button"
                  onClick={() => updateFormData({ selectedHotelOptionId: opcion.id })}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-[#6b0014] bg-[#6b0014]/5 ring-1 ring-[#6b0014]/20 shadow-2xs"
                      : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#6b0014] bg-[#6b0014]" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{opcion.nombre}</span>
                    </span>
                    <span className="text-xs font-black text-[#6b0014] font-title shrink-0">
                      {formatHotelOptionPrice(opcion, currency, exchangeRate)}
                    </span>
                  </div>

                  {hotelOpcionIncludesLodging(opcion) && opcion.hoteles.length > 0 && (
                    <div className="text-[11px] text-slate-500 pl-6 flex flex-wrap gap-x-2 gap-y-0.5">
                      {opcion.hoteles.map((h, hIdx) => (
                        <span key={hIdx} className="inline-flex items-center gap-1">
                          <strong className="text-slate-700">{h.ciudad}:</strong> {h.hotel}
                        </span>
                      ))}
                    </div>
                  )}
                  {!hotelOpcionIncludesLodging(opcion) && (
                    <p className="text-[11px] text-amber-800 pl-6">
                      Sin estadía incluida — coordinas tu propio alojamiento.
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {descuentos?.menores && descuentos.menores.length > 0 && (
            <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/70 mt-1">
              <strong>💡 Descuentos por edad disponibles:</strong> Menores de 3 años gratis, niños de 3-11 años y jóvenes tienen descuento especial.
            </div>
          )}
        </div>
      )}

      {/* Upgrades (Huayna Picchu) */}
      {includesMachuPicchu && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
            Personaliza tu experiencia (Opcional)
          </span>
          <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includeHuaynaPicchu}
                onChange={(e) => updateFormData({ includeHuaynaPicchu: e.target.checked })}
                className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
              />
              <FaMountain className="w-3.5 h-3.5 text-[#6b0014]" />
              <span className="font-bold text-slate-800">Entrada Huayna Picchu</span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">+${huaynaPicchuPrice}/pax</span>
          </label>
        </div>
      )}

      {/* Live Price Summary */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>
            {priceTag} x {formData.adults} pax
          </span>
          <span className="font-semibold">{totalTag}</span>
        </div>
        <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
          <span>Tu inversión total</span>
          <span className="text-[#6b0014] font-extrabold text-base">{totalTag}</span>
        </div>
      </div>
    </div>
  );
};