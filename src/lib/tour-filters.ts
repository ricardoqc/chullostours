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
  { id: 'cusco', label: 'Cusco & Alrededores', iconName: 'Mountain' },
  { id: 'machu-picchu', label: 'Machu Picchu', iconName: 'Landmark' },
  { id: 'valle-sagrado', label: 'Valle Sagrado', iconName: 'Trees' },
  { id: 'puno', label: 'Puno & Titicaca', iconName: 'Waves' },
  { id: 'lima', label: 'Lima & Costa', iconName: 'Sun' },
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
  if (tour.destino_ids && tour.destino_ids.length > 0) {
    if (tour.destino_ids.includes('puno') || tour.destino_ids.includes('lago-titicaca')) return 'puno';
    if (tour.destino_ids.includes('lima')) return 'lima';
    return 'cusco';
  }

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

/** True if tour matches a destination filter id (supports fine-grained ids). */
export function tourMatchesDestination(tour: Tour, destinationId: string): boolean {
  if (!destinationId || destinationId === 'all') return true;
  const ids = tour.destino_ids || [];
  if (ids.includes(destinationId)) return true;

  // Alias map for home / legacy links
  const aliases: Record<string, string[]> = {
    'cusco-ciudad': ['cusco', 'cusco-ciudad'],
    cusco: ['cusco', 'cusco-ciudad', 'machu-picchu', 'valle-sagrado'],
    'machu-picchu': ['machu-picchu'],
    'valle-sagrado': ['valle-sagrado'],
    'lago-titicaca': ['lago-titicaca', 'puno'],
    puno: ['puno', 'lago-titicaca'],
    lima: ['lima'],
  };

  const expanded = aliases[destinationId] || [destinationId];
  if (ids.some((id) => expanded.includes(id))) return true;

  // Fallback for tours without destino_ids
  return getTourDestination(tour) === destinationId ||
    (destinationId === 'cusco-ciudad' && getTourDestination(tour) === 'cusco') ||
    (destinationId === 'machu-picchu' && tour.slug.toLowerCase().includes('machu')) ||
    (destinationId === 'valle-sagrado' && tour.slug.toLowerCase().includes('valle-sagrado')) ||
    (destinationId === 'lago-titicaca' && getTourDestination(tour) === 'puno');
}

export function estimateTourPrice(tour: Tour): number {
  // Prefer explicit JSON pricing via shared pricing module pattern
  if (typeof tour.precio_usd === 'number' && tour.precio_usd > 0) {
    return tour.precio_usd;
  }
  if (typeof tour.precio === 'number' && tour.precio > 0) {
    return tour.precio;
  }

  if (tour.opciones_hotel && tour.opciones_hotel.length > 0) {
    const minHotel = Math.min(...tour.opciones_hotel.map((h) => h.precio_usd).filter((n) => n > 0));
    if (minHotel > 0 && Number.isFinite(minHotel)) return minHotel;
  }

  if (tour.seo_schema && Array.isArray(tour.seo_schema['@graph'])) {
    const prod = tour.seo_schema['@graph'].find((g: { '@type'?: string }) => g && g['@type'] === 'Product') as
      | { offers?: { price?: string | number } }
      | undefined;
    if (prod?.offers?.price != null) {
      const parsed = parseFloat(String(prod.offers.price));
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return 0;
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

  // Familiar (Family friendly routes)
  if (
    slug.includes('city-tour') ||
    slug.includes('valle-sagrado') ||
    slug.includes('valle-sur') ||
    slug.includes('machu-picchu') ||
    slug.includes('magico') ||
    slug.includes('titicaca') ||
    slug.includes('tren') ||
    days >= 2 ||
    categoria.includes('cultural') ||
    categoria.includes('tradicional')
  ) {
    tags.push('familiar');
  }

  // Parejas / Romance (Magical couples experiences)
  if (
    slug.includes('magico') ||
    slug.includes('machu-picchu') ||
    slug.includes('valle-sagrado') ||
    slug.includes('tren') ||
    slug.includes('vistadome') ||
    slug.includes('titicaca') ||
    slug.includes('humantay') ||
    days >= 3
  ) {
    tags.push('pareja');
  }

  return tags;
}

