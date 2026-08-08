"use client";

import React from "react";
import { Sun, Calendar } from "lucide-react";

interface DayRangeSliderProps {
  minDays: number;
  maxDays: number;
  value: [number, number];
  onChange: (newValue: [number, number]) => void;
}

export const DayRangeSlider: React.FC<DayRangeSliderProps> = ({
  minDays,
  maxDays,
  value,
  onChange,
}) => {
  const [currentMin, currentMax] = value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), currentMax);
    onChange([val, currentMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), currentMin);
    onChange([currentMin, val]);
  };

  return (
    <div className="flex flex-col gap-3 min-w-[220px]">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-slate-800">
          <Calendar className="w-4 h-4 text-[#6b0014]" />
          <span>Duración (Días)</span>
        </span>
        <span className="bg-[#6b0014]/10 text-[#6b0014] px-2 py-0.5 rounded-md font-mono text-[11px]">
          {currentMin === currentMax
            ? `${currentMin} ${currentMin === 1 ? "día" : "días"}`
            : `${currentMin} - ${currentMax} días`}
        </span>
      </div>

      <div className="relative pt-1 pb-1">
        {/* Track background */}
        <div className="h-2 rounded-lg bg-slate-200 w-full relative">
          <div
            className="absolute h-full bg-[#6b0014] rounded-lg"
            style={{
              left: `${((currentMin - minDays) / (maxDays - minDays)) * 100}%`,
              right: `${100 - ((currentMax - minDays) / (maxDays - minDays)) * 100}%`,
            }}
          />
        </div>

        {/* Dual Range Input Sliders */}
        <input
          type="range"
          min={minDays}
          max={maxDays}
          value={currentMin}
          onChange={handleMinChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-4 top-0"
        />
        <input
          type="range"
          min={minDays}
          max={maxDays}
          value={currentMax}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer pointer-events-auto h-4 top-0"
        />
      </div>

      {/* Quick Select Buttons */}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => onChange([1, 6])}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors ${
            currentMin === 1 && currentMax === 6
              ? "bg-[#6b0014] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onChange([1, 1])}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors ${
            currentMin === 1 && currentMax === 1
              ? "bg-[#6b0014] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          1 Día
        </button>
        <button
          type="button"
          onClick={() => onChange([2, 6])}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors ${
            currentMin === 2 && currentMax === 6
              ? "bg-[#6b0014] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Multi-Día
        </button>
      </div>
    </div>
  );
};
