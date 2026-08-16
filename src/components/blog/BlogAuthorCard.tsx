import React from "react";
import { Award, MapPin, CheckCircle2 } from "lucide-react";

interface BlogAuthorCardProps {
  authorName?: string;
}

export function BlogAuthorCard({ authorName = "Alexandra Gamboa" }: BlogAuthorCardProps) {
  return (
    <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 md:p-8 my-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
      <div className="relative shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#6b0014] text-[#ffc000] flex items-center justify-center font-extrabold text-2xl border-4 border-white shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
            alt={authorName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#6b0014] text-white p-1 rounded-full border-2 border-white">
          <CheckCircle2 className="w-4 h-4 text-[#ffc000]" />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <h4 className="text-lg font-bold text-[#1C1C1C]">{authorName}</h4>
          <span className="bg-[#6b0014] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Especialista en Turismo en Perú
          </span>
        </div>

        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
          Guía oficial y especialista en experiencias de viaje en Cusco, Machu Picchu y la región Andina con más de 10 años de experiencia. Apasionada por transmitir la historia inca, la cultura viva y las recomendaciones más precisas para viajeros de todo el mundo.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-gray-500 pt-2 border-t border-amber-200/40">
          <span className="flex items-center gap-1 text-[#6b0014]">
            <Award className="w-3.5 h-3.5 text-[#ffc000]" /> Guía Oficial Licenciada
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-[#6b0014]" /> Residente en Cusco, Perú
          </span>
        </div>
      </div>
    </div>
  );
}
