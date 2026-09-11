import type { HomeHeroConfig } from "@/lib/home-hero";
import { TourImage } from "@/components/ui/TourImage";

type HomeHeroMediaProps = {
  hero: HomeHeroConfig;
  fallbackSrc: string;
};

export function HomeHeroMedia({ hero, fallbackSrc }: HomeHeroMediaProps) {
  const isVideo = hero.kind === "video" && Boolean(hero.src);
  const imageSrc = isVideo ? hero.poster || fallbackSrc : hero.src || fallbackSrc;

  return (
    <div className="absolute inset-0 rounded-2xl md:rounded-[32px] overflow-hidden pointer-events-none">
      <TourImage
        src={imageSrc}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 100vw, 1280px"
        className="object-cover"
      />
      {isVideo ? (
        <video
          className="home-hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={hero.poster || undefined}
          aria-hidden="true"
        >
          <source src={hero.src} type={hero.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
    </div>
  );
}
