import React from "react";
import { getTourBySlug, getAllTours } from "@/lib/tours";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TourDetailClient } from "./tour-detail-client";

interface TourPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) return {};

  return {
    title: tour.seo?.meta_title || `${tour.titulo} | Chullos Tours`,
    description: tour.seo?.meta_description || tour.resumen,
    alternates: {
      canonical: tour.seo?.canonical,
    },
    openGraph: {
      title: tour.seo?.open_graph?.og_title || tour.titulo,
      description: tour.seo?.open_graph?.og_description || tour.resumen,
      url: tour.seo?.open_graph?.og_url,
      images: tour.seo?.open_graph?.og_image ? [{ url: tour.seo.open_graph.og_image }] : [],
      type: "website",
    },
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  const allTours = getAllTours();

  if (!tour) {
    notFound();
  }

  return (
    <>
      {tour.seo_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tour.seo_schema) }}
        />
      )}
      <TourDetailClient tour={tour} allTours={allTours} />
    </>
  );
}
