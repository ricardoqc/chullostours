"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate = new Date().toISOString().split("T")[0],
  placeholder = "Selecciona una fecha",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to current date
  const parsedValue = value ? new Date(`${value}T00:00:00`) : null;
  const initialYear = parsedValue ? parsedValue.getFullYear() : new Date().getFullYear();
  const initialMonth = parsedValue ? parsedValue.getMonth() : new Date().getMonth();

  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // Close calendar when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper to format date string
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return placeholder;
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return `${d} de ${MONTH_NAMES[m]}, ${y}`;
  };

  // Generate days for grid
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 is Sunday, convert to Monday = 0, Sunday = 6
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const minDateObj = minDate ? new Date(`${minDate}T00:00:00`) : new Date();

  const handleSelectDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateFormatted = `${currentYear}-${monthStr}-${dayStr}`;
    onChange(dateFormatted);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-[#6b0014] focus:ring-4 focus:ring-[#6b0014]/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-[#6b0014] shrink-0 group-hover:scale-110 transition-transform" />
          <span className={`truncate ${value ? "text-slate-900 font-extrabold" : "text-slate-400 font-medium"}`}>
            {value ? formatDateDisplay(value) : placeholder}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
          {isOpen ? "Cerrar" : "Elegir"}
        </span>
      </button>

      {/* Interactive Dropdown Calendar */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn animate-slideDown">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-black text-slate-900 font-title uppercase tracking-wide">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((name) => (
              <span key={name} className="text-[10px] font-extrabold text-slate-400 py-1">
                {name}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dateForDay = new Date(currentYear, currentMonth, dayNumber);
              const isPast = dateForDay < minDateObj;

              const monthStr = String(currentMonth + 1).padStart(2, "0");
              const dayStr = String(dayNumber).padStart(2, "0");
              const isSelected = value === `${currentYear}-${monthStr}-${dayStr}`;

              return (
                <button
                  key={dayNumber}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(dayNumber)}
                  className={`h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                    isPast
                      ? "text-slate-300 cursor-not-allowed opacity-40"
                      : isSelected
                      ? "bg-[#6b0014] text-white shadow-md font-black scale-105"
                      : "text-slate-700 hover:bg-[#ffc000]/20 hover:text-[#6b0014]"
                  }`}
                >
                  <span>{dayNumber}</span>
                  {isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#ffc000]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Options */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const m = String(today.getMonth() + 1).padStart(2, "0");
                const d = String(today.getDate()).padStart(2, "0");
                onChange(`${today.getFullYear()}-${m}-${d}`);
                setIsOpen(false);
              }}
              className="text-[#6b0014] hover:underline font-bold"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
                const d = String(tomorrow.getDate()).padStart(2, "0");
                onChange(`${tomorrow.getFullYear()}-${m}-${d}`);
                setIsOpen(false);
              }}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Mañana
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
