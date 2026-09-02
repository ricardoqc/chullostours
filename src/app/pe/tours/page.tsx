import React from "react";
import { getAllTours } from "@/lib/tours";
import { ToursClient } from "@/app/tours/tours-client";

export const metadata = {
  title: "Tours en Cusco y Machu Picchu | Chullos Tours Perú",
  description:
    "Catálogo de tours y paquetes en Cusco. Reserva con Chullos Tours, operador directo en Perú.",
  alternates: {
    canonical: "https://chullostours.com/pe/tours/",
    languages: {
      "es-PE": "https://chullostours.com/pe/tours/",
      es: "https://chullostours.com/tours/",
    },
  },
};

export default function PeToursPage() {
  const tours = getAllTours();
  return <ToursClient initialTours={tours} />;
}
