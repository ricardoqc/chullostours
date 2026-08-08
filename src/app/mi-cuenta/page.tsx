"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Compass, History, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyAccountPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      <div className="bg-[#111330] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#37d4d9] text-xs font-bold uppercase tracking-widest">
            Área de Clientes
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-[#f7f7f7] p-8 rounded-3xl border border-gray-200 flex flex-col gap-6 shadow-sm">
          <div className="flex bg-gray-200 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-full transition-all ${
                isLogin ? "bg-[#ff681a] text-white shadow-sm" : "text-gray-600"
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-full transition-all ${
                !isLogin ? "bg-[#ff681a] text-white shadow-sm" : "text-gray-600"
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1c1c1c]">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1c1c1c]">Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1c1c1c]">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff681a]"
              />
            </div>

            <Button variant="primary" size="lg" className="w-full mt-2">
              {isLogin ? "Entrar a mi cuenta" : "Registrarme"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
