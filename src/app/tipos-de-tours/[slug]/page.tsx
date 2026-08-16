import React from "react";
import { Metadata } from "next";
import { getAllTours } from "@/lib/tours";
import { ToursClient } from "@/app/tours/tours-client";

interface TiposDeToursPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "paquetes" },
    { slug: "aventura" },
    { slug: "caminatas" },
    { slug: "tours-diarios" },
  ];
}

export async function generateMetadata({ params }: TiposDeToursPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedType = slug.replace(/-/g, " ");
  return {
    title: `Tours de Tipo: ${formattedType} | Chullos Tours`,
    description: `Catálogo de experiencias y paquetes filtrados por el tipo: ${formattedType}.`,
  };
}

export default async function TiposDeToursSlugPage({ params }: TiposDeToursPageProps) {
  const { slug } = await params;
  const tours = getAllTours();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 capitalize">
          Tipo de Tour: {slug.replace(/-/g, " ")}
        </h1>
        <ToursClient initialTours={tours} />
      </div>
    </div>
  );
}
