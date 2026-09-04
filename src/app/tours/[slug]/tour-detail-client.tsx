"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaCheck,
  FaQuestionCircle,
} from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Tour } from "@/types/tour";
import { trackViewItem } from "@/lib/analytics";
import {
  getGalleryItems,
  parseDurationDays,
  estimateTourPrice,
  parseMultiDayItinerary,
  cleanRecomendaciones,
  cleanHighlights,
} from "@/lib/tour-detail-utils";

import { TourHero } from "@/components/tours/TourHero";
import { TourDayTimeline } from "@/components/tours/TourDayTimeline";
import { TourMultiDayItinerary } from "@/components/tours/TourMultiDayItinerary";
import { TourBookingWidget } from "@/components/tours/TourBookingWidget";
import { TourStickyMobileCTA } from "@/components/tours/TourStickyMobileCTA";
import { TourTabNav } from "@/components/tours/TourTabNav";
import { TourVariantsSwitcher } from "@/components/tours/TourVariantsSwitcher";
import { TourPricingDetails } from "@/components/tours/TourPricingDetails";
import { TourComparisonTable } from "@/components/tours/TourComparisonTable";
import { TourPuntosDeInteres } from "@/components/tours/TourPuntosDeInteres";
import { TourValueProposition } from "@/components/tours/TourValueProposition";
import { HotelSelector } from "@/components/tours/HotelSelector";
import { EntradasIncluidasBanner } from "@/components/tours/EntradasIncluidasBanner";
import { TourItineraryMap } from "@/components/tours/map/TourItineraryMap";
import { TourReservationProvider } from "@/components/tours/TourReservationProvider";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import { resolveTourMapStops } from "@/lib/places";
import type { TourImagen } from "@/types/tour";

interface TourDetailClientProps {
  tour: Tour;
  allTours?: Tour[];
  galleryItems?: TourImagen[];
}

