import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Map,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTours } from "@/lib/tours";
import { tourMatchesDestination } from "@/lib/tour-filters";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { MachuPicchuToursGrid } from "@/components/machu-picchu/MachuPicchuToursGrid";

export const metadata = {
  title: "Viaja a Machu Picchu en 2026: Entradas, Circuitos y Paquetes | Chullos Tours",
  description:
    "Guía 2026 para Machu Picchu: circuitos, entradas, clima y paquetes con precios reales de Chullos Tours.",
};

const CIRCUITS = [
  {
    name: "Circuito 1 — Panorámico",
    ideal: "Vistas amplias, ritmo ligero",
    note: "Menor exigencia física; buena opción si priorizas fotos del entorno.",
  },
  {
    name: "Circuito 2 — Clásico",
    ideal: "Recorrido tradicional de la ciudadela",
    note: "El más solicitado; conviene reservar con 60+ días en temporada alta.",
  },
  {
    name: "Circuito 3 — Realeza",
    ideal: "Rutas ampliadas + montañas opcionales",
    note: "Huayna Picchu o Montaña MP según cupo disponible al momento de compra.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Puedo comprar entradas a Machu Picchu en la puerta en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Las entradas deben adquirirse con anticipación online (tuboleto.cultura.pe) o mediante una agencia autorizada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los circuitos de Machu Picchu en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Circuito 1 (Panorámico), Circuito 2 (Clásico) y Circuito 3 (Realeza, con opciones como Huayna Picchu según disponibilidad).",
      },
    },
    {
      "@type": "Question",
      name: "¿Con cuánta anticipación debo reservar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Idealmente 60 días o más en temporada alta (mayo–octubre), especialmente para Circuito 2 o Huayna Picchu.",
      },
    },
  ],
};

export default function MachuPicchuPromoPage() {
  const all = getAllTours();
  const mpTours = all.filter((t) => tourMatchesDestination(t, "machu-picchu"));

  const fullDay = mpTours.filter(
    (t) =>
      (t.atributos?.duracion || "").toLowerCase().includes("1 día") ||
      (t.atributos?.duracion || "").toLowerCase().includes("full")
  );
  const multi = mpTours.filter((t) => !fullDay.includes(t) && !t.slug.includes("camino-inca"));
  const inca = mpTours.filter((t) => t.slug.includes("camino-inca"));
  const packages = mpTours.filter(
    (t) => (t.opciones_hotel && t.opciones_hotel.length > 0) || t.slug.includes("dias")
  );

  const featured = [
    ...fullDay.slice(0, 2),
    ...multi.slice(0, 2),
    ...packages.slice(0, 2),
  ]
    .filter((t, i, arr) => arr.findIndex((x) => x.slug === t.slug) === i)
    .slice(0, 6);

  const guidePosts = getAllBlogPosts()
    .filter((p) => /machu|machupicchu/i.test(p.slug))
    .slice(0, 4)
    .map((item) => getBlogPostBySlug(item.slug))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <div className="flex flex-col gap-14 pb-16 bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative min-h-[480px] md:min-h-[520px] flex items-center justify-center bg-[#111330] overflow-hidden text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="relative z-10 max-w-3xl px-4 flex flex-col items-center gap-4">
          <span className="text-[#ffc000] text-xs font-extrabold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Temporada 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-title leading-tight">
            Machu Picchu 2026: circuitos, entradas y experiencias
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl">
            Planifica con datos actualizados y reserva con operador directo en Cusco. Precios en USD
            por defecto; cambia a soles si estás en Perú.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Link href="/tours/?destino=machu-picchu">
              <Button variant="primary" size="lg">
                Ver tours a Machu Picchu
              </Button>
            </Link>
            <Link href="/viaje-personalizado/">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                Armar viaje a medida
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

      {guidePosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[#6b0014] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Blog
              </span>
              <h2 className="text-2xl font-black font-title text-slate-900 mt-1">
                Guías para planificar tu visita
              </h2>
            </div>
            <Link href="/blog/" className="text-sm font-bold text-[#6b0014] hover:underline">
              Ver todo el blog →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guidePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-[#6b0014]/30 transition-colors flex flex-col gap-2"
              >
                <span className="text-[10px] font-bold uppercase text-[#6b0014]">
                  {post.categories?.[0] || "Guía"}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 line-clamp-3 font-title leading-snug">
                  {post.title}
                </h3>
                <span className="text-[11px] text-slate-500 mt-auto">
                  {post.reading_time_minutes || 5} min de lectura
                </span>
              </Link>
            ))}
          </div>
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
            <Button variant="primary" size="lg" className="bg-[#ffc000] text-[#1c1c1c] hover:bg-amber-400">
              Diseñar mi viaje
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 w-full flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#6b0014] text-xs font-black uppercase">
          <HelpCircle className="w-4 h-4" /> FAQ 2026
        </div>
        {faqSchema.mainEntity.map((f) => (
          <div key={f.name} className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-extrabold text-sm text-slate-900 flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {f.name}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
              {f.acceptedAnswer.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
