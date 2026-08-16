"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/I18nContext";
import { LOCALES_INFO, SupportedLocale } from "@/i18n/config";

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentInfo = LOCALES_INFO[locale] || LOCALES_INFO.es;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar idioma"
        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
      >
        <span className="text-sm">{currentInfo.flag}</span>
        <span className="uppercase tracking-wider">{currentInfo.shortName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-slideDown overflow-hidden">
          {(Object.keys(LOCALES_INFO) as SupportedLocale[]).map((locKey) => {
            const info = LOCALES_INFO[locKey];
            const isSelected = locale === locKey;
            return (
              <button
                key={locKey}
                type="button"
                onClick={() => {
                  setLocale(locKey);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#6b0014]/10 text-[#6b0014] font-extrabold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{info.flag}</span>
                  <span>{info.name}</span>
                </span>
                {isSelected && <span className="text-[#6b0014] font-black">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
