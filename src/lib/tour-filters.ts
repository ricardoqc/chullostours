import { Tour } from '@/types/tour';

export interface TravelerProfile {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export interface DestinationFilter {
  id: string;
  label: string;
  iconName: string;
}

export const DESTINATION_FILTERS: DestinationFilter[] = [
  { id: 'all', label: 'Todos los Destinos', iconName: 'Globe' },
  { id: 'cusco', label: 'Cusco & Machu Picchu', iconName: 'Mountain' },
  { id: 'puno', label: 'Puno & Titicaca', iconName: 'Waves' },
  { id: 'lima', label: 'Lima & Ica (Costa)', iconName: 'Sun' },
];

export const TRAVELER_PROFILES: TravelerProfile[] = [
  {
    id: 'adventurer',
    label: 'Aventurero',
    iconName: 'Footprints',
    description: 'Trekking y caminatas de alta montaña',
  },
  {
    id: 'history',
    label: 'Historia & Cultura',
    iconName: 'Landmark',
    description: 'Ruinas incas, ciudadelas y patrimonio',
  },
  {
    id: 'train',
    label: 'Experiencia en Tren',
    iconName: 'Train',
    description: 'Rutas panorámicas en tren a Machu Picchu',
  },
  {
    id: 'multiday',
    label: 'Paquetes Varios Días',
    iconName: 'CalendarDays',
    description: 'Circuitos de varios días con todo incluido',
  },
  {
    id: 'adrenaline',
    label: 'Adrenalina & Motor',
    iconName: 'Zap',
    description: 'Cuatrimotos, buggies y actividades extremas',
  },
  {
    id: 'nature',
    label: 'Naturaleza & Lagos',
    iconName: 'Trees',
    description: 'Lagunas turquesas, valles e islas',
  },
  {
    id: 'mystic',
    label: 'Místico & Vivencial',
    iconName: 'Sparkles',
    description: 'Experiencias místicas y turismo vivencial',
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

export function getTourDestination(tour: Tour): string {
  const slug = tour.slug.toLowerCase();
  const location = (tour.atributos?.ubicacion || '').toLowerCase();
  const categoria = (tour.categoria || '').toLowerCase();

  if (
    slug.includes('puno') ||
    slug.includes('titicaca') ||
    slug.includes('uros') ||
    slug.includes('taquile') ||
    slug.includes('amantani') ||
    location.includes('puno') ||
    categoria.includes('puno')
  ) {
    return 'puno';
  }

  if (
    slug.includes('lima') ||
    slug.includes('huacachina') ||
    slug.includes('ballestas') ||
    slug.includes('ica') ||
    slug.includes('paracas') ||
    location.includes('lima') ||
    location.includes('ica') ||
    location.includes('paracas') ||
    categoria.includes('lima') ||
    categoria.includes('ica')
  ) {
    return 'lima';
  }

  return 'cusco';
}

export function estimateTourPrice(tour: Tour): number {
  if (typeof tour.precio_usd === 'number' && tour.precio_usd > 0) {
    return tour.precio_usd;
  }
  if (typeof tour.precio === 'number' && tour.precio > 0) {
    return tour.precio;
  }

  if (tour.seo_schema && Array.isArray(tour.seo_schema['@graph'])) {
    const prod = tour.seo_schema['@graph'].find((g: any) => g && g['@type'] === 'Product');
    if (prod && prod.offers && prod.offers.price) {
      const parsed = parseFloat(prod.offers.price);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

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
  if (slug.includes('cuatrimoto') || slug.includes('atv')) {
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
  const location = (tour.atributos?.ubicacion || '').toLowerCase();
  const categoria = (tour.categoria || '').toLowerCase();

  // Adventurer
  if (
    slug.includes('camino-inca') ||
    slug.includes('humantay') ||
    slug.includes('vinicunca') ||
    slug.includes('montana') ||
    slug.includes('quelccaya') ||
    slug.includes('waqrapukara') ||
    slug.includes('7-lagunas') ||
    slug.includes('ausangate') ||
    slug.includes('poc-poc') ||
    slug.includes('by-car') ||
    title.includes('trekking') ||
    title.includes('caminata') ||
    categoria.includes('trekking')
  ) {
    tags.push('adventurer');
  }

  // History & Culture
  if (
    slug.includes('machu-picchu') ||
    slug.includes('machupicchu') ||
    slug.includes('city-tour') ||
    slug.includes('valle-sagrado') ||
    slug.includes('valle-sur') ||
    slug.includes('tipon') ||
    slug.includes('pikillacta') ||
    slug.includes('andahuaylillas') ||
    slug.includes('qeswachaka') ||
    slug.includes('lima-city-tour') ||
    slug.includes('cusco') ||
    categoria.includes('cultural') ||
    categoria.includes('tradicional')
  ) {
    tags.push('history');
  }

  // Train Experience
  if (
    slug.includes('tren') ||
    title.includes('tren') ||
    title.includes('expedition') ||
    title.includes('vistadome') ||
    title.includes('observatory')
  ) {
    tags.push('train');
  }

  // Multi-day
  if (days > 1) {
    tags.push('multiday');
  }

  // Adrenaline
  if (
    slug.includes('cuatrimoto') ||
    slug.includes('atv') ||
    slug.includes('buggies') ||
    slug.includes('sandboarding') ||
    slug.includes('huacachina') ||
    slug.includes('by-car') ||
    title.includes('cuatrimoto') ||
    title.includes('aventura') ||
    categoria.includes('aventura')
  ) {
    tags.push('adrenaline');
  }

  // Nature
  if (
    slug.includes('humantay') ||
    slug.includes('titicaca') ||
    slug.includes('vinicunca') ||
    slug.includes('qeswachaka') ||
    slug.includes('quelccaya') ||
    slug.includes('7-lagunas') ||
    slug.includes('poc-poc') ||
    slug.includes('ballestas') ||
    slug.includes('huacachina') ||
    slug.includes('uros') ||
    slug.includes('taquile') ||
    slug.includes('amantani') ||
    categoria.includes('naturaleza')
  ) {
    tags.push('nature');
  }

  // Mystic & Experiential
  if (
    slug.includes('mistico') ||
    slug.includes('apukunyana') ||
    slug.includes('duendes') ||
    slug.includes('vivencial') ||
    slug.includes('amantani') ||
    slug.includes('morada-de-los-dioses') ||
    title.includes('místico') ||
    title.includes('vivencial')
  ) {
    tags.push('mystic');
  }

  return tags;
}

