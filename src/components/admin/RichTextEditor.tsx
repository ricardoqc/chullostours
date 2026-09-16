"use client";

import { useEffect, useState } from "react";
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
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  slug: string;
  /** Upload folder under /media (default blog/{slug}). */
  mediaFolder?: string;
};

export function RichTextEditor({ value, onChange, slug, mediaFolder }: RichTextEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const folder = mediaFolder || `blog/${slug}`;

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

  if (!editor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Cargando editor…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("heading", { level: 2 }) ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" aria-hidden="true" />
          H2
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("heading", { level: 3 }) ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" aria-hidden="true" />
          H3
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("bold") ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("italic") ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("bulletList") ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("orderedList") ? "border-slate-900 text-slate-900" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`admin-ghost-btn ${editor.isActive("blockquote") ? "border-slate-900 text-slate-900" : ""}`}
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
        <button type="button" className="admin-ghost-btn" onClick={() => setPickerOpen(true)}>
          <ImagePlus className="w-4 h-4" aria-hidden="true" />
          Imagen
        </button>
        <button
          type="button"
          className="admin-ghost-btn"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="admin-ghost-btn"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <EditorContent editor={editor} />

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple
        title="Insertar imágenes en el contenido"
        initialFolder={folder.split("/")[0] || "library"}
        uploadFolder={folder}
        onSelect={(files) => {
          let chain = editor.chain().focus();
          for (const file of files) {
            chain = chain.setImage({ src: file.src, alt: file.name });
          }
          chain.run();
        }}
      />
    </div>
  );
}
