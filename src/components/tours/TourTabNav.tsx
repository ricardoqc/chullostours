"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import {
  FaCompass,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaHotel,
  FaDollarSign,
  FaClipboardCheck,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { SocialWhatsapp } from "@/components/ui/icons";
import { companyInfo } from "@/lib/company-info";
import { useTranslation } from "@/i18n/I18nContext";
import { TourImage } from "@/components/ui/TourImage";
import { useOptionalTourReservation } from "./TourReservationProvider";

interface TourTabNavProps {
  hasFaqs: boolean;
  hasRecom: boolean;
  hasHotels?: boolean;
  hasMap?: boolean;
}

export const TourTabNav: React.FC<TourTabNavProps> = ({
  hasFaqs,
  hasRecom,
  hasHotels = false,
  hasMap = false,
}) => {
  const [activeSection, setActiveSection] = useState<string>("descripcion");
  const [siteMenuOpen, setSiteMenuOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const reservation = useOptionalTourReservation();

  const tabs = [
    { id: "descripcion", label: "La Experiencia", icon: FaCompass },
    { id: "itinerario", label: "Itinerario", icon: FaCalendarAlt },
    ...(hasMap ? [{ id: "mapa-ruta", label: "Mapa", icon: FaMapMarkedAlt }] : []),
    hasHotels
      ? { id: "hoteles", label: "Hoteles & Estadía", icon: FaHotel }
      : { id: "tarifas", label: "Tarifas", icon: FaDollarSign },
    { id: "incluye", label: "¿Qué Incluye?", icon: FaCheckCircle },
    ...(hasRecom ? [{ id: "recomendaciones", label: "Recomendaciones", icon: FaInfoCircle }] : []),
    ...(hasFaqs ? [{ id: "faqs", label: "Preguntas Frecuentes", icon: FaQuestionCircle }] : []),
  ];

  const navLinks = [
    { name: t("header.nav.machuPicchu"), href: "/machu-picchu-2026" },
    { name: t("header.nav.customTrip"), href: "/viaje-personalizado" },
    { name: t("header.nav.catalog"), href: "/tours" },
    { name: "Blog y Guías", href: "/blog" },
    { name: t("header.nav.aboutUs"), href: "/acerca-de-chullos-tours" },
    { name: t("header.nav.contact"), href: "/contacto-chullos" },
  ];

  const sectionIdsKey = tabs.map((t) => t.id).join("|");

  useEffect(() => {
    const sectionIds = sectionIdsKey.split("|");

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 1);
      }

      const scrollPos = window.scrollY + 120;

      // El orden de las pestañas no siempre coincide con el orden en el DOM,
      // así que se resuelve la sección activa por su posición real.
      const positioned = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.getBoundingClientRect().top + window.scrollY };
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null)
        .sort((a, b) => a.top - b.top);

      if (positioned.length === 0) return;

      let nextActive = positioned[0].id;
      for (const section of positioned) {
        if (section.top > scrollPos) break;
        nextActive = section.id;
      }

      setActiveSection((prev) => {
        if (prev !== nextActive && tabsContainerRef.current) {
          document
            .getElementById(`tab-btn-${nextActive}`)
            ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
        return nextActive;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIdsKey]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    const activeBtn = document.getElementById(`tab-btn-${id}`);
    if (activeBtn && tabsContainerRef.current) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const handleReserveClick = () => {
    const widget = document.getElementById("reservar");
    const isWidgetVisible = !!widget && widget.getBoundingClientRect().width > 0;

    if (isWidgetVisible) {
      widget.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (reservation) {
      reservation.openReservation();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchQuery.trim();
    if (!term) return;
    setSiteMenuOpen(false);
    router.push(`/resultados-de-busqueda?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200 ${
          isSticky ? "shadow-md py-1.5" : "shadow-2xs py-1"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 md:gap-4">
          {/* Left: Brand Logo (Identical to header, ONLY appears when sticky) */}
          {isSticky && (
            <Link
              href="/"
              className="flex items-center shrink-0 pr-2 sm:pr-3 border-r border-slate-200 animate-fadeIn"
            >
              <TourImage
                src="/img/Chullos-Tourslogo.png"
                alt="Viajando con Chullos Tours Logo"
                width={160}
                height={36}
                className="h-7 sm:h-8 md:h-9 w-auto max-w-[130px] sm:max-w-none object-contain"
              />
            </Link>
          )}

          {/* Center: Tour Tab Links with horizontal scroll & smooth active tracking */}
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 flex-1 min-w-0 scroll-smooth"
          >
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-extrabold whitespace-nowrap py-2.5 px-3 md:px-3.5 transition-all cursor-pointer border-b-2 shrink-0 touch-manipulation min-h-[40px] ${
                    isActive
                      ? "border-[#6b0014] text-[#6b0014] bg-[#6b0014]/5 rounded-t-xl"
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-[#6b0014]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions: Reservar CTA & Circular Maroon Hamburger Button (Identical to Web Header) */}
          <div className="flex items-center gap-2 shrink-0 pl-1.5 sm:pl-2">
            <button
              type="button"
              onClick={handleReserveClick}
              className="hidden sm:flex items-center gap-1.5 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 min-h-[40px]"
            >
              <FaClipboardCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Reservar</span>
            </button>

            {/* Hamburger Button: EXACT style, color, icon and animation from Header.tsx */}
            <button
              type="button"
              onClick={() => setSiteMenuOpen(!siteMenuOpen)}
              aria-label="Menú principal"
              aria-expanded={siteMenuOpen}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#850019] active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
            >
              {siteMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-down Web Navigation Drawer (Identical Card Design to Header.tsx) */}
      {siteMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-start pt-16 px-4"
          onClick={() => setSiteMenuOpen(false)}
        >
          <div
            className="max-w-md w-full mx-auto bg-white rounded-2xl md:rounded-[20px] shadow-2xl border border-gray-100 p-5 z-50 flex flex-col gap-4 animate-slideDown max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
              <span className="text-xs font-black uppercase tracking-wider text-[#6b0014]">
                Menú Principal
              </span>
              <button
                type="button"
                onClick={() => setSiteMenuOpen(false)}
                aria-label="Cerrar menú principal"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>
            </div>

            <form onSubmit={submitSearch} className="relative shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tours y destinos..."
                aria-label="Buscar en el sitio"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014] transition-all"
              />
            </form>

            <nav className="flex flex-col gap-1.5 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setSiteMenuOpen(false)}
                    className={`text-base font-bold py-2.5 px-3.5 rounded-xl transition-colors flex items-center justify-between font-title ${
                      isActive
                        ? "bg-[#6b0014]/10 text-[#6b0014] font-extrabold"
                        : "text-[#1C1C1C] hover:bg-gray-50 hover:text-[#6b0014]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 shrink-0">
              <a
                href={companyInfo.phones.primary.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#20bd5a] transition-all shadow-md text-sm"
              >
                <SocialWhatsapp className="w-5 h-5 text-white" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

