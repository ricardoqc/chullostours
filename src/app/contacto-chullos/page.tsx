"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyInfo, getPrimaryWhatsappUrl } from "@/lib/company-info";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const mainWhatsappMsgUrl = getPrimaryWhatsappUrl(
    "Hola Chullos Tours, necesito información sobre un tour."
  );

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      {/* Header Banner */}
      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/familia-background_v4.png')" }}
        />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="text-[#ffc000] text-xs font-bold uppercase tracking-widest">
            Estamos para ayudarte
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-title">
            Contacto {companyInfo.name}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl font-light">
            ¿Tienes dudas sobre tu viaje? Escríbenos y un asesor te atenderá de inmediato.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards (Left Col) */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#f7f7f7] p-6 rounded-3xl border border-gray-100 flex flex-col gap-5">
            <h3 className="font-bold text-lg text-[#1c1c1c] font-title">Información de Contacto</h3>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#6b0014]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#1c1c1c]">Dirección</span>
                <span className="text-xs text-gray-500 leading-relaxed">
                  {companyInfo.address.street}, {companyInfo.address.office}<br />{companyInfo.address.city}, {companyInfo.address.country}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#6b0014]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm text-[#1c1c1c]">WhatsApp & Teléfono</span>
                <a
                  href={companyInfo.phones.primary.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6b0014] font-semibold hover:underline"
                >
                  {companyInfo.phones.primary.number} ({companyInfo.phones.primary.agent})
                </a>
                <a
                  href={companyInfo.phones.secondary.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6b0014] font-semibold hover:underline"
                >
                  {companyInfo.phones.secondary.number} ({companyInfo.phones.secondary.agent})
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#6b0014]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#1c1c1c]">Correo Electrónico</span>
                <span className="text-xs text-gray-500">{companyInfo.emails.reservas}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6b0014]/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#6b0014]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#1c1c1c]">Horario de Atención</span>
                <span className="text-xs text-gray-500">{companyInfo.hours.weekdays}</span>
                <span className="text-xs text-gray-500">{companyInfo.hours.weekends}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Quick Contact */}
          <div className="bg-[#6b0014] p-6 rounded-3xl flex flex-col gap-3 text-white">
            <h3 className="font-bold text-base font-title">¿Prefieres WhatsApp?</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Chatea directamente con nuestras asesoras de viaje. Respuesta inmediata.
            </p>
            <a
              href={mainWhatsappMsgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#ffc000] text-[#1c1c1c] font-bold text-sm px-5 py-3 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form (Right Col) */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-[#f7f7f7] p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1c1c1c] font-title">¡Mensaje Enviado!</h2>
              <p className="text-sm text-gray-500">
                Gracias por escribirnos. Te responderemos a la brevedad posible vía correo o WhatsApp.
              </p>
              <Button variant="primary" size="md" onClick={() => setSent(false)}>
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#f7f7f7] p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1c1c1c] font-title">¿Tienes Preguntas?</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Escríbenos tus dudas o sugerencias y te responderemos tan pronto podamos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Tu Nombre Completo *"
                  className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
                />
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="Correo Electrónico *"
                  className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
                />
              </div>

              <input
                id="contact-phone"
                type="tel"
                placeholder="Teléfono / WhatsApp"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
              />

              <input
                id="contact-subject"
                type="text"
                placeholder="Asunto o Tour de Interés"
                className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
              />

              <textarea
                id="contact-message"
                rows={5}
                required
                placeholder="Escribe tu mensaje o consulta aquí... *"
                className="bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#6b0014] focus:ring-1 focus:ring-[#6b0014]"
              />

              <Button variant="primary" size="lg" type="submit" className="flex items-center justify-center gap-2 mt-2">
                <Send className="w-4 h-4" />
                <span>Enviar Consulta</span>
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Map Embed */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-72">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.3399200000003!2d-71.98175!3d-13.52264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91682ef53e4fa4e7%3A0x7a42e4a1c10f56d0!2sCentro%20Comercial%20San%20Andres%2C%20Cusco!5e0!3m2!1ses!2spe!4v1690000000000!5m2!1ses!2spe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Chullos Tours - Centro Comercial San Andrés 218, Cusco"
          />
        </div>
      </div>
    </div>
  );
}
