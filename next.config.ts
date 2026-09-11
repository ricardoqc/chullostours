import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.OUTPUT_STANDALONE === "true" ? "standalone" : undefined,
  experimental: {
    proxyClientMaxBodySize: "80mb",
    serverActions: {
      bodySizeLimit: "80mb",
    },
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "chullostours.com",
      },
      {
        protocol: "https",
        hostname: "dynamic-media-cdn.tripadvisor.com",
      },
    ],
  },
  trailingSlash: true,
  async redirects() {
    return [
      // 1. Tours modificados
      {
        source: "/tours/machupicchu-full-day-con-tren-vistadome/",
        destination: "/tours/machupicchu-full-day-tren-expedition-vistadome/",
        permanent: true,
      },
      {
        source: "/tours/machupicchu-full-day-con-tren-vistadome-observatory/",
        destination: "/tours/machupicchu-full-day-con-tren-observatory-expedition/",
        permanent: true,
      },
      {
        source: "/tours/cusco-escenico-city-tour-nocturno/",
        destination: "/tours/cusco-escenico-city-tour-tarde/",
        permanent: true,
      },
      {
        source: "/tours/tour-lago-titicaca-2-dias/",
        destination: "/tours/tour-puno-2-dias-uros-amantani/",
        permanent: true,
      },

      // 2. Blog Posts raíz heredados de WordPress -> /blog/:slug/
      {
        source: "/tours-en-cusco-guia-completa/",
        destination: "/blog/tours-en-cusco-guia-completa/",
        permanent: true,
      },
      {
        source: "/viajar-a-peru-con-chullos-tours/",
        destination: "/blog/viajar-a-peru-con-chullos-tours/",
        permanent: true,
      },
      {
        source: "/guia-completa-para-viajar-a-machupicchu/",
        destination: "/blog/guia-completa-para-viajar-a-machupicchu/",
        permanent: true,
      },
      {
        source: "/cuanto-cuesta-viajar-a-machu-picchu-2025/",
        destination: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2026/",
        permanent: true,
      },
      {
        source: "/cuanto-cuesta-viajar-a-machu-picchu-2026/",
        destination: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2026/",
        permanent: true,
      },
      {
        source: "/mejores-fechas-viaje-machu-picchu-en-2025/",
        destination: "/blog/mejores-fechas-viaje-machu-picchu-en-2026/",
        permanent: true,
      },
      {
        source: "/mejores-fechas-viaje-machu-picchu-en-2026/",
        destination: "/blog/mejores-fechas-viaje-machu-picchu-en-2026/",
        permanent: true,
      },
      {
        source: "/machu-picchu-ciudad-perdida-de-los-incas/",
        destination: "/blog/machu-picchu-ciudad-perdida-de-los-incas/",
        permanent: true,
      },
      {
        source: "/como-comprar-tu-boleto-a-machu-picchu-guia-completa/",
        destination: "/blog/como-comprar-tu-boleto-a-machu-picchu-guia-completa/",
        permanent: true,
      },
      {
        source: "/viajar-a-peru-y-machu-picchu-itinerario-ideal-para-6-dias/",
        destination: "/blog/viajar-a-peru-y-machu-picchu-itinerario-ideal-para-6-dias/",
        permanent: true,
      },
      {
        source: "/descubre-machu-picchu-historia-cultura-y-aventura/",
        destination: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        permanent: true,
      },
      {
        source: "/que-ver-en-machu-picchu-lugares-imperdibles-para-visita/",
        destination: "/blog/que-ver-en-machu-picchu-lugares-imperdibles-para-visita/",
        permanent: true,
      },
      {
        source: "/como-llegar-a-machu-picchu-guia-completa-para-tu-visita/",
        destination: "/blog/como-llegar-a-machu-picchu-guia-completa-para-tu-visita/",
        permanent: true,
      },
      {
        source: "/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        destination: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        permanent: true,
      },
      {
        source: "/todo-los-que-necesitas-saber-sobre-machu-picchu/",
        destination: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        permanent: true,
      },
      {
        source: "/explora-las-maravillas-de-machu-picchu-vacaciones-inolvidables-en-el-corazon-de-los-andes/",
        destination: "/blog/explora-las-maravillas-de-machu-picchu-vacaciones-inolvidables-en-el-corazon-de-los-andes/",
        permanent: true,
      },
      {
        source: "/machu-picchu-viaje-inolvidable/",
        destination: "/blog/machu-picchu-viaje-inolvidable/",
        permanent: true,
      },
      {
        source: "/camino-inca-4-dias-guia-definitiva/",
        destination: "/blog/camino-inca-4-dias-guia-definitiva/",
        permanent: true,
      },
      {
        source: "/montana-de-7-colores-vinicunca-guia-completa/",
        destination: "/blog/montana-de-7-colores-vinicunca-guia-completa/",
        permanent: true,
      },

      // 3. Redirecciones internas en /blog/ (fusión de canibalizados y actualización de año)
      {
        source: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2025/",
        destination: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2026/",
        permanent: true,
      },
      {
        source: "/blog/mejores-fechas-viaje-machu-picchu-en-2025/",
        destination: "/blog/mejores-fechas-viaje-machu-picchu-en-2026/",
        permanent: true,
      },
      {
        source: "/blog/todo-los-que-necesitas-saber-sobre-machu-picchu/",
        destination: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        permanent: true,
      },
      {
        source: "/blog/descubre-machu-picchu-historia-cultura-y-aventura/",
        destination: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/",
        permanent: true,
      },

      // 4. Destinos WordPress -> Destinos Next.js
      {
        source: "/destinos/cusco-ciudad/",
        destination: "/destinos/cusco/",
        permanent: true,
      },
      {
        source: "/destinos/laguna-humantay/",
        destination: "/destinos/humantay/",
        permanent: true,
      },
      {
        source: "/destinos/machu-picchu-pueblo/",
        destination: "/destinos/machu-picchu/",
        permanent: true,
      },
      {
        source: "/destinos/puno-ciudad/",
        destination: "/destinos/puno/",
        permanent: true,
      },
      {
        source: "/destinos/lago-titicaca/",
        destination: "/destinos/puno/",
        permanent: true,
      },
      {
        source: "/destinos/qeswachaka/",
        destination: "/tours/puente-qeswachaka-tour-full-day/",
        permanent: true,
      },
      {
        source: "/destinos/valle-sagrado-de-los-incas/",
        destination: "/destinos/valle-sagrado/",
        permanent: true,
      },
      {
        source: "/destinos/montana-de-colores-vinicunca/",
        destination: "/destinos/vinicunca/",
        permanent: true,
      },
      {
        source: "/destino/",
        destination: "/destinos/",
        permanent: true,
      },
      {
        source: "/destinos-disponibles/",
        destination: "/destinos/",
        permanent: true,
      },

      // 5. Actividades WordPress -> Actividades Next.js
      {
        source: "/actividades/caminata-hiking/",
        destination: "/actividades/caminata/",
        permanent: true,
      },
      {
        source: "/actividades/outdoor/",
        destination: "/actividades/aventura/",
        permanent: true,
      },
      {
        source: "/actividades/trekking/",
        destination: "/actividades/treks/",
        permanent: true,
      },

      // 6. Páginas utilitarias y slugs legacy de WooCommerce
      {
        source: "/shop/",
        destination: "/tours/",
        permanent: true,
      },
      {
        source: "/my-account/",
        destination: "/mi-cuenta/",
        permanent: true,
      },
      {
        source: "/wishlist-3/",
        destination: "/wishlist/",
        permanent: true,
      },
      {
        source: "/resultado-de-busqueda-viajes/",
        destination: "/resultados-de-busqueda/",
        permanent: true,
      },

      // 7. Wildcards para Tags y taxonomías antiguas de WordPress (evitar 404s en Search Console)
      {
        source: "/trip_tag/:slug*",
        destination: "/tours/",
        permanent: true,
      },
      {
        source: "/post_tag/:slug*",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/author/:slug*",
        destination: "/acerca-de-chullos-tours/",
        permanent: true,
      },
      {
        source: "/difficulty/:slug*",
        destination: "/tours/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