export const TourDetailClient: React.FC<TourDetailClientProps> = ({
  tour,
  allTours = [],
  galleryItems: galleryItemsProp,
}) => {
  const { currency } = useDisplayCurrency();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showReservedBanner, setShowReservedBanner] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromQuery = searchParams.get("reservado") === "1";
    const fromSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem(`chullos_reserved_${tour.slug}`) === "1";
    setShowReservedBanner(fromQuery || fromSession);

    // Track GA4/GTM view_item
    if (tour && tour.slug) {
      trackViewItem({
        id: tour.slug,
        name: tour.titulo,
        price: tour.precio_usd || tour.precio || 0,
        currency: "USD",
        category: tour.atributos?.tipo_tour || "Tour",
      });
    }
  }, [searchParams, tour.slug, tour]);

  const galleryItems = galleryItemsProp ?? getGalleryItems(tour);
  const durationDays = parseDurationDays(tour.atributos?.duracion);
  const basePrice = estimateTourPrice(tour);
  const cleanedHighlights = cleanHighlights(tour.destacados_highlights);
  const cleanedRecs = cleanRecomendaciones(tour.recomendaciones);
  const multiDayDays = parseMultiDayItinerary(tour);

  const isFullDay = durationDays === 1;
  const hasFaqs = !!(tour.faqs && tour.faqs.length > 0);
  const hasRecom = cleanedRecs.length > 0;
  const hasHotels = !!(tour.opciones_hotel && tour.opciones_hotel.length > 0);
  const hasMapData =
    !!tour.mapa?.destinos?.length || !!tour.destino_ids?.length;
  const hasMap = hasMapData && resolveTourMapStops(tour).length > 0;

  return (
    <TourReservationProvider tour={tour} defaultSelection={{ currency }}>
    <div className="flex flex-col gap-0 pb-28 sm:pb-24 bg-white">
      {showReservedBanner && (
        <div className="bg-emerald-600 text-white text-center text-xs sm:text-sm font-bold py-2.5 px-4">
          Ya reservaste esta experiencia — un asesor te contactará pronto.
        </div>
      )}
      {/* 1. Contained Bento Grid Hero Header (Crisp & High Resolution) */}
      <TourHero
        tour={tour}
        galleryItems={galleryItems}
        rating={4.9}
        reviewCount={48}
      />

      <div className="max-w-7xl mx-auto px-4 w-full -mt-2 mb-2">
        <EntradasIncluidasBanner tour={tour} />
      </div>

      {/* 2. Sticky Tab Navigation Bar */}
      <TourTabNav hasFaqs={hasFaqs} hasRecom={hasRecom} hasHotels={hasHotels} hasMap={hasMap} />

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 w-full pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Left Column (70%) */}
          <main className="lg:col-span-2 flex flex-col gap-10 sm:gap-12">
            {/* Section 1: Descripción & Propuesta de Valor */}
            <section id="descripcion" className="flex flex-col gap-6 scroll-mt-20 md:scroll-mt-24">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-title tracking-tight">
                  La Experiencia
                </h2>
                
                {/* Parágrafo de resumen o descripción completa */}
                {tour.descripcion_completa ? (
                  <div className="text-slate-700 text-base md:text-lg leading-relaxed font-normal space-y-4 whitespace-pre-line break-words">
                    {tour.descripcion_completa}
                  </div>
                ) : (
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed font-normal break-words">
                    {tour.resumen}
                  </p>
                )}
              </div>

              {/* Propuesta de Valor y Garantías de Operador Directo */}
              <TourValueProposition
                highlights={tour.tour_highlights}
                items={tour.propuesta_de_valor}
              />
            </section>

            {/* Section 2: Itinerario Detallado (Prioridad Alta en UX) */}
            <section id="itinerario" className="scroll-mt-20 md:scroll-mt-24">
              {isFullDay ? (
                <TourDayTimeline highlights={cleanedHighlights} />
              ) : (
                <TourMultiDayItinerary days={multiDayDays} />
              )}
            </section>

            {hasMap && <TourItineraryMap tour={tour} />}

            {/* Section 3: Hoteles & Estadía (Paquetes) O Desglose de Tarifas (Tours Diarios) */}
            {hasHotels ? (
              <HotelSelector
                opcionesHotel={tour.opciones_hotel!}
                descuentos={tour.descuentos}
                tourTitle={tour.titulo}
              />
            ) : (
              <TourPricingDetails
                basePrice={basePrice}
                duration={tour.atributos?.duracion || "Full Day"}
                isMultiDay={!isFullDay}
                tourTitle={tour.titulo}
                descuentos={tour.descuentos}
              />
            )}

            {/* Section 4: Incluye & No Incluye */}
            <section id="incluye" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 scroll-mt-20 md:scroll-mt-24">
              {/* Incluye */}
              {tour.incluye && tour.incluye.length > 0 && (
                <div className="bg-emerald-50/70 p-4 sm:p-6 rounded-3xl border border-emerald-200/80 flex flex-col gap-3.5 sm:gap-4">
                  <h3 className="font-extrabold text-emerald-950 text-base sm:text-lg flex items-center gap-2 font-title">
                    <FaCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>¿Qué Incluye este Tour?</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-emerald-950">
                    {tour.incluye.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white/70 p-2.5 sm:p-3 rounded-xl border border-emerald-200/50 shadow-2xs">
                        <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No Incluye */}
              {tour.no_incluye && tour.no_incluye.length > 0 && (
                <div className="bg-rose-50/70 p-4 sm:p-6 rounded-3xl border border-rose-200/80 flex flex-col gap-3.5 sm:gap-4">
                  <h3 className="font-extrabold text-rose-950 text-base sm:text-lg flex items-center gap-2 font-title">
                    <FaTimesCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>No Incluye</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-rose-950">
                    {tour.no_incluye.map((noInc, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white/70 p-2.5 sm:p-3 rounded-xl border border-rose-200/50 shadow-2xs">
                        <FaTimesCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{noInc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Puntos de Interés / Atractivos Visitados */}
            {tour.puntos_de_interes && tour.puntos_de_interes.length > 0 && (
              <TourPuntosDeInteres puntos={tour.puntos_de_interes} />
            )}

            {/* Train Variants Interactive Switcher */}
            <TourVariantsSwitcher currentSlug={tour.slug} />

            {/* Section 4: Recomendaciones */}
            {hasRecom && (
              <section id="recomendaciones" className="bg-slate-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-4 scroll-mt-20 md:scroll-mt-24">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2 font-title">
                  <FaInfoCircle className="w-5 h-5 text-[#ffc000] shrink-0" />
                  <span>Recomendaciones Importantes</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700">
                  {cleanedRecs.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs"
                    >
                      <FaCheck className="w-3.5 h-3.5 text-[#6b0014] mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Section 5: FAQs Accordion */}
            {hasFaqs && (
              <section id="faqs" className="flex flex-col gap-4 sm:gap-5 scroll-mt-20 md:scroll-mt-24">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
                    <FaQuestionCircle className="w-3.5 h-3.5" />
                    <span>Resolvemos tus dudas</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-title tracking-tight">
                    Preguntas Frecuentes (FAQs)
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {tour.faqs.map((faq, fIdx) => {
                    const isFaqOpen = openFaq === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                          isFaqOpen ? "border-[#6b0014] bg-white shadow-xs" : "border-slate-200 bg-slate-50/60"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isFaqOpen ? null : fIdx)}
                          className="w-full p-4 md:p-5 text-left font-extrabold text-xs md:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                              isFaqOpen ? "bg-[#6b0014] text-white" : "bg-slate-200 text-slate-700"
                            }`}>
                              Q{fIdx + 1}
                            </span>
                            <span className="leading-snug">{faq.pregunta}</span>
                          </div>
                          {isFaqOpen ? (
                            <FaChevronUp className="w-3.5 h-3.5 text-[#6b0014] shrink-0" />
                          ) : (
                            <FaChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isFaqOpen && (
                          <div className="p-4 md:p-5 pt-2 bg-white text-xs md:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                            {faq.respuesta}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 6: Comparativa de Experiencias */}
            {allTours && allTours.length > 0 && (
              <TourComparisonTable currentTour={tour} allTours={allTours} />
            )}
          </main>

          {/* Right Sticky Sidebar (30%) */}
          <aside id="reservar" className="lg:col-span-1 hidden lg:block scroll-mt-24">
            <TourBookingWidget tour={tour} />
          </aside>
        </div>
      </div>

      <TourStickyMobileCTA tour={tour} />
    </div>
    </TourReservationProvider>
  );
};

