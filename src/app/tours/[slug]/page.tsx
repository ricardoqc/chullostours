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

export const dynamicParams = false;

export async function generateStaticParams() {
  const tours = getAllTours();
  return tours
    .filter((tour) => tour && tour.slug)
    .map((tour) => ({
      slug: String(tour.slug),
    }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) return {};

  const title = tour.seo?.meta_title || `${tour.titulo} | Chullos Tours`;
  const description = tour.seo?.meta_description || tour.resumen;
  const ogImage = tour.seo?.open_graph?.og_image || (tour.galeria && tour.galeria[0]?.src);
  const twitterImage = tour.seo?.twitter_card?.image || ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: tour.seo?.canonical || `https://chullostours.com/tours/${tour.slug}/`,
    },
    openGraph: {
      title: tour.seo?.open_graph?.og_title || title,
      description: tour.seo?.open_graph?.og_description || description,
      url: tour.seo?.open_graph?.og_url || `https://chullostours.com/tours/${tour.slug}/`,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tour.seo?.twitter_card?.title || title,
      description: tour.seo?.twitter_card?.description || description,
      images: twitterImage ? [twitterImage] : [],
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://chullostours.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tours",
        "item": "https://chullostours.com/tienda/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tour.titulo,
        "item": `https://chullostours.com/tours/${tour.slug}/`
      }
    ]
  };

  return (
    <>
      {tour.seo_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tour.seo_schema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TourDetailClient tour={tour} allTours={allTours} />
    </>
  );
}
