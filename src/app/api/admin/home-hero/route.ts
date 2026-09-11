import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getHomeHero, heroKindFromSrc, saveHomeHero } from "@/lib/home-hero";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ success: true, hero: getHomeHero() });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const current = getHomeHero();
  const body = (await request.json()) as {
    src?: string;
    poster?: string;
    kind?: string;
    clear?: boolean;
    slides?: Array<{ src?: string; alt?: string }>;
  };
  if (body.clear) {
    return NextResponse.json({
      success: true,
      hero: saveHomeHero({ kind: "image", src: "", poster: "", slides: [] }),
    });
  }

  const src = typeof body.src === "string" ? body.src.trim() : current.src;
  const poster = typeof body.poster === "string" ? body.poster.trim() : current.poster;
  const kind = body.kind === "image" || body.kind === "video" ? body.kind : heroKindFromSrc(src);
  const slides = Array.isArray(body.slides)
    ? body.slides
        .map((slide) => ({
          src: typeof slide?.src === "string" ? slide.src.trim() : "",
          alt: typeof slide?.alt === "string" ? slide.alt.trim() : "",
        }))
        .filter((slide) => Boolean(slide.src))
    : current.slides;

  return NextResponse.json({
    success: true,
    hero: saveHomeHero({ kind, src, poster, slides }),
  });
}
