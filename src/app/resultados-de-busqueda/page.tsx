import React from "react";
import { getAllTours } from "@/lib/tours";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import { Search } from "lucide-react";

interface SearchResultsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchResultsPage({ searchParams }: SearchResultsPageProps) {
  const { q = "" } = await searchParams;
  const tours = getAllTours();

  const filtered = tours.filter(
    (t) =>
      t.titulo.toLowerCase().includes(q.toLowerCase()) ||
      t.resumen?.toLowerCase().includes(q.toLowerCase()) ||
      t.atributos?.ubicacion?.toLowerCase().includes(q.toLowerCase())
  );

  const adaptTourToCardProps = (tour: any): TourProps => ({
    id: tour.slug,
    slug: tour.slug,
    title: tour.titulo,
    location: tour.atributos?.ubicacion || "Cusco, Perú",
    duration: tour.atributos?.duracion || "Full Day",
    price: tour.atributos?.duracion?.includes("Días") ? 350 : 65,
    rating: 4.9,
    reviewCount: 30,
    imageUrl:
      tour.galeria && tour.galeria.length > 0
        ? tour.galeria[0].src
        : "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    badge: tour.atributos?.tipo_tour || "Resultado",
  });

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="bg-[#111330] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[#37d4d9] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
            Resultados de Búsqueda
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {q ? `Búsqueda: "${q}"` : "Todos los Resultados"}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        <span className="text-sm text-gray-500 font-semibold">
          Se encontraron <strong className="text-[#ff681a]">{filtered.length}</strong> tours coincidentes
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((tour) => (
            <TourCard key={tour.slug} tour={adaptTourToCardProps(tour)} />
          ))}
        </div>
      </div>
    </div>
  );
}
