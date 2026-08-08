"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  travelers: number;
  pricePerPerson: number;
  imageUrl: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: "cart-1",
    slug: "machu-picchu-full-day-tren-expedition",
    title: "Machu Picchu Full Day en Tren Expedition",
    date: "2026-09-15",
    travelers: 2,
    pricePerPerson: 299,
    imageUrl:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cart-2",
    slug: "laguna-humantay-tour-cusco",
    title: "Tour Laguna Humantay & Paisajes del Salkantay",
    date: "2026-09-17",
    travelers: 2,
    pricePerPerson: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.pricePerPerson * item.travelers,
    0
  );
  const finalTotal = Math.max(0, subtotal - discount);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toUpperCase() === "CHULLOS10") {
      setDiscount(subtotal * 0.1);
    } else {
      alert("Cupón inválido. Prueba con CHULLOS10");
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-16 bg-white min-h-[70vh]">
      {/* Header Banner */}
      <div className="bg-[#111330] py-12 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#ff681a] text-xs font-bold uppercase tracking-widest">
            Tu Reserva
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Carrito de Compras
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        {items.length === 0 ? (
          <div className="bg-[#f7f7f7] rounded-3xl p-16 text-center flex flex-col items-center gap-4 my-8">
            <ShoppingBag className="w-16 h-16 text-[#ff681a]" />
            <h2 className="text-2xl font-bold text-[#1c1c1c]">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              Explora nuestro catálogo de tours en Cusco y añade tus experiencias favoritas.
            </p>
            <Link href="/tours">
              <Button variant="primary" size="lg" className="mt-2">
                Explorar Tours
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List (Left Col) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-[#1c1c1c]">
                Tours Seleccionados ({items.length})
              </h2>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full sm:w-28 h-24 object-cover rounded-xl shrink-0"
                    />

                    <div className="flex flex-col flex-grow gap-1 text-center sm:text-left">
                      <Link href={`/tours/${item.slug}`}>
                        <h3 className="font-bold text-[#1c1c1c] text-base hover:text-[#ff681a] transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="text-xs text-gray-500 flex flex-wrap justify-center sm:justify-start gap-4">
                        <span>📅 Fecha: {item.date}</span>
                        <span>👥 Pasajeros: {item.travelers}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-3 shrink-0 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total</span>
                        <span className="text-lg font-extrabold text-[#ff681a]">
                          ${item.pricePerPerson * item.travelers} USD
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Eliminar tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form
                onSubmit={handleApplyCoupon}
                className="bg-[#f7f7f7] p-4 rounded-2xl flex items-center gap-3 border border-gray-100 mt-2"
              >
                <Tag className="w-5 h-5 text-[#ff681a] shrink-0" />
                <input
                  type="text"
                  placeholder="Código de cupón (ej: CHULLOS10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#ff681a] w-full"
                />
                <Button variant="navy" size="sm" type="submit" className="shrink-0">
                  Aplicar
                </Button>
              </form>
            </div>

            {/* Cart Summary Sidebar (Right Col) */}
            <aside className="lg:col-span-1">
              <div className="bg-[#f7f7f7] rounded-3xl p-6 border border-gray-200 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-[#1c1c1c] border-b border-gray-200 pb-3">
                  Resumen de Compra
                </h3>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1c1c1c]">
                      ${subtotal} USD
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Descuento (10%)</span>
                      <span className="font-semibold">-${discount.toFixed(2)} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos y tasas</span>
                    <span className="font-semibold text-emerald-600">Incluidos</span>
                  </div>

                  <div className="flex justify-between text-lg font-extrabold text-[#1c1c1c] pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#ff681a]">${finalTotal.toFixed(2)} USD</span>
                  </div>
                </div>

                <Link href="/finalizar-compra">
                  <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span>Procesar Pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pago 100% Encriptado y Seguro</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
