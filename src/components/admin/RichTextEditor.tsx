"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { TourImage } from "@/components/ui/TourImage";
import { adminApi } from "@/lib/admin/api";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  slug: string;
};

type MediaFile = { src: string; name: string; folder?: string };

export function RichTextEditor({ value, onChange, slug }: RichTextEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#6b0014] underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full h-auto my-4" },
      }),
      Placeholder.configure({
        placeholder: "Escribe el artículo… Usa la barra para títulos, listas e imágenes.",
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] focus:outline-none px-4 py-3 text-sm leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const openImagePicker = () => {
    setUploadError("");
    fetch(adminApi("/api/admin/media?reusable=1"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.files)) setFiles(data.files);
      })
      .catch(() => undefined);
    dialogRef.current?.showModal();
  };

  const insertImage = (src: string, alt = "") => {
    editor?.chain().focus().setImage({ src, alt }).run();
    dialogRef.current?.close();
  };

  if (!editor) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Cargando editor…</div>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("heading", { level: 2 }) ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" aria-hidden="true" />
          H2
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("heading", { level: 3 }) ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" aria-hidden="true" />
          H3
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("bold") ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("italic") ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("bulletList") ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("orderedList") ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("blockquote") ? "border-[#6b0014] text-[#6b0014]" : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="admin-ghost-btn"
          onClick={() => {
            const url = window.prompt("URL del enlace:");
            if (!url) return;
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          <Link2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button type="button" className="admin-ghost-btn" onClick={openImagePicker}>
          <ImagePlus className="w-4 h-4" aria-hidden="true" />
          Imagen
        </button>
        <button type="button" className="admin-ghost-btn" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button type="button" className="admin-ghost-btn" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <EditorContent editor={editor} />

      <dialog ref={dialogRef} className="admin-dialog rounded-2xl p-0 w-[min(720px,calc(100vw-2rem))] backdrop:bg-black/40">
        <form method="dialog" className="p-5 space-y-4">
          <h3 className="text-lg font-black text-slate-900 font-title">Insertar imagen</h3>
          <div className="admin-field">
            <label htmlFor="rte-upload" className="admin-label">
              Subir a /media/blog/{slug}/ (o library)
            </label>
            <input
              id="rte-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="admin-input"
              disabled={uploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                setUploading(true);
                setUploadError("");
                try {
                  const body = new FormData();
                  body.set("folder", `blog/${slug}`);
                  body.set("file", file);
                  const res = await fetch(adminApi("/api/admin/media"), { method: "POST", body });
                  const data = await res.json();
                  if (!res.ok) {
                    setUploadError(data.error || "No se pudo subir.");
                    return;
                  }
                  insertImage(data.file.src, file.name);
                } catch {
                  setUploadError("Error de red.");
                } finally {
                  setUploading(false);
                }
              }}
            />
            {uploading ? <p className="text-xs text-slate-500">Subiendo…</p> : null}
            {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-auto">
            {files.map((file) => (
              <li key={file.src}>
                <button
                  type="button"
                  onClick={() => insertImage(file.src, file.name)}
                  className="w-full text-left rounded-xl border border-slate-200 overflow-hidden hover:border-[#6b0014]"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <TourImage src={file.src} alt={file.name} fill className="object-cover" sizes="160px" unprotected />
                  </div>
                  <span className="block p-2 text-[10px] font-mono truncate">{file.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="submit" className="admin-ghost-btn">
            Cerrar
          </button>
        </form>
      </dialog>
    </div>
  );
}
