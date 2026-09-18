import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  Map,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Compass,
  Ticket,
  TrainFront,
  Wallet,
  CalendarDays,
  Landmark,
  Mountain,
  Route,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTours } from "@/lib/tours";
import { tourMatchesDestination } from "@/lib/tour-filters";
import { getBlogPostBySlug } from "@/lib/blogs";
import { getReviewsMatching } from "@/lib/reviews";
import { MachuPicchuToursGrid } from "@/components/machu-picchu/MachuPicchuToursGrid";
import { ReviewsSlider } from "@/components/tours/reviews-slider";
import { TourImage } from "@/components/ui/TourImage";

const PAGE_URL = "https://chullostours.com/machu-picchu-2026/";
const OG_IMAGE = "https://chullostours.com/media/tours/machupicchu-full-day-tren-expedition-vistadome/01.jpg";
const PAGE_TITLE = "Viaja a Machu Picchu en 2026: Entradas, Circuitos y Paquetes | Chullos Tours";
const PAGE_DESCRIPTION =
  "Guía 2026 para Machu Picchu: circuitos, entradas, clima y paquetes con precios reales de Chullos Tours.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Chullos Tours",
    type: "website",
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const PILLAR_SLUG = "guia-completa-para-viajar-a-machupicchu";

const CLUSTER_SPOKES = [
  {
    slug: "como-comprar-tu-boleto-a-machu-picchu-guia-completa",
    label: "Entradas y boletos",
    icon: Ticket,
    start: true,
  },
  {
    slug: "como-llegar-a-machu-picchu-guia-completa-para-tu-visita",
    label: "Cómo llegar",
    icon: TrainFront,
  },
  {
    slug: "cuanto-cuesta-viajar-a-machu-picchu-2026",
    label: "Presupuesto y costos",
    icon: Wallet,
  },
  {
    slug: "mejores-fechas-viaje-machu-picchu-en-2026",
    label: "Mejores fechas y clima",
    icon: CalendarDays,
  },
  {
    slug: "que-ver-en-machu-picchu-lugares-imperdibles-para-visita",
    label: "Qué ver dentro",
    icon: Landmark,
  },
  {
    slug: "camino-inca-4-dias-guia-definitiva",
    label: "Camino Inca (trekking)",
    icon: Mountain,
  },
  {
    slug: "viajar-a-peru-y-machu-picchu-itinerario-ideal-para-6-dias",
    label: "Itinerario 6 días",
    icon: Route,
  },
];

const CIRCUITS = [
  {
    name: "Circuito 1 — Panorámico",
    ideal: "Vistas amplias, ritmo ligero",
    note: "Menor exigencia física; buena opción si priorizas fotos del entorno.",
  },
  {
    name: "Circuito 2 — Clásico",
    ideal: "Recorrido tradicional de la ciudadela",
    note: "El más solicitado; conviene reservar con 3 a 6 meses de anticipación en temporada alta.",
  },
  {
    name: "Circuito 3 — Realeza",
    ideal: "Rutas ampliadas + montañas opcionales",
    note: "Huayna Picchu o Montaña MP según cupo disponible al momento de compra.",
  },
];

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
      name: "Machu Picchu 2026",
      item: PAGE_URL,
    },
  ],
};

