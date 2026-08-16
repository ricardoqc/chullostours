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
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer select-none border ${
        isSelected
          ? "bg-[#6b0014] text-white border-[#6b0014] shadow-md scale-105"
          : "bg-slate-50/80 text-slate-700 border-slate-200 hover:border-[#6b0014]/40 hover:bg-slate-100/90"
      }`}
    >
      <IconComponent className={`w-4 h-4 transition-colors ${isSelected ? "text-amber-400" : "text-[#6b0014]"}`} />
      <span>{profile.label}</span>
    </button>
  );
};

