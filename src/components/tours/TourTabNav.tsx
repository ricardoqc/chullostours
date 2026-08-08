"use client";

import React, { useState, useEffect } from "react";
import {
  FaCompass,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";

interface TourTabNavProps {
  hasFaqs: boolean;
  hasRecom: boolean;
}

export const TourTabNav: React.FC<TourTabNavProps> = ({ hasFaqs, hasRecom }) => {
  const [activeSection, setActiveSection] = useState<string>("descripcion");

  const tabs = [
    { id: "descripcion", label: "La Experiencia", icon: FaCompass },
    { id: "itinerario", label: "Itinerario", icon: FaCalendarAlt },
    { id: "incluye", label: "¿Qué Incluye?", icon: FaCheckCircle },
    ...(hasRecom ? [{ id: "recomendaciones", label: "Recomendaciones", icon: FaInfoCircle }] : []),
    ...(hasFaqs ? [{ id: "faqs", label: "Preguntas Frecuentes", icon: FaQuestionCircle }] : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = tabs.map((t) => t.id);
      const scrollPos = window.scrollY + 100;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasFaqs, hasRecom]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -75;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex items-center gap-2 text-xs md:text-sm font-extrabold whitespace-nowrap py-3 px-3 md:px-4 transition-all cursor-pointer border-b-2 ${
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
    </div>
  );
};

