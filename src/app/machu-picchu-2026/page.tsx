import React from "react";
import Link from "next/link";
import { Sparkles, Map, AlertTriangle, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourCard, TourProps } from "@/components/tours/tour-card";

const CAMPAIGN_TOURS: TourProps[] = [
  {
    id: "mp-1",
    slug: "machu-picchu-full-day-tren-expedition",
    title: "Machu Picchu Full Day en Tren Expedition",
    location: "Cusco - Machu Picchu",
    duration: "1 Día",
    price: 299,
    originalPrice: 350,
    rating: 4.9,
    reviewCount: 154,
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    badge: "Más Vendido",
  },
  {
    id: "mp-2",
    slug: "machupicchu-full-day-con-tren-vistadome",
    title: "Machu Picchu Full Day en Tren Vistadome Panorámico",
    location: "Cusco - Machu Picchu",
    duration: "1 Día",
    price: 360,
    originalPrice: 420,
    rating: 5.0,
    reviewCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=800&q=80",
    badge: "VIP Panorámico",
  },
  {
    id: "mp-3",
    slug: "tour-machu-picchu-2-dias",
    title: "Tour Machu Picchu + Valle Sagrado 2 Días / 1 Noche",
    location: "Valle Sagrado - Machu Picchu",
    duration: "2 Días",
    price: 450,
    originalPrice: 520,
    rating: 4.9,
    reviewCount: 110,
    imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
    badge: "Paquete Completo",
  },
];

export const metadata = {
  title: "Viaja a Machu Picchu en 2026: Entradas, Circuitos y Paquetes | Chullos Tours",
  description: "Guía definitiva para viajar a Machu Picchu en 2026. Conoce los nuevos circuitos, cómo comprar boletos, clima y reserva paquetes con descuento.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Puedo comprar entradas a Machu Picchu en la puerta en 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Las entradas a Machu Picchu no se venden en la puerta de ingreso. Deben ser adquiridas de forma anticipada y online a través de la plataforma oficial tuboleto.cultura.pe o mediante una agencia autorizada."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son los nuevos circuitos de Machu Picchu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Existen 3 circuitos principales: Circuito 1 (Panorámico, ideal para fotos clásicas), Circuito 2 (Clásico, el más recomendado para ver la ciudadela) y Circuito 3 (Realeza, para quienes desean realizar caminatas como Huayna Picchu)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Con cuánto tiempo de anticipación debo comprar mi entrada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Se recomienda reservar las entradas con al menos 60 días de anticipación, especialmente si deseas el Circuito 2 (Clásico) o si viajas en temporada alta (mayo a octubre)."
      }
    }
  ]
};

