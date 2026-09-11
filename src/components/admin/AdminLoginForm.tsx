"use client";

import { useState } from "react";
import { AlertCircle, Lock, RefreshCw } from "lucide-react";

type AdminLoginFormProps = {
  onSuccess: () => void;
};

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Clave administrativa incorrecta.");
        return;
      }
      onSuccess();
    } catch {
      setErrorMsg("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-title">CMS de Tours</h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Ingresa la clave de administración para editar tours, detalles e imágenes.
          </p>
        </div>

        <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-4" noValidate>
          <div className="admin-field">
            <label htmlFor="admin-key" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clave administrativa
            </label>
            <p id="admin-key-hint" className="text-[11px] text-slate-500 mb-1.5">
              La clave no se guarda en el navegador; se usa una sesión segura.
            </p>
            <input
              id="admin-key"
              name="admin-key"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Clave de administrador"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              aria-describedby="admin-key-hint"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6b0014] text-sm min-h-12"
              autoFocus
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-12 bg-[#6b0014] hover:bg-[#850019] text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-900/10"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> : "Acceder al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
