import React from "react";
import { getAllTours } from "@/lib/tours";
import { ToursClient } from "../tours/tours-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda de Tours y Experiencias | Chullos Tours",
  description: "Explora nuestra tienda de paquetes de viaje y experiencias turísticas en Cusco y Perú.",
};

export default function TiendaPage() {
  const tours = getAllTours();

  return <ToursClient initialTours={tours} />;
}
