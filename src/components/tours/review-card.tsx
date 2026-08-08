"use client";

import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { TripAdvisorReview } from "@/lib/reviews";
import { SocialTripadvisor } from "@/components/ui/icons";

export function ReviewCard({ review }: { review: TripAdvisorReview }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;
  
  const isLong = review.text && review.text.length > maxLength;
  const displayText = expanded || !isLong ? review.text : review.text.substring(0, maxLength) + "...";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* TripAdvisor Badge/Logo */}
      <div className="absolute top-4 right-4 w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
        <SocialTripadvisor className="w-8 h-8 text-[#34E0A1]" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between z-10 pr-10">
          <div className="flex items-center gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <FaCircle key={i} className="w-3.5 h-3.5 text-[#34E0A1]" />
            ))}
          </div>
        </div>
        <h3 className="font-title font-bold text-slate-900 leading-tight">"{review.title}"</h3>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {displayText}
          {isLong && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="ml-1 text-[#6b0014] font-semibold hover:underline"
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs">
        {review.user?.avatar?.image ? (
          <img src={review.user.avatar.image} alt={review.user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase">
            {review.user?.name ? review.user.name.charAt(0) : "U"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">{review.user?.name || "Usuario de TripAdvisor"}</h4>
          <span className="text-slate-400 text-[11px] block truncate">{review.publishedDate}</span>
        </div>
      </div>
    </div>
  );
}
