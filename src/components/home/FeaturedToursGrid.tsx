"use client";

import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import { PricedTourCard } from "@/components/tours/PricedTourCard";
import type { Tour } from "@/types/tour";

interface FeaturedToursGridProps {
  items: { tour: Tour; badge: string }[];
}

export function FeaturedToursGrid({ items }: FeaturedToursGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map(({ tour, badge }, idx) => (
        <Reveal key={tour.slug} delay={idx * 0.08}>
          <PricedTourCard tour={tour} badge={badge} />
        </Reveal>
      ))}
    </div>
  );
}
