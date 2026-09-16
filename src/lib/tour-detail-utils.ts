import { Tour, TourImagen } from '@/types/tour';
import { parseDurationDays, estimateTourPrice } from './tour-filters';

export { parseDurationDays, estimateTourPrice };

/** Portada del tour: imagen_principal o primera de galería. */
export function getTourMainImage(tour: Tour): TourImagen | undefined {
  const items = tour.galeria || [];
  if (tour.imagen_principal) {
    const match = items.find((item) => item.src === tour.imagen_principal);
    if (match) return match;
    return {
      src: tour.imagen_principal,
      alt: `${tour.titulo} - imagen principal`,
    };
  }
  return items[0];
}

export function getTourMainImageSrc(tour: Tour, fallback?: string): string {
  return getTourMainImage(tour)?.src || fallback || "/img/placeholder.jpg";
}

/**
 * Filter out tracking pixels and tiny logo badges from tour gallery images.
 * Returns src URLs (legacy) — prefer getGalleryItems for alt text.
 */
export function getValidGalleryImages(tour: Tour): string[] {
  return getGalleryItems(tour).map((g) => g.src);
}

export function getGalleryItems(tour: Tour): TourImagen[] {
  if (!tour.galeria || tour.galeria.length === 0) {
    return [
      {
        src: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
        alt: `${tour.titulo} - vista principal`,
      },
      {
        src: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
        alt: `${tour.titulo} - paisaje`,
      },
      {
        src: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=800&q=80",
        alt: `${tour.titulo} - experiencia`,
      },
    ];
  }

  const valid = tour.galeria
    .filter((g) => {
      if (!g?.src) return false;
      const lower = g.src.toLowerCase();
      if (lower.includes("facebook.com/tr")) return false;
      if (lower.includes("elementor/thumbs/sunat")) return false;
      if (lower.includes("elementor/thumbs/mincetur")) return false;
      if (lower.includes("elementor/thumbs/esnna")) return false;
      if (lower.includes("elementor/thumbs/gercetur")) return false;
      if (lower.includes("90x80")) return false;
      return true;
    })
    .map((g, i) => ({
      src: g.src,
      alt: g.alt?.trim() || `${tour.titulo} - foto ${i + 1}`,
      caption: g.caption,
      credito: g.credito,
    }));

  if (valid.length === 0) {
    return [
      {
        src: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
        alt: `${tour.titulo} - vista principal`,
      },
    ];
  }

  // Portada explícita primero (cards, hero y OG)
  if (tour.imagen_principal) {
    const mainIdx = valid.findIndex((item) => item.src === tour.imagen_principal);
    if (mainIdx > 0) {
      const [main] = valid.splice(mainIdx, 1);
      valid.unshift(main);
    }
  }

  return valid;
}

export interface ParsedDay {
  dayNumber: number;
  title: string;
  items: string[];
}

/**
 * Parses itinerary directly from tour.itinerario array.
 */
