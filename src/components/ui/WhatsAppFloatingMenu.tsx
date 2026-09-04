"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, ChevronRight } from "lucide-react";
import { SocialWhatsapp } from "@/components/ui/icons";
import { getWhatsappAgents, buildAgentWhatsappUrl } from "@/lib/site-config";
import type { WhatsAppAgent } from "@/types/site-config";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppFloatingMenuProps {
  customMessage?: string;
}

export const WhatsAppFloatingMenu: React.FC<WhatsAppFloatingMenuProps> = ({ customMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const agents: WhatsAppAgent[] = getWhatsappAgents();

  const isTourDetailPage = pathname?.startsWith("/tours/") && pathname !== "/tours";

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      ref={menuRef}
      className={`fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 ${
        isTourDetailPage ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Floating Popup Modal */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeInUp flex flex-col mb-2">
          {/* Header */}
          <div className="bg-[#6b0014] text-white p-4 relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffc000] text-[#1C1C1C] font-extrabold flex items-center justify-center font-title text-sm shadow-md">
                CT
              </div>
              <div>
                <h4 className="font-bold text-sm font-title leading-tight">Chullos Tours Asistencia</h4>
                <p className="text-[11px] text-[#ffc000] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Asesores en línea en Cusco
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar ventana de WhatsApp"
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtext */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 text-[11px] text-slate-600">
            👋 ¡Hola! Selecciona a un especialista para iniciar tu conversación directamente en WhatsApp:
          </div>

          {/* Agents List */}
          <div className="p-3 flex flex-col gap-2.5 max-h-[300px] overflow-y-auto">
            {agents.map((agent) => {
              const message = customMessage || agent.defaultMessage;
              const waUrl = buildAgentWhatsappUrl(agent.raw, message);

              return (
                <a
                  key={agent.id}
                  id={`gtm-whatsapp-agent-${agent.id}`}
                  data-gtm-action="whatsapp_agent_click"
                  data-gtm-agent={agent.name}
                  data-gtm-phone={agent.number}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackWhatsAppClick({
                      location: "floating_menu",
                      agentName: agent.name,
                      phoneNumber: agent.number,
                    });
                    setIsOpen(false);
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center font-bold text-sm font-title">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
                    </div>
                    <div className="text-left">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#6b0014] transition-colors">
                        {agent.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{agent.role}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shrink-0">
                    <SocialWhatsapp className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500">
            Respuesta promedio: <strong className="text-slate-800">Menos de 5 minutos</strong>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <div className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-1.5 animate-fadeInUp">
            <span>¿Dudas sobre tu viaje? ¡Escríbenos!</span>
          </div>
        )}

        <button
          type="button"
          id="gtm-whatsapp-floating-trigger"
          data-gtm-action="whatsapp_floating_toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir opciones de WhatsApp"
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen
              ? "bg-[#6b0014] text-white rotate-90"
              : "bg-[#25D366] text-white hover:scale-105"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <SocialWhatsapp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
