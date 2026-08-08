import { Tour } from '@/types/tour';

export interface TravelerProfile {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const TRAVELER_PROFILES: TravelerProfile[] = [
  {
    id: 'adventurer',
    label: 'Aventurero',
    emoji: '🏔️',
    description: 'Trekking y caminatas de alta montaña',
  },
  {
    id: 'history',
    label: 'Historia & Cultura',
    emoji: '🏛️',
    description: 'Ruinas incas, ciudadelas y patrimonio',
  },
  {
    id: 'train',
    label: 'Experiencia en Tren',
    emoji: '🚂',
    description: 'Rutas panorámicas en tren a Machu Picchu',
  },
  {
    id: 'multiday',
    label: 'Paquete Completo',
    emoji: '🏕️',
    description: 'Circuitos de varios días con todo incluido',
  },
  {
    id: 'adrenaline',
    label: 'Adrenalina & Motor',
    emoji: '🏍️',
    description: 'Cuatrimotos y actividades extremas',
  },
  {
    id: 'nature',
    label: 'Naturaleza & Lagos',
    emoji: '🌊',
    description: 'Lagunas turquesas, valles y paisajes',
  },
];

export function parseDurationDays(duracion: string | undefined): number {
  if (!duracion) return 1;
  const match = duracion.match(/(\d+)\s*(Día|Días|día|días)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 1;
}

export function estimateTourPrice(tour: Tour): number {
  const days = parseDurationDays(tour.atributos?.duracion);
  if (days >= 5) return 450;
  if (days >= 4) return 380;
  if (days >= 3) return 290;
  if (days >= 2) return 180;

  const slug = tour.slug.toLowerCase();
  if (slug.includes('machu-picchu') || slug.includes('machupicchu')) {
    return 299;
  }
  if (slug.includes('vinicunca') || slug.includes('humantay')) {
    return 45;
  }
  if (slug.includes('cuatrimoto')) {
    return 55;
  }
  if (slug.includes('city-tour')) {
    return 35;
  }
  return 65;
}

export function deriveExperienceTags(tour: Tour): string[] {
  const tags: string[] = [];
  const slug = tour.slug.toLowerCase();
  const title = tour.titulo.toLowerCase();
  const days = parseDurationDays(tour.atributos?.duracion);

  // Adventurer
  if (
    slug.includes('camino-inca') ||
    slug.includes('humantay') ||
    slug.includes('vinicunca') ||
    slug.includes('montana') ||
    title.includes('trekking') ||
    title.includes('caminata')
  ) {
    tags.push('adventurer');
  }

  // History & Culture
  if (
    slug.includes('machu-picchu') ||
    slug.includes('machupicchu') ||
    slug.includes('city-tour') ||
    slug.includes('valle-sagrado') ||
    slug.includes('cusco')
  ) {
    tags.push('history');
  }

  // Train Experience
  if (slug.includes('tren') || title.includes('tren') || title.includes('expedition') || title.includes('vistadome')) {
    tags.push('train');
  }

  // Multi-day
  if (days > 1) {
    tags.push('multiday');
  }

  // Adrenaline
  if (slug.includes('cuatrimoto') || title.includes('cuatrimoto') || title.includes('aventura')) {
    tags.push('adrenaline');
  }

  // Nature
  if (
    slug.includes('humantay') ||
    slug.includes('titicaca') ||
    slug.includes('vinicunca') ||
    slug.includes('qeswachaka')
  ) {
    tags.push('nature');
  }

  return tags;
}
