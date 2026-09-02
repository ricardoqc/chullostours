import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, ArrowRight, Compass, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getAllTours } from "@/lib/tours";
import {
  getDestinationBySlug,
  getDestinationsWithTours,
  getToursByDestination,
} from "@/lib/places";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { TourCard } from "@/components/tours/tour-card";
import { toTourCardProps } from "@/lib/tour-card-mapper";

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getDestinationsWithTours(getAllTours()).map((destination) => ({
    slug: destination.slug,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug, getAllTours());

  if (!destination) return {};

  const hasTours = destination.toursCount > 0;
  const title = hasTours
    ? `Tours en ${destination.nombre} | ${destination.toursCount} experiencias | Chullos Tours`
    : `Tours en ${destination.nombre} | Chullos Tours`;
  const description = hasTours
    ? `${destination.toursCount} tours y excursiones en ${destination.nombre} (${destination.region}). ${destination.descripcion}`
    : `Aún no tenemos tours publicados en ${destination.nombre}. Escríbenos y armamos un itinerario a medida en ${destination.region}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://chullostours.com/destinos/${destination.slug}/`,
    },
    robots: hasTours ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `https://chullostours.com/destinos/${destination.slug}/`,
      images: [{ url: destination.imagen }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [destination.imagen],
    },
  };
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const tours = getAllTours();
  const destination = getDestinationBySlug(slug, tours);

  if (!destination) {
    notFound();
  }

  const destinationTours = getToursByDestination(slug, tours);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://chullostours.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinos",
        item: "https://chullostours.com/destinos/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: destination.nombre,
        item: `https://chullostours.com/destinos/${destination.slug}/`,
      },
    ],
  };

  const whatsappUrl = getPrimaryWhatsappUrl(
    `Hola, me interesa viajar a ${destination.nombre}. ¿Qué opciones tienen disponibles?`
  );

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="bg-[#ffc000] text-[#6b0014] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {destination.region}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white font-title">
            {destination.nombre}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl font-light">
            {destination.descripcion}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
        >
          <Link href="/" className="hover:text-[#6b0014] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/destinos/"
            className="hover:text-[#6b0014] transition-colors"
          >
            Destinos
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700">{destination.nombre}</span>
        </nav>

        {destinationTours.length > 0 ? (
          <>
            <h2 className="text-2xl font-black text-slate-900 font-title">
              Tours en {destination.nombre}{" "}
              <span className="text-[#6b0014]">
                ({destinationTours.length})
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationTours.map((tour) => (
                <TourCard key={tour.slug} tour={toTourCardProps(tour)} />
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />

            <div className="w-16 h-16 rounded-3xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
              <Compass className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-title leading-snug">
                Todavía no tenemos tours publicados en {destination.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Estamos preparando nuevas salidas para este destino. Mientras
                tanto puedes revisar nuestro catálogo completo o pedirnos un
                itinerario a medida que incluya {destination.nombre}.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <Link
                href="/tours/"
                className="inline-flex items-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title"
              >
                <span>Ver todos los tours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

            <Link
              href="/destinos/"
              className="text-[11px] font-extrabold text-slate-400 hover:text-[#6b0014] transition-colors uppercase tracking-wider"
            >
              Volver a todos los destinos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
