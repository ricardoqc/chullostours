/**
 * Export tours to a CMS-friendly flat JSON for Strapi/Directus import.
 * Run: node scripts/export-tours-for-cms.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toursDir = path.join(__dirname, "..", "data", "tours");
const outDir = path.join(__dirname, "..", "data", "exports");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(toursDir).filter((f) => {
  const p = path.join(toursDir, f);
  return f.endsWith(".json") && fs.statSync(p).isFile() && f !== "rutas_migracion.json";
});

const tours = [];
const hotels = [];
const extras = [];
const faqs = [];
const gallery = [];

for (const file of files) {
  const tour = JSON.parse(fs.readFileSync(path.join(toursDir, file), "utf8"));
  if (!tour.slug) continue;

  tours.push({
    source_file: file,
    id: tour.id || tour.slug,
    slug: tour.slug,
    titulo: tour.titulo,
    precio_usd: tour.precio_usd,
    precio_soles: tour.precio_soles || null,
    destino_ids: tour.destino_ids || [],
    categoria: tour.categoria || null,
    duracion: tour.atributos?.duracion || null,
    ubicacion: tour.atributos?.ubicacion || null,
    resumen: tour.resumen,
    incluye: tour.incluye || [],
    no_incluye: tour.no_incluye || [],
    destacados_highlights: tour.destacados_highlights || [],
    precios_comparacion: tour.precios_comparacion || null,
    seo_meta_title: tour.seo?.meta_title || null,
    seo_meta_description: tour.seo?.meta_description || null,
  });

  for (const h of tour.opciones_hotel || []) {
    hotels.push({ tour_slug: tour.slug, ...h });
  }
  for (const e of tour.extras || []) {
    extras.push({ tour_slug: tour.slug, ...e });
  }
  for (const f of tour.faqs || []) {
    faqs.push({ tour_slug: tour.slug, ...f });
  }
  for (const g of tour.galeria || []) {
    gallery.push({ tour_slug: tour.slug, src: g.src, alt: g.alt });
  }
}

const payload = {
  exported_at: new Date().toISOString(),
  cms_notes:
    "Map tours → Collection Type Tour; hotels/extras/faqs/gallery as components or related collections. Target: Strapi or Directus + Postgres/MySQL.",
  counts: {
    tours: tours.length,
    hotels: hotels.length,
    extras: extras.length,
    faqs: faqs.length,
    gallery: gallery.length,
  },
  tours,
  hotels,
  extras,
  faqs,
  gallery,
};

fs.writeFileSync(
  path.join(outDir, "tours-cms-export.json"),
  JSON.stringify(payload, null, 2)
);
console.log("Wrote data/exports/tours-cms-export.json", payload.counts);
