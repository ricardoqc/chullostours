"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { TourEditor } from "@/components/admin/TourEditor";
import type { TourDraft } from "@/lib/admin/tour-schema";

type TourEditorPageProps = {
  slug: string;
};

export function TourEditorPage({ slug }: TourEditorPageProps) {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [file, setFile] = useState("");
  const [draft, setDraft] = useState<TourDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadTour = async () => {
    setErrorMsg("");
    const res = await fetch(`/api/admin/tours/${encodeURIComponent(slug)}`);
    if (res.status === 401) {
      setAuth("login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || "No se pudo cargar el tour.");
      setAuth("ok");
      return;
    }
    setFile(data.file);
    setDraft(data.draft);
    setAuth("ok");
  };

  useEffect(() => {
    loadTour().catch(() => {
      setErrorMsg("Error al conectar con el servidor.");
      setAuth("login");
    });
  }, [slug]);

  if (auth === "checking") {
    return (
      <div className="min-h-[50vh] grid place-items-center text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
        <span className="sr-only">Cargando editor</span>
      </div>
    );
  }

  if (auth === "login") {
    return <AdminLoginForm onSuccess={loadTour} />;
  }

  return (
    <AdminShell>
      <Link href="/admin/tours/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#6b0014]">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Volver al catálogo
      </Link>
      {errorMsg && <p className="text-sm text-red-700">{errorMsg}</p>}
      {draft && <TourEditor slug={slug} file={file} initialDraft={draft} />}
    </AdminShell>
  );
}
