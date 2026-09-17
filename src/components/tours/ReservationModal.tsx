"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FaTimes,
  FaArrowRight,
  FaShieldAlt,
  FaCalendarAlt,
  FaHotel,
  FaMountain,
  FaClock,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./reservation/StepIndicator";
import { StepTravelerInfo } from "./reservation/StepTravelerInfo";
import { StepReview } from "./reservation/StepReview";
import {
  TravelersSelector,
  countNonAdultTravelers,
  formatTravelersSummary,
} from "./reservation/TravelersSelector";
import {
  ReservationFormData,
  ReservationModalProps,
} from "./reservation/types";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import {
  calculateTourTotal,
  formatMoney,
  getEnabledExtras,
  getTourBasePriceUsd,
} from "@/lib/pricing";
import { hotelOpcionIncludesLodging } from "@/lib/hotel-options";
import { trackBookingSubmitted } from "@/lib/analytics";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";

const STEPS = ["Tu viaje", "Tus datos", "Confirmar"];
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  tour: tourProp,
  initialSelection,
  tourTitle: legacyTitle,
  slug: legacySlug,
  horarios: legacyHorarios,
  opcionesHotel: legacyHotels,
}) => {
  const router = useRouter();
  const tour = tourProp;
  const title = tour?.titulo || legacyTitle || "";
  const slug = tour?.slug || legacySlug || "";
  const horarios = tour?.horarios_disponibles || legacyHorarios;
  const opcionesHotel = tour?.opciones_hotel || legacyHotels;
  const tarifas = tour?.tarifas_personas || [];
  const enabledExtras = tour ? getEnabledExtras(tour) : [];

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formStartedAt] = useState(() => Date.now());
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReservationFormData>(() => ({
    tourTitle: title,
    tourSlug: slug,
    travelDate: initialSelection?.travelDate || "",
    selectedHorario:
      initialSelection?.selectedHorario ||
      (horarios && horarios.length > 0 ? horarios[0] : ""),
    adults: initialSelection?.adults || 2,
    withChildren: false,
    childrenByTarifa: initialSelection?.childrenByTarifa || {},
    childAges: {},
    selectedExtraIds: initialSelection?.selectedExtraIds || [],
    includeHuaynaPicchu: (initialSelection?.selectedExtraIds || []).includes("huayna-picchu"),
    includeHotel: false,
    selectedHotelOptionId:
      initialSelection?.selectedHotelId ||
      (opcionesHotel && opcionesHotel.length > 0 ? opcionesHotel[0].id : ""),
    currency: initialSelection?.currency || "USD",
    fullName: "",
    email: "",
    phone: "",
    country: "Perú",
    countryCode: "PE",
    dialCode: "+51",
    otherCountry: "",
    dni: "",
    website: "",
    fillCompanions: false,
    companions: [],
    arrivalDate: "",
    noFlightYet: true,
    flightDate: "",
    flightNumber: "",
    noHotelYet: true,
    hotelName: "",
    allergies: "",
    specialNeeds: "",
    howDidYouFindUs: "",
    termsAccepted: false,
    totalPrice: 0,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const updateFormData = (updates: Partial<ReservationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const durationLower = (tour?.atributos?.duracion || "").toLowerCase();
  const isMultiDay =
    durationLower.includes("día") &&
    !durationLower.includes("1 día") &&
    !durationLower.includes("full day");
  const hasHotelOptions = !!(opcionesHotel && opcionesHotel.length > 0);

  const hasNonAdultTravelers = countNonAdultTravelers(formData.childrenByTarifa) > 0;

  const breakdown = useMemo(() => {
    if (!tour) {
      return {
        total: getTourBasePriceUsd({ precio_usd: 0 } as never),
        perAdult: 0,
        currency: formData.currency,
      };
    }
    return calculateTourTotal(tour, {
      adults: formData.adults,
      childrenByTarifa: formData.childrenByTarifa,
      selectedHotelId: formData.selectedHotelOptionId,
      selectedExtraIds: formData.selectedExtraIds,
      currency: formData.currency,
    });
  }, [tour, formData]);

  const totalTravelers =
    formData.adults + countNonAdultTravelers(formData.childrenByTarifa);

  const travelersSummary = formatTravelersSummary(
    formData.adults,
    formData.childrenByTarifa,
    tarifas
  );

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.travelDate) newErrors.travelDate = "Selecciona la fecha de tu viaje";
    if (formData.adults < 1) newErrors.adults = "Debe haber al menos 1 adulto";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Ingresa tu nombre completo";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      newErrors.phone = "Ingresa un WhatsApp válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!formData.termsAccepted) {
      setErrors({ termsAccepted: "Debes aceptar los términos para continuar" });
      return;
    }

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setErrors({ submit: "Completa la verificación antibot antes de enviar." });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const selectedHotel = opcionesHotel?.find(
      (h) => h.id === formData.selectedHotelOptionId
    );
    const includeHuayna = formData.selectedExtraIds.includes("huayna-picchu");

    try {
      const res = await fetch("/api/send-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourTitle: formData.tourTitle,
          tourSlug: formData.tourSlug,
          travelDate: formData.travelDate,
          selectedHorario: formData.selectedHorario,
          adults: formData.adults,
          withChildren: hasNonAdultTravelers,
          childrenByTarifa: formData.childrenByTarifa,
          selectedHotelOptionId: formData.selectedHotelOptionId,
          selectedExtraIds: formData.selectedExtraIds,
          currency: formData.currency,
          travelers: totalTravelers,
          totalPrice: breakdown.total,
          isSoles: formData.currency === "PEN",
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          countryCode: formData.countryCode,
          dialCode: formData.dialCode,
          otherCountry: formData.otherCountry,
          dni: formData.dni,
          fillCompanions: formData.fillCompanions,
          companions: formData.fillCompanions ? formData.companions : [],
          hotelOption: selectedHotel?.nombre,
          hotelName: formData.hotelName,
          includeHuaynaPicchu: includeHuayna,
          flightNumber: formData.flightNumber,
          flightDate: formData.flightDate,
          arrivalDate: formData.arrivalDate,
          allergies: formData.allergies,
          specialNeeds: formData.specialNeeds,
          howDidYouFindUs: formData.howDidYouFindUs,
          termsAccepted: formData.termsAccepted,
          website: formData.website,
          formStartedAt,
          captchaToken: captchaToken || undefined,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        leadId?: string;
        ticketId?: string;
      };

      if (!res.ok || !data.success) {
        setErrors({
          submit: data.error || "No se pudo enviar la solicitud. Intenta de nuevo.",
        });
        setCaptchaToken(null);
        return;
      }

      if (typeof window !== "undefined" && slug) {
        sessionStorage.setItem(`chullos_reserved_${slug}`, "1");
        sessionStorage.removeItem(`chullos_reserved_${slug}_dismissed`);
      }

      trackBookingSubmitted({
        tourSlug: slug,
        tourTitle: title,
        totalPrice: breakdown.total,
        currency: formData.currency || "USD",
        travelersCount: totalTravelers,
        travelDate: formData.travelDate,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        leadId: data.leadId,
        ticketId: data.ticketId,
      });

      onClose();
      router.push(
        `/muchas-gracias/?tour=${encodeURIComponent(slug)}&title=${encodeURIComponent(title)}`
      );
    } catch (e) {
      console.error("Email dispatch error", e);
      setErrors({ submit: "Error de conexión. Verifica tu red e intenta de nuevo." });
      setCaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-6 bg-black/65 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92dvh] overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#6b0014] text-white p-4 sm:p-6 rounded-t-3xl flex items-center justify-between shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              Solicitud de reserva
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold truncate">Reservar experiencia</h2>
            <p className="text-xs text-gray-200 line-clamp-1">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0"
            aria-label="Cerrar"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="shrink-0">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>

        <div className="p-4 sm:p-6 pt-2 flex flex-col gap-4 overflow-y-auto overscroll-contain min-h-0 flex-1">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => updateFormData({ website: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#6b0014]/5 border border-[#6b0014]/20 rounded-2xl p-4 flex justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-[#6b0014]">
                    Total estimado
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{travelersSummary}</p>
                </div>
                <p className="text-lg font-black text-[#6b0014] font-title shrink-0">
                  {formatMoney(breakdown.total, formData.currency)}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase flex items-center gap-1.5">
                      <FaCalendarAlt className="text-[#6b0014]" /> Fecha de viaje
                    </label>
                    <CustomDatePicker
                      value={formData.travelDate}
                      onChange={(d) => updateFormData({ travelDate: d })}
                      placeholder="Elige tu fecha"
                    />
                    {errors.travelDate && (
                      <span className="text-[11px] text-rose-600 font-semibold">
                        {errors.travelDate}
                      </span>
                    )}
                  </div>

                  <TravelersSelector
                    adults={formData.adults}
                    childrenByTarifa={formData.childrenByTarifa}
                    tarifas={tarifas}
                    onAdultsChange={(count) => updateFormData({ adults: count })}
                    onTarifaChange={(tarifaId, count) =>
                      updateFormData({
                        childrenByTarifa: {
                          ...formData.childrenByTarifa,
                          [tarifaId]: count,
                        },
                      })
                    }
                    error={errors.adults}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {!isMultiDay && !hasHotelOptions && horarios && horarios.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase flex items-center gap-1.5">
                        <FaClock className="text-[#6b0014]" /> Horario
                      </label>
                      <select
                        value={formData.selectedHorario}
                        onChange={(e) => updateFormData({ selectedHorario: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold bg-white appearance-auto"
                      >
                        {horarios.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {hasHotelOptions && opcionesHotel && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase flex items-center gap-1.5">
                        <FaHotel className="text-[#6b0014]" /> Hospedaje
                      </label>
                      <select
                        value={formData.selectedHotelOptionId}
                        onChange={(e) =>
                          updateFormData({ selectedHotelOptionId: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold bg-white appearance-auto"
                      >
                        {opcionesHotel.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.nombre}
                            {!hotelOpcionIncludesLodging(opt) ? " — sin estadía" : ""} (${opt.precio_usd})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {enabledExtras.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-extrabold uppercase text-slate-600">
                        Extras opcionales
                      </span>
                      {enabledExtras.map((extra) => (
                        <label
                          key={extra.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                        >
                          <span className="flex items-center gap-2 font-bold">
                            <input
                              type="checkbox"
                              checked={formData.selectedExtraIds.includes(extra.id)}
                              onChange={() => {
                                const has = formData.selectedExtraIds.includes(extra.id);
                                updateFormData({
                                  selectedExtraIds: has
                                    ? formData.selectedExtraIds.filter((id) => id !== extra.id)
                                    : [...formData.selectedExtraIds, extra.id],
                                });
                              }}
                            />
                            <FaMountain className="text-[#6b0014]" />
                            {extra.label}
                          </span>
                          <span>+${extra.precio_usd}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px]">
                <FaShieldAlt className="text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-950">
                  Sin cobro en la web. Un asesor confirma disponibilidad contigo.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className="w-full bg-[#6b0014] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm"
              >
                Continuar con mis datos <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <StepTravelerInfo
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              totalPrice={breakdown.total}
              totalLabel={formatMoney(breakdown.total, formData.currency)}
              travelersLabel={travelersSummary}
              opcionesHotel={opcionesHotel}
              onNext={() => {
                if (validateStep2()) setCurrentStep(3);
              }}
              onBack={() => {
                setCurrentStep(1);
                setErrors({});
              }}
            />
          )}

          {currentStep === 3 && (
            <>
              <StepReview
                formData={formData}
                totalPrice={breakdown.total}
                opcionesHotel={opcionesHotel}
                travelersSummary={travelersSummary}
                onBack={() => setCurrentStep(2)}
              />
              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    updateFormData({ termsAccepted: e.target.checked });
                    if (e.target.checked) setErrors((prev) => ({ ...prev, termsAccepted: "" }));
                  }}
                  className="mt-0.5"
                />
                <span>
                  Acepto los{" "}
                  <a
                    href="/terminos-y-condiciones/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6b0014] font-bold underline"
                  >
                    términos y condiciones
                  </a>{" "}
                  y autorizo el contacto por WhatsApp para confirmar mi reserva.
                </span>
              </label>
              {errors.termsAccepted && (
                <span className="text-[11px] text-rose-600 font-semibold">
                  {errors.termsAccepted}
                </span>
              )}
              {TURNSTILE_SITE_KEY ? (
                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={setCaptchaToken}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-2"
                />
              ) : null}
              {errors.submit && (
                <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">
                  {errors.submit}
                </div>
              )}
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-60 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm shrink-0"
              >
                {submitting ? "Enviando solicitud…" : "Enviar solicitud de reserva"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
