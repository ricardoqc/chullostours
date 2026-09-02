import React from "react";
import { Users, Star, Compass, Award, HeartHandshake } from "lucide-react";
import { getMetrics } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";

export const StatsCounterSection: React.FC = () => {
  const metrics = getMetrics();

  const stats = [
    {
      id: "travelers",
      value: metrics.travelersServed,
      label: "Viajeros Felices",
      sublabel: "Experiencias memorables en Perú",
      icon: Users,
    },
    {
      id: "reviews",
      value: `${metrics.tripadvisorRating.toFixed(1)} ★`,
      label: "Excelencia TripAdvisor",
      sublabel: `${metrics.tripadvisorReviewsCount} opiniones verificadas`,
      icon: Star,
    },
    {
      id: "experience",
      value: `${metrics.yearsExperience}+ Años`,
      label: "Experiencia Local",
      sublabel: "Operadores nativos en Cusco",
      icon: Award,
    },
    {
      id: "tours",
      value: `${metrics.activeToursCount}+`,
      label: "Rutas & Aventuras",
      sublabel: "Machu Picchu, treks y valles",
      icon: Compass,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 w-full relative z-10" aria-label="Estadísticas de confianza">
      <Reveal as="div" className="bg-gradient-to-r from-[#6b0014] via-[#7d0018] to-[#6b0014] rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl border border-[#ffc000]/20 text-white relative overflow-hidden">
        {/* Subtle Andean motif overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center text-center px-2 sm:px-4 ${
                  index !== stats.length - 1 ? "lg:border-r lg:border-white/15" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#ffc000] mb-3 shadow-inner">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#ffc000] font-title tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white mt-1 font-title">{stat.label}</div>
                <div className="text-xs text-slate-200/80 mt-0.5 hidden sm:block">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
};
