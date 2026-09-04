"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaShieldAlt,
  FaClock,
  FaFire,
  FaCheckCircle,
  FaMountain,
  FaHotel,
  FaWhatsapp,
  FaBalanceScale,
  FaTimes,
  FaStar,
  FaThumbsUp,
  FaGlobe,
  FaClipboardCheck,
  FaCreditCard,
} from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { useTourReservation } from "./TourReservationProvider";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { trackBeginCheckout, trackWhatsAppClick } from "@/lib/analytics";
import { Tour } from "@/types/tour";
import {
  calculateTourTotal,
  formatMoney,
  getComparePrices,
  getEnabledExtras,
  getTourBasePriceUsd,
} from "@/lib/pricing";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import { hotelOpcionIncludesLodging } from "@/lib/hotel-options";

interface TourBookingWidgetProps {
  tour: Tour;
}

function getUrgencyViews(slug: string): number {
  if (typeof window === "undefined") return 45;
  const key = `chullos_views_${slug}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return parseInt(existing, 10);
  const n = Math.floor(Math.random() * (90 - 30 + 1)) + 30;
  sessionStorage.setItem(key, String(n));
  return n;
}

export const TourBookingWidget: React.FC<TourBookingWidgetProps> = ({ tour }) => {
  const basePrice = getTourBasePriceUsd(tour);
  const duration = tour.atributos?.duracion || "Full Day";
  const horarios = tour.horarios_disponibles;
  const puntoInicio = tour.punto_inicio;
  const opcionesHotel = tour.opciones_hotel;
  const enabledExtras = getEnabledExtras(tour);
  const ESTIMATE_ADULTS = 2;

  const { currency, exchangeRate } = useDisplayCurrency();

  const [travelDate, setTravelDate] = useState("");
  const [selectedHorario, setSelectedHorario] = useState(
    horarios && horarios.length > 0 ? horarios[0] : ""
  );
  const [viewsCount, setViewsCount] = useState(45);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(
    opcionesHotel && opcionesHotel.length > 0 ? opcionesHotel[0].id : ""
  );
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);

  const { openReservation, updateSelection } = useTourReservation();

  useEffect(() => {
    setViewsCount(getUrgencyViews(tour.slug));
  }, [tour.slug]);

  const reservationSelection = useMemo(
    () => ({
      travelDate,
      selectedHorario,
      selectedHotelId,
      selectedExtraIds,
      currency,
    }),
    [travelDate, selectedHorario, selectedHotelId, selectedExtraIds, currency]
  );

  useEffect(() => {
    updateSelection(reservationSelection);
  }, [reservationSelection, updateSelection]);

  const durationLower = (duration || "").toLowerCase();
  const isMultiDay =
    durationLower.includes("día") &&
    !durationLower.includes("1 día") &&
    !durationLower.includes("full day");
  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);
  const breakdown = useMemo(
    () =>
      calculateTourTotal(tour, {
        adults: ESTIMATE_ADULTS,
        childrenByTarifa: {},
        selectedHotelId: hasHotelOptions ? selectedHotelId : undefined,
        selectedExtraIds,
        currency,
        exchangeRatePen: exchangeRate,
      }),
    [
      tour,
      selectedHotelId,
      selectedExtraIds,
      currency,
      exchangeRate,
      hasHotelOptions,
    ]
  );

  const compare = getComparePrices(tour);
  const priceTag = formatMoney(breakdown.perAdult, currency);
  const totalTag = formatMoney(breakdown.total, currency);

  const hotelText = breakdown.hotel
    ? `\nHospedaje: ${breakdown.hotel.nombre} (${breakdown.hotel.precio_etiqueta})`
    : "";
  const extrasText =
    breakdown.selectedExtras.length > 0
      ? `\nExtras: ${breakdown.selectedExtras.map((e) => e.label).join(", ")}`
      : "";
  const horarioText = selectedHorario ? `\nHorario: ${selectedHorario}` : "";
  const rawMessage = `¡Hola Chullos Tours! Quisiera reservar: *${tour.titulo}* Fecha: ${travelDate || "Por definir"}${horarioText}${hotelText}${extrasText} Total estimado (${ESTIMATE_ADULTS} adultos): ${totalTag}`;
  const whatsappUrl = getPrimaryWhatsappUrl(rawMessage);

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200/80">
          <FaFire className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
          <span suppressHydrationWarning>
            {viewsCount} personas consultaron este tour hoy
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Desde
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#6b0014] font-title">
                {priceTag.replace(" USD", "")}
              </span>
              <span className="text-xs font-bold text-slate-500">/ persona</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => setShowPriceModal(true)}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-slate-900 text-xs font-black px-3 py-1.5 rounded-full border border-amber-300"
            >
              <FaBalanceScale className="w-3 h-3 text-amber-700" />
              Comparar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <FaCalendarAlt className="w-3.5 h-3.5 text-[#6b0014]" />
              Fecha de viaje
            </label>
            <CustomDatePicker
              value={travelDate}
              onChange={(dateStr) => setTravelDate(dateStr)}
              placeholder="Elige tu fecha"
            />
          </div>

          {!isMultiDay && !hasHotelOptions && horarios && horarios.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <FaClock className="w-3.5 h-3.5 text-[#6b0014]" />
                Horario
              </label>
              <select
                value={selectedHorario}
                onChange={(e) => setSelectedHorario(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold"
              >
                {horarios.map((h, idx) => (
                  <option key={idx} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          )}

          {puntoInicio && (
            <div className="text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <strong>Punto de partida:</strong> {puntoInicio}
            </div>
          )}

          {hasHotelOptions && opcionesHotel && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <FaHotel className="w-3.5 h-3.5 text-[#6b0014]" />
                Hospedaje
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
              >
                {opcionesHotel.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nombre}
                    {!hotelOpcionIncludesLodging(opt) ? " — sin estadía" : ""} (${opt.precio_usd} USD)
                  </option>
                ))}
              </select>
            </div>
          )}

          {enabledExtras.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase">
                Extras opcionales
              </span>
              {enabledExtras.map((extra) => (
                <label
                  key={extra.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedExtraIds.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-4 h-4 rounded text-[#6b0014]"
                    />
                    <FaMountain className="w-3.5 h-3.5 text-[#6b0014]" />
                    <span className="font-bold text-slate-800">{extra.label}</span>
                  </div>
                  <span className="text-slate-500 font-semibold text-[11px]">
                    +${extra.precio_usd}/pax
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between font-black text-slate-900 text-sm">
            <span>Estimado ({ESTIMATE_ADULTS} adultos)</span>
            <span className="text-[#6b0014] font-extrabold text-base">{totalTag}</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            Indica viajeros (adultos, jóvenes y niños) al completar la reserva.
          </p>
        </div>

        <button
          type="button"
          id="gtm-tour-booking-reserve-btn"
          data-gtm-action="begin_checkout"
          data-gtm-tour-slug={tour.slug}
          data-gtm-tour-name={tour.titulo}
          data-gtm-price={breakdown.total}
          onClick={() => {
            trackBeginCheckout({
              id: tour.slug,
              name: tour.titulo,
              price: breakdown.total,
              currency,
              travelers: ESTIMATE_ADULTS,
              date: travelDate,
            });
            openReservation(reservationSelection);
          }}
          className="w-full bg-[#6b0014] hover:bg-red-900 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <FaClipboardCheck className="w-4 h-4" />
          Reservar ahora
        </button>

        <a
          id="gtm-tour-booking-whatsapp-btn"
          data-gtm-action="whatsapp_tour_widget"
          data-gtm-tour-slug={tour.slug}
          data-gtm-tour-name={tour.titulo}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackWhatsAppClick({
              location: "tour_booking_widget",
              tourSlug: tour.slug,
              tourName: tour.titulo,
            });
          }}
          className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <FaWhatsapp className="w-5 h-5" />
          Hablar por WhatsApp
        </a>

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold flex-wrap">
            <FaCreditCard className="w-3.5 h-3.5" />
            <span>Visa</span>
            <span>·</span>
            <span>Mastercard</span>
            <span>·</span>
            <span>Yape</span>
            <span>·</span>
            <span>Transferencia</span>
          </div>
          <p className="text-[10px] text-slate-500">
            El pago se coordina con tu asesor. Sin cobro automático en la web.
          </p>
          <div className="flex items-center gap-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-[11px]">
            <FaShieldAlt className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-950">
              Confirmación con asesor en minutos
            </span>
          </div>
        </div>
      </div>

      {showPriceModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPriceModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#6b0014] text-white p-6 rounded-t-3xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase">
                  Transparencia
                </span>
                <h2 className="text-xl font-extrabold">Comparar precios</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-2 border-[#6b0014]/30 rounded-2xl p-5 bg-[#6b0014]/5">
                <p className="text-sm font-extrabold text-[#6b0014] text-center">
                  Chullos Tours
                </p>
                <p className="text-3xl font-black text-[#6b0014] text-center mt-2">
                  ${basePrice}
                </p>
                <div className="flex justify-center gap-0.5 my-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-[#00AA6C]" />
                  ))}
                </div>
                <ul className="text-xs space-y-1.5 mt-3">
                  {["Operador directo", "Sin cargos ocultos", "Atención real"].map(
                    (item) => (
                      <li key={item} className="flex gap-1.5 items-center">
                        <FaCheckCircle className="w-3 h-3 text-[#6b0014]" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <p className="text-sm font-extrabold text-center flex items-center justify-center gap-1">
                  <FaGlobe className="w-3.5 h-3.5" /> Online
                </p>
                <p className="text-2xl font-black text-center mt-2">
                  ${compare.online}
                </p>
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <p className="text-sm font-extrabold text-center flex items-center justify-center gap-1">
                  <FaHotel className="w-3.5 h-3.5" /> Agencias
                </p>
                <p className="text-2xl font-black text-center mt-2">
                  ${compare.agencias}
                </p>
              </div>
              <div className="sm:col-span-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex gap-2">
                <FaThumbsUp className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Referencias de mercado orientativas
                  {tour.precios_comparacion?.etiqueta
                    ? ` — ${tour.precios_comparacion.etiqueta}`
                    : ""}
                  . Reserva directa con operador local.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