export function parseMultiDayItinerary(tour: Tour): ParsedDay[] {
  // If tour has explicit itinerario array, use it directly!
  if (tour.itinerario && tour.itinerario.length > 0) {
    return tour.itinerario.map((item, idx) => {
      const rawItems = item.actividades || [];
      const cleanItems: string[] = rawItems
        .map((act) => {
          if (typeof act === 'string') return act;
          if (typeof act === 'object' && act !== null) {
            const desc = (act as { hora?: string; descripcion?: string }).descripcion || '';
            const hora = (act as { hora?: string; descripcion?: string }).hora;
            return hora ? `${hora}: ${desc}` : desc;
          }
          return '';
        })
        .filter((item): item is string => Boolean(item && item.length > 0));

      return {
        dayNumber: item.dia || idx + 1,
        title: item.titulo ? (item.titulo.startsWith("Día") ? item.titulo : `Día ${item.dia || idx + 1}: ${item.titulo}`) : `Día ${item.dia || idx + 1}`,
        items: cleanItems.length > 0 ? cleanItems : ["Recorrido guiado y actividades del día."],
      };
    });
  }

  const totalDays = parseDurationDays(tour.atributos?.duracion);
  const highlights = tour.destacados_highlights || [];
  const days: ParsedDay[] = [];

  const mainText = highlights.join('\n');
  const dayRegex = /(Día|Dia)\s*(\d+)\s*[:|-]\s*([^\n✅🛑📍]*)/gi;
  let match;
  const matches: { index: number; dayNum: number; title: string }[] = [];

  while ((match = dayRegex.exec(mainText)) !== null) {
    matches.push({
      index: match.index,
      dayNum: parseInt(match[2], 10),
      title: match[3].trim() || `Día ${match[2]}`,
    });
  }

  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const curr = matches[i];
      const nextIndex = i < matches.length - 1 ? matches[i + 1].index : mainText.length;
      const textChunk = mainText.substring(curr.index, nextIndex);

      const lines = textChunk
        .split(/\n|✅|🔹|📍|🛑/)
        .map((l) => l.trim())
        .filter((l) => l.length > 10 && !l.toLowerCase().startsWith('día') && !l.toLowerCase().startsWith('dia'));

      days.push({
        dayNumber: curr.dayNum || i + 1,
        title: curr.title || `Día ${i + 1}`,
        items: lines.slice(0, 8),
      });
    }
    return days;
  }

  // Fallback: create generic N days if multi-day
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      dayNumber: i,
      title: `Día ${i}: Actividades y Recorrido Guiado`,
      items: [
        `Desayuno e inicio de las actividades programadas para el Día ${i}.`,
        `Recorrido por los principales atractivos turísticos con nuestro guía profesional bilingüe.`,
        `Tiempo libre para tomar fotografías y disfrutar de la gastronomía andina local.`,
      ],
    });
  }

  return days;
}

/**
 * Filter out corrupt scraping items from recommendations list.
 */
export function cleanRecomendaciones(recs: string[] | undefined): string[] {
  if (!recs) return [];
  const blacklist = [
    "fecha y hora",
    "tipo de paquete",
    "transporte completo",
    "asistencia en ruta",
    "tickets incluidos",
    "mejora disponible",
  ];

  return recs.filter((r) => {
    if (!r || r.trim().length < 5) return false;
    const lower = r.trim().toLowerCase();
    return !blacklist.some((b) => lower === b);
  });
}

/**
 * Clean highlights array into bullet points
 */
export function cleanHighlights(highlights: string[] | undefined): string[] {
  if (!highlights) return [];
  const cleaned: string[] = [];

  for (const h of highlights) {
    if (!h) continue;

    const split = h.split(/✅|🔹|✔/);
    for (const item of split) {
      const trimmed = item
        .replace(/Galería.*?Cusco/gi, '')
        .replace(/¡Pide tu tour por WhatsApp!/gi, '')
        .replace(/Itinerario Inclusiones FAQs Recomendaciones Itinerario Inclusiones FAQs Recomendaciones Itinerario Expandir todo/gi, '')
        .trim();

      if (trimmed.length > 5 && trimmed.length < 250) {
        cleaned.push(trimmed);
      }
    }
  }

  return cleaned.slice(0, 6);
}

export function checkTourUpgrades(tourTitle: string, hasHotelOptions: boolean = false) {
  const titleLower = tourTitle.toLowerCase();

  const isTrekOrCamping =
    titleLower.includes("camino inca") ||
    titleLower.includes("ausangate") ||
    titleLower.includes("salkantay") ||
    titleLower.includes("humantay") ||
    titleLower.includes("vinicunca") ||
    titleLower.includes("colores") ||
    titleLower.includes("waqrapukara") ||
    titleLower.includes("quelccaya") ||
    titleLower.includes("choquequirao");

  const isByCar = titleLower.includes("by car");

  const isNonMachu =
    titleLower.includes("city tour") ||
    (titleLower.includes("valle sagrado") && !titleLower.includes("machu")) ||
    titleLower.includes("valle sur") ||
    titleLower.includes("morada de los dioses") ||
    titleLower.includes("maras moray") ||
    titleLower.includes("cuatrimoto") ||
    titleLower.includes("titicaca") ||
    titleLower.includes("puno") ||
    titleLower.includes("lima") ||
    titleLower.includes("huacachina") ||
    titleLower.includes("qeswachaka") ||
    titleLower.includes("poc poc");

  // Huayna Picchu add-on applies only to tours visiting Machu Picchu citadel
  const includesMachuPicchu =
    !isTrekOrCamping &&
    !isByCar &&
    !isNonMachu &&
    (titleLower.includes("machu") || hasHotelOptions);

  return { includesMachuPicchu };
}

