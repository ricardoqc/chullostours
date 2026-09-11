import React from "react";
import { Users, Star, ShieldCheck, Award, Headphones, Compass } from "lucide-react";
import { getMetrics } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";

type TrustItem = {
  id: string;
  value: string;
  label: string;
  icon: typeof Star;
  tone: "brand" | "gold" | "light";
};

export const StatsCounterSection: React.FC = () => {
  const metrics = getMetrics();

  const items: TrustItem[] = [
    {
      id: "reviews",
      value: `${metrics.tripadvisorRating.toFixed(1)} ★`,
      label: "TripAdvisor",
      icon: Star,
      tone: "brand",
    },
    {
      id: "tickets",
      value: "100%",
      label: "Ingresos asegurados",
      icon: ShieldCheck,
      tone: "light",
    },
    {
      id: "experience",
      value: `${metrics.yearsExperience}+ años`,
      label: "Experiencia local",
      icon: Award,
      tone: "gold",
    },
    {
      id: "guides",
      value: "Guías",
      label: "Cusqueños oficiales",
      icon: Users,
      tone: "light",
    },
    {
      id: "tours",
      value: `${metrics.activeToursCount}+`,
      label: "Tours activos",
      icon: Compass,
      tone: "brand",
    },
    {
      id: "support",
      value: "24/7",
      label: "Soporte real",
      icon: Headphones,
      tone: "light",
    },
  ];

  const toneClass: Record<TrustItem["tone"], string> = {
    brand: "bg-[#6b0014] text-white border-[#6b0014]",
    gold: "bg-[#ffc000] text-slate-900 border-[#ffc000]",
    light: "bg-white text-slate-900 border-slate-200",
  };

  const iconClass: Record<TrustItem["tone"], string> = {
    brand: "bg-white/15 text-[#ffc000]",
    gold: "bg-black/10 text-slate-900",
    light: "bg-[#6b0014]/10 text-[#6b0014]",
  };

  return (
    <section className="max-w-7xl mx-auto px-4 w-full relative z-10" aria-label="Confianza y cifras clave">
      <Reveal
        as="div"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 md:gap-3"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border px-3.5 py-3.5 md:py-4 flex items-center gap-3 min-h-[76px] ${toneClass[item.tone]}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass[item.tone]}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-black font-title leading-tight truncate">{item.value}</p>
                <p
                  className={`text-[11px] md:text-xs font-semibold leading-snug ${
                    item.tone === "brand" ? "text-white/80" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
};
