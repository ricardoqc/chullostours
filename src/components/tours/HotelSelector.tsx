"use client";

import React, { useState } from "react";
import {
  FaHotel,
  FaCheckCircle,
  FaWifi,
  FaCoffee,
  FaShower,
  FaTv,
  FaBed,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaWhatsapp,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaTag,
  FaImages,
} from "react-icons/fa";
import { HotelOpcion, DescuentosInfo, HotelCiudad } from "@/types/tour";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { hotelOpcionIncludesLodging } from "@/lib/hotel-options";
import { useDisplayCurrency } from "@/components/layout/MarketProvider";
import { formatHotelOptionPrice } from "@/lib/pricing";
import type { DisplayCurrency } from "@/lib/pricing";
import { HotelPhotoModal } from "./HotelPhotoModal";
import { hotelHasPhotos, resolveHotelImagesWithMeta } from "@/lib/hotel-images";

interface HotelSelectorProps {
  opcionesHotel: HotelOpcion[];
  descuentos?: DescuentosInfo;
  tourTitle: string;
}

export const HotelSelector: React.FC<HotelSelectorProps> = ({
  opcionesHotel,
  descuentos,
  tourTitle,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    opcionesHotel.length > 0 ? opcionesHotel[0].id : ""
  );
  const [photoHotel, setPhotoHotel] = useState<HotelCiudad | null>(null);
  const [photoMeta, setPhotoMeta] = useState<{ isReferential: boolean } | null>(null);
  const { currency, exchangeRate } = useDisplayCurrency();

  const formatOptionPrice = (opcion: HotelOpcion) =>
    formatHotelOptionPrice(opcion, currency, exchangeRate);

  const currencySuffix = (c: DisplayCurrency) => (c === "PEN" ? "PEN" : "USD");

  const openHotelPhotos = (hotel: HotelCiudad) => {
    const resolved = resolveHotelImagesWithMeta(hotel);
    setPhotoHotel(hotel);
    setPhotoMeta({ isReferential: resolved.isReferential });
  };

  if (!opcionesHotel || opcionesHotel.length === 0) {
    return null;
  }

  const selectedOption =
    opcionesHotel.find((opt) => opt.id === selectedId) || opcionesHotel[0];

  const getServiceIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes("wifi")) return <FaWifi className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    if (s.includes("desayuno")) return <FaCoffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    if (s.includes("ducha") || s.includes("baño") || s.includes("bano")) return <FaShower className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
    if (s.includes("tv") || s.includes("cable")) return <FaTv className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
    return <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
  };

  const getCategoryBadge = (categoria: string) => {
    const cat = categoria.toLowerCase();
    if (cat.includes("3 estrellas") || cat.includes("superior")) {
      return {
        bg: "bg-purple-100 text-purple-800 border-purple-200",
        label: "3 Estrellas / Superior",
        stars: 3,
      };
    }
    if (cat.includes("boutique")) {
      return {
        bg: "bg-amber-100 text-amber-900 border-amber-300",
        label: "Boutique / Con Encanto",
        stars: 3,
      };
    }
    if (cat.includes("premium")) {
      return {
        bg: "bg-rose-100 text-rose-900 border-rose-300",
        label: "Premium / VIP",
        stars: 4,
      };
    }
    if (cat.includes("intermedio")) {
      return {
        bg: "bg-blue-100 text-blue-900 border-blue-200",
        label: "Intermedio",
        stars: 2,
      };
    }
    if (cat.includes("sin alojamiento") || cat.includes("solo tours")) {
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-300",
        label: "Sin Hotel",
        stars: 0,
      };
    }
    return {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      label: "Básico Confort",
      stars: 2,
    };
  };

  const currentBadge = getCategoryBadge(selectedOption.categoria);
  const includesLodging = hotelOpcionIncludesLodging(selectedOption);

  const waMessage = `¡Hola Viajando con Chullos Tours! Me interesa consultar disponibilidad para el paquete "${tourTitle}" con la categoría "${selectedOption.nombre}" (${selectedOption.precio_etiqueta}). ¿Podrían brindarme más información?`;
  const waUrl = getPrimaryWhatsappUrl(waMessage);

  return (
    <section id="hoteles" className="flex flex-col gap-6 scroll-mt-20 md:scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase tracking-wider">
          <FaHotel className="w-3.5 h-3.5" />
          <span>Hospedaje & Categorías de Alojamiento</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-title tracking-tight">
              Opciones de Hotel para este Paquete
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Personaliza tu experiencia seleccionando la categoría de hospedaje que mejor se adapte a tu viaje.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full self-start md:self-auto shrink-0 border border-slate-200">
            <FaBed className="w-3.5 h-3.5 text-[#6b0014]" />
            <span>Hab. Doble, Matrimonial o Individual</span>
          </span>
        </div>
      </div>

      {/* Tabs / Tier Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {opcionesHotel.map((opcion) => {
          const isSelected = opcion.id === selectedId;
          const badge = getCategoryBadge(opcion.categoria);

          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => setSelectedId(opcion.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? "border-[#6b0014] bg-white shadow-md ring-2 ring-[#6b0014]/10"
                  : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                >
                  {opcion.categoria}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#6b0014] text-white flex items-center justify-center shrink-0">
                    <FaCheckCircle className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-sm md:text-base font-title leading-snug">
                  {opcion.nombre}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {opcion.descripcion}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-[11px] font-semibold text-slate-500">Tarifa pax:</span>
                <span className="text-base font-black text-[#6b0014] font-title">
                  {formatOptionPrice(opcion)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Option Detail Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${currentBadge.bg}`}
              >
                {currentBadge.label}
              </span>
              {currentBadge.stars > 0 && (
                <div className="flex items-center text-amber-400 gap-0.5">
                  {Array.from({ length: currentBadge.stars }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 font-title">
              {selectedOption.nombre}
            </h3>
            <p className="text-sm text-slate-600">
              {selectedOption.descripcion}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-1 bg-[#6b0014]/5 md:bg-transparent p-4 md:p-0 rounded-2xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Precio total por persona
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-black text-[#6b0014] font-title">
                {formatOptionPrice(selectedOption)}
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-600">
                {currencySuffix(currency)} / pax
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {includesLodging
                ? "Base habitación doble o matrimonial (mín. 2 personas)"
                : "Tarifa por persona sin estadía incluida"}
            </span>
          </div>
        </div>

        {/* Hotels Included by City */}
        {selectedOption.hoteles && selectedOption.hoteles.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h4 className="text-sm md:text-base font-extrabold text-slate-900 flex items-center gap-2 font-title">
              <FaHotel className="w-4 h-4 text-[#6b0014]" />
              <span>Hoteles incluidos en el paquete:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOption.hoteles.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase text-[#6b0014] bg-[#6b0014]/10 px-2.5 py-0.5 rounded-full">
                        {h.ciudad}
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {h.tipo_habitacion}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 mt-1">
                      <h5 className="font-extrabold text-slate-900 text-base md:text-lg">
                        {h.hotel}
                      </h5>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hotelHasPhotos(h) && (
                          <button
                            type="button"
                            onClick={() => openHotelPhotos(h)}
                            className="text-xs font-bold text-[#6b0014] hover:underline inline-flex items-center gap-1 bg-white p-1.5 rounded-lg border border-[#6b0014]/20"
                          >
                            <FaImages className="w-3 h-3" />
                            <span>Fotos</span>
                            {resolveHotelImagesWithMeta(h).isReferential && (
                              <span
                                className="text-[9px] uppercase bg-amber-100 text-amber-900 px-1 rounded"
                                title="Fotos referenciales — edítalas en el JSON del tour"
                              >
                                Ref.
                              </span>
                            )}
                          </button>
                        )}
                        {h.sitio_web && (
                          <a
                            href={h.sitio_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#6b0014] hover:underline inline-flex items-center gap-1 bg-white p-1.5 rounded-lg border border-slate-200"
                            title="Ver sitio web del hotel"
                          >
                            <span>Web</span>
                            <FaExternalLinkAlt className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {h.direccion && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{h.direccion}</span>
                      </p>
                    )}
                  </div>

                  {/* Amenities */}
                  {h.servicios && h.servicios.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Comodidades & Servicios:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {h.servicios.map((srv, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"
                          >
                            {getServiceIcon(srv)}
                            <span>{srv}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-950">
            <FaTag className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-xs md:text-sm leading-relaxed">
              <p className="font-bold">Solo tour (sin alojamiento)</p>
              <p className="text-amber-900 mt-0.5">
                Esta opción incluye traslados, ingresos oficiales, trenes turísticos y guiado profesional. No incluye noches de hotel: puedes reservar tu propio alojamiento o solicitar asesoría a nuestro equipo.
              </p>
            </div>
          </div>
        )}

        {/* Age Discounts (if available) */}
        {descuentos?.menores && descuentos.menores.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200/80 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FaUsers className="w-4 h-4 text-emerald-700" />
              <h4 className="font-extrabold text-emerald-950 text-sm md:text-base font-title">
                Descuentos Especiales para Familias y Menores de Edad
              </h4>
            </div>
            {descuentos.nota && (
              <p className="text-xs text-emerald-800">{descuentos.nota}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {descuentos.menores.map((desc, dIdx) => (
                <div
                  key={dIdx}
                  className="bg-white/80 p-3 rounded-xl border border-emerald-200/60 flex flex-col gap-1"
                >
                  <span className="text-xs font-bold text-slate-700">{desc.rango_edad}</span>
                  <span className="text-sm font-black text-emerald-800 font-title">
                    {desc.nota}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Consultation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaShieldAlt className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Reserva con 50% de anticipo. Saldo pagadero al llegar a Cusco.</span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs md:text-sm py-3 px-6 rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>Consultar disponibilidad con {selectedOption.nombre}</span>
          </a>
        </div>
      </div>

      {photoHotel && (
        <HotelPhotoModal
          hotel={photoHotel}
          images={resolveHotelImagesWithMeta(photoHotel).images}
          isReferential={photoMeta?.isReferential ?? false}
          isOpen={!!photoHotel}
          onClose={() => {
            setPhotoHotel(null);
            setPhotoMeta(null);
          }}
        />
      )}
    </section>
  );
};
