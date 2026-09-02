import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";

export interface HelpLink {
  title: string;
  href: string;
  desc: string;
}

export const HELP_PANEL_POPULAR_LINKS: HelpLink[] = [
  { title: "Machu Picchu 2026", href: "/machu-picchu-2026", desc: "Ingresos y trenes garantizados" },
  { title: "Catálogo Completo de Tours", href: "/tours", desc: "Trekkings, Full Days y Paquetes" },
  { title: "Camino Inca 2 Días", href: "/tours/camino-inca-2-dias", desc: "La caminata corta clásica" },
  { title: "Diseña tu Viaje a Medida", href: "/viaje-personalizado", desc: "Itinerario 100% personalizado" },
];

/** Shared class for the guinda primary button so both the 404 and error pages stay identical. */
export const HELP_PANEL_PRIMARY_BUTTON_CLASS =
  "inline-flex items-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title";

interface HelpLinksPanelProps {
  /** Rendered to the left of the WhatsApp CTA: "Volver al Inicio", "Reintentar", etc. */
  primaryAction?: React.ReactNode;
  linksTitle?: string;
  whatsappLabel?: string;
  /** Pre-filled WhatsApp message. Omit it to open a plain chat. */
  whatsappMessage?: string;
  links?: HelpLink[];
}

export const HelpLinksPanel: React.FC<HelpLinksPanelProps> = ({
  primaryAction,
  linksTitle = "Rutas y Páginas Recomendadas:",
  whatsappLabel = "Ayuda por WhatsApp",
  whatsappMessage,
  links = HELP_PANEL_POPULAR_LINKS,
}) => {
  return (
    <>
      <div className="w-full flex flex-col gap-2.5 pt-4 border-t border-slate-100 text-left">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center sm:text-left">
          {linksTitle}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-[#ffc000]/15 hover:border-[#6b0014]/30 transition-all group"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#6b0014] transition-colors truncate">
                  {link.title}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {link.desc}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
        {primaryAction}
        <a
          href={getPrimaryWhatsappUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>{whatsappLabel}</span>
        </a>
      </div>
    </>
  );
};

export default HelpLinksPanel;
