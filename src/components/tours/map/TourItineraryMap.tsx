"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { X, Maximize2 } from "lucide-react";
import type { Tour } from "@/types/tour";
import { resolveTourMapStops, type ResolvedMapStop } from "@/lib/places";
import { TourImage } from "@/components/ui/TourImage";

const LeafletTourMap = dynamic(
  () => import("./LeafletTourMap").then((m) => m.LeafletTourMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[320px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-500">
        Cargando mapa…
      </div>
    ),
  }
);

interface TourItineraryMapProps {
  tour: Tour;
}

export function TourItineraryMap({ tour }: TourItineraryMapProps) {
  const [selected, setSelected] = useState<ResolvedMapStop | null>(null);
  const [expanded, setExpanded] = useState(false);

  const stops = useMemo(() => resolveTourMapStops(tour), [tour]);

  if (stops.length === 0) return null;

  return (
    <section id="mapa-ruta" className="flex flex-col gap-4 scroll-mt-20 md:scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6b0014]">
            Ruta del viaje
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 font-title">
            Lugares que visitarás
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] border border-[#6b0014]/20 rounded-full px-3 py-1.5 hover:bg-[#6b0014]/5"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Ampliar mapa
        </button>
      </div>

      <div className="relative z-0 h-[320px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        <LeafletTourMap
          mapKey={`inline-${tour.slug}`}
          stops={stops}
          onSelect={(stop) => setSelected(stop)}
        />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[9998] bg-black/55 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 w-full bg-slate-100">
              <TourImage
                src={selected.image}
                alt={selected.title}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="text-lg font-black text-[#6b0014] font-title">{selected.title}</h3>
              {selected.dia ? (
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Día {selected.dia} · Parada {selected.order}
                </span>
              ) : null}
              <p className="text-sm text-slate-700">{selected.summary}</p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-2 text-sm font-bold text-[#6b0014]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 z-[9997] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-5xl p-4 flex flex-col gap-3 max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between shrink-0">
              <h3 className="font-bold text-slate-900">Mapa ampliado — {tour.titulo}</h3>
              <button type="button" onClick={() => setExpanded(false)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative h-[min(70dvh,520px)] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <LeafletTourMap
                mapKey={`expanded-${tour.slug}`}
                stops={stops}
                expanded
                onSelect={(stop) => setSelected(stop)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
