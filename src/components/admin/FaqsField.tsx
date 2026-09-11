"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TourDraft } from "@/lib/admin/tour-schema";

type FaqsFieldProps = {
  faqs: TourDraft["faqs"];
  onChange: (faqs: TourDraft["faqs"]) => void;
};

export function FaqsField({ faqs, onChange }: FaqsFieldProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-slate-800">Preguntas frecuentes</legend>
      {faqs.map((faq, index) => (
        <article key={`faq-${index}`} className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900">FAQ {index + 1}</h3>
            <button type="button" onClick={() => onChange(faqs.filter((_, i) => i !== index))} className="admin-ghost-btn hover:text-red-600">
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Quitar
            </button>
          </div>
          <div className="admin-field">
            <label htmlFor={`faq-q-${index}`} className="admin-label">
              Pregunta
            </label>
            <input
              id={`faq-q-${index}`}
              name={`faqs[${index}].pregunta`}
              type="text"
              required
              value={faq.pregunta}
              onChange={(event) =>
                onChange(faqs.map((item, i) => (i === index ? { ...item, pregunta: event.target.value } : item)))
              }
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label htmlFor={`faq-a-${index}`} className="admin-label">
              Respuesta
            </label>
            <textarea
              id={`faq-a-${index}`}
              name={`faqs[${index}].respuesta`}
              rows={4}
              required
              value={faq.respuesta}
              onChange={(event) =>
                onChange(faqs.map((item, i) => (i === index ? { ...item, respuesta: event.target.value } : item)))
              }
              className="admin-input"
            />
          </div>
        </article>
      ))}
      <button
        type="button"
        onClick={() => onChange([...faqs, { pregunta: "", respuesta: "" }])}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar FAQ
      </button>
    </fieldset>
  );
}
