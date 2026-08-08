import React from "react";
import Link from "next/link";
import { Heart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Mi Lista de Deseos | Chullos Tours",
  description: "Tours y experiencias guardadas en tu lista de favoritos.",
};

export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 bg-white min-h-[60vh]">
      <div className="bg-[#111330] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[#37d4d9] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#ff681a] text-[#ff681a]" />
            Tours Favoritos
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Mi Lista de Deseos
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 w-full text-center">
        <div className="bg-[#f7f7f7] rounded-3xl p-16 flex flex-col items-center gap-4 border border-gray-100">
          <Heart className="w-16 h-16 text-[#ff681a]" />
          <h2 className="text-2xl font-bold text-[#1c1c1c]">No tienes tours guardados</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Guarda los tours que más te interesen haciendo clic en el ícono de corazón para consultarlos más tarde.
          </p>
          <Link href="/tours">
            <Button variant="primary" size="lg">
              Explorar Tours
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
