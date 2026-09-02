/**
 * One-time enrichment of tour JSON files for production pricing model.
 * Run: node scripts/enrich-tour-jsons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toursDir = path.join(__dirname, "..", "data", "tours");

/** slug -> precio_usd from commercial list + schema-known packages */
const PRICE_BY_SLUG = {
  "city-tour-cusco": 40,
  "valle-sagrado-vip-tour-cusco": 45,
  "machu-picchu-full-day-tren-expedition": 300,
  "machupicchu-full-day-con-tren-vistadome": 360,
  "machupicchu-full-day-con-tren-observatory": 380,
  "machupicchu-full-day-con-tren-vistadome-observatory": 420,
  "machupicchu-full-day-tren-expedition-vistadome": 340,
  "montana-colores-vinicunca-tour": 40,
  "tour-morada-de-los-dioses-cuatrimoto": 80,
  "laguna-humantay-tour-cusco": 40,
  "glaciar-quelccaya-tour": 70,
  "atv-maras-moray-cuatrimotos": 60,
  "cusco-mistico-morada-dioses": 50,
  "cusco-escenico-city-tour-nocturno": 30,
  "puente-qeswachaka-tour-full-day": 50,
  "waqrapukara-trekking": 50,
  "7-lagunas-ausangate-pacchanta": 45,
  "valle-sur-cusco-tipon-pikillacta": 45,
  "cataratas-poc-poc-chinchero": 45,
  "machu-picchu-by-car-2-dias": 180,
  "camino-inca-2-dias": 570,
  "camino-inca-4-dias": 795,
  "tour-puno-full-day-uros-taquile": 120,
  "tour-puno-2-dias-uros-amantani": 200,
  "tour-lago-titicaca-2-dias": 180,
  "lima-city-tour": 70,
  "huacachina-islas-ballestas-lima": 120,
  "tour-machu-picchu-2-dias": 280,
  "cusco-fascinante-4-dias": 380,
  "descubre-cusco-3-dias": 290,
  "cusco-magico-5-dias": 550,
  "lo-mejor-de-cusco-6-dias": 590,
  "gran-imperio-inca-7-dias": 475,
  "tesoros-del-peru-7-dias": 778,
};

const STOCK = {
  machu: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
  mountain: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
  lake: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1200&q=80",
  valley: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=1200&q=80",
  cusco: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
  lima: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=1200&q=80",
  desert: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
  trek: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  atv: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
};

