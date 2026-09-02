"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaPlane,
  FaBed,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { StepComponentProps } from "./types";
import { HotelOpcion } from "@/types/tour";
import { LATAM_COUNTRIES, getCountryByCode, formatCountryLabel } from "@/lib/countries";
import { countNonAdultTravelers } from "./TravelersSelector";

interface StepTravelerInfoProps extends StepComponentProps {
  totalPrice: number;
  totalLabel?: string;
  travelersLabel?: string;
  opcionesHotel?: HotelOpcion[];
  onNext: () => void;
  onBack: () => void;
}

export const StepTravelerInfo: React.FC<StepTravelerInfoProps> = ({
  formData,
  updateFormData,
  errors,
  totalPrice,
  totalLabel,
  travelersLabel,
  opcionesHotel,
  onNext,
  onBack,
}) => {
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [showCompanions, setShowCompanions] = useState(formData.fillCompanions);

  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);
  const selectedHotel = hasHotelOptions
    ? opcionesHotel.find((opt) => opt.id === formData.selectedHotelOptionId) || opcionesHotel[0]
    : null;

  const totalDisplay =
    totalLabel ||
    (formData.currency === "PEN"
      ? `S/ ${totalPrice.toLocaleString()} PEN`
      : `$${totalPrice} USD`);

  const travelersText = travelersLabel || `${formData.adults} adulto${formData.adults !== 1 ? "s" : ""}`;

  const totalSlots =
    formData.adults + countNonAdultTravelers(formData.childrenByTarifa);

  const companions =
    formData.companions.length >= totalSlots
      ? formData.companions
      : [
          ...formData.companions,
          ...Array.from({ length: totalSlots - formData.companions.length }, () => ({
            firstName: "",
            lastName: "",
            passport: "",
            age: undefined as number | undefined,
          })),
        ].slice(0, totalSlots);

  const updateCompanion = (index: number, field: string, value: string | number) => {
    const next = [...companions];
    next[index] = { ...next[index], [field]: value };
    updateFormData({ companions: next, fillCompanions: showCompanions });
  };

  const toggleCompanions = (open: boolean) => {
    setShowCompanions(open);
    updateFormData({ fillCompanions: open });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-bold text-slate-800 line-clamp-1">{formData.tourTitle}</span>
          <span className="text-[11px] text-slate-500">
            {formData.travelDate} · {travelersText}
            {selectedHotel ? ` · ${selectedHotel.nombre}` : ""}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
          <span className="font-extrabold text-[#6b0014] text-sm font-title">{totalDisplay}</span>
        </div>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-900 flex items-start gap-2">
        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Solo necesitamos tus datos de contacto. Un asesor te escribe por WhatsApp para confirmar
          disponibilidad.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <FaUser className="w-3.5 h-3.5 text-[#6b0014]" />
              <span>Nombre completo</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all ${
                errors.fullName ? "border-rose-400 ring-1 ring-rose-400" : ""
              }`}
            />
            {errors.fullName && (
              <span className="text-[11px] font-semibold text-rose-600">{errors.fullName}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <FaPhoneAlt className="w-3.5 h-3.5 text-[#6b0014]" />
                <span>WhatsApp</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder={`${formData.dialCode || "+51"} 999 000 000`}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all ${
                  errors.phone ? "border-rose-400 ring-1 ring-rose-400" : ""
                }`}
              />
              {errors.phone && (
                <span className="text-[11px] font-semibold text-rose-600">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <FaEnvelope className="w-3.5 h-3.5 text-[#6b0014]" />
                <span>Email</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="tu@email.com"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all ${
                  errors.email ? "border-rose-400 ring-1 ring-rose-400" : ""
                }`}
              />
              {errors.email && (
                <span className="text-[11px] font-semibold text-rose-600">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <FaGlobe className="w-3.5 h-3.5 text-[#6b0014]" />
              <span>País de procedencia</span>
            </label>
            <select
              value={formData.countryCode}
              onChange={(e) => {
                const code = e.target.value;
                const country = getCountryByCode(code);
                updateFormData({
                  countryCode: code,
                  country: country?.name || formData.country,
                  dialCode: country?.dial || formData.dialCode,
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all cursor-pointer"
            >
              {LATAM_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {formatCountryLabel(c)}
                </option>
              ))}
            </select>
            {formData.countryCode === "OTHER" && (
              <input
                type="text"
                value={formData.otherCountry}
                onChange={(e) =>
                  updateFormData({ otherCountry: e.target.value, country: e.target.value })
                }
                placeholder="Indica tu país"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleCompanions(!showCompanions)}
          className="w-full p-3.5 text-left text-xs font-extrabold text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer transition-colors bg-slate-100/60 min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <FaUsers className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>Registrar nombres de viajeros (opcional)</span>
          </span>
          {showCompanions ? (
            <FaChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <FaChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {showCompanions && (
          <div className="p-4 flex flex-col gap-3 border-t border-slate-200 bg-white">
            <p className="text-[11px] text-slate-500">
              Puedes completarlo ahora o después con tu asesor por WhatsApp.
            </p>
            {companions.map((c, i) => (
              <fieldset
                key={i}
                className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2 text-xs"
              >
                <legend className="font-bold text-[#6b0014] px-1">
                  Viajero {i + 1}
                  {i >= formData.adults ? " (menor)" : ""}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Nombre"
                    value={c.firstName}
                    onChange={(e) => updateCompanion(i, "firstName", e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />
                  <input
                    placeholder="Apellido"
                    value={c.lastName}
                    onChange={(e) => updateCompanion(i, "lastName", e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />
                </div>
                <input
                  placeholder="Pasaporte (opcional)"
                  value={c.passport || ""}
                  onChange={(e) => updateCompanion(i, "passport", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2"
                />
                {i >= formData.adults && (
                  <input
                    type="number"
                    min={0}
                    max={17}
                    placeholder="Edad"
                    value={c.age ?? ""}
                    onChange={(e) =>
                      updateCompanion(
                        i,
                        "age",
                        e.target.value ? parseInt(e.target.value, 10) : ""
                      )
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2"
                  />
                )}
              </fieldset>
            ))}
          </div>
        )}
          </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowOptionalDetails(!showOptionalDetails)}
          className="w-full p-3.5 text-left text-xs font-extrabold text-slate-700 hover:text-slate-900 flex items-center justify-between cursor-pointer transition-colors bg-slate-100/60 min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <FaPlane className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>Datos de vuelo y alojamiento (opcional)</span>
          </span>
          {showOptionalDetails ? (
            <FaChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <FaChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {showOptionalDetails && (
          <div className="p-4 flex flex-col gap-3.5 border-t border-slate-200 bg-white">
            <p className="text-[11px] text-slate-500">
              Si aún no los tienes, puedes enviarlos después por WhatsApp.
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FaCalendarAlt className="w-3 h-3 text-[#6b0014]" />
                <span>Fecha estimada de llegada a Cusco</span>
              </label>
              <input
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => updateFormData({ arrivalDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 font-medium focus:outline-none focus:border-[#6b0014]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FaPlane className="w-3 h-3 text-[#6b0014]" />
                <span>Número o aerolínea de vuelo</span>
              </label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => updateFormData({ flightNumber: e.target.value })}
                placeholder="Ej: LATAM 2014"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014]"
              />
            </div>

            {!hasHotelOptions && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <FaBed className="w-3 h-3 text-[#6b0014]" />
                  <span>Hotel o Airbnb en Cusco (para recojo)</span>
                </label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => updateFormData({ hotelName: e.target.value })}
                  placeholder="Ej: Casa Andina San Blas"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FaExclamationTriangle className="w-3 h-3 text-[#6b0014]" />
                <span>Restricciones alimenticias o necesidades especiales</span>
              </label>
              <textarea
                rows={2}
                value={formData.allergies}
                onChange={(e) => updateFormData({ allergies: e.target.value })}
                placeholder="Ej: Vegetariano, alergia a frutos secos..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] resize-none"
              />
            </div>
          </div>
        )}
      </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[#6b0014] hover:bg-red-900 text-white font-black py-3.5 px-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer active:scale-98 min-h-[44px]"
        >
          <FaCheckCircle className="w-5 h-5" />
          <span>Revisar y confirmar</span>
        </button>
      </div>
    </div>
  );
};
