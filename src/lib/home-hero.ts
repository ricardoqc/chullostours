import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export type HomeHeroKind = "image" | "video";
export type HomeHeroSlide = { src: string; alt?: string };

export type HomeHeroConfig = {
  kind: HomeHeroKind;
  src: string;
  poster: string;
  slides: HomeHeroSlide[];
};

const DEFAULT_HERO: HomeHeroConfig = {
  kind: "image",
  src: "",
  poster: "",
  slides: [],
};

const HERO_FILE = path.join(process.cwd(), "data", "home-hero.json");

function isHeroKind(value: unknown): value is HomeHeroKind {
  return value === "image" || value === "video";
}

function sanitizeSlides(value: unknown): HomeHeroSlide[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const src = typeof item?.src === "string" ? item.src.trim() : "";
      const alt = typeof item?.alt === "string" ? item.alt.trim() : "";
      if (!src) return null;
      return alt ? { src, alt } : { src };
    })
    .filter((item): item is HomeHeroSlide => Boolean(item));
}

export function getHomeHero(): HomeHeroConfig {
  try {
    if (!fs.existsSync(HERO_FILE)) return DEFAULT_HERO;
    const parsed = JSON.parse(fs.readFileSync(HERO_FILE, "utf-8")) as Partial<HomeHeroConfig>;
    const legacySlides =
      typeof parsed.src === "string" && parsed.src.trim() && !/\.(mp4|webm)(\?|$)/i.test(parsed.src)
        ? [{ src: parsed.src.trim() }]
        : [];
    const parsedSlides = sanitizeSlides(parsed.slides);
    return {
      kind: isHeroKind(parsed.kind) ? parsed.kind : "image",
      src: typeof parsed.src === "string" ? parsed.src.trim() : "",
      poster: typeof parsed.poster === "string" ? parsed.poster.trim() : "",
      slides: parsedSlides.length > 0 ? parsedSlides : legacySlides,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

export function saveHomeHero(next: HomeHeroConfig) {
  const payload: HomeHeroConfig = {
    kind: isHeroKind(next.kind) ? next.kind : "image",
    src: next.src.trim(),
    poster: next.poster.trim(),
    slides: sanitizeSlides(next.slides),
  };
  const dir = path.dirname(HERO_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tempPath = `${HERO_FILE}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, HERO_FILE);
  revalidatePath("/");
  revalidatePath("/", "layout");
  return payload;
}

export function heroKindFromSrc(src: string): HomeHeroKind {
  return /\.(mp4|webm)(\?|$)/i.test(src) ? "video" : "image";
}
