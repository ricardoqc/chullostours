import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  ArrowRight,
  Compass,
  ChevronRight,
  Mountain,
  Thermometer,
  Calendar,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getAllTours } from "@/lib/tours";
import {
  getDestinationBySlug,
  getToursByDestination,
} from "@/lib/places";
import {
  generateDestinationSchema,
  getDestinationDocBySlug,
  getPublishedDestinations,
} from "@/lib/destinos";
import { getPrimaryWhatsappUrl } from "@/lib/company-info";
import { TourCard } from "@/components/tours/tour-card";
import { toTourCardProps } from "@/lib/tour-card-mapper";
import { TourImage } from "@/components/ui/TourImage";

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getPublishedDestinations().map((destination) => ({
    slug: destination.slug,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDestinationDocBySlug(slug, { publishedOnly: true });
  if (!doc) return {};

  const tours = getAllTours();
  const toursCount = getToursByDestination(slug, tours).length;
  const title =
    doc.seo.title ||
    (toursCount > 0
      ? `Tours en ${doc.title} | ${toursCount} experiencias | Chullos Tours`
      : `Tours en ${doc.title} | Chullos Tours`);
  const description =
    doc.seo.description ||
    (toursCount > 0
      ? `${toursCount} tours y excursiones en ${doc.title} (${doc.region}). ${doc.excerpt}`
      : `Descubre ${doc.title} en ${doc.region}. ${doc.excerpt}`);

  const ogImage = doc.seo.og_image || doc.featured_image;

  return {
    title,
    description,
    alternates: {
      canonical: doc.seo.canonical || `https://chullostours.com/destinos/${doc.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://chullostours.com/destinos/${doc.slug}/`,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const tours = getAllTours();
  const destination = getDestinationBySlug(slug, tours);
  const doc = getDestinationDocBySlug(slug, { publishedOnly: true });

  if (!destination || !doc) {
    notFound();
  }

  const destinationTours = getToursByDestination(slug, tours);
  const placeSchema = generateDestinationSchema(doc);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://chullostours.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinos",
        item: "https://chullostours.com/destinos/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: destination.nombre,
        item: `https://chullostours.com/destinos/${destination.slug}/`,
      },
    ],
  };

  const whatsappUrl = getPrimaryWhatsappUrl(
    `Hola, me interesa viajar a ${destination.nombre}. ¿Qué opciones tienen disponibles?`
  );

  const gallery = (doc.gallery?.length ? doc.gallery : [doc.featured_image]).filter(Boolean);
  const hasBody = Boolean(doc.body_html && doc.body_html.replace(/<[^>]+>/g, "").trim());
  const hasInfo = Boolean(doc.info_html && doc.info_html.replace(/<[^>]+>/g, "").trim());

  return (
    <div className="flex flex-col gap-12 pb-16 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />

      <div className="relative bg-[#6b0014] py-16 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-3 z-10">
          <span className="bg-[#ffc000] text-[#6b0014] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {destination.region}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white font-title">
            {doc.title}
          </h1>
          {doc.subtitle ? (
            <p className="text-[#ffc000] text-sm md:text-base font-semibold">{doc.subtitle}</p>
          ) : null}
          <p className="text-white/80 text-sm md:text-base max-w-xl font-light">
            {doc.excerpt || destination.descripcion}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-10">
        <nav
          aria-label="Ruta de navegación"
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
        >
          <Link href="/" className="hover:text-[#6b0014] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/destinos/" className="hover:text-[#6b0014] transition-colors">
            Destinos
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700">{doc.title}</span>
        </nav>

        {doc.featured_image ? (
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <TourImage
              src={doc.featured_image}
              alt={doc.featured_image_alt || doc.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ) : null}

        {hasBody ? (
          <section className="max-w-3xl prose prose-slate prose-headings:font-title">
            <h2 className="text-2xl font-black text-slate-900 font-title not-prose mb-4">
              Sobre {doc.title}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: doc.body_html }} />
          </section>
        ) : null}

        {doc.lugares && doc.lugares.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-slate-900 font-title">
              Lugares turísticos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doc.lugares.map((lugar) => (
                <article
                  key={lugar.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
                >
                  {lugar.imagen ? (
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <TourImage
                        src={lugar.imagen}
                        alt={lugar.nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="font-bold text-slate-900">{lugar.nombre}</h3>
                    {lugar.descripcion ? (
                      <p className="text-xs text-slate-500 leading-relaxed">{lugar.descripcion}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {(hasInfo || (doc.tips && doc.tips.length > 0)) && (
          <section className="grid gap-6 lg:grid-cols-2">
            {hasInfo ? (
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-black text-slate-900 font-title not-prose mb-4">
                  Información turística
                </h2>
                <div dangerouslySetInnerHTML={{ __html: doc.info_html || "" }} />
              </div>
            ) : null}
            {doc.tips && doc.tips.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-black text-slate-900 font-title mb-3">
                  Tips prácticos
                </h2>
                <ul className="space-y-2">
                  {doc.tips.filter(Boolean).map((tip) => (
                    <li key={tip} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-[#6b0014] font-bold">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <h2 className="sm:col-span-2 lg:col-span-4 text-lg font-black text-slate-900 font-title">
            Datos geográficos
          </h2>
          <div className="flex gap-3 items-start">
            <MapPin className="w-5 h-5 text-[#6b0014] shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Coordenadas</p>
              <p className="text-sm text-slate-700 font-mono">
                {doc.geo.lat.toFixed(4)}, {doc.geo.lng.toFixed(4)}
              </p>
            </div>
          </div>
          {doc.geo.altitude_m != null ? (
            <div className="flex gap-3 items-start">
              <Mountain className="w-5 h-5 text-[#6b0014] shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Altitud</p>
                <p className="text-sm text-slate-700">{doc.geo.altitude_m} m</p>
              </div>
            </div>
          ) : null}
          {doc.geo.best_season ? (
            <div className="flex gap-3 items-start">
              <Calendar className="w-5 h-5 text-[#6b0014] shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Mejor temporada</p>
                <p className="text-sm text-slate-700">{doc.geo.best_season}</p>
              </div>
            </div>
          ) : null}
          {doc.geo.climate_summary ? (
            <div className="flex gap-3 items-start">
              <Thermometer className="w-5 h-5 text-[#6b0014] shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Clima</p>
                <p className="text-sm text-slate-700">{doc.geo.climate_summary}</p>
              </div>
            </div>
          ) : null}
          <div className="flex gap-3 items-start sm:col-span-2">
            <Compass className="w-5 h-5 text-[#6b0014] shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase text-slate-400">Región</p>
              <p className="text-sm text-slate-700">
                {doc.geo.region_label || doc.region} ({doc.geo.country || "PE"})
              </p>
            </div>
          </div>
        </section>

        {gallery.length > 1 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-slate-900 font-title">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                >
                  <TourImage
                    src={src}
                    alt={doc.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {destinationTours.length > 0 ? (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-900 font-title">
              Tours en {doc.title}{" "}
              <span className="text-[#6b0014]">({destinationTours.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationTours.map((tour) => (
                <TourCard key={tour.slug} tour={toTourCardProps(tour)} />
              ))}
            </div>
          </section>
        ) : (
          <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6b0014] via-[#ffc000] to-[#6b0014]" />
            <div className="w-16 h-16 rounded-3xl bg-[#6b0014]/10 text-[#6b0014] flex items-center justify-center shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-title leading-snug">
                Todavía no tenemos tours publicados en {doc.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Estamos preparando nuevas salidas para este destino. Mientras tanto puedes
                revisar nuestro catálogo completo o pedirnos un itinerario a medida.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <Link
                href="/tours/"
                className="inline-flex items-center gap-2 bg-[#6b0014] hover:bg-[#850019] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title"
              >
                <span>Ver todos los tours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 font-title"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
