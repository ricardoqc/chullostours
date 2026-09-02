import type { Tour } from "@/types/tour";

const ENTRADA_PATTERNS = [
  "ingreso",
  "entrada",
  "machu picchu",
  "boleto turístico",
  "boleto turistico",
  "entradas incluidas",
  "entradas e ingresos",
];

function matchesEntradaPattern(text: string): boolean {
  const lower = text.toLowerCase();
  return ENTRADA_PATTERNS.some((p) => lower.includes(p));
}

export function hasEntradasIncluidas(tour: Tour): boolean {
  if (tour.entradas_incluidas?.destacado === false) return false;
  if (tour.entradas_incluidas?.destacado === true) return true;
  if (tour.boleto_turistico?.incluido) return true;
  return (tour.incluye || []).some(matchesEntradaPattern);
}

export function getEntradasIncluidasCopy(tour: Tour): {
  titulo: string;
  detalle: string;
  variant: "emerald" | "gold" | "brand";
} {
  const custom = tour.entradas_incluidas;
  if (custom?.titulo || custom?.detalle) {
    return {
      titulo: custom.titulo || "Entradas incluidas",
      detalle:
        custom.detalle ||
        "Ingresos oficiales incluidos en el precio del tour o paquete.",
      variant: custom.variant || "gold",
    };
  }

  const incluyeEntradas = (tour.incluye || []).filter(matchesEntradaPattern);
  const hasMachu = incluyeEntradas.some((i) => i.toLowerCase().includes("machu"));
  const hasBtc = tour.boleto_turistico?.incluido;

  let detalle = "Ingresos oficiales incluidos en el precio.";
  if (hasMachu && hasBtc) {
    detalle = "Ingreso a Machu Picchu + Boleto Turístico General del Cusco (BTC).";
  } else if (hasMachu) {
    detalle = "Ingreso oficial a Machu Picchu incluido en el precio.";
  } else if (hasBtc) {
    detalle = "Boleto Turístico General del Cusco (BTC) incluido.";
  } else if (incluyeEntradas.length > 0) {
    detalle = incluyeEntradas[0];
  }

  return {
    titulo: "Entradas incluidas",
    detalle,
    variant: hasMachu ? "gold" : "emerald",
  };
}

export function isTourPublished(tour: Tour): boolean {
  return tour.visible !== false;
}
