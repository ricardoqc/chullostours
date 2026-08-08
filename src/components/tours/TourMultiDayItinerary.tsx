"use client";

import React, { useState } from "react";
import { FaChevronDown, FaCalendarAlt, FaCheckCircle, FaSun, FaHotel, FaUtensils } from "react-icons/fa";
import { ParsedDay } from "@/lib/tour-detail-utils";

interface TourMultiDayItineraryProps {
  days: ParsedDay[];
}

export const TourMultiDayItinerary: React.FC<TourMultiDayItineraryProps> = ({ days }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleDay = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-title flex items-center gap-2">
          <FaCalendarAlt className="w-5 h-5 text-[#6b0014]" />
          <span>Itinerario Día por Día</span>
        </h3>
        <span className="text-xs font-black text-[#6b0014] bg-[#6b0014]/10 px-3 py-1 rounded-full uppercase tracking-wider">
          {days.length} Días Programados
        </span>
      </div>

      <div className="flex flex-col gap-4 relative pl-3 sm:pl-6 before:absolute before:left-7 sm:before:left-10 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-[#6b0014] before:via-[#6b0014]/40 before:to-slate-300">
        {days.map((day, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
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
                      Día {day.dayNumber}
                    </span>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-tight">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                    <FaSun className="w-3 h-3 text-[#ffc000]" />
                    <span>Día activo</span>
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

