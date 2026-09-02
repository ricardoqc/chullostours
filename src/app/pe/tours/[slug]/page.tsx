import React, { Suspense } from "react";
import { getTourBySlug, getAllTours } from "@/lib/tours";
import { resolveGalleryItems } from "@/lib/gallery-media";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TourDetailClient } from "@/app/tours/[slug]/tour-detail-client";

interface PeTourPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const tours = getAllTours();
  return tours.filter((t) => t.slug).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PeTourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};

  const title = tour.seo?.meta_title || tour.titulo;
  return {
    title,
    description: tour.seo?.meta_description || tour.resumen,
    alternates: {
      canonical: `https://chullostours.com/pe/tours/${tour.slug}/`,
      languages: {
        "es-PE": `https://chullostours.com/pe/tours/${tour.slug}/`,
        es: `https://chullostours.com/tours/${tour.slug}/`,
      },
    },
  };
}

export default async function PeTourPage({ params }: PeTourPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  const allTours = getAllTours();

  if (!tour) notFound();

  const galleryItems = resolveGalleryItems(tour);

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-500 font-bold">Cargando experiencia...</div>
      }
    >
      <TourDetailClient tour={tour} allTours={allTours} galleryItems={galleryItems} />
    </Suspense>
  );
}
