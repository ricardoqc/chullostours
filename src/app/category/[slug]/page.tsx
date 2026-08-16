import React from "react";
import { Metadata } from "next";
import { getAllTours } from "@/lib/tours";
import { ToursClient } from "@/app/tours/tours-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "guias" },
    { slug: "consejos" },
    { slug: "destinos" },
    { slug: "tours" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedCategory = slug.replace(/-/g, " ");
  return {
    title: `Categoría: ${formattedCategory} | Chullos Tours`,
    description: `Artículos y tours relacionados con la categoría ${formattedCategory} en Chullos Tours.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const tours = getAllTours();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 capitalize">
          Categoría: {slug.replace(/-/g, " ")}
        </h1>
        <ToursClient initialTours={tours} />
      </div>
    </div>
  );
}
