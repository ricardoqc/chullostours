"use client";

import React from "react";
import { TravelerProfile } from "@/lib/tour-filters";
import {
  Footprints,
  Landmark,
  Train,
  CalendarDays,
  Zap,
  Trees,
  Sparkles,
  Compass,
} from "lucide-react";

interface TravelerProfilePillProps {
  profile: TravelerProfile;
  isSelected: boolean;
  onToggle: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Footprints,
  Landmark,
  Train,
  CalendarDays,
  Zap,
  Trees,
  Sparkles,
};

export const TravelerProfilePill: React.FC<TravelerProfilePillProps> = ({
  profile,
  isSelected,
  onToggle,
}) => {
  const IconComponent = ICON_MAP[profile.iconName] || Compass;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer select-none border active:scale-95 touch-manipulation ${
        isSelected
          ? "bg-[#6b0014] text-white border-[#6b0014] shadow-md shadow-[#6b0014]/20 scale-[1.03]"
          : "bg-white text-slate-700 border-slate-200/90 hover:border-[#6b0014]/40 hover:bg-slate-50 shadow-2xs"
      }`}
    >
      <IconComponent className={`w-4 h-4 transition-colors ${isSelected ? "text-amber-300" : "text-[#6b0014]"}`} />
      <span>{profile.label}</span>
      {/* Active Dot Indicator */}
      <span
        className={`w-2 h-2 rounded-full transition-all ${
          isSelected
            ? "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.9)] scale-100"
            : "bg-slate-200 scale-75"
        }`}
      />
    </button>
  );
};

