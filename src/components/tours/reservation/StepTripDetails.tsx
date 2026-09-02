"use client";

import React from "react";
import {
  FaPlane,
  FaBed,
  FaExclamationTriangle,
  FaHandshake,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { StepComponentProps, SOURCES } from "./types";

export const StepTripDetails: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 text-[11px] text-sky-900 flex items-start gap-2">
        <FaHandshake className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
        <span>
          Estos datos ayudan a nuestro agente a coordinar tu experiencia. Todos son opcionales.
        </span>
      </div>

      {/* Fecha de llegada a Cusco */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Fecha de llegada a Cusco</span>
        </label>
        <input
          type="date"
          value={formData.arrivalDate}
          onChange={(e) => updateFormData({ arrivalDate: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
        />
      </div>

      {/* Vuelo */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.noFlightYet}
            onChange={(e) => updateFormData({ noFlightYet: e.target.checked })}
            className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
          />
          <FaPlane className="w-3.5 h-3.5 text-[#6b0014]" />
          <span className="text-xs font-extrabold text-slate-800">
            Todavía no tengo vuelo reservado
          </span>
        </label>

        {!formData.noFlightYet && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">
                Fecha de vuelo
              </label>
              <input
                type="date"
                value={formData.flightDate}
                onChange={(e) => updateFormData({ flightDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">
                Número de vuelo
              </label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => updateFormData({ flightNumber: e.target.value })}
                placeholder="Ej: LATAM 201"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Alojamiento */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.noHotelYet}
            onChange={(e) => updateFormData({ noHotelYet: e.target.checked })}
            className="w-4 h-4 rounded text-[#6b0014] focus:ring-[#6b0014]"
          />
          <FaBed className="w-3.5 h-3.5 text-[#6b0014]" />
          <span className="text-xs font-extrabold text-slate-800">
            Todavía no tengo alojamiento reservado
          </span>
        </label>

        {!formData.noHotelYet && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 mt-1">
            <label className="text-[10px] font-extrabold text-slate-600 uppercase">
              Nombre del hotel o dirección
            </label>
            <input
              type="text"
              value={formData.hotelName}
              onChange={(e) => updateFormData({ hotelName: e.target.value })}
              placeholder="Ej: Casa Andina Premium Cusco o dirección del Airbnb"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
            />
          </div>
        )}
      </div>

      {/* Alergias */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <FaExclamationTriangle className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Alergias / Restricciones alimenticias</span>
        </label>
        <textarea
          rows={2}
          value={formData.allergies}
          onChange={(e) => updateFormData({ allergies: e.target.value })}
          placeholder="Ej: vegetariana, celíaca, alergia a frutos secos..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all resize-none"
        />
      </div>

      {/* Necesidades especiales */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <FaHandshake className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>Necesidades especiales</span>
        </label>
        <textarea
          rows={2}
          value={formData.specialNeeds}
          onChange={(e) => updateFormData({ specialNeeds: e.target.value })}
          placeholder="Ej: movilidad reducida, silla de ruedas, condición médica..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all resize-none"
        />
      </div>

      {/* Cómo nos encontraste */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <FaSearch className="w-3.5 h-3.5 text-[#6b0014]" />
          <span>¿Cómo nos encontraste?</span>
        </label>
        <select
          value={formData.howDidYouFindUs}
          onChange={(e) => updateFormData({ howDidYouFindUs: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all cursor-pointer"
        >
          <option value="">Selecciona una opción</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {errors.tripDetails && (
        <span className="text-[11px] font-semibold text-rose-600">{errors.tripDetails}</span>
      )}
    </div>
  );
};