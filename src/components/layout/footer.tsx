"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import {
  SocialFacebook,
  SocialInstagram,
  SocialTiktok,
  SocialTripadvisor,
  SocialWhatsapp,
} from "@/components/ui/icons";
import { companyInfo } from "@/lib/company-info";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=300&q=80",
      title: "Machu Picchu",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=300&q=80",
      title: "Vinicunca",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=300&q=80",
      title: "Humantay",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=300&q=80",
      title: "Valle Sagrado",
    },
  ];

  return (
    <footer className="w-full text-slate-300 font-sans relative overflow-hidden mt-auto border-t border-slate-800 flex flex-col">
      {/* Upper Content Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Company Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/img/Chullos-Tourslogo.png"
                alt="Viajando con Chullos Tours Logo"
                className="h-12 w-auto object-contain bg-white/90 p-1.5 rounded-lg"
              />
            </Link>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {companyInfo.description}
            </p>

            <div className="text-xs text-slate-400 leading-snug space-y-1 pt-1">
              <p>
                <span className="font-bold text-[#ffc000]">RUC:</span> {companyInfo.ruc}
              </p>
              <p className="font-bold text-white tracking-wide">{companyInfo.legalName}</p>
              <p>
                <span className="font-bold text-[#ffc000]">Dirección:</span> {companyInfo.address.full}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-2">
              <a
                href={companyInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <SocialFacebook className="w-4.5 h-4.5" />
              </a>
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <SocialInstagram className="w-4.5 h-4.5" />
              </a>
              <a
                href={companyInfo.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-[#6b0014] text-white flex items-center justify-center hover:bg-[#ffc000] hover:text-[#6b0014] hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <SocialTiktok className="w-4.5 h-4.5" />
              </a>
              <a
                href={companyInfo.social.tripadvisor}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
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
                { name: "Contacto", href: "/contacto-chullos" },
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
                className="w-full px-3.5 py-2.5 text-xs md:text-sm border border-slate-700 rounded-lg focus:outline-none focus:border-[#ffc000] text-white placeholder:text-slate-500 bg-slate-900"
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
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group h-20 rounded-lg overflow-hidden shadow-sm bg-slate-900"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#6b0014]/0 group-hover:bg-[#6b0014]/60 transition-colors flex items-center justify-center">
                    <SocialInstagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panoramic Footer Graphic */}
      <div className="w-full relative overflow-hidden pointer-events-none opacity-90 -mt-2">
        <img
          src="/img/background-footer-.png"
          alt="Machu Picchu Footer Landscape"
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

      {/* Floating WhatsApp Widget */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3">
        <div className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-1">
          <span>¿Dudas sobre tu viaje? ¡Escríbenos!</span>
        </div>
        <a
          href={companyInfo.phones.primary.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat en WhatsApp"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <SocialWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </a>
      </div>
    </footer>
  );
};
