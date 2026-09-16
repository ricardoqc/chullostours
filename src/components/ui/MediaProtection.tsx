"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function findProtectedMedia(target: EventTarget | null): HTMLImageElement | HTMLVideoElement | null {
  if (!(target instanceof Element)) return null;
  const wrapped = target.closest(".media-protect, [data-media-protect='true'], .media-protect-shield");
  if (wrapped) {
    const media = wrapped.querySelector("img, video");
    if (media instanceof HTMLImageElement || media instanceof HTMLVideoElement) return media;
  }
  const media = target.closest("img, video");
  if (!(media instanceof HTMLImageElement || media instanceof HTMLVideoElement)) return null;
  if (media.closest("header, footer, nav, .admin-shell, [data-media-protect='false']")) return null;
  const src = media.currentSrc || media.src || "";
  if (!/\/media\/|\/tours\/|\/hoteles\//.test(src) && !media.classList.contains("media-protect-img")) {
    return null;
  }
  return media;
}

function mediaPathFromSrc(src: string): string | null {
  try {
    const url = new URL(src, window.location.origin);
    if (!url.pathname.startsWith("/media/")) {
      // next/image: /_next/image?url=%2Fmedia%2F...
      const nested = url.searchParams.get("url");
      if (nested) {
        const decoded = decodeURIComponent(nested);
        if (decoded.startsWith("/media/")) return decoded;
      }
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

function downloadEncrypted(mediaPath: string) {
  const a = document.createElement("a");
  a.href = `${mediaPath}?download=1`;
  a.download = "chullos-protegido.enc";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function isAdminPath(pathname: string | null) {
  return Boolean(pathname?.startsWith("/admin"));
}

/**
 * Disuasión anti-descarga: la foto se ve nítida en la página.
 * Clic derecho / guardar fuerza la descarga de un archivo .enc (no es imagen usable).
 * Abrir /media/... en una pestaña nueva también entrega el cifrado.
 */
export function MediaProtection() {
  const pathname = usePathname();

  useEffect(() => {
    if (isAdminPath(pathname)) {
      document.documentElement.classList.remove("media-protection-on");
      return;
    }

    document.documentElement.classList.add("media-protection-on");

    const onContextMenu = (event: MouseEvent) => {
      const media = findProtectedMedia(event.target);
      if (!media) return;
      event.preventDefault();
      event.stopPropagation();
      const path = mediaPathFromSrc(media.currentSrc || media.src);
      if (path) downloadEncrypted(path);
    };

    const onDragStart = (event: DragEvent) => {
      if (findProtectedMedia(event.target)) {
        event.preventDefault();
      }
    };

    const onSelectStart = (event: Event) => {
      if (findProtectedMedia(event.target)) {
        event.preventDefault();
      }
    };

    const onCopy = (event: ClipboardEvent) => {
      if (findProtectedMedia(event.target)) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      if (key !== "s" && key !== "p") return;

      const active = document.activeElement;
      const hovered = document.querySelector("img:hover, video:hover, .media-protect:hover");
      const media =
        findProtectedMedia(active) ||
        (hovered ? findProtectedMedia(hovered) : null);
      if (!media) return;

      event.preventDefault();
      event.stopPropagation();
      if (key === "s") {
        const path = mediaPathFromSrc(media.currentSrc || media.src);
        if (path) downloadEncrypted(path);
      }
    };

    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("selectstart", onSelectStart, true);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.documentElement.classList.remove("media-protection-on");
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("selectstart", onSelectStart, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [pathname]);

  return null;
}
