import React from "react";
import { getAllTours } from "@/lib/tours";
import { ToursClient } from "./tours-client";

export const metadata = {
  title: "Catálogo de Tours en Cusco y Machu Picchu | Chullos Tours",
  description: "Explora todos los tours, caminatas y paquetes turísticos en Cusco y Perú.",
};

export default function ToursPage() {
  const tours = getAllTours();

  return <ToursClient initialTours={tours} />;
}
