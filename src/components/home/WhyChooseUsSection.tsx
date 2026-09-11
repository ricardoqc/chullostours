import React from "react";
import Link from "next/link";
import { Award, ShieldCheck, Users, Headphones, CheckCircle2, ArrowRight } from "lucide-react";
import { getWhyChooseUs } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { TourImage } from "@/components/ui/TourImage";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Award,
  ShieldCheck,
  Users,
  Headphones,
  CheckCircle2,
};

export const WhyChooseUsSection: React.FC = () => {
  const whyConfig = getWhyChooseUs();

  if (!whyConfig || !whyConfig.items) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 w-full py-4" aria-label="Por qué viajar con Chullos Tours">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Authentic Team / Guide Experience Image Card */}
        <Reveal as="div" className="lg:col-span-5 relative" direction="right">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-[4/5] bg-slate-900 group">
            <TourImage
              src={whyConfig.teamImage || "/media/tours/city-tour-cusco/01.jpg"}
              alt="Guías locales de Chullos Tours en Cusco"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Floating Trust Pill inside Image */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xl text-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6b0014] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  100%
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-title leading-tight">
                    Operación 100% Directa y Local
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Sin comisiones a terceros ni intermediarios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Title and 4 Key Value Pillars */}
        <Reveal as="div" className="lg:col-span-7 flex flex-col gap-6" direction="left">
          <div>
            <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider block mb-1 font-title">
              {whyConfig.tagline}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-title leading-tight">
              {whyConfig.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2.5 leading-relaxed">
              {whyConfig.description}
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyConfig.items.map((item) => {
              const IconComp = ICON_MAP[item.icon] || CheckCircle2;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#ffc000] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-[#6b0014]" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 font-title leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-0.5">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/acerca-de-chullos-tours">
              <Button size="lg" className="bg-[#6b0014] hover:bg-[#850019] text-white font-title font-bold text-xs sm:text-sm">
                Conoce Nuestra Historia
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
