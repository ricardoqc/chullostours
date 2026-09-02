import React from "react";
import Link from "next/link";
import { Users, Heart, Compass, Landmark, ArrowRight, Sparkles } from "lucide-react";
import { getTravelerProfiles } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { TourImage } from "@/components/ui/TourImage";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Users,
  Heart,
  Compass,
  Landmark,
};

export const TravelerProfilesSection: React.FC = () => {
  const profiles = getTravelerProfiles();

  if (!profiles || profiles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 w-full py-4" aria-label="Tours por estilo de viajero">
      <Reveal as="div" className="flex flex-col gap-6 md:gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 font-title">
            <Sparkles className="w-3.5 h-3.5 text-[#ffc000]" /> Experiencias para Cada Tipo de Viajero
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 font-title">
            ¿Cómo sueñas vivir tu aventura en Perú?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            Selecciona tu estilo de viaje y descubre los itinerarios diseñados a tu propio ritmo.
          </p>
        </div>

        {/* Grid of Traveler Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {profiles.map((profile, idx) => {
            const IconComp = ICON_MAP[profile.icon] || Compass;
            return (
              <Reveal key={profile.id} delay={idx * 80} as="div">
                <Link
                  href={profile.href}
                  className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-5 border border-slate-200/80 hover:-translate-y-1 block bg-slate-900"
                >
                  {/* Background Image */}
                  <TourImage
                    src={profile.image}
                    alt={profile.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-[#6b0014] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <IconComp className="w-3 h-3 text-[#6b0014]" />
                      {profile.badge}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 flex flex-col gap-1.5 text-white">
                    <h3 className="text-lg sm:text-xl font-bold font-title group-hover:text-[#ffc000] transition-colors leading-tight">
                      {profile.title}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                      {profile.subtitle}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#ffc000] group-hover:translate-x-1 transition-transform">
                      <span>Ver Tours Recomendados</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
};
