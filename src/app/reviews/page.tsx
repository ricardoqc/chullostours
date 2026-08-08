import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAllReviews } from "@/lib/reviews";
import { ReviewCard } from "@/components/tours/review-card";

export const metadata = {
  title: "Reseñas de Pasajeros - Chullos Tours",
  description: "Lee las opiniones y experiencias reales de nuestros pasajeros en Cusco, Machu Picchu y más.",
};

export default function ReviewsPage() {
  const allReviews = getAllReviews();

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[#34E0A1] font-bold text-sm uppercase tracking-wider mb-2 block">
              TripAdvisor Reviews
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-title">
              Lo Que Dicen Nuestros Pasajeros
            </h1>
            <p className="text-slate-600 mt-3 max-w-2xl text-lg">
              Descubre por qué somos la elección número uno para explorar Cusco y el Valle Sagrado. Experiencias reales de viajeros de todo el mundo.
            </p>
          </div>
          
          <a 
            href="https://www.tripadvisor.com.mx/Attraction_Review-g294314-d26719669-Reviews-Chullos_Tours-Cusco_Cusco_Region.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#34E0A1] text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-[#2bc58c] transition-colors"
          >
            Ver en TripAdvisor
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
