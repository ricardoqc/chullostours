/**
 * One-shot: data/places.json → data/destinos/{slug}.json + index.json
 * Migrated destinations are published so existing public URLs keep working.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const placesPath = path.join(root, "data", "places.json");
const outDir = path.join(root, "data", "destinos");

const DESTINO_REGIONES = {
  cusco: "Cusco, Perú",
  "machu-picchu": "Cusco, Perú",
  "aguas-calientes": "Urubamba, Cusco",
  ollantaytambo: "Valle Sagrado, Cusco",
  sacsayhuaman: "Cusco, Perú",
  "valle-sagrado": "Urubamba, Cusco",
  humantay: "Anta, Cusco",
  vinicunca: "Canchis, Cusco",
  puno: "Puno, Perú",
  lima: "Lima, Perú",
};

const places = JSON.parse(fs.readFileSync(placesPath, "utf-8"));
fs.mkdirSync(outDir, { recursive: true });

const index = {
  total: 0,
  updated_at: new Date().toISOString(),
  destinations: [],
};

let id = 1;
for (const [slug, place] of Object.entries(places)) {
  const region = DESTINO_REGIONES[slug] || "Perú";
  const doc = {
    id,
    title: place.nombre,
    subtitle: "",
    slug,
    status: "publish",
    region,
    tipo: place.tipo || "landmark",
    excerpt: place.descripcion || "",
    body_html: `<p>${place.descripcion || ""}</p>`,
    info_html: "<p></p>",
    lugares: [],
    tips: [],
    geo: {
      lat: place.lat,
      lng: place.lng,
      country: "PE",
      region_label: region,
      schema_tourist_attraction: place.tipo === "landmark" || place.tipo === "nature" || place.tipo === "trek",
    },
    featured_image: place.imagen || "",
    featured_image_alt: place.nombre,
    gallery: place.imagen ? [place.imagen] : [],
    seo: {
      title: `Tours en ${place.nombre} | Chullos Tours`,
      description: place.descripcion || "",
      canonical: `https://chullostours.com/destinos/${slug}/`,
      og_image: place.imagen || "",
    },
    related_place_ids: [],
    created: new Date().toISOString().slice(0, 10),
    modified: new Date().toISOString().slice(0, 10),
  };

  const filePath = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`, "utf-8");
  index.destinations.push({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    region: doc.region,
    tipo: doc.tipo,
    excerpt: doc.excerpt,
    featured_image: doc.featured_image,
    lat: doc.geo.lat,
    lng: doc.geo.lng,
    filename: `${slug}.json`,
  });
  console.log(`✓ ${slug}`);
  id += 1;
}

index.total = index.destinations.length;
fs.writeFileSync(
  path.join(outDir, "index.json"),
  `${JSON.stringify(index, null, 2)}\n`,
  "utf-8"
);
console.log(`Migrated ${index.total} destinations → data/destinos/`);
