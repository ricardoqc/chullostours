"use client";

import React, { useEffect, useRef } from "react";
import { TripAdvisorReview } from "@/lib/reviews";
import { ReviewCard } from "./review-card";

export function ReviewsSlider({ reviews }: { reviews: TripAdvisorReview[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let intervalId: NodeJS.Timeout;
    const startScroll = () => {
      intervalId = setInterval(() => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) { // close to the end
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: 350, behavior: "smooth" });
        }
      }, 4000);
    };

    startScroll();

    // Pause on hover
    const pauseScroll = () => clearInterval(intervalId);
    const resumeScroll = () => startScroll();

    el.addEventListener("mouseenter", pauseScroll);
    el.addEventListener("mouseleave", resumeScroll);
    el.addEventListener("touchstart", pauseScroll);
    el.addEventListener("touchend", resumeScroll);

    return () => {
      clearInterval(intervalId);
      if (el) {
        el.removeEventListener("mouseenter", pauseScroll);
        el.removeEventListener("mouseleave", resumeScroll);
        el.removeEventListener("touchstart", pauseScroll);
        el.removeEventListener("touchend", resumeScroll);
      }
    };
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory hide-scrollbar"
    >
      {reviews.map((r) => (
        <div key={r.id} className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px] snap-center">
          <ReviewCard review={r} />
        </div>
      ))}
    </div>
  );
}