export default function MachuPicchuPromoPage() {
  return (
    <div className="flex flex-col gap-16 pb-16 bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Campaign Banner */}
      <section className="relative min-h-[550px] flex items-center justify-center bg-[#111330] overflow-hidden text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 flex flex-col items-center gap-5 z-10 py-16">
          <span className="bg-[#ff681a] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Guía y Ofertas 2026
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
            Viaja a Machu Picchu en <span className="text-[#37d4d9]">2026</span>
          </h1>

          <p className="text-gray-200 text-base sm:text-lg max-w-2xl font-light drop-shadow">
            Descubre los nuevos circuitos, asegura tus boletos oficiales y reserva paquetes con todo incluido. Planifica tu viaje perfecto a la ciudadela inca.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link href="#ofertas">
              <Button variant="primary" size="lg" className="font-bold">
                Ver Paquetes en Oferta
              </Button>
            </Link>
            <Link href="#guia">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Leer Guía de Viaje
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campaign Offers */}
      <section id="ofertas" className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-8 pt-8">
        <div className="text-center max-w-xl mx-auto flex flex-col items-center">
          <span className="text-[#ff681a] text-xs font-bold uppercase tracking-wider">
            Reserva Anticipada
          </span>
          <h2 className="text-3xl font-extrabold text-[#1c1c1c] mt-1">
            Paquetes Promocionales
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Garantiza tu ingreso reservando tu paquete completo. Cupos limitados para temporada alta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAMPAIGN_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        
        {/* Lead Capture Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#111330]">¿Necesitas un viaje a medida?</h3>
            <p className="text-slate-600 mt-1">Nuestros expertos te ayudarán a elegir el mejor circuito y tren según tus fechas.</p>
          </div>
          <Button variant="primary" className="whitespace-nowrap shadow-md">
            Solicitar Asesoría Gratuita
          </Button>
        </div>
      </section>

      {/* SEO/GEO Informative Content */}
      <section id="guia" className="max-w-7xl mx-auto px-4 w-full flex flex-col lg:flex-row gap-12 mt-8">
        
        {/* Left Column: Circuits */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1c1c1c] flex items-center gap-2">
              <Map className="w-8 h-8 text-[#ff681a]" />
              Los 3 Nuevos Circuitos 2026
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              El sistema de visitas a Machu Picchu ha cambiado. Ya no se puede recorrer toda la ciudadela con un solo boleto. Ahora debes elegir entre 3 circuitos, cada uno con un enfoque distinto. <strong>Importante:</strong> Una vez dentro, no puedes cambiar de ruta ni retroceder.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#111330]">Circuito 1: Panorámico</h3>
              <p className="text-slate-600 mt-2 text-sm">Ideal para la fotografía clásica desde la parte alta.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> <strong>Rutas:</strong> Montaña Machu Picchu, Terraza Superior, Inti Punku.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> <strong>Lo mejor:</strong> La vista de postal de la ciudadela.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm ring-1 ring-blue-50">
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mb-2">Más Recomendado</div>
              <h3 className="text-xl font-bold text-[#111330]">Circuito 2: Clásico</h3>
              <p className="text-slate-600 mt-2 text-sm">El recorrido más completo por el sector urbano y templos sagrados.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> <strong>Rutas:</strong> Ruta Diseñada (Clásica), Terraza Inferior.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> <strong>Lo mejor:</strong> Conocerás a detalle la historia Inca paseando por las ruinas.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#111330]">Circuito 3: Realeza</h3>
              <p className="text-slate-600 mt-2 text-sm">Diseñado para aventureros y enfocado en la zona baja.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> <strong>Rutas:</strong> Huayna Picchu, Huchuy Picchu, Gran Caverna.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> <strong>Lo mejor:</strong> Las caminatas hacia las montañas adyacentes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Tips & Info */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-slate-900 text-white p-6 rounded-xl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Requisitos y Novedades
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li>
                <strong className="text-white block">Plataforma Oficial</strong>
                Las entradas en 2026 se compran en <em>tuboleto.cultura.pe</em>. No hay venta en la puerta física.
              </li>
              <li>
                <strong className="text-white block">Anticipación</strong>
                Reserva con al menos 60 días. El aforo es limitado a 4,500 - 5,600 personas por día.
              </li>
              <li>
                <strong className="text-white block">Documentación</strong>
                El ingreso es con tu pasaporte o documento de identidad físico original. Debe coincidir con la entrada.
              </li>
              <li>
                <strong className="text-white block">Guía Obligatorio</strong>
                Es requisito ingresar acompañado de un guía oficial de turismo.
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-[#111330]">Mejor Época para Viajar</h3>
             <p className="text-sm text-slate-600 mt-3">
               <strong>Temporada Seca (Mayo a Octubre):</strong> Días soleados, cielos despejados. Ideal para fotos y evitar la lluvia. Hay más turistas.
             </p>
             <p className="text-sm text-slate-600 mt-3">
               <strong>Temporada de Lluvias (Noviembre a Abril):</strong> Paisajes más verdes, menos aglomeración de turistas. Febrero es el mes más lluvioso (el Camino Inca cierra).
             </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 w-full mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-[#1c1c1c] flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#ff681a]" />
            Preguntas Frecuentes (FAQ)
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-bold text-[#111330]">¿Puedo comprar entradas a Machu Picchu en la puerta en 2026?</h4>
            <p className="text-sm text-slate-600 mt-2">No. Las entradas a Machu Picchu no se venden en la puerta de ingreso. Deben ser adquiridas de forma anticipada y online a través de la plataforma oficial tuboleto.cultura.pe o mediante una agencia autorizada.</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-bold text-[#111330]">¿Cuáles son los nuevos circuitos de Machu Picchu?</h4>
            <p className="text-sm text-slate-600 mt-2">Existen 3 circuitos principales: Circuito 1 (Panorámico, ideal para fotos clásicas), Circuito 2 (Clásico, el más recomendado para ver la ciudadela) y Circuito 3 (Realeza, para quienes desean realizar caminatas como Huayna Picchu).</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="font-bold text-[#111330]">¿Con cuánto tiempo de anticipación debo comprar mi entrada?</h4>
            <p className="text-sm text-slate-600 mt-2">Se recomienda reservar las entradas con al menos 60 días de anticipación, especialmente si deseas el Circuito 2 (Clásico) o si viajas en temporada alta (mayo a octubre).</p>
          </div>
        </div>
      </section>
      
    </div>
  );
}

