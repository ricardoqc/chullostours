"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { HomeHeroConfig } from "@/lib/home-hero";

type HomeHeroMediaProps = {
  hero: HomeHeroConfig;
  fallbackSrc: string;
};

export function HomeHeroMedia({ hero, fallbackSrc }: HomeHeroMediaProps) {
  const isVideo = hero.kind === "video" && Boolean(hero.src);
  const imageSlides = useMemo(
    () => hero.slides.filter((slide) => Boolean(slide.src.trim())),
    [hero.slides]
  );

  const sliderSources = useMemo(() => {
    if (isVideo) return [] as Array<{ src: string; alt: string }>;
    if (imageSlides.length > 0) {
      return imageSlides.map((slide) => ({
        src: slide.src,
        alt: slide.alt?.trim() || "Hero Chullos Tours",
      }));
    }
    const single = hero.src || fallbackSrc;
    return [{ src: single || fallbackSrc, alt: "Hero Chullos Tours" }];
  }, [isVideo, imageSlides, hero.src, fallbackSrc]);

  const posterSrc = isVideo ? hero.poster || fallbackSrc : "";
  const [activeIndex, setActiveIndex] = useState(0);
  const readyRef = useRef<Record<string, boolean>>({});
  const sourcesKey = sliderSources.map((item) => item.src).join("|");

  useEffect(() => {
    setActiveIndex(0);
  }, [sourcesKey, isVideo]);

  useEffect(() => {
    if (isVideo || sliderSources.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % sliderSources.length;
        const nextSrc = sliderSources[next]?.src;
        if (nextSrc && !readyRef.current[nextSrc]) return prev;
        return next;
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [isVideo, sliderSources]);

  return (
    <div className="absolute inset-0 rounded-2xl md:rounded-[32px] overflow-hidden pointer-events-none">
      {!isVideo
        ? sliderSources.map((slide, index) => (
            <Image
              key={`${slide.src}-${index}`}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              quality={90}
              sizes="(max-width: 768px) 100vw, 1280px"
              className={`object-cover transition-opacity duration-700 ease-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => {
                readyRef.current[slide.src] = true;
              }}
            />
          ))
        : posterSrc ? (
            <Image
              src={posterSrc}
              alt="Hero Chullos Tours"
              fill
              priority
              fetchPriority="high"
              quality={90}
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover"
            />
          ) : null}
      {isVideo ? (
        <video
          className="home-hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={hero.poster || undefined}
          aria-hidden="true"
        >
          <source src={hero.src} type={hero.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/20 to-black/20" />
    </div>
  );
}
