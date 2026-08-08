"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Lock, CheckCircle2, User, Mail, Phone, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "transfer">("card");
  const [completed, setCompleted] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 my-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1c1c1c]">
          ¡Reserva Confirmada Exitosamente!
        </h1>
        <p className="text-gray-600 text-base max-w-lg leading-relaxed">
          Hemos enviado la confirmación y los tickets a tu correo electrónico. Nuestro equipo se pondrá en contacto contigo vía WhatsApp para coordinar los detalles del recojo.
        </p>
        <div className="bg-[#f7f7f7] p-6 rounded-2xl border border-gray-200 text-left w-full max-w-md flex flex-col gap-2 text-sm text-[#1c1c1c]">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Código de Reserva:</span>
            <span className="font-mono font-bold text-[#ff681a]">#CT-98241</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">Total Pagado:</span>
            <span className="font-bold text-[#ff681a]">$688 USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estado:</span>
            <span className="text-emerald-600 font-bold">Confirmado</span>
          </div>
        </div>
        <Link href="/">
          <Button variant="primary" size="lg" className="mt-4">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-16 bg-white">
      {/* Header Banner */}
      <div className="bg-[#111330] py-12 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#37d4d9] text-xs font-bold uppercase tracking-widest">
            Paso Final
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Finalizar Reserva
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Passenger & Payment Form (Left Col) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Passenger Information */}
            <section className="flex flex-col gap-4 bg-[#f7f7f7] p-6 rounded-3xl border border-gray-200">
              <h2 className="text-lg font-bold text-[#1c1c1c] flex items-center gap-2">
                <User className="w-5 h-5 text-[#ff681a]" />
                Datos del Pasajero Principal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Carlos"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pérez Gómez"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 987 654 321"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Documento / Pasaporte *</label>
                  <input
                    type="text"
                    required
                    placeholder="Número de Pasaporte o DNI"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1c1c]">Nacionalidad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Peruana, Española, Chilena"
                    className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method Selector */}
            <section className="flex flex-col gap-4 bg-[#f7f7f7] p-6 rounded-3xl border border-gray-200">
              <h2 className="text-lg font-bold text-[#1c1c1c] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff681a]" />
                Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#ff681a] bg-white shadow-md"
                      : "border-gray-200 bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-sm text-[#1c1c1c]">Tarjeta Crédito / Débito</div>
                  <span className="text-xs text-gray-400">Visa, Mastercard, AMEX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-[#ff681a] bg-white shadow-md"
                      : "border-gray-200 bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-sm text-[#1c1c1c]">PayPal</div>
                  <span className="text-xs text-gray-400">Pago rápido y seguro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                    paymentMethod === "transfer"
                      ? "border-[#ff681a] bg-white shadow-md"
                      : "border-gray-200 bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-sm text-[#1c1c1c]">Transferencia / Yape</div>
                  <span className="text-xs text-gray-400">Bancos de Perú</span>
                </button>
              </div>

              {/* Card Payment Inputs */}
              {paymentMethod === "card" && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1c1c1c]">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="bg-[#f7f7f7] border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1c1c1c]">Expiración (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="bg-[#f7f7f7] border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#1c1c1c]">CVC / CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="bg-[#f7f7f7] border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Summary Sidebar (Right Col) */}
          <aside className="lg:col-span-1">
            <div className="bg-[#111330] text-white rounded-3xl p-6 flex flex-col gap-6 sticky top-24 shadow-xl">
              <h3 className="font-bold text-lg text-white border-b border-white/10 pb-3">
                Resumen de la Orden
              </h3>

              <div className="flex flex-col gap-3 text-sm text-gray-300">
                <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
                  <span className="font-bold text-white text-base">
                    Machu Picchu Full Day en Tren
                  </span>
                  <span className="text-xs text-gray-400">📅 15 Sept | 2 Pasajeros</span>
                  <span className="text-right text-[#ff681a] font-bold">$598 USD</span>
                </div>

                <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
                  <span className="font-bold text-white text-base">
                    Tour Laguna Humantay
                  </span>
                  <span className="text-xs text-gray-400">📅 17 Sept | 2 Pasajeros</span>
                  <span className="text-right text-[#ff681a] font-bold">$90 USD</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 text-[#ff681a] text-xl font-extrabold">
                  <span className="text-white text-base">Total Final</span>
                  <span>$688 USD</span>
                </div>
              </div>

              <Button variant="primary" size="lg" type="submit" className="w-full flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pagar $688 USD</span>
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#37d4d9]" />
                <span>Transacción Segura 256-bit SSL</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
