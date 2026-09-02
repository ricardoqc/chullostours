/**
 * Aplica cambios de Fase 1: precios, paquetes, visibilidad, entradas.
 * Uso: node scripts/apply-phase1-tours.mjs
 */
import fs from "fs";
import path from "path";

const TOURS_DIR = path.join(process.cwd(), "data", "tours");

const AURI_AGUAS = {
  ciudad: "Aguas Calientes (Machu Picchu Pueblo)",
  hotel: "Machupicchu Inn",
  tipo_habitacion: "Doble o Matrimonial",
  servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
};

const INTI_AGUAS = {
  ciudad: "Aguas Calientes (Machu Picchu Pueblo)",
  hotel: "Hotel Intiwatana Aguas Calientes",
  sitio_web: "https://www.intiwatana.pe/#/home",
  tipo_habitacion: "Doble o Matrimonial",
  servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
};

const ROJAS_AGUAS = {
  ciudad: "Aguas Calientes (Machu Picchu Pueblo)",
  hotel: "Rojas Inn Aguas Calientes",
  sitio_web: "https://hotelrojasinn.com/room/standard-double-room/",
  tipo_habitacion: "Doble o Matrimonial",
  servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
};

function buildOpcionesHotel({ solo, auri, inti, rojas }) {
  return [
    {
      id: "solo_tour",
      nombre: "Solo tour (sin hotel en Cusco)",
      categoria: "Solo tour",
      precio_usd: solo,
      precio_etiqueta: `USD $${solo}.00 / persona`,
      descripcion:
        "Incluye traslados, entradas, trenes y guía según itinerario. Alojamiento en Cusco por cuenta del viajero.",
      hoteles: [AURI_AGUAS],
    },
    {
      id: "auri_basico",
      nombre: "Tour + Hotel Auri Básico",
      categoria: "Básico",
      precio_usd: auri,
      precio_etiqueta: `USD $${auri}.00 / persona`,
      descripcion: "Comodidad esencial con Auri Boutique Hotel en Cusco y noche en Aguas Calientes incluida.",
      estrellas: 3,
      hoteles: [
        {
          ciudad: "Cusco",
          hotel: "Auri Boutique Hotel",
          direccion: "Calle Pardo, Cusco",
          tipo_habitacion: "Doble o Matrimonial",
          servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
        },
        AURI_AGUAS,
      ],
    },
    {
      id: "intiwatana",
      nombre: "Tour + Hotel Intiwatana",
      categoria: "Boutique",
      precio_usd: inti,
      precio_etiqueta: `USD $${inti}.00 / persona`,
      descripcion: "Experiencia boutique con Hotel Intiwatana en Cusco y Aguas Calientes.",
      estrellas: 4,
      hoteles: [
        {
          ciudad: "Cusco",
          hotel: "Hotel Intiwatana",
          direccion: "Calle Afligidos, Cusco",
          sitio_web: "https://www.intiwatana.pe/#/home",
          tipo_habitacion: "Doble o Matrimonial",
          servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
        },
        INTI_AGUAS,
      ],
    },
    {
      id: "rojas_inn",
      nombre: "Tour + Hotel Rojas Inn",
      categoria: "3 Estrellas",
      precio_usd: rojas,
      precio_etiqueta: `USD $${rojas}.00 / persona`,
      descripcion: "Mayor confort con Hotel Rojas Inn en Cusco y Aguas Calientes.",
      estrellas: 3,
      hoteles: [
        {
          ciudad: "Cusco",
          hotel: "Hotel Rojas Inn",
          direccion: "Calle Tigre o Santa, Cusco",
          sitio_web: "https://hotelrojasinn.com/room/standard-double-room/",
          tipo_habitacion: "Doble o Matrimonial",
          servicios: ["Desayuno incluido", "Baño privado", "Ducha caliente", "Artículos de baño", "Wifi", "Cable TV"],
        },
        ROJAS_AGUAS,
      ],
    },
  ];
}

