import React from "react";
import {
  FaUtensils,
  FaTrain,
  FaBus,
  FaMapMarkerAlt,
  FaHotel,
  FaUserTie,
  FaUsers,
  FaMountain,
  FaWater,
  FaWalking,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaCompass,
  FaCamera,
  FaTicketAlt,
  FaHandshake,
  FaMotorcycle,
  FaSun,
  FaPlane,
  FaCar,
  FaShip,
  FaSuitcase,
  FaBed,
} from "react-icons/fa";
import { TourHighlightItem } from "@/types/tour";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FaUtensils,
  FaTrain,
  FaBus,
  FaMapMarkerAlt,
  FaHotel,
  FaUserTie,
  FaUsers,
  FaMountain,
  FaWater,
  FaWalking,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaCompass,
  FaCamera,
  FaTicketAlt,
  FaHandshake,
  FaMotorcycle,
  FaSun,
  FaPlane,
  FaCar,
  FaShip,
  FaSuitcase,
  FaBed,
};

function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  return FaCompass;
}

interface ValueCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface TourValuePropositionProps {
  highlights?: TourHighlightItem[];
  items?: string[];
}

export const TourValueProposition: React.FC<TourValuePropositionProps> = ({
  highlights,
  items,
}) => {
  let cards: ValueCard[] = [];

  if (highlights && highlights.length > 0) {
    cards = highlights.slice(0, 6).map((h) => ({
      icon: getIconComponent(h.icono),
      title: h.titulo,
      description: h.detalle,
    }));
  } else if (items && items.length > 0) {
    const fallbackIcons = [FaHandshake, FaShieldAlt, FaUserTie, FaCompass, FaClock, FaStar];
    cards = items.slice(0, 6).map((item, idx) => {
      const dashIdx = item.indexOf(" - ");
      if (dashIdx !== -1) {
        return {
          icon: fallbackIcons[idx % fallbackIcons.length],
          title: item.slice(0, dashIdx).trim(),
          description: item.slice(dashIdx + 3).trim(),
        };
      }
      const colonIdx = item.indexOf(":");
      if (colonIdx !== -1) {
        return {
          icon: fallbackIcons[idx % fallbackIcons.length],
          title: item.slice(0, colonIdx).trim(),
          description: item.slice(colonIdx + 1).trim(),
        };
      }
      return {
        icon: fallbackIcons[idx % fallbackIcons.length],
        title: item.length > 40 ? item.slice(0, 40) + "..." : item,
        description: item,
      };
    });
  }

  if (cards.length === 0) return null;

  // Fill up to 4 minimum if needed
  const defaults: ValueCard[] = [
    { icon: FaHandshake, title: "Operador Directo", description: "Sin intermediarios. Reserva directamente con Viajando con Chullos Tours y obtén el mejor precio sin cargos ocultos." },
    { icon: FaShieldAlt, title: "Reserva Garantizada", description: "Tu reserva está 100% asegurada. Confirmación inmediata y atención humana en todo momento." },
    { icon: FaUserTie, title: "Guías Certificados", description: "Nuestros guías son residentes de Cusco con licencia oficial y profundo conocimiento cultural." },
    { icon: FaUsers, title: "Grupos Reducidos", description: "Máximo 12 personas por grupo para garantizar una experiencia personalizada e íntima." },
  ];

  const finalCards = cards.length >= 4 ? cards : [...cards, ...defaults].slice(0, Math.max(4, cards.length));

  return (
    <div className="bg-white border border-slate-200/80 p-5 md:p-7 rounded-3xl flex flex-col gap-5 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-[#6b0014] font-black text-xs uppercase tracking-wider">Viajando con Chullos Tours</span>
        <h3 className="text-base md:text-lg font-black text-slate-900 font-title">
          ¿Por qué elegir esta experiencia con nosotros?
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {finalCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              className="flex flex-row items-start gap-4 bg-slate-50/80 hover:bg-amber-50/40 border border-slate-200/70 hover:border-amber-200/60 rounded-2xl p-4 transition-all group"
            >
              {/* Left Section: Flat Icon */}
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#6b0014]/10 group-hover:bg-[#6b0014]/15 flex items-center justify-center transition-colors">
                <IconComp className="w-5 h-5 text-[#6b0014]" />
              </div>

              {/* Right Section: Title + Detail */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                  {card.title}
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                  {card.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
