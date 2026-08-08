import React from "react";
import Link from "next/link";
import { MapPin, Compass } from "lucide-react";

const DESTINATIONS_DATA = [
  {
    slug: "machu-picchu-pueblo",
    name: "Machu Picchu & Aguas Calientes",
    region: "Cusco, Perú",
    toursCount: 8,
    description: "Maravilla del Mundo Moderno. Disfruta de la mística ciudadela inca y sus impresionantes vistas de montaña.",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "city-tour-cusco",
    name: "Cusco Ciudad Imperial",
    region: "Cusco, Perú",
    toursCount: 5,
    description: "Capital arqueológica de América. Explora Sacsayhuamán, Qorikancha y el centro histórico colonial.",
    imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "valle-sagrado",
    name: "Valle Sagrado de los Incas",
    region: "Urubamba - Calca",
    toursCount: 6,
    description: "Pueblos tradicionales, andenerías incas y fortalezas majestuosas como Pisac y Ollantaytambo.",
    imageUrl: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "lago-titicaca",
    name: "Puno & Lago Titicaca",
    region: "Puno, Perú",
    toursCount: 3,
    description: "El lago navegable más alto del mundo. Visita las islas flotantes de los Uros, Taquile y Amantaní.",
    imageUrl: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=800&q=80",
  },
];

export const metadata = {
  title: "Destinos Turísticos en Perú | Chullos Tours",
  description: "Descubre los mejores destinos turísticos en Cusco, Machu Picchu, Puno y el Valle Sagrado.",
};

export default function DestinationsPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#111330] py-16 px-4 text-center text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#37d4d9] text-xs font-bold uppercase tracking-widest">
            Lugares Increíbles
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Destinos Turísticos de Perú
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl font-light">
            Explora las maravillas naturales e históricas más icónicas del sur del Perú.
          </p>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DESTINATIONS_DATA.map((dest) => (
          <Link
            key={dest.slug}
            href={`/destinos/${dest.slug}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#ff681a] text-white text-xs font-bold px-3 py-1 rounded-full">
                {dest.toursCount} Tours
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#37d4d9] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {dest.region}
                </span>
                <h2 className="text-xl font-bold text-[#1c1c1c] group-hover:text-[#ff681a] transition-colors">
                  {dest.name}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  {dest.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#111330] group-hover:text-[#ff681a]">
                <span>Ver Tours Disponibles</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
