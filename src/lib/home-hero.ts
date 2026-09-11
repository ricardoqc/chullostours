import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export type HomeHeroKind = "image" | "video";

export type HomeHeroConfig = {
  kind: HomeHeroKind;
  src: string;
  poster: string;
};

const DEFAULT_HERO: HomeHeroConfig = {
  kind: "image",
  src: "",
  poster: "",
};

const HERO_FILE = path.join(process.cwd(), "data", "home-hero.json");

function isHeroKind(value: unknown): value is HomeHeroKind {
  return value === "image" || value === "video";
}

export function getHomeHero(): HomeHeroConfig {
  try {
    if (!fs.existsSync(HERO_FILE)) return DEFAULT_HERO;
    const parsed = JSON.parse(fs.readFileSync(HERO_FILE, "utf-8")) as Partial<HomeHeroConfig>;
    return {
      kind: isHeroKind(parsed.kind) ? parsed.kind : "image",
      src: typeof parsed.src === "string" ? parsed.src.trim() : "",
      poster: typeof parsed.poster === "string" ? parsed.poster.trim() : "",
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
  };
  const dir = path.dirname(HERO_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tempPath = `${HERO_FILE}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, HERO_FILE);
  revalidatePath("/");
  return payload;
}

export function heroKindFromSrc(src: string): HomeHeroKind {
  return /\.(mp4|webm)(\?|$)/i.test(src) ? "video" : "image";
}