const FAQ_ITEMS: { question: string; answer: string; linkHref?: string; linkLabel?: string }[] = [
  {
    question: "¿Puedo comprar entradas a Machu Picchu en la puerta en 2026?",
    answer:
      "No. Las entradas deben adquirirse con anticipación online (tuboleto.cultura.pe) o mediante una agencia autorizada.",
    linkHref: "/blog/como-comprar-tu-boleto-a-machu-picchu-guia-completa",
    linkLabel: "Ver el paso a paso para comprar tu boleto",
  },
  {
    question: "¿Cuáles son los circuitos de Machu Picchu en 2026?",
    answer:
      "Circuito 1 (Panorámico), Circuito 2 (Clásico) y Circuito 3 (Realeza, con opciones como Huayna Picchu según disponibilidad).",
  },
  {
    question: "¿Con cuánta anticipación debo reservar?",
    answer:
      "Entre 3 y 6 meses de anticipación en temporada alta (mayo–octubre), especialmente para Circuito 2 o Huayna Picchu. Para el Camino Inca conviene reservar con 6 a 8 meses.",
  },
  {
    question: "¿Cuánto cuesta visitar Machu Picchu en 2026?",
    answer:
      "El circuito clásico (1 o 2) cuesta S/152 (~USD 45). Sumar Huayna Picchu o Montaña Machu Picchu cuesta S/200 (~USD 59). A eso se suman tren, bus y guía.",
    linkHref: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2026",
    linkLabel: "Ver el presupuesto completo desglosado",
  },
  {
    question: "¿Cuál es la mejor época para viajar a Machu Picchu?",
    answer:
      "La temporada seca (abril–octubre) tiene el mejor clima. Abril, mayo, septiembre y octubre son el punto dulce: buen clima con menos afluencia que junio–julio.",
    linkHref: "/blog/mejores-fechas-viaje-machu-picchu-en-2026",
    linkLabel: "Ver el clima mes a mes",
  },
  {
    question: "¿Cómo llego a Machu Picchu desde Cusco?",
    answer:
      "En tren desde Ollantaytambo o Poroy hasta Aguas Calientes, y de ahí en bus (25 min) o caminando (90–120 min) hasta la ciudadela. También existe la ruta económica por Hidroeléctrica.",
    linkHref: "/blog/como-llegar-a-machu-picchu-guia-completa-para-tu-visita",
    linkLabel: "Comparar todas las rutas y precios",
  },
  {
    question: "¿Qué es el Camino Inca y con cuánta anticipación debo reservarlo?",
    answer:
      "Es el trekking de 4 días que llega a Machu Picchu por el Inti Punku. Solo hay 500 permisos diarios (incluyendo guías y porteadores) y se agotan con 6 a 8 meses de anticipación. Cierra todo febrero por mantenimiento.",
    linkHref: "/blog/camino-inca-4-dias-guia-definitiva",
    linkLabel: "Ver la guía definitiva del Camino Inca",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function MachuPicchuPromoPage() {
  const all = getAllTours();
  const mpTours = all.filter((t) => tourMatchesDestination(t, "machu-picchu"));

  // Baldes mutuamente excluyentes (cada tour cae en uno solo) para que las 4 cifras
  // mostradas como desglose sumen el total de mpTours.
  const inca = mpTours.filter((t) => t.slug.includes("camino-inca"));
  const afterInca = mpTours.filter((t) => !inca.includes(t));

  const fullDay = afterInca.filter((t) => {
    const d = (t.atributos?.duracion || "").toLowerCase();
    return d.includes("1 día") || d.includes("full");
  });
  const afterFullDay = afterInca.filter((t) => !fullDay.includes(t));

  const multi = afterFullDay.filter((t) => {
    const d = (t.atributos?.duracion || "").toLowerCase();
    return d.includes("2 días") || d.includes("2 dias");
  });
  const packages = afterFullDay.filter((t) => !multi.includes(t));

  const featured = [
    ...fullDay.slice(0, 2),
    ...multi.slice(0, 2),
    ...packages.slice(0, 2),
  ]
    .filter((t, i, arr) => arr.findIndex((x) => x.slug === t.slug) === i)
    .slice(0, 6);

  const mpReviews = getReviewsMatching(/machu\s*picchu|machupicchu/i, 6);
  const pillarPost = getBlogPostBySlug(PILLAR_SLUG);
  const spokePosts = CLUSTER_SPOKES.map((spoke) => ({
    ...spoke,
    post: getBlogPostBySlug(spoke.slug),
  })).filter((s): s is typeof s & { post: NonNullable<typeof s.post> } => s.post !== null);

  return (
    <div className="flex flex-col gap-14 pb-16 bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative min-h-[480px] md:min-h-[520px] flex items-center justify-center bg-[#111330] overflow-hidden text-center text-white">
        <TourImage
          src="/media/tours/machupicchu-full-day-tren-expedition-vistadome/01.jpg"
          alt="Viajeros de Chullos Tours frente a la ciudadela de Machu Picchu y el Huayna Picchu"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="relative z-10 max-w-3xl px-4 flex flex-col items-center gap-4">
          <span className="text-[#ffc000] text-xs font-extrabold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Temporada 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-title leading-tight">
            Machu Picchu 2026: circuitos, entradas y experiencias
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl">
            Planifica con datos verificados 2026 y reserva directo con nuestro equipo en Cusco — sin
            intermediarios ni sobreprecio.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Link href="/tours/?destino=machu-picchu">
              <Button variant="primary" size="lg">
                Ver tours a Machu Picchu
              </Button>
            </Link>
            <Link href="/viaje-personalizado/">
              <Button variant="outline-white" size="lg">
                Armar viaje a medida
              </Button>
            </Link>
          </div>
          <Link
            href="/destinos/machu-picchu/"
            className="text-[11px] text-slate-300 hover:text-white underline underline-offset-4"
          >
            Ver ubicación, clima y galería de Machu Picchu →
          </Link>
        </div>
      </section>

      <nav
        aria-label="Ruta de navegación"
        className="-mt-10 -mb-10 max-w-7xl mx-auto px-4 w-full flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
      >
        <Link href="/" className="hover:text-[#6b0014] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Machu Picchu 2026</span>
      </nav>

      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Map,
            title: "Circuitos 2026",
            text: "Panorámico, Clásico y Realeza. Te ayudamos a elegir según fotos, ritmo y cupos.",
          },
          {
            icon: AlertTriangle,
            title: "Cupos limitados",
            text: "Huayna Picchu y Circuito 2 se agotan rápido. Reserva con anticipación.",
          },
          {
            icon: Sparkles,
            title: "Operador directo",
            text: "Tren, buses y entradas coordinados por el mismo equipo en Cusco.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2"
          >
            <item.icon className="w-5 h-5 text-[#6b0014]" />
            <h3 className="font-extrabold text-slate-900 font-title">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-5">
        <div>
          <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider">
            Guía rápida
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-title text-slate-900 mt-1">
            Circuitos oficiales en 2026
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CIRCUITS.map((c) => (
            <div
              key={c.name}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-2"
            >
              <h3 className="font-extrabold text-sm text-[#6b0014] font-title">{c.name}</h3>
              <p className="text-xs font-semibold text-slate-800">{c.ideal}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        <div>
          <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider">
            Experiencias
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-title text-slate-900 mt-1">
            Elige cómo vivir Machu Picchu
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Full Day en tren",
              count: fullDay.length,
              href: "/tours/?destino=machu-picchu&q=tren",
            },
            {
              label: "2 días / noche",
              count: multi.length,
              href: "/tours/?destino=machu-picchu&q=2",
            },
            { label: "Camino Inca", count: inca.length, href: "/tours/?q=camino+inca" },
            {
              label: "Paquetes",
              count: packages.length,
              href: "/tours/?destino=machu-picchu&tipo=multiday",
            },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-[#6b0014]/40 transition-colors"
            >
              <p className="text-2xl font-black text-[#6b0014] font-title">{c.count}</p>
              <p className="text-xs font-bold text-slate-800 mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6">
        <h2 className="text-2xl font-black font-title text-slate-900">
          Tours recomendados ({featured.length})
        </h2>
        <MachuPicchuToursGrid tours={featured} />
        <div className="text-center">
          <Link
            href="/tours/?destino=machu-picchu"
            className="inline-flex text-sm font-bold text-[#6b0014] underline"
          >
            Ver todos los tours Machu Picchu ({mpTours.length})
          </Link>
        </div>
      </section>

      {mpReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-6 overflow-hidden">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#ffc000] text-[#ffc000]" /> Reseñas verificadas en
                TripAdvisor
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-title text-slate-900 mt-1">
                Lo que dicen quienes ya viajaron a Machu Picchu
              </h2>
            </div>
            <Link href="/reviews" className="text-sm font-bold text-[#6b0014] hover:underline">
              Ver todas las reseñas →
            </Link>
          </div>
          <ReviewsSlider reviews={mpReviews} />
        </section>
      )}

      {(pillarPost || spokePosts.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Guía Machu Picchu 2026
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-title text-slate-900 mt-1">
                Todo lo que necesitas planificar, en un solo lugar
              </h2>
            </div>
            <Link href="/blog/" className="text-sm font-bold text-[#6b0014] hover:underline">
              Ver todo el blog →
            </Link>
          </div>

          {pillarPost && (
            <Link
              href={`/blog/${pillarPost.slug}`}
              className="group bg-[#111330] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#1a1d4d] transition-colors"
            >
              <div className="flex flex-col gap-2 max-w-2xl">
                <span className="text-[#ffc000] text-[10px] font-black uppercase tracking-widest">
                  Guía definitiva · {pillarPost.reading_time_minutes || 13} min de lectura
                </span>
                <h3 className="text-xl md:text-2xl font-black font-title leading-snug">
                  {pillarPost.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                  {pillarPost.excerpt}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#ffc000] group-hover:underline">
                Leer guía completa →
              </span>
            </Link>
          )}

          {spokePosts.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {spokePosts.map(({ post, label, icon: Icon, start }) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`relative rounded-2xl p-4 transition-all flex flex-col gap-2 ${
                    start
                      ? "bg-[#6b0014] border border-[#6b0014] hover:bg-[#850019] shadow-sm"
                      : "bg-white border border-slate-200 hover:border-[#6b0014]/40 hover:shadow-sm"
                  }`}
                >
                  {start && (
                    <span className="absolute -top-2 right-3 bg-[#ffc000] text-[#1C1C1C] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      Empieza aquí
                    </span>
                  )}
                  <Icon className={`w-4 h-4 ${start ? "text-[#ffc000]" : "text-[#6b0014]"}`} />
                  <span
                    className={`text-[10px] font-black uppercase tracking-wide ${
                      start ? "text-[#ffc000]" : "text-[#6b0014]"
                    }`}
                  >
                    {label}
                  </span>
                  <h3
                    className={`text-sm font-extrabold line-clamp-3 font-title leading-snug ${
                      start ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <span className={`text-[11px] mt-auto ${start ? "text-slate-200" : "text-slate-500"}`}>
                    {post.reading_time_minutes || 5} min de lectura
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="bg-[#6b0014] text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-xl md:text-2xl font-black font-title flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#ffc000]" />
              ¿Quieres un itinerario hecho para ti?
            </h2>
            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              Cuéntanos fechas, ritmo y presupuesto. Un asesor en Cusco arma tu propuesta sin costo
              ni compromiso.
            </p>
          </div>
          <Link href="/viaje-personalizado/">
            <Button variant="secondary" size="lg">
              Diseñar mi viaje
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 w-full flex flex-col gap-4">
        <div>
          <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ 2026
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-title text-slate-900 mt-1">
            Preguntas frecuentes sobre Machu Picchu
          </h2>
        </div>
        {FAQ_ITEMS.map((f) => (
          <div key={f.question} className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-extrabold text-sm text-slate-900 flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {f.question}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">{f.answer}</p>
            {f.linkHref && (
              <Link
                href={f.linkHref}
                className="text-xs font-bold text-[#6b0014] hover:underline mt-2 ml-6 inline-block"
              >
                {f.linkLabel} →
              </Link>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
