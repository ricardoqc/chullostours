"use client";

import React from "react";
import { TourCard } from "@/components/tours/tour-card";
import { toTourCardProps } from "@/lib/tour-card-mapper";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import type { Tour } from "@/types/tour";

interface PricedTourCardProps {
  tour: Tour;
  badge?: string;
}

export function PricedTourCard({ tour, badge }: PricedTourCardProps) {
  const { currency } = useDisplayCurrency();
  return <TourCard tour={toTourCardProps(tour, { badge, currency })} />;
}
