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

  const body = (await request.json()) as { src?: string; poster?: string; kind?: string; clear?: boolean };
  if (body.clear) {
    return NextResponse.json({ success: true, hero: saveHomeHero({ kind: "image", src: "", poster: "" }) });
  }

  const src = typeof body.src === "string" ? body.src.trim() : getHomeHero().src;
  const poster = typeof body.poster === "string" ? body.poster.trim() : getHomeHero().poster;
  const kind = body.kind === "image" || body.kind === "video" ? body.kind : heroKindFromSrc(src);

  return NextResponse.json({
    success: true,
    hero: saveHomeHero({ kind, src, poster }),
  });
}
