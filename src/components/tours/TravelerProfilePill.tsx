"use client";

import React from "react";
import { TravelerProfile } from "@/lib/tour-filters";

interface TravelerProfilePillProps {
  profile: TravelerProfile;
  isSelected: boolean;
  onToggle: () => void;
}

export const TravelerProfilePill: React.FC<TravelerProfilePillProps> = ({
  profile,
  isSelected,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer select-none border ${
        isSelected
          ? "bg-[#6b0014] text-white border-[#6b0014] shadow-md scale-105"
          : "bg-white text-slate-700 border-slate-200 hover:border-[#6b0014]/40 hover:bg-slate-50"
      }`}
    >
      <span className="text-base leading-none">{profile.emoji}</span>
      <span>{profile.label}</span>
    </button>
  );
};