const DEFAULT_TARIFAS = [
  { id: "adulto", label: "Adulto (18–100 años)", rango_edad: "18-100", edad_min: 18, edad_max: 100, tipo: "fixed", descuento_usd: 0 },
  { id: "joven", label: "Joven (12–17 años)", rango_edad: "12-17", edad_min: 12, edad_max: 17, tipo: "discount", descuento_usd: 20 },
  { id: "nino", label: "Niño (3–11 años)", rango_edad: "3-11", edad_min: 3, edad_max: 11, tipo: "discount", descuento_usd: 30 },
  { id: "infante", label: "Infante (0–2 años)", rango_edad: "0-2", edad_min: 0, edad_max: 2, tipo: "free", descuento_usd: 0 },
];

const CAMINO_INCA_TARIFAS = DEFAULT_TARIFAS.filter((t) => t.id !== "nino");

function setPrice(tour, usd) {
  tour.precio_usd = usd;
  tour.precio = usd;
  if (tour.seo_schema?.["@graph"]) {
    for (const node of tour.seo_schema["@graph"]) {
      if (node?.["@type"] === "Product" && node.offers) {
        node.offers.price = String(usd);
      }
    }
  }
}

function setEntradasPaquete(tour) {
  tour.boleto_turistico = { tipo: "BTC_GENERAL", incluido: true, precio_pen: 130 };
  tour.entradas_incluidas = {
    destacado: true,
    titulo: "Entradas incluidas",
    detalle: "Ingreso a Machu Picchu + Boleto Turístico General del Cusco (BTC).",
    variant: "gold",
  };
  tour.aplica_descuentos_edad = true;
  tour.tarifas_personas = DEFAULT_TARIFAS;
}

function setEntradasMachu(tour) {
  tour.entradas_incluidas = {
    destacado: true,
    titulo: "Entradas incluidas",
    detalle: "Ingreso oficial a Machu Picchu, bus Consettur y tren turístico según itinerario.",
    variant: "gold",
  };
  tour.aplica_descuentos_edad = true;
  tour.tarifas_personas = DEFAULT_TARIFAS;
}

function readTour(file) {
  const p = path.join(TOURS_DIR, file);
  return { path: p, data: JSON.parse(fs.readFileSync(p, "utf8")) };
}

