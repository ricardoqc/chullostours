"use client";

import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaCompass,
  FaMapMarkerAlt,
  FaCamera,
  FaCheck,
  FaLightbulb,
  FaHandshake,
  FaQuestionCircle,
} from "react-icons/fa";
import { Tour } from "@/types/tour";
import {
  getValidGalleryImages,
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
import { TourQuickFacts } from "@/components/tours/TourQuickFacts";
import { TourValueProposition } from "@/components/tours/TourValueProposition";

interface TourDetailClientProps {
  tour: Tour;
  allTours?: Tour[];
}

export const TourDetailClient: React.FC<TourDetailClientProps> = ({ tour, allTours = [] }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const galleryImages = getValidGalleryImages(tour);
  const durationDays = parseDurationDays(tour.atributos?.duracion);
  const basePrice = estimateTourPrice(tour);
  const cleanedHighlights = cleanHighlights(tour.destacados_highlights);
  const cleanedRecs = cleanRecomendaciones(tour.recomendaciones);
  const multiDayDays = parseMultiDayItinerary(tour);

  const isFullDay = durationDays === 1;
  const hasFaqs = !!(tour.faqs && tour.faqs.length > 0);
  const hasRecom = cleanedRecs.length > 0;

  const highlightIcons = [FaCompass, FaMapMarkerAlt, FaCamera, FaHandshake, FaLightbulb, FaCheckCircle];

  return (
    <div className="flex flex-col gap-0 pb-20 bg-white">
      {/* 1. Contained Bento Grid Hero Header (Crisp & High Resolution) */}
      <TourHero
        tour={tour}
        galleryImages={galleryImages}
        rating={4.9}
        reviewCount={48}
      />

      {/* 2. Sticky Tab Navigation Bar */}
      <TourTabNav hasFaqs={hasFaqs} hasRecom={hasRecom} />

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Left Column (70%) */}
          <main className="lg:col-span-2 flex flex-col gap-12">
            {/* Section 1: Descripción & Highlights */}
            <section id="descripcion" className="flex flex-col gap-6 scroll-mt-28">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-title tracking-tight">
                  La Experiencia
                </h2>
                
                {/* Parágrafo de resumen o descripción completa */}
                {tour.descripcion_completa ? (
                  <div className="text-slate-700 text-base md:text-lg leading-relaxed font-normal space-y-4 whitespace-pre-line">
                    {tour.descripcion_completa}
                  </div>
                ) : (
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed font-normal">
                    {tour.resumen}
                  </p>
                )}
              </div>

              {/* Propuesta de Valor (Por qué elegir esta experiencia con nosotros) */}
              <TourValueProposition
                highlights={tour.tour_highlights}
                items={tour.propuesta_de_valor}
              />

              {/* Lo más destacado del recorrido */}
              {cleanedHighlights.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 font-title">
                    <FaCompass className="w-4 h-4 text-[#6b0014]" />
                    <span>Lo más destacado del recorrido</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {cleanedHighlights.slice(0, 6).map((h, i) => {
                      const IconComp = highlightIcons[i % highlightIcons.length];
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white p-4 rounded-2xl border-l-4 border-[#6b0014] border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0 mt-0.5">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs md:text-sm text-slate-800 font-semibold leading-relaxed">
                            {h}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* GEO AI Optimization Quick Facts Box */}
            <TourQuickFacts geoData={tour.geo_ai_optimization} />

            {/* Puntos de Interés / Atractivos Visitados */}
            {tour.puntos_de_interes && tour.puntos_de_interes.length > 0 && (
              <TourPuntosDeInteres puntos={tour.puntos_de_interes} />
            )}

            {/* Train Variants Interactive Switcher */}
            <TourVariantsSwitcher currentSlug={tour.slug} />

            {/* Section 2: Itinerario Detallado */}
            <section id="itinerario" className="scroll-mt-28">
              {isFullDay ? (
                <TourDayTimeline highlights={cleanedHighlights} />
              ) : (
                <TourMultiDayItinerary days={multiDayDays} />
              )}
            </section>

            {/* Detailed Pricing Breakdown by Traveler & Hotel Category */}
            <TourPricingDetails
              basePrice={basePrice}
              duration={tour.atributos?.duracion || "Full Day"}
              isMultiDay={!isFullDay}
              tourTitle={tour.titulo}
            />

            {/* Section 3: Incluye & No Incluye */}
            <section id="incluye" className="grid grid-cols-1 sm:grid-cols-2 gap-6 scroll-mt-28">
              {/* Incluye */}
              {tour.incluye && tour.incluye.length > 0 && (
                <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/80 flex flex-col gap-4">
                  <h3 className="font-extrabold text-emerald-950 text-lg flex items-center gap-2 font-title">
                    <FaCheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>¿Qué Incluye este Tour?</span>
                  </h3>
                  <ul className="flex flex-col gap-3 text-xs md:text-sm text-emerald-950">
                    {tour.incluye.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white/60 p-2.5 rounded-xl border border-emerald-200/50">
                        <FaCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No Incluye */}
              {tour.no_incluye && tour.no_incluye.length > 0 && (
                <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200/80 flex flex-col gap-4">
                  <h3 className="font-extrabold text-rose-950 text-lg flex items-center gap-2 font-title">
                    <FaTimesCircle className="w-5 h-5 text-rose-600" />
                    <span>No Incluye</span>
                  </h3>
                  <ul className="flex flex-col gap-3 text-xs md:text-sm text-rose-950">
                    {tour.no_incluye.map((noInc, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-white/60 p-2.5 rounded-xl border border-rose-200/50">
                        <FaTimesCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{noInc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Interactive Side-by-Side Comparison Matrix */}
            <TourComparisonTable currentTour={tour} allTours={allTours} />

            {/* Section 4: Recomendaciones */}
            {hasRecom && (
              <section id="recomendaciones" className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-4 scroll-mt-28">
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2 font-title">
                  <FaInfoCircle className="w-5 h-5 text-[#ffc000]" />
                  <span>Recomendaciones Importantes</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-slate-700">
                  {cleanedRecs.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs"
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
              <section id="faqs" className="flex flex-col gap-5 scroll-mt-28">
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
          </main>

          {/* Right Sticky Sidebar (30%) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <TourBookingWidget
              tourTitle={tour.titulo}
              basePrice={basePrice}
              duration={tour.atributos?.duracion || "Full Day"}
              horarios={tour.horarios_disponibles}
              puntoInicio={tour.punto_inicio}
              categoria={tour.categoria}
            />
          </aside>
        </div>
      </div>

      {/* Mobile Floating Sticky CTA */}
      <TourStickyMobileCTA tourTitle={tour.titulo} basePrice={basePrice} />
    </div>
  );
};

