"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isTourDetailPage = pathname?.startsWith("/tours/") && pathname !== "/tours";

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed z-40 p-3 rounded-full bg-[#6b0014] text-white shadow-xl hover:bg-[#850019] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center border border-white/20 touch-manipulation ${
        isTourDetailPage
          ? "bottom-20 lg:bottom-6 right-4 sm:right-6"
          : "bottom-20 sm:bottom-6 left-4 sm:left-6"
      }`}
    >
      <ChevronUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};