function writeTour(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// --- Precios individuales ---
const priceUpdates = {
  "machupicchu_full_day_con_tren_observatory.json": 460,
  "machupicchu_full_day_tren_expedition_vistadome.json": 365,
  "machu_picchu_full_day_tren_expedition.json": 300,
  "7_lagunas_ausangate_pacchanta.json": 50,
  "cataratas_poc_poc_chinchero.json": 100,
  "lima_city_tour.json": 80,
  "tour_machu_picchu_2_dias.json": 410,
  "tour_puno_2_dias_uros_amantani.json": 200,
};

for (const [file, price] of Object.entries(priceUpdates)) {
  const { path: p, data } = readTour(file);
  setPrice(data, price);
  if (file.includes("machu") || file.includes("machupicchu")) setEntradasMachu(data);
  writeTour(p, data);
  console.log(`Precio ${file} → ${price}`);
}

// --- Paquetes ---
const packages = {
  "descubre_cusco_3_dias.json": { solo: 460, auri: 490, inti: 520, rojas: 535 },
  "cusco_fascinante_4_dias.json": { solo: 490, auri: 530, inti: 580, rojas: 600 },
  "cusco_magico_5_dias.json": { solo: 510, auri: 565, inti: 630, rojas: 670 },
  "lo_mejor_de_cusco_6_dias.json": { solo: 550, auri: 620, inti: 700, rojas: 740 },
};

for (const [file, prices] of Object.entries(packages)) {
  const { path: p, data } = readTour(file);
  setPrice(data, prices.solo);
  data.opciones_hotel = buildOpcionesHotel(prices);
  setEntradasPaquete(data);
  // Mover BTC a incluido si estaba en no_incluye
  data.no_incluye = (data.no_incluye || []).filter(
    (x) => !x.toLowerCase().includes("boleto turístico") && !x.toLowerCase().includes("boleto turistico")
  );
  if (!data.incluye.some((x) => x.toLowerCase().includes("boleto turístico"))) {
    data.incluye.push("Boleto Turístico General del Cusco (BTC).");
  }
  writeTour(p, data);
  console.log(`Paquete ${file} actualizado`);
}

// --- Ocultar tours ---
for (const file of ["machu_picchu_by_car_2_dias.json", "tesoros_del_peru_7_dias.json"]) {
  const { path: p, data } = readTour(file);
  data.visible = false;
  writeTour(p, data);
  console.log(`Oculto ${file}`);
}

// --- Renombrar Observatory & Expedition ---
{
  const oldFile = "machupicchu_full_day_con_tren_vistadome_observatory.json";
  const newFile = "machupicchu_full_day_con_tren_observatory_expedition.json";
  const { path: p, data } = readTour(oldFile);
  data.titulo = "Machu Picchu Full Day con Tren Observatory & Expedition";
  data.slug = "machupicchu-full-day-con-tren-observatory-expedition";
  data.url = "/tours/machupicchu-full-day-con-tren-observatory-expedition/";
  setPrice(data, 380);
  setEntradasMachu(data);
  const newPath = path.join(TOURS_DIR, newFile);
  writeTour(newPath, data);
  fs.unlinkSync(p);
  console.log(`Renombrado ${oldFile} → ${newFile}`);
}

// --- Eliminar Vistadome solo ---
fs.unlinkSync(path.join(TOURS_DIR, "machupicchu_full_day_con_tren_vistadome.json"));
console.log("Eliminado machupicchu_full_day_con_tren_vistadome.json");

// --- Eliminar Titicaca duplicado ---
fs.unlinkSync(path.join(TOURS_DIR, "tour_lago_titicaca_2_dias.json"));
console.log("Eliminado tour_lago_titicaca_2_dias.json");

// --- Cusco Escénico → turno tarde ---
{
  const file = "cusco_escenico_city_tour_nocturno.json";
  const newFile = "cusco_escenico_city_tour_tarde.json";
  const { path: p, data } = readTour(file);
  let raw = JSON.stringify(data);
  raw = raw
    .replace(/Nocturno/gi, "Turno Tarde")
    .replace(/nocturno/gi, "turno tarde")
    .replace(/de noche/gi, "por la tarde")
    .replace(/cielo andino turno tarde/gi, "atardecer en el cielo andino");
  const updated = JSON.parse(raw);
  updated.titulo = "Cusco Escénico – City Tour Turno Tarde";
  updated.slug = "cusco-escenico-city-tour-tarde";
  updated.url = "/tours/cusco-escenico-city-tour-tarde/";
  updated.atributos.duracion = "Turno tarde / Medio Día (aprox. 4 horas)";
  updated.atributos.tipo_tour = updated.atributos.tipo_tour?.replace(/Nocturno/i, "Turno Tarde") || "City Tour / Turno Tarde";
  updated.horarios_disponibles = ["14:00 hrs – Salida desde Plaza de Armas"];
  if (updated.faqs?.[0]) {
    updated.faqs[0].pregunta = "¿A qué hora inicia el City Tour turno tarde?";
    updated.faqs[0].respuesta =
      "La salida es a las 14:00 hrs desde la Plaza de Armas de Cusco. El recorrido dura aproximadamente 4 horas (hasta cerca de las 18:00 hrs).";
  }
  setPrice(updated, updated.precio_usd || 30);
  const newPath = path.join(TOURS_DIR, newFile);
  writeTour(newPath, updated);
  fs.unlinkSync(p);
  console.log(`Renombrado ${file} → ${newFile}`);
}

// --- Camino Inca tarifas ---
for (const file of ["camino_inca_2_dias.json", "camino_inca_4_dias.json"]) {
  const { path: p, data } = readTour(file);
  data.aplica_descuentos_edad = true;
  data.tarifas_personas = CAMINO_INCA_TARIFAS;
  writeTour(p, data);
}

// --- Tour MP 2d tarifas ---
{
  const { path: p, data } = readTour("tour_machu_picchu_2_dias.json");
  setEntradasMachu(data);
  writeTour(p, data);
}

console.log("Fase 1 JSON completada.");
