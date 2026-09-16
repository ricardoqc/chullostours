"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { adminApi } from "@/lib/admin/api";
import type { BlogDraft } from "@/lib/admin/blog-schema";

type BlogEditorPageProps = {
  slug: string;
};

export function BlogEditorPage({ slug }: BlogEditorPageProps) {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [file, setFile] = useState("");
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadPost = async () => {
    setErrorMsg("");
    const res = await fetch(adminApi(`/api/admin/blogs/${encodeURIComponent(slug)}`));
    if (res.status === 401) {
      setAuth("login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || "No se pudo cargar el post.");
      setAuth("ok");
      return;
    }
    setFile(data.file);
    setDraft(data.draft);
    setAuth("ok");
  };

  useEffect(() => {
    loadPost().catch(() => {
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
    return <AdminLoginForm onSuccess={loadPost} />;
  }

  return (
    <AdminShell wide>
      <div className="mb-2">
        <Link href="/admin/blog/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#6b0014]">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Volver al listado
        </Link>
      </div>
      {errorMsg ? <p className="text-sm text-red-600 mb-4">{errorMsg}</p> : null}
      {draft ? <BlogEditor slug={slug} file={file} initialDraft={draft} /> : null}
    </AdminShell>
  );
}
