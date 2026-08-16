"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  items: FAQItem[];
  title?: string;
}

export function BlogFAQ({ items, title = "Preguntas Frecuentes (FAQs)" }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <div className="my-10 bg-gray-50 border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2.5 text-[#6b0014] font-extrabold text-xl md:text-2xl mb-6 pb-3 border-b border-gray-200">
        <HelpCircle className="w-6 h-6 text-[#ffc000]" />
        <h2>{title}</h2>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full py-4 px-5 text-left font-bold text-gray-900 flex items-center justify-between gap-4 hover:text-[#6b0014] transition-colors"
              >
                <span className="text-sm md:text-base">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#6b0014] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-amber-50/20">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
