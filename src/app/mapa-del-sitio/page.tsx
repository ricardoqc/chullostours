import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Compass,
  MapPin,
  BookOpen,
  FileText,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Mountain,
} from "lucide-react";
import { getAllTours } from "@/lib/tours";
import { getAllBlogPosts } from "@/lib/blogs";
import { getDestinationsWithTours } from "@/lib/places";

export const metadata: Metadata = {
  title: "Mapa del Sitio (HTML Sitemap) | Chullos Tours",
  description:
    "Explora la estructura completa de Chullos Tours: tours en Cusco, Machu Picchu, Camino Inca, destinos turísticos, guías de viaje y páginas oficiales.",
  alternates: {
    canonical: "https://chullostours.com/mapa-del-sitio/",
  },
  openGraph: {
    title: "Mapa del Sitio Oficial | Chullos Tours",
    description:
      "Índice visual y estructurado de todas las rutas, tours, guías y destinos de Chullos Tours en Perú.",
    url: "https://chullostours.com/mapa-del-sitio/",
    type: "website",
  },
};

export default function MapaDelSitioPage() {
  const tours = getAllTours();
  const blogs = getAllBlogPosts();
  const destinations = getDestinationsWithTours(tours);

  const mainPages = [
    { name: "Página de Inicio", href: "/" },
    { name: "Catálogo Completo de Tours", href: "/tours/" },
    { name: "Tours para Peruanos (Tarifas Nacionales)", href: "/pe/tours/" },
    { name: "Tienda de Experiencias", href: "/tienda/" },
    { name: "Acerca de Chullos Tours", href: "/acerca-de-chullos-tours/" },
    { name: "Contacto y Ubicación", href: "/contacto-chullos/" },
    { name: "Diseña tu Viaje Personalizado", href: "/viaje-personalizado/" },
    { name: "Blog y Guías de Viaje", href: "/blog/" },
    { name: "Destinos Disponibles", href: "/destinos/" },
    { name: "Opiniones y Reseñas de Viajeros", href: "/reviews/" },
    { name: "Buscador de Tours", href: "/resultados-de-busqueda/" },
    { name: "Políticas de Privacidad", href: "/politicas-de-privacidad/" },
    { name: "Términos y Condiciones", href: "/terminos-y-condiciones/" },
  ];

  // Group tours for easier browsing
  const machuPicchuTours = tours.filter((t) =>
    t.slug.includes("machu") || t.slug.includes("inca")
  );
  const dayTours = tours.filter(
    (t) =>
      !machuPicchuTours.some((m) => m.slug === t.slug) &&
      (!t.atributos?.duracion || t.atributos.duracion.includes("Día") || t.atributos.duracion.includes("Horas")) &&
      !t.atributos.duracion.includes("2") &&
      !t.atributos.duracion.includes("3") &&
      !t.atributos.duracion.includes("4") &&
      !t.atributos.duracion.includes("5") &&
      !t.atributos.duracion.includes("6") &&
      !t.atributos.duracion.includes("7")
  );
  const packageTours = tours.filter(
    (t) =>
      !machuPicchuTours.some((m) => m.slug === t.slug) &&
      !dayTours.some((d) => d.slug === t.slug)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Header Banner */}
        <header className="bg-[#6b0014] text-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-950 flex flex-col gap-4">
          <nav className="flex items-center gap-1.5 text-xs text-amber-200/90 py-1">
            <Link href="/" className="hover:underline">Inicio</Link>
            <ChevronRight className="w-3 h-3 text-[#ffc000]" />
            <span className="text-white font-semibold">Mapa del Sitio</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="bg-[#ffc000] text-[#1c1c1c] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2">
                <Compass className="w-3.5 h-3.5" />
                Directorio Web
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-title tracking-tight text-white">
                Mapa del Sitio Web
              </h1>
              <p className="text-slate-200 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                Navega por todas las páginas, experiencias turísticas, guías oficiales de viaje y destinos ofrecidos por Chullos Tours en Cusco y Perú.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
            >
              <span>Ver XML Técnico (Search Engines)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ffc000]" />
            </a>
          </div>
        </header>

        {/* Section 1: Páginas Principales & Destinos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Páginas Principales */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-title">Páginas Institucionales</h2>
                <p className="text-xs text-slate-500">Información corporativa, reservas y políticas</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {mainPages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                    <span>{page.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Destinos */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-title">Destinos Turísticos</h2>
                <p className="text-xs text-slate-500">Lugares sagrados y regiones del Perú</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {destinations.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/destinos/${dest.slug}/`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                      {dest.nombre}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {dest.toursCount} tours
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section 2: Catálogo de Tours */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-title">
                  Tours y Paquetes Turísticos ({tours.length})
                </h2>
                <p className="text-xs text-slate-500">Experiencias guiadas por arqueología, trekking y aventura</p>
              </div>
            </div>
            <Link
              href="/tours/"
              className="text-xs font-bold text-[#6b0014] hover:text-red-700 inline-flex items-center gap-1 hover:underline"
            >
              Explorar catálogo con filtros <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Group 1: Machu Picchu & Camino Inca */}
          <div>
            <h3 className="text-sm font-bold text-[#6b0014] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffc000]" />
              Machu Picchu & Camino Inca ({machuPicchuTours.length})
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {machuPicchuTours.map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}/`}
                    className="flex items-start gap-2 py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                    <span className="line-clamp-1">{tour.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 2: Full Days & Excursiones */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#6b0014] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#ffc000]" />
              Tours de 1 Día y Aventura en Cusco ({dayTours.length})
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {dayTours.map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}/`}
                    className="flex items-start gap-2 py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                    <span className="line-clamp-1">{tour.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 3: Paquetes Multidía & Altiplano */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#6b0014] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffc000]" />
              Paquetes Multidía & Lago Titicaca ({packageTours.length})
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {packageTours.map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}/`}
                    className="flex items-start gap-2 py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                    <span className="line-clamp-1">{tour.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3: Artículos y Guías del Blog */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-title">
                  Guías de Viaje y Blog ({blogs.length})
                </h2>
                <p className="text-xs text-slate-500">Artículos con información actualizada sobre entradas, trenes y consejos</p>
              </div>
            </div>
            <Link
              href="/blog/"
              className="text-xs font-bold text-[#6b0014] hover:text-red-700 inline-flex items-center gap-1 hover:underline"
            >
              Ver revista del blog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {blogs.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="flex items-start gap-2 py-1.5 px-2 rounded-lg text-slate-700 hover:text-[#6b0014] hover:bg-red-50/50 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#6b0014] group-hover:translate-x-0.5 transition-transform" />
                  <span className="line-clamp-1">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
