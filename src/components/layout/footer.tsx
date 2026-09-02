"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Send, X, ShieldCheck } from "lucide-react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import {
  SocialFacebook,
  SocialInstagram,
  SocialTiktok,
  SocialTripadvisor,
} from "@/components/ui/icons";
import { companyInfo } from "@/lib/company-info";
import { getCertifications, getPaymentMethods } from "@/lib/site-config";
import { WhatsAppFloatingMenu } from "@/components/ui/WhatsAppFloatingMenu";
import { TourImage } from "@/components/ui/TourImage";

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string; size?: number }>> = {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaApplePay,
  FaGooglePay,
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [essnaModalOpen, setEssnaModalOpen] = useState(false);

  const certifications = getCertifications();
  const paymentMethods = getPaymentMethods();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Close ESSNA modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEssnaModalOpen(false);
    };
    if (essnaModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [essnaModalOpen]);

  const instagramPosts = [
    {
      id: 1,
      image: "/media/tours/tour-machu-picchu-2-dias/01.jpg",
      title: "Machu Picchu",
    },
    {
      id: 2,
      image: "/media/tours/montana-colores-vinicunca-tour/01.jpg",
      title: "Vinicunca",
    },
    {
      id: 3,
      image: "/media/tours/laguna-humantay-tour-cusco/01.jpg",
      title: "Humantay",
    },
    {
      id: 4,
      image: "/media/tours/valle-sagrado-vip-tour-cusco/01.jpg",
      title: "Valle Sagrado",
    },
  ];

  return (
    <>
      <footer className="w-full text-slate-300 font-sans relative overflow-hidden mt-auto border-t border-slate-800/80 flex flex-col">
        {/* Upper Content Section */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Company Info */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2">
                <TourImage
                  src="/img/Chullos-Tourslogo.png"
                  alt="Viajando con Chullos Tours Logo"
                  width={180}
                  height={48}
                  className="h-12 w-auto object-contain bg-white/95 p-1.5 rounded-lg shadow-md"
                />
              </Link>

              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                {companyInfo.description}
              </p>

              <div className="text-xs text-slate-400 leading-snug space-y-1 pt-1 border-t border-slate-800/80">
                <p>
                  <span className="font-bold text-[#ffc000]">RUC:</span> {companyInfo.ruc}
                </p>
                <p className="font-bold text-white tracking-wide">{companyInfo.legalName}</p>
                <p>
                  <span className="font-bold text-[#ffc000]">Dirección:</span> {companyInfo.address.full}
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 mt-1">
                <a
                  href={companyInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Oficial Chullos Tours"
                  className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <SocialFacebook className="w-4.5 h-4.5" />
                </a>
                <a
                  href={companyInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial Chullos Tours"
                  className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <SocialInstagram className="w-4.5 h-4.5" />
                </a>
                <a
                  href={companyInfo.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Oficial Chullos Tours"
                  className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <SocialTiktok className="w-4.5 h-4.5" />
                </a>
                <a
                  href={companyInfo.social.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TripAdvisor Chullos Tours"
                  className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <SocialTripadvisor className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Accesos Rápidos */}
            <div>
              <h4 className="text-base font-bold text-[#ffc000] mb-4 font-title">Accesos Rápidos</h4>
              <ul className="flex flex-col gap-2.5 text-xs md:text-sm">
                {[
                  { name: "Catálogo de Tours", href: "/tours" },
                  { name: "Machu Picchu 2026", href: "/machu-picchu-2026" },
                  { name: "Planea tu Viaje", href: "/viaje-personalizado" },
                  { name: "Sobre Chullos Tours", href: "/acerca-de-chullos-tours" },
                  { name: "Blog de Viajes", href: "/blog" },
                  { name: "Contacto en Cusco", href: "/contacto-chullos" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-slate-400 hover:text-[#ffc000] transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffc000] group-hover:scale-125 transition-transform shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Ofertas & Newsletter */}
            <div>
              <h4 className="text-base font-bold text-[#ffc000] mb-4 font-title">Ofertas Especiales</h4>
              <p className="text-xs md:text-sm text-slate-400 mb-4 leading-relaxed">
                Recibe promociones exclusivas e itinerarios recomendados en tu correo.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-slate-700 rounded-lg focus:outline-none focus:border-[#ffc000] text-white placeholder:text-slate-500 bg-black/40 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md font-title"
                >
                  <span>Suscribirme</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
                {subscribed && (
                  <span className="text-xs text-green-400 font-medium">¡Gracias por suscribirte!</span>
                )}
              </form>
            </div>

            {/* Column 4: Galería Instagram */}
            <div>
              <h4 className="text-base font-bold text-[#ffc000] mb-4 font-title">Galería de Fotos</h4>
              <div className="grid grid-cols-2 gap-2">
                {instagramPosts.map((post) => (
                  <a
                    key={post.id}
                    href={companyInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group h-20 rounded-lg overflow-hidden shadow-sm bg-black/40"
                  >
                    <TourImage
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-[#6b0014]/0 group-hover:bg-[#6b0014]/60 transition-colors flex items-center justify-center">
                      <SocialInstagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BANDA DE CERTIFICACIONES OFICIALES & MÉTODOS DE PAGO (FONDO TRANSPARENTE) */}
          {/* ========================================================================= */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col gap-8">
            {/* Certificaciones y Reconocimientos */}
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-[11px] font-bold text-[#ffc000] uppercase tracking-widest flex items-center gap-1.5 font-title">
                <ShieldCheck className="w-4 h-4 text-[#ffc000]" /> Certificaciones Oficiales & Reconocimientos
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 w-full max-w-4xl">
                {certifications.map((cert) => {
                  if (cert.isModal) {
                    return (
                      <button
                        key={cert.id}
                        type="button"
                        onClick={() => setEssnaModalOpen(true)}
                        className="opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-300 flex items-center cursor-pointer p-1 rounded-lg hover:bg-white/10"
                        title="Click para ver Certificado Oficial ESSNA"
                      >
                        <TourImage
                          src={cert.logo}
                          alt={cert.alt}
                          width={120}
                          height={48}
                          className="h-10 sm:h-12 w-auto object-contain brightness-95 hover:brightness-100"
                        />
                      </button>
                    );
                  }

                  if (cert.href) {
                    return (
                      <a
                        key={cert.id}
                        href={cert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-300 flex items-center p-1 rounded-lg hover:bg-white/10"
                        title={cert.name}
                      >
                        <TourImage
                          src={cert.logo}
                          alt={cert.alt}
                          width={120}
                          height={48}
                          className="h-10 sm:h-12 w-auto object-contain brightness-95 hover:brightness-100"
                        />
                      </a>
                    );
                  }

                  return (
                    <div
                      key={cert.id}
                      className="opacity-85 hover:opacity-100 transition-opacity flex items-center p-1"
                      title={cert.name}
                    >
                      <TourImage
                        src={cert.logo}
                        alt={cert.alt}
                        width={120}
                        height={48}
                        className="h-10 sm:h-12 w-auto object-contain brightness-95 hover:brightness-100"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pasarelas de Pago Seguras */}
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Pagos 100% Seguros y Encriptados
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
                {paymentMethods.map((pm) => {
                  const IconComp = PAYMENT_ICON_MAP[pm.icon] || FaCcVisa;
                  return (
                    <span
                      key={pm.id}
                      title={pm.name}
                      className="w-11 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 hover:text-white hover:border-white/30 transition-colors shadow-sm"
                    >
                      <IconComp size={24} />
                      <span className="sr-only">{pm.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Panoramic Footer Graphic */}
        <div className="w-full relative overflow-hidden pointer-events-none opacity-90 -mt-2">
          <TourImage
            src="/img/background-footer-.png"
            alt="Machu Picchu Footer Landscape"
            width={1920}
            height={320}
            className="w-full h-auto block"
          />
        </div>

        {/* Bottom Copyright Bar */}
        <div className="bg-[#6b0014] text-white py-4 px-4 text-xs relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-center sm:text-left text-slate-200 font-medium">
              {companyInfo.copyright}
            </p>
            <div className="flex items-center gap-4 text-slate-200">
              <Link href="/mapa-del-sitio" className="hover:text-[#ffc000] transition-colors">
                Mapa del Sitio
              </Link>
              <span className="text-white/40">|</span>
              <Link href="/politicas-de-privacidad" className="hover:text-[#ffc000] transition-colors">
                Política de Privacidad
              </Link>
              <span className="text-white/40">|</span>
              <Link href="/terminos-y-condiciones" className="hover:text-[#ffc000] transition-colors">
                Términos & Condiciones
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Agent WhatsApp Widget */}
        <WhatsAppFloatingMenu />
      </footer>

      {/* ESSNA Certificate Modal */}
      {essnaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificado ESSNA Oficial"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp"
          onClick={() => setEssnaModalOpen(false)}
        >
          <div
            className="relative bg-slate-900 rounded-2xl p-4 sm:p-6 max-w-xl w-full border border-slate-700 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ffc000]" />
                <h3 className="text-base font-bold text-white font-title">
                  Certificado de Código de Conducta ESSNA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEssnaModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black/50 border border-slate-800 flex justify-center max-h-[70vh] overflow-y-auto">
              <TourImage
                src="/img/legal-brands/Certificado-ESSNA.jpeg"
                alt="Certificado ESSNA - Chullos Tours"
                width={800}
                height={1100}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Agencia comprometida con la protección de niños y adolescentes (ESSNA)</span>
              <button
                type="button"
                onClick={() => setEssnaModalOpen(false)}
                className="px-4 py-1.5 bg-[#6b0014] text-white font-bold rounded-lg hover:bg-[#850019] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
