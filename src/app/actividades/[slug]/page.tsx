import React from "react";
import { getAllTours } from "@/lib/tours";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import { Compass } from "lucide-react";

interface ActivityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const titleFormatted = slug.replace(/-/g, " ").toUpperCase();
  const tours = getAllTours();

  const adaptTourToCardProps = (tour: any): TourProps => {
    const firstImage =
      tour.galeria && tour.galeria.length > 0
        ? tour.galeria[0].src
        : "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80";

    return {
      id: tour.slug,
      slug: tour.slug,
      title: tour.titulo,
      location: tour.atributos?.ubicacion || "Cusco, Perú",
      duration: tour.atributos?.duracion || "Full Day",
      price: tour.atributos?.duracion?.includes("Días") ? 350 : 65,
      rating: 4.9,
      reviewCount: 24,
      imageUrl: firstImage,
      badge: tour.atributos?.tipo_tour || "Actividad",
    };
  };

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#111330] py-16 px-4 text-center text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="bg-[#37d4d9] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Tipo de Actividad
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white capitalize">
            {titleFormatted}
          </h1>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#1c1c1c]">
          Tours de {titleFormatted} ({tours.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={adaptTourToCardProps(tour)} />
          ))}
        </div>
      </div>
    </div>
  );
}
