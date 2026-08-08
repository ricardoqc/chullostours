import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/destino", destination: "/destinos", permanent: true },
      { source: "/machu-picchu-2025", destination: "/machu-picchu-2026", permanent: true },
      { source: "/my-account", destination: "/mi-cuenta", permanent: true },
      { source: "/wishlist-3", destination: "/wishlist", permanent: true },
      { source: "/shop", destination: "/tours", permanent: true },
      { source: "/destinos-disponibles", destination: "/destinos", permanent: true },
      { source: "/resultado-de-busqueda-viajes", destination: "/resultados-de-busqueda", permanent: true },
    ];
  },
};

export default nextConfig;
