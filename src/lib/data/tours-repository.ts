import {
  readAllToursFromJson,
  readTourBySlugFromJson,
} from "@/lib/data/tours-json";
import { isTourPublished } from "@/lib/tour-inclusions";
import type { Tour } from "@/types/tour";

/**
 * Data-access contract for tours.
 * Today: local JSON files via tours-json.
 * Tomorrow: swap implementation for Strapi / Directus / Postgres without changing UI.
 */
export interface ToursRepository {
  getAll(): Tour[];
  getBySlug(slug: string): Tour | null;
  getDestinations(): { id: string; label: string }[];
}

const jsonRepository: ToursRepository = {
  getAll() {
    return readAllToursFromJson().filter(isTourPublished);
  },
  getBySlug(slug: string) {
    const tour = readTourBySlugFromJson(slug);
    if (!tour || !isTourPublished(tour)) return null;
    return tour;
  },
  getDestinations() {
    const set = new Map<string, string>();
    const labels: Record<string, string> = {
      cusco: "Cusco & Alrededores",
      "cusco-ciudad": "Cusco Ciudad",
      "machu-picchu": "Machu Picchu",
      "valle-sagrado": "Valle Sagrado",
      puno: "Puno",
      "lago-titicaca": "Lago Titicaca",
      lima: "Lima & Costa",
    };
    for (const tour of readAllToursFromJson().filter(isTourPublished)) {
      for (const id of tour.destino_ids || []) {
        set.set(id, labels[id] || id);
      }
    }
    return [...set.entries()].map(([id, label]) => ({ id, label }));
  },
};

/** Active repository — change this when migrating to CMS/DB */
export const toursRepository: ToursRepository = jsonRepository;

export function getAllTours(): Tour[] {
  return toursRepository.getAll();
}

/** All tours including hidden (admin, redirects, legacy slugs) */
export function getAllToursRaw(): Tour[] {
  return readAllToursFromJson();
}

export function getPublishedTours(): Tour[] {
  return getAllTours();
}

export function getTourBySlug(slug: string): Tour | null {
  return toursRepository.getBySlug(slug);
}

export function getDestinations() {
  return toursRepository.getDestinations();
}
