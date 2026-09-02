"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import type { ResolvedMapStop } from "@/lib/places";
import "leaflet/dist/leaflet.css";

function markerIcon(stop: ResolvedMapStop) {
  const label = stop.marker === "airport" ? "✈" : String(stop.order);
  return L.divIcon({
    className: "leaflet-chullos-marker",
    html: `<div class="leaflet-chullos-pin-wrap"><span class="leaflet-chullos-pin"><span class="leaflet-chullos-pin-text">${label}</span></span><span class="leaflet-chullos-label">${stop.title}</span></div>`,
    iconSize: [36, 56],
    iconAnchor: [18, 48],
  });
}

interface LeafletTourMapProps {
  stops: ResolvedMapStop[];
  expanded?: boolean;
  mapKey?: string;
  onSelect: (stop: ResolvedMapStop) => void;
}

export function LeafletTourMap({
  stops,
  expanded = false,
  mapKey = "default",
  onSelect,
}: LeafletTourMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || stops.length === 0) return;

    const map = L.map(el, {
      scrollWheelZoom: expanded,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const points = stops.map((s) => L.latLng(s.lat, s.lng));

    if (points.length > 1) {
      L.polyline(points, {
        color: "#6b0014",
        weight: 4,
        dashArray: "10 8",
        opacity: 0.9,
      }).addTo(map);
    }

    stops.forEach((stop) => {
      L.marker([stop.lat, stop.lng], { icon: markerIcon(stop) })
        .addTo(map)
        .on("click", () => onSelectRef.current(stop));
    });

    const fit = () => {
      map.invalidateSize();
      if (points.length === 1) {
        map.setView(points[0], 11);
        return;
      }
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
    };

    fit();
    const t1 = window.setTimeout(fit, 80);
    const t2 = window.setTimeout(fit, 400);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.invalidateSize())
        : null;
    observer?.observe(el);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer?.disconnect();
      map.remove();
    };
  }, [stops, expanded, mapKey]);

  if (stops.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
        Sin puntos en el mapa
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="leaflet-tour-map h-full w-full rounded-2xl"
      data-map-key={mapKey}
    />
  );
}
