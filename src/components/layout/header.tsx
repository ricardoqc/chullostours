"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Search, Menu, X, ChevronDown } from "lucide-react";
import {
  SocialFacebook,
  SocialInstagram,
  SocialTiktok,
  SocialGoogle,
  SocialTripadvisor,
  SocialWhatsapp,
} from "@/components/ui/icons";
import { companyInfo } from "@/lib/company-info";
import { useTranslation } from "@/i18n/I18nContext";
import { PeruCurrencySelector } from "@/components/layout/PeruCurrencySelector";
import { TourImage } from "@/components/ui/TourImage";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navLinks = [
    { name: t("header.nav.machuPicchu"), href: "/machu-picchu-2026", hasDropdown: false },
    { name: t("header.nav.customTrip"), href: "/viaje-personalizado", hasDropdown: false },
    { name: t("header.nav.catalog"), href: "/tours", hasDropdown: false },
    { name: "Blog", href: "/blog", hasDropdown: false },
    { name: t("header.nav.aboutUs"), href: "/acerca-de-chullos-tours", hasDropdown: false },
    { name: t("header.nav.contact"), href: "/contacto-chullos", hasDropdown: false },
  ];

  const isTourDetailPage = pathname?.startsWith("/tours/") && pathname !== "/tours";

  useEffect(() => {
    if (!isTourDetailPage) {
      setIsScrolledPastHero(false);
      return;
    }

    const handleScroll = () => {
      // Once scrolled past hero where TourTabNav kicks in, hide web header
      setIsScrolledPastHero(window.scrollY > 480);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTourDetailPage]);

  return (
    <header
      className={`w-full transition-all duration-300 z-50 ${
        isTourDetailPage
          ? isScrolledPastHero
            ? "sticky -top-11 md:-top-12 -translate-y-full opacity-0 pointer-events-none"
            : "sticky -top-11 md:-top-12 opacity-100"
          : "sticky -top-11 md:-top-12"
      }`}
    >
      {/* Top Maroon Banner - Optimized Mobile Display */}
      <div className="bg-[#6b0014] text-white pt-2.5 pb-10 px-4 md:px-12 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Contact Details */}
          <div className="flex items-center gap-4 md:gap-8 text-white font-medium overflow-x-auto no-scrollbar py-0.5">
            {/* Email */}
            <a
              href={`mailto:${companyInfo.emails.info}`}
              className="hidden sm:flex items-center gap-2 hover:text-[#ffc000] transition-colors shrink-0"
            >
              <Mail className="w-4 h-4 text-white shrink-0 stroke-[2]" />
              <span className="text-xs md:text-sm tracking-wide">{companyInfo.emails.info}</span>
            </a>

            {/* WhatsApp 1 */}
            <a
              href={companyInfo.phones.primary.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#ffc000] transition-colors shrink-0 group"
            >
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#6b0014] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <SocialWhatsapp className="w-3.5 h-3.5 text-[#6b0014]" />
              </div>
              <span className="text-xs md:text-sm font-bold tracking-wide">{companyInfo.phones.primary.number}</span>
            </a>

            {/* WhatsApp 2 - Desktop/Tablet only */}
            <a
              href={companyInfo.phones.secondary.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 hover:text-[#ffc000] transition-colors shrink-0 group"
            >
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#6b0014] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <SocialWhatsapp className="w-3.5 h-3.5 text-[#6b0014]" />
              </div>
              <span className="text-xs md:text-sm font-bold tracking-wide">{companyInfo.phones.secondary.number}</span>
            </a>
          </div>

          {/* Right Social Icons + currency (Perú) */}
          <div className="flex items-center gap-2 shrink-0">
            <PeruCurrencySelector />
            <a
              href={companyInfo.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SocialFacebook className="w-4 h-4" />
            </a>
            <a
              href={companyInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SocialInstagram className="w-4 h-4" />
            </a>
            <a
              href={companyInfo.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SocialTiktok className="w-4 h-4" />
            </a>
            <a
              href={companyInfo.social.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TripAdvisor"
              className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <SocialTripadvisor className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Floating Sticky Nav Card Container */}
      <div className={`max-w-7xl mx-auto px-3 sm:px-4 md:px-8 -mt-8 ${isTourDetailPage ? "relative z-30" : "sticky top-3 z-50"} transition-all`}>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-[20px] shadow-xl border border-gray-100 px-3 sm:px-4 md:px-6 py-2 md:py-3 flex items-center justify-between transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink">
            <TourImage
              src="/img/Chullos-Tourslogo.png"
              alt="Viajando con Chullos Tours Logo"
              width={200}
              height={48}
              priority
              className="h-8 sm:h-10 md:h-12 w-auto max-w-[160px] sm:max-w-none object-contain"
            />
          </Link>

          {/* Desktop Navigation Links with Active State */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm md:text-[15px] font-bold transition-all relative py-1 font-title ${
                    isActive
                      ? "text-[#6b0014] font-extrabold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#6b0014] after:rounded-full"
                      : "text-[#1C1C1C] hover:text-[#6b0014]"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Search & Hamburger */}
          <div className="flex items-center gap-2">
            {/* Direct WhatsApp Desktop Button */}
            <a
              href={companyInfo.phones.primary.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#25D366] text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-[#20bd5a] transition-all shadow-sm active:scale-95"
            >
              <SocialWhatsapp className="w-4 h-4 text-white" />
              <span>Hablar con Experto</span>
            </a>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar tours"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#850019] active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
            >
              <Search className="w-4.5 h-4.5 md:w-5 md:h-5 stroke-[2.2]" />
            </button>

            {/* Mobile Menu Toggle (lg:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú principal"
              className="lg:hidden w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#850019] active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>

        {/* Search Drawer / Input Bar */}
        {searchOpen && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 mt-2 max-w-2xl mx-auto flex flex-col gap-3 z-40 relative animate-slideDown">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/resultados-de-busqueda?q=${encodeURIComponent(searchQuery.trim())}`;
                  setSearchOpen(false);
                } else {
                  window.location.href = "/tours";
                  setSearchOpen(false);
                }
              }}
              className="flex items-center gap-2 bg-slate-50 p-1.5 pl-4 rounded-2xl border-2 border-slate-200 focus-within:border-[#6b0014] focus-within:ring-4 focus-within:ring-[#6b0014]/10 transition-all"
            >
              <Search className="w-5 h-5 text-[#6b0014] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué tour o destino buscas? (ej. Machu Picchu, Humantay...)"
                className="w-full text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400 bg-transparent py-2"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer shadow-md active:scale-95 font-title"
              >
                Buscar
              </button>
            </form>

            {/* Quick Suggestions / Popular Searches */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
                Búsquedas populares:
              </span>
              {[
                "Machu Picchu",
                "Camino Inca",
                "Laguna Humantay",
                "Montaña de 7 Colores",
                "Valle Sagrado",
                "Titicaca",
              ].map((term) => (
                <Link
                  key={term}
                  href={`/resultados-de-busqueda?q=${encodeURIComponent(term)}`}
                  onClick={() => setSearchOpen(false)}
                  className="text-xs bg-slate-100 hover:bg-[#ffc000]/20 hover:text-[#6b0014] text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Menu Drawer with Animation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-2xl border border-gray-100 mt-2 p-5 z-40 relative flex flex-col gap-4 animate-slideDown">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-[#6b0014]/10 text-[#6b0014] font-extrabold"
                        : "text-[#1C1C1C] hover:bg-gray-50"
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
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
        )}
      </div>
    </header>
  );
};
