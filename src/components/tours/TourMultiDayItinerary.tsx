"use client";

import React, { useState } from "react";
import { FaChevronDown, FaCalendarAlt, FaCheckCircle, FaSun, FaHotel, FaUtensils, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { ParsedDay } from "@/lib/tour-detail-utils";

interface TourMultiDayItineraryProps {
  days: ParsedDay[];
}

export const TourMultiDayItinerary: React.FC<TourMultiDayItineraryProps> = ({ days }) => {
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 0: true });

  const toggleDay = (idx: number) => {
    setOpenDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const isAllOpen = days.every((_, idx) => openDays[idx]);

  const toggleAll = () => {
    if (isAllOpen) {
      setOpenDays({});
    } else {
      const all: Record<number, boolean> = {};
      days.forEach((_, idx) => {
        all[idx] = true;
      });
      setOpenDays(all);
    }
  };

  const jumpToDay = (idx: number) => {
    setOpenDays((prev) => ({
      ...prev,
      [idx]: true,
    }));
    const el = document.getElementById(`day-card-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="w-5 h-5 text-[#6b0014]" />
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-title">
            Itinerario Día por Día
          </h3>
          <span className="text-xs font-black text-[#6b0014] bg-[#6b0014]/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {days.length} Días Programados
          </span>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#6b0014] bg-slate-100 hover:bg-amber-50 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors w-fit cursor-pointer"
        >
          {isAllOpen ? (
            <>
              <FaCompressAlt className="w-3 h-3 text-[#6b0014]" />
              <span>Colapsar Todos</span>
            </>
          ) : (
            <>
              <FaExpandAlt className="w-3 h-3 text-[#6b0014]" />
              <span>Expandir Todos los Días</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Day Navigation Pills (Mobile & Desktop) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">
          Saltar a:
        </span>
        {days.map((day, idx) => {
          const isOpen = !!openDays[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => jumpToDay(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isOpen
                  ? "bg-[#6b0014] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
              }`}
            >
              Día {day.dayNumber}
            </button>
          );
        })}
      </div>

      {/* Day Cards Timeline */}
      <div className="flex flex-col gap-4 relative pl-3 sm:pl-6 before:absolute before:left-7 sm:before:left-10 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-[#6b0014] before:via-[#6b0014]/40 before:to-slate-300">
        {days.map((day, idx) => {
          const isOpen = !!openDays[idx];

          return (
            <div
              key={idx}
              id={`day-card-${idx}`}
              className={`relative z-10 border rounded-2xl md:rounded-3xl transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "border-[#6b0014] bg-white shadow-md ring-1 ring-[#6b0014]/20"
                  : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/70"
              }`}
            >
              {/* Day Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleDay(idx)}
                className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs md:text-sm transition-all shrink-0 ${
                      isOpen
                        ? "bg-[#6b0014] text-white shadow-md scale-105"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    D{day.dayNumber}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#6b0014]">
                      Día {day.dayNumber} de {days.length}
                    </span>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-tight">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                    <FaSun className="w-3 h-3 text-[#ffc000]" />
                    <span>Excursión Guiada</span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#6b0014]" : ""
                    }`}
                  >
                    <FaChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* Day Content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex flex-col gap-4">
                  <ul className="flex flex-col gap-2.5">
                    {day.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60"
                      >
                        <FaCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
