import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Headphones, ArrowRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourCard, TourProps } from "@/components/tours/tour-card";
import { PromoBanner } from "@/components/ui/promo-banner";
import { HeroSearch } from "@/components/tours/hero-search";
import { getAllTours } from "@/lib/tours";
import { estimateTourPrice } from "@/lib/tour-filters";
import { Tour } from "@/types/tour";
import { getAllReviews } from "@/lib/reviews";
import { ReviewCard } from "@/components/tours/review-card";
import { ReviewsSlider } from "@/components/tours/reviews-slider";

function adaptTourToCard(tour: Tour, badge?: string): TourProps {
  const firstImage =
    tour.galeria && tour.galeria.length > 0
      ? tour.galeria[0].src
      : "/tours/camino-inca-2-dias/01.jpg";

  const price = estimateTourPrice(tour);

  return {
    id: tour.slug,
    slug: tour.slug,
    title: tour.titulo,
    location: tour.atributos?.ubicacion ? tour.atributos.ubicacion.split(",")[0] : "Cusco, Perú",
    duration: tour.atributos?.duracion || "1 Día",
    price,
    rating: 5.0,
    imageUrl: firstImage,
    badge: badge || tour.atributos?.duracion || "Popular",
  };
}



export default function Home() {
  const allTours = getAllTours();
  const allReviews = getAllReviews();
  const featuredReviews = allReviews.slice(0, 6);

  // Helper to find tour by slug or fallback
  const getTour = (slug: string) => allTours.find((t) => t.slug === slug) || allTours[0];

  // Select 4 Featured Tours dynamically
  const featuredSlugs = [
    { slug: "machu-picchu-full-day-tren-expedition", badge: "Más Popular" },
    { slug: "montana-colores-vinicunca-tour", badge: "Imperdible" },
    { slug: "laguna-humantay-tour-cusco", badge: "Trekking Top" },
    { slug: "valle-sagrado-vip-tour-cusco", badge: "Recomendado" },
  ];

  const featuredTours: TourProps[] = featuredSlugs.map(({ slug, badge }) => {
    const tour = getTour(slug);
    return adaptTourToCard(tour, badge);
  });

  // Destinations dynamically mapped with real tour local images
  const destinations = [
    {
      name: "Machu Picchu",
      toursCount: "8 Tours",
      image: getTour("tour-machu-picchu-2-dias")?.galeria?.[0]?.src || "/tours/tour-machu-picchu-2-dias/01.jpg",
      slug: "machu-picchu",
    },
    {
      name: "Cusco & Alrededores",
      toursCount: "5 Tours",
      image: getTour("city-tour-cusco")?.galeria?.[0]?.src || "/tours/city-tour-cusco/01.jpg",
      slug: "cusco-ciudad",
    },
    {
      name: "Valle Sagrado Inca",
      toursCount: "4 Tours",
      image: getTour("valle-sagrado-vip-tour-cusco")?.galeria?.[0]?.src || "/tours/valle-sagrado-vip-tour-cusco/01.jpg",
      slug: "valle-sagrado",
    },
    {
      name: "Lago Titicaca & Puno",
      toursCount: "3 Tours",
      image: getTour("tour-lago-titicaca-2-dias")?.galeria?.[0]?.src || "/tours/tour-lago-titicaca-2-dias/01.jpg",
      slug: "lago-titicaca",
    },
  ];

  // Hero Background image
  const heroBgImage = getTour("camino-inca-2-dias")?.galeria?.[1]?.src ||
    getTour("camino-inca-2-dias")?.galeria?.[0]?.src ||
    "/tours/camino-inca-2-dias/01.jpg";

  // Promo Banner Tour
  const promoTour = getTour("cusco-magico-5-dias");
  const promoBgImage = promoTour?.galeria?.[0]?.src || "/tours/cusco-magico-5-dias/01.jpg";

  return (
    <div className="flex flex-col gap-10 md:gap-16 pb-16">
      {/* Hero Section with Interactive Tour Search Engine */}
      <section className="max-w-7xl mx-auto px-4 pt-3 md:pt-6 w-full">
        <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden min-h-[520px] md:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between shadow-2xl bg-slate-900 border border-slate-800 p-6 md:p-12 lg:p-14">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{
              backgroundImage: `url('${heroBgImage}')`,
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

          {/* Hero Left Main Content */}
          <div className="relative max-w-2xl flex flex-col items-start gap-4 md:gap-5 text-left z-10 my-auto w-full">
            {/* Trust Pill */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white shadow-sm max-w-full">
              <span className="text-[#ffc000] font-extrabold shrink-0">★ 5.0 TripAdvisor</span>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="truncate">Agencia Oficial Autorizada Cusco 2026</span>
            </div>

            {/* H1 Copywriting with Andean Emotion */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight font-title text-white">
              Vive <span className="text-[#ffc000]">Cusco</span> con Guías Locales. <span className="block text-slate-100">No solo lo veas — siéntelo.</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-xl">
              Explora Machu Picchu, la Montaña de 7 Colores y ciudadelas sagradas con{" "}
              <strong className="font-bold text-white">itinerarios todo incluido</strong> diseñados por expertos andinos.
            </p>
          </div>

          {/* Integrated Interactive Tour Search Engine Bar (Client Component) */}
          <HeroSearch totalTours={allTours.length} />
        </div>
      </section>

      {/* Features Bar - Trust Signals */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center text-[#6b0014] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-title">Reserva 100% Garantizada</h4>
              <p className="text-xs text-slate-500 mt-0.5">Agencia oficial autorizada. Boletos garantizados.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ffc000]/20 flex items-center justify-center text-slate-900 shrink-0">
              <Award className="w-6 h-6 text-[#6b0014]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-title">Guías Oficiales Cusqueños</h4>
              <p className="text-xs text-slate-500 mt-0.5">Expertos bilingües nativos apasionados por el Imperio Inca.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center text-[#6b0014] shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-title">Asistencia WhatsApp 24/7</h4>
              <p className="text-xs text-slate-500 mt-0.5">Acompañamiento continuo antes, durante y después de tu viaje.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider">
              Experiencias Destacadas 2026
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-title">
              Nuestros Tours Más Aclamados en Cusco
            </h2>
          </div>
          <Link href="/tours">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 border border-slate-200">
              <span>Explorar los {allTours.length} Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* Promotional Banner Section */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <PromoBanner
          subtitle="Paquete Imperdible 2026"
          duration={promoTour?.atributos?.duracion || "5 Días / 4 Noches"}
          title={promoTour?.titulo || "Cusco Mágico 5 Días"}
          price={estimateTourPrice(promoTour)}
          buttonText="Ver Oferta Especial"
          buttonLink={`/tours/${promoTour?.slug || "cusco-magico-5-dias"}`}
          backgroundImage={promoBgImage}
        />
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6 md:gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col items-center">
          <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider">
            Destinos Sagrados
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-title">
            Explora las Maravillas Imperiales del Perú
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/tours?destino=${dest.slug}`}
              className="group relative h-60 sm:h-64 lg:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <span className="bg-[#ffc000] text-[#1C1C1C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {dest.toursCount}
                </span>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold group-hover:text-[#ffc000] transition-colors font-title line-clamp-1">
                  {dest.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6 md:gap-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[#34E0A1] text-xs font-extrabold uppercase tracking-wider">
              Reseñas Verificadas en TripAdvisor
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-title">
              Experiencias Reales de Nuestros Viajeros
            </h2>
          </div>
          <Link href="/reviews">
            <Button variant="outline" className="!text-[#6b0014] hover:!text-white hover:bg-[#6b0014] flex items-center gap-2 border-[#6b0014] ">
              Ver todas las reseñas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Reviews Slider */}
        <ReviewsSlider reviews={featuredReviews} />
      </section>

      {/* Call To Action Banner: Custom Itinerary with 3-Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="relative rounded-2xl md:rounded-3xl bg-[#6b0014] text-white p-6 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: "url('/img/familia-background_v4.png')" }}
          />

          <div className="relative z-10 max-w-xl flex flex-col gap-4 text-center md:text-left">
            <span className="text-[#ffc000] font-bold text-xs uppercase tracking-widest">
              ¿Viaje a la Medida?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-title">
              ¿Deseas un Itinerario Personalizado para tu Viaje?
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Diseñamos paquetes a la medida de tu presupuesto, días y preferencias con guías locales dedicados.
            </p>

            {/* 3 Steps Mini Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-left w-full">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-[#ffc000] font-bold text-xs block">1. Cuéntanos</span>
                <span className="text-[11px] text-slate-200">Tus fechas y gustos</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-[#ffc000] font-bold text-xs block">2. Diseñamos</span>
                <span className="text-[11px] text-slate-200">Tu plan perfecto</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-[#ffc000] font-bold text-xs block">3. ¡Disfruta!</span>
                <span className="text-[11px] text-slate-200">Tu viaje soñado</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/viaje-personalizado">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto font-title font-bold text-white">
                  Diseñar Mi Viaje Ahora →
                </Button>
              </Link>
            </div>
          </div>

          {/* Mascot Illustration */}
          <div className="relative z-10 shrink-0 flex items-center justify-center">
            <img
              src="/img/llamita-chullos-tours-v1.png"
              alt="Mascota Chullos Tours"
              className="h-36 sm:h-44 md:h-56 max-w-full w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
