"use client";

import React from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaPlane,
  FaBed,
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";
import { ReservationFormData } from "./types";
import { HotelOpcion } from "@/types/tour";
import { formatHotelOptionSummary } from "@/lib/hotel-options";

interface StepReviewProps {
  formData: ReservationFormData;
  totalPrice: number;
  opcionesHotel?: HotelOpcion[];
  travelersSummary?: string;
  onBack?: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  formData,
  totalPrice,
  opcionesHotel,
  travelersSummary,
  onBack,
}) => {
  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);
  const selectedHotel = hasHotelOptions
    ? opcionesHotel.find((opt) => opt.id === formData.selectedHotelOptionId) || opcionesHotel[0]
    : null;

  const upgradesList: string[] = [];
  if (formData.includeHuaynaPicchu) upgradesList.push("Huayna Picchu");
  if (formData.includeHotel && !hasHotelOptions) upgradesList.push("Hotel 3★ Superior");

  const isSoles = formData.currency === "PEN";
  const totalDisplay = isSoles ? `S/ ${totalPrice.toLocaleString()} PEN` : `$${totalPrice} USD`;

  const travelersText =
    travelersSummary ||
    `${formData.adults} adulto${formData.adults !== 1 ? "s" : ""}`;

  const flightText = formData.noFlightYet
    ? "Por confirmar"
    : [formData.flightDate, formData.flightNumber].filter(Boolean).join(" - ") || "Por confirmar";
  const hotelText = selectedHotel
    ? formatHotelOptionSummary(selectedHotel)
    : formData.noHotelYet ? "Por confirmar" : formData.hotelName || "Por confirmar";
  const allergiesText = formData.allergies || "Ninguna";
  const sourceText = formData.howDidYouFindUs || "No especificado";

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-900 flex items-start gap-2">
        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Revisa que todos tus datos sean correctos antes de enviar. Nuestro agente te contactará por
          WhatsApp para confirmar tu reserva.
        </span>
      </div>

      {/* Secciones de resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sección 1: Tour */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b0014]">
          Detalles del Tour
        </span>
        <div className="text-xs text-slate-800 font-bold leading-snug">{formData.tourTitle}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Fecha:</strong> {formData.travelDate || "Por definir"}
            </span>
          </div>
          {formData.selectedHorario && (
            <div className="flex items-center gap-1.5">
              <FaClock className="w-3 h-3 text-[#6b0014] shrink-0" />
              <span>
                <strong>Horario:</strong> {formData.selectedHorario}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FaUsers className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Viajeros:</strong> {travelersText}
            </span>
          </div>
        </div>
        {upgradesList.length > 0 && (
          <div className="text-[11px] text-slate-600 flex flex-wrap gap-1.5 pt-1">
            {upgradesList.map((u) => (
              <span
                key={u}
                className="bg-[#6b0014]/10 text-[#6b0014] font-bold px-2 py-0.5 rounded-full"
              >
                + {u}
              </span>
            ))}
          </div>
        )}
        </div>

        {/* Sección 2: Contacto */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b0014]">
          Datos de Contacto
        </span>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
          <FaUser className="w-3 h-3 text-[#6b0014] shrink-0" />
          <span>{formData.fullName}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <FaEnvelope className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>{formData.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaPhoneAlt className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>{formData.phone}</span>
          </div>
          {formData.country && (
            <div className="flex items-center gap-1.5">
              <FaGlobe className="w-3 h-3 text-[#6b0014] shrink-0" />
              <span>{formData.country}</span>
            </div>
          )}
          {formData.dni && (
            <div className="flex items-center gap-1.5">
              <FaUser className="w-3 h-3 text-[#6b0014] shrink-0" />
              <span>DNI: {formData.dni}</span>
            </div>
          )}
        </div>
        </div>

        {/* Sección 3: Viaje */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex flex-col gap-2 lg:col-span-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b0014]">
          Detalles del Viaje
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Llegada a Cusco:</strong> {formData.arrivalDate || "Por definir"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaPlane className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Vuelo:</strong> {flightText}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBed className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Alojamiento:</strong> {hotelText}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaExclamationTriangle className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Alergias:</strong> {allergiesText}
            </span>
          </div>
          {formData.specialNeeds && (
            <div className="flex items-start gap-1.5 sm:col-span-2">
              <FaCheckCircle className="w-3 h-3 text-[#6b0014] shrink-0 mt-0.5" />
              <span>
                <strong>Necesidades:</strong> {formData.specialNeeds}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FaSearch className="w-3 h-3 text-[#6b0014] shrink-0" />
            <span>
              <strong>Fuente:</strong> {sourceText}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-[#6b0014]/5 border border-[#6b0014]/20 rounded-2xl p-4">
        <span className="text-xs font-extrabold text-slate-800 uppercase">Inversión estimada</span>
        <span className="text-2xl font-black text-[#6b0014] font-title">
          {totalDisplay}
        </span>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-bold text-slate-600 hover:text-[#6b0014] self-start"
        >
          ← Editar datos anteriores
        </button>
      )}
    </div>
  );
};