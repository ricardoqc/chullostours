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
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <FaCalendarAlt className="w-4 sm:w-5 h-4 sm:h-5 text-[#6b0014] shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 font-title">
            Itinerario Día por Día
          </h3>
          <span className="text-[10px] sm:text-xs font-black text-[#6b0014] bg-[#6b0014]/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
            {days.length} Días
          </span>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#6b0014] bg-slate-100 hover:bg-amber-50 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors w-fit cursor-pointer min-h-[36px] touch-manipulation"
        >
          {isAllOpen ? (
            <>
              <FaCompressAlt className="w-3 h-3 text-[#6b0014]" />
              <span>Colapsar Todos</span>
            </>
          ) : (
            <>
              <FaExpandAlt className="w-3 h-3 text-[#6b0014]" />
              <span>Expandir Todos</span>
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
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer touch-manipulation min-h-[38px] ${
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
      <div className="flex flex-col gap-4 sm:gap-5">
        {days.map((day, idx) => {
          const isOpen = !!openDays[idx];
          const isLastDay = idx === days.length - 1;

          return (
            <div key={idx} className="flex items-start gap-2 sm:gap-4 group">
              {/* Left Timeline Node & Connector Line */}
              <div className="flex flex-col items-center shrink-0 w-8 sm:w-11 pt-1 self-stretch">
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  aria-label={`Día ${day.dayNumber}`}
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 z-10 cursor-pointer shadow-xs touch-manipulation ${
                    isOpen
                      ? "bg-[#6b0014] text-white shadow-md ring-3 sm:ring-4 ring-[#6b0014]/15 scale-105"
                      : "bg-white border-2 border-slate-300 text-slate-700 hover:border-[#6b0014] hover:text-[#6b0014]"
                  }`}
                >
                  D{day.dayNumber}
                </button>
                {!isLastDay && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-[#6b0014] via-[#6b0014]/30 to-slate-200 my-1.5 sm:my-2 rounded-full min-h-[1.5rem]" />
                )}
              </div>

              {/* Right Day Content Card */}
              <div
                id={`day-card-${idx}`}
                className={`flex-1 min-w-0 border rounded-2xl md:rounded-3xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#6b0014]/60 bg-white shadow-md ring-1 ring-[#6b0014]/15"
                    : "border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                {/* Day Header Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className="w-full p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 sm:gap-3 text-left cursor-pointer min-h-[48px]"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-[#6b0014]">
                      Día {day.dayNumber} de {days.length}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-900 leading-tight">
                      {day.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
                  <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-slate-100 flex flex-col gap-3">
                    <ul className="flex flex-col gap-2">
                      {day.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200/60"
                        >
                          <FaCheckCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
