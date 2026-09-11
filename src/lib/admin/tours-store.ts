import fs from "fs";
import path from "path";
import type { Tour } from "@/types/tour";
import { clearToursJsonCache } from "@/lib/data/tours-json";
import { applyDraftToTour, type TourDraft } from "@/lib/admin/tour-schema";
import { revalidateTourPages } from "@/lib/admin/revalidate";

export const TOURS_DIR = path.join(process.cwd(), "data", "tours");

export type AdminTourSummary = {
  file: string;
  slug: string;
  title: string;
  duration: string;
  price_usd: number;
  visible: boolean;
  image: string;
  destinations: string[];
};

export function getTourFiles(): string[] {
  if (!fs.existsSync(TOURS_DIR)) return [];
  return fs.readdirSync(TOURS_DIR).filter((file) => file.endsWith(".json") && file !== "rutas_migracion.json");
}

export function readTourFile(file: string): Tour {
  const fullPath = path.join(TOURS_DIR, file);
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as Tour;
}

export function findTourBySlug(slug: string): { file: string; tour: Tour } | null {
  for (const file of getTourFiles()) {
    const tour = readTourFile(file);
    if (tour.slug === slug) {
      return { file, tour };
    }
  }
  return null;
}

export function listAdminTours(): AdminTourSummary[] {
  const tours = getTourFiles().map((file) => {
    const data = readTourFile(file);
    return {
      file,
      slug: data.slug,
      title: data.titulo || data.slug,
      duration: data.atributos?.duracion || "1 Día",
      price_usd: data.precio_usd || data.precio || 0,
      visible: data.visible !== false,
      image: data.galeria?.[0]?.src || "/img/placeholder.jpg",
      destinations: data.destino_ids || [],
    };
  });

  tours.sort((a, b) => a.title.localeCompare(b.title, "es"));
  return tours;
}

export function writeTourFile(file: string, tour: Tour) {
  const fullPath = path.join(TOURS_DIR, file);
  const tempPath = `${fullPath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(tour, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, fullPath);
  clearToursJsonCache();
}

export function saveTourDraft(slug: string, draft: TourDraft) {
  const found = findTourBySlug(slug);
  if (!found) return null;

  const next = applyDraftToTour(found.tour, draft);
  writeTourFile(found.file, next);
  revalidateTourPages(slug);
  return { file: found.file, tour: next };
}

export function setTourVisibility(slug: string, visible: boolean) {
  const found = findTourBySlug(slug);
  if (!found) return null;

  found.tour.visible = visible;
  writeTourFile(found.file, found.tour);
  revalidateTourPages(slug);
  return { file: found.file, tour: found.tour };
}

export function duplicateTour(sourceSlug: string, nextSlug: string, titulo: string) {
  const found = findTourBySlug(sourceSlug);
  if (!found) return { error: "not_found" as const };
  if (findTourBySlug(nextSlug)) return { error: "slug_taken" as const };

  const copy: Tour = structuredClone(found.tour);
  copy.slug = nextSlug;
  copy.titulo = titulo;
  copy.visible = false;
  copy.url = `https://chullostours.com/tours/${nextSlug}/`;
  if (copy.metas) {
    copy.metas.og_title = titulo;
    copy.metas.og_url = copy.url;
  }
  if (copy.seo) {
    copy.seo.canonical = copy.url;
    if (copy.seo.open_graph) {
      copy.seo.open_graph.og_title = titulo;
      copy.seo.open_graph.og_url = copy.url;
    }
  }

  const file = `${nextSlug.replace(/-/g, "_")}.json`;
  writeTourFile(file, copy);
  revalidateTourPages(nextSlug);
  return { file, tour: copy };
}

export { listMediaForSlug, publicSrcExists } from "@/lib/admin/media-store";