function schemaPrice(tour) {
  if (tour.seo_schema && Array.isArray(tour.seo_schema["@graph"])) {
    const prod = tour.seo_schema["@graph"].find((g) => g && g["@type"] === "Product");
    if (prod?.offers?.price) {
      const n = parseFloat(prod.offers.price);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return null;
}

function inferDestinos(tour) {
  const slug = (tour.slug || "").toLowerCase();
  const loc = (tour.atributos?.ubicacion || "").toLowerCase();
  const title = (tour.titulo || "").toLowerCase();
  const ids = new Set();

  if (slug.includes("puno") || slug.includes("titicaca") || slug.includes("uros") || loc.includes("puno")) {
    ids.add("puno");
    ids.add("lago-titicaca");
  }
  if (slug.includes("lima") || slug.includes("huacachina") || slug.includes("ballestas") || loc.includes("lima") || loc.includes("ica")) {
    ids.add("lima");
  }
  if (slug.includes("machu") || title.includes("machu picchu") || loc.includes("machu")) {
    ids.add("machu-picchu");
    ids.add("cusco");
  }
  if (slug.includes("valle-sagrado") || title.includes("valle sagrado") || loc.includes("valle sagrado")) {
    ids.add("valle-sagrado");
    ids.add("cusco");
  }
  if (slug.includes("camino-inca")) {
    ids.add("machu-picchu");
    ids.add("cusco");
  }
  if (ids.size === 0) {
    ids.add("cusco");
    if (slug.includes("cusco") || loc.includes("cusco")) ids.add("cusco-ciudad");
  } else if ([...ids].some((d) => d === "cusco" || d === "machu-picchu" || d === "valle-sagrado")) {
    // keep cusco for regional filter
  }

  // City tours around cusco
  if (
    slug.includes("city-tour") ||
    slug.includes("escenico") ||
    slug.includes("mistico") ||
    slug.includes("humantay") ||
    slug.includes("vinicunca") ||
    slug.includes("maras") ||
    slug.includes("waqrapukara") ||
    slug.includes("quelccaya") ||
    slug.includes("ausangate") ||
    slug.includes("qeswachaka") ||
    slug.includes("poc-poc") ||
    slug.includes("valle-sur") ||
    slug.includes("tipon")
  ) {
    ids.add("cusco");
    ids.add("cusco-ciudad");
  }

  return [...ids];
}

function shouldHaveHuayna(tour) {
  const slug = tour.slug.toLowerCase();
  const title = tour.titulo.toLowerCase();
  if (slug.includes("camino-inca") || slug.includes("by-car")) return false;
  if (slug.includes("humantay") || slug.includes("vinicunca") || slug.includes("ausangate")) return false;
  if (slug.includes("puno") || slug.includes("lima") || slug.includes("huacachina")) return false;
  if (slug.includes("city-tour") || slug.includes("valle-sagrado") || slug.includes("valle-sur")) return false;
  if (slug.includes("cuatrimoto") || slug.includes("atv") || slug.includes("qeswachaka")) return false;
  return (
    slug.includes("machu") ||
    title.includes("machu picchu") ||
    (tour.opciones_hotel && tour.opciones_hotel.length > 0 && (slug.includes("cusco") || slug.includes("imperio") || slug.includes("tesoros") || slug.includes("mejor")))
  );
}

function stockGallery(tour) {
  const slug = tour.slug.toLowerCase();
  let primary = STOCK.cusco;
  if (slug.includes("machu") || slug.includes("camino-inca")) primary = STOCK.machu;
  else if (slug.includes("humantay") || slug.includes("ausangate") || slug.includes("quelccaya")) primary = STOCK.lake;
  else if (slug.includes("vinicunca") || slug.includes("montana")) primary = STOCK.mountain;
  else if (slug.includes("valle")) primary = STOCK.valley;
  else if (slug.includes("lima") || slug.includes("huacachina")) primary = STOCK.desert;
  else if (slug.includes("atv") || slug.includes("cuatrimoto")) primary = STOCK.atv;
  else if (slug.includes("trek") || slug.includes("waqra") || slug.includes("poc")) primary = STOCK.trek;

  const title = tour.titulo;
  return [
    { src: primary, alt: `${title} - vista principal` },
    { src: STOCK.valley, alt: `${title} - paisaje andino` },
    { src: STOCK.cusco, alt: `${title} - experiencia en Cusco` },
    { src: STOCK.machu, alt: `${title} - patrimonio del Perú` },
  ];
}

function ensureFaqs(tour) {
  const existing = Array.isArray(tour.faqs) ? [...tour.faqs] : [];
  const title = tour.titulo;
  const duration = tour.atributos?.duracion || "Full Day";
  const price = tour.precio_usd || schemaPrice(tour) || 0;
  const incluyeSample = (tour.incluye || []).slice(0, 3).join("; ") || "transporte, guía e ingresos según itinerario";
  const dificultad = tour.atributos?.dificultad || tour.atributos?.nivel_fisico || "Moderada";
  const altitud = tour.atributos?.altitud_maxima || "según el itinerario";

  const bank = [
    {
      pregunta: `¿Qué incluye exactamente el tour ${title}?`,
      respuesta: `El precio desde USD $${price} por persona contempla: ${incluyeSample}. Revisa la sección “Incluye” de esta página para el detalle completo.`,
    },
    {
      pregunta: "¿Con cuánta anticipación debo reservar?",
      respuesta:
        "Recomendamos reservar con al menos 7 a 15 días de anticipación para full days, y 30 a 60 días para paquetes con Machu Picchu o Camino Inca por la disponibilidad de cupos y trenes.",
    },
    {
      pregunta: "¿El tour es apto para niños o adultos mayores?",
      respuesta: `Depende de la exigencia física (${dificultad}). Los full days culturales son más flexibles; trekkings de altura requieren buena condición. Contáctanos si viajas con niños o adultos mayores para ajustar el ritmo.`,
    },
    {
      pregunta: "¿Qué debo llevar el día del tour?",
      respuesta:
        "Documento de identidad o pasaporte, ropa en capas, protector solar, gorra, agua, snacks ligeros y dinero en efectivo para gastos personales. En trekkings añade calzado de agarre y chaqueta impermeable.",
    },
    {
      pregunta: "¿Hay mal de altura? ¿Cómo prepararme?",
      respuesta: `La altitud máxima del recorrido es ${altitud}. Te sugerimos llegar a Cusco 1 día antes, hidratarte, evitar alcohol el primer día y considerar mate de coca. Avisa a tu guía si presentas molestias.`,
    },
    {
      pregunta: "¿Puedo cancelar o cambiar la fecha?",
      respuesta:
        "Sí, sujeto a políticas del servicio (trenes, entradas y hoteles). Avísanos lo antes posible por WhatsApp o correo; te orientaremos según la fecha y el tipo de experiencia.",
    },
    {
      pregunta: "¿El precio es por persona? ¿Hay descuento para grupos?",
      respuesta: `Sí, las tarifas publicadas son por persona (habitualmente en base doble para paquetes). Grupos de 4 o más viajeros pueden solicitar tarifa especial por WhatsApp.`,
    },
    {
      pregunta: `¿Cuánto dura ${title}?`,
      respuesta: `La duración oficial es ${duration}. Los horarios exactos de recojo se confirman el día anterior según tu hotel o punto de encuentro.`,
    },
    {
      pregunta: "¿Habrá guía en español e inglés?",
      respuesta:
        "Sí. Operamos con guías oficiales bilingües (español/inglés). Si necesitas otro idioma, consúltanos al reservar.",
    },
    {
      pregunta: "¿Cómo confirmo mi reserva y pago?",
      respuesta:
        "Envías la solicitud desde la web o WhatsApp. Un asesor confirma disponibilidad y te indica el método de pago (transferencia, tarjeta u otros). No se cobra automáticamente en la web.",
    },
  ];

  const seen = new Set(existing.map((f) => f.pregunta.toLowerCase().trim()));
  for (const faq of bank) {
    if (existing.length >= 8) break;
    const key = faq.pregunta.toLowerCase().trim();
    if (seen.has(key)) continue;
    existing.push(faq);
    seen.add(key);
  }
  // ensure at least 7
  while (existing.length < 7 && bank[existing.length]) {
    existing.push(bank[existing.length]);
  }
  return existing.slice(0, 10);
}

function enrichGallery(tour) {
  let gal = Array.isArray(tour.galeria) ? tour.galeria : [];
  if (gal.length === 0) {
    gal = stockGallery(tour);
  }
  return gal.map((img, i) => ({
    src: img.src,
    alt:
      img.alt && String(img.alt).trim().length > 3
        ? img.alt
        : `${tour.titulo} - foto ${i + 1}`,
  }));
}

function buildTarifasFromDescuentos(tour) {
  if (tour.tarifas_personas && tour.tarifas_personas.length) return tour.tarifas_personas;
  const menores = tour.descuentos?.menores;
  if (!menores || !menores.length) return undefined;

  return menores.map((m, idx) => {
    const lower = (m.nota || "").toLowerCase();
    const isFree = lower.includes("no pagan") || lower.includes("gratis");
    return {
      id: `menor-${idx + 1}`,
      label: m.rango_edad || `Menor ${idx + 1}`,
      rango_edad: m.rango_edad,
      descuento_soles: m.descuento_soles,
      descuento_usd: m.descuento_usd,
      nota: m.nota,
      tipo: isFree ? "free" : "discount",
    };
  });
}

function enrich(tour) {
  const slug = tour.slug;
  let precio =
    (typeof tour.precio_usd === "number" && tour.precio_usd > 0 && tour.precio_usd) ||
    (typeof tour.precio === "number" && tour.precio > 0 && tour.precio) ||
    PRICE_BY_SLUG[slug] ||
    schemaPrice(tour);

  if (!precio || precio <= 0) precio = 65;

  tour.precio_usd = precio;
  tour.precio = precio;

  if (!tour.destino_ids || !tour.destino_ids.length) {
    tour.destino_ids = inferDestinos(tour);
  }

  tour.galeria = enrichGallery(tour);
  tour.faqs = ensureFaqs(tour);

  if (!tour.precios_comparacion) {
    tour.precios_comparacion = {
      agencias_usd: Math.round(precio * 1.22),
      online_usd: Math.round(precio * 1.12),
      etiqueta: "Precio medio de referencia en el mercado",
    };
  }

  // Extras: Huayna when applicable
  const extras = Array.isArray(tour.extras) ? [...tour.extras] : [];
  const hasHuayna = extras.some((e) => e.id === "huayna-picchu");
  if (shouldHaveHuayna(tour) && !hasHuayna) {
    extras.push({
      id: "huayna-picchu",
      label: "Entrada Huayna Picchu",
      precio_usd: 20,
      precio_soles: 75,
      enabled: true,
      descripcion: "Ascenso opcional a la montaña Huayna Picchu (cupos limitados).",
    });
  }
  // Ensure enabled flag exists on all extras
  tour.extras = extras.map((e) => ({
    ...e,
    enabled: e.enabled !== false,
  }));

  const tarifas = buildTarifasFromDescuentos(tour);
  if (tarifas) tour.tarifas_personas = tarifas;

  // Sync schema product price if present
  if (tour.seo_schema && Array.isArray(tour.seo_schema["@graph"])) {
    for (const node of tour.seo_schema["@graph"]) {
      if (node && node["@type"] === "Product" && node.offers) {
        node.offers.price = String(precio);
        if (!node.offers.priceCurrency) node.offers.priceCurrency = "USD";
      }
    }
  }

  return tour;
}

const files = fs.readdirSync(toursDir).filter((f) => {
  const p = path.join(toursDir, f);
  return f.endsWith(".json") && fs.statSync(p).isFile() && f !== "rutas_migracion.json";
});

let count = 0;
for (const file of files) {
  const fp = path.join(toursDir, file);
  const tour = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!tour.slug) {
    console.warn("Skip (no slug):", file);
    continue;
  }
  const updated = enrich(tour);
  fs.writeFileSync(fp, JSON.stringify(updated, null, 2) + "\n", "utf8");
  count++;
  console.log(
    "OK",
    file,
    "| $",
    updated.precio_usd,
    "| dest",
    (updated.destino_ids || []).join(","),
    "| faqs",
    updated.faqs.length,
    "| gal",
    updated.galeria.length,
    "| extras",
    (updated.extras || []).length
  );
}
console.log("Enriched", count, "tours");
