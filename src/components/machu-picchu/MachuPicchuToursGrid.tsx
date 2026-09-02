"use client";

import React from "react";
import { PricedTourCard } from "@/components/tours/PricedTourCard";
import type { Tour } from "@/types/tour";

interface MachuPicchuToursGridProps {
  tours: Tour[];
  badge?: string;
}

export function MachuPicchuToursGrid({ tours, badge = "Machu Picchu" }: MachuPicchuToursGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tours.map((tour) => (
        <PricedTourCard key={tour.slug} tour={tour} badge={badge} />
      ))}
    </div>
  );
}
