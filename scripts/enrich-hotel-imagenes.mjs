/**
 * Escribe campo editable hoteles[].imagenes en tours con opciones_hotel.
 * Usa catálogo local primero; si no hay, Unsplash referencial + imagenes_referenciales: true.
 *
 * Gran Imperio Inca 7d: no modifica tiers ni nombres — solo agrega imagenes editables.
 *
 * Uso: node scripts/enrich-hotel-imagenes.mjs
 *      node scripts/enrich-hotel-imagenes.mjs --dry-run
 */
import fs from "fs";
import path from "path";

const TOURS_DIR = path.join(process.cwd(), "data", "tours");
const DRY_RUN = process.argv.includes("--dry-run");

const catalog = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "hotel-images.json"), "utf8")
);
const unsplash = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "hotel-images-unsplash.json"), "utf8")
);

function normalize(name) {
  return name.trim().toLowerCase();
}

function cityBucket(ciudad) {
  const c = ciudad.toLowerCase();
  if (c.includes("lima")) return "default_lima";
  if (c.includes("aguas calientes") || c.includes("machu picchu pueblo")) {
    return "default_aguas_calientes";
  }
  return "default_cusco";
}

function resolveImages(hotel) {
  const key = normalize(hotel.hotel);
  if (catalog[key]?.length) {
    return { imagenes: catalog[key], imagenes_referenciales: false, source: "catalog" };
  }
  if (unsplash[key]?.length) {
    return { imagenes: unsplash[key], imagenes_referenciales: true, source: "unsplash" };
  }
  const bucket = cityBucket(hotel.ciudad);
  return {
    imagenes: unsplash[bucket] || unsplash.default_cusco,
    imagenes_referenciales: true,
    source: "unsplash",
  };
}

const report = {
  updated: [],
  skipped: [],
  referential: [],
};

const files = fs
  .readdirSync(TOURS_DIR)
  .filter((f) => f.endsWith(".json") && !f.startsWith("."));

for (const file of files) {
  const filePath = path.join(TOURS_DIR, file);
  const tour = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(tour.opciones_hotel)) continue;

  let changed = false;

  for (const opt of tour.opciones_hotel) {
    if (!Array.isArray(opt.hoteles)) continue;
    for (const hotel of opt.hoteles) {
      if (hotel.imagenes?.length > 0) {
        report.skipped.push(`${file} → ${hotel.hotel} (ya tiene imagenes en JSON)`);
        continue;
      }

      const resolved = resolveImages(hotel);
      hotel.imagenes = resolved.imagenes;
      hotel.imagenes_referenciales = resolved.imagenes_referenciales;
      changed = true;

      const line = `${file} → ${hotel.hotel} [${resolved.source}]`;
      report.updated.push(line);
      if (resolved.imagenes_referenciales) {
        report.referential.push(line);
      }
    }
  }

  if (changed && !DRY_RUN) {
    fs.writeFileSync(filePath, `${JSON.stringify(tour, null, 2)}\n`, "utf8");
  }
}

console.log("\n=== Enriquecimiento hoteles[].imagenes ===\n");
if (DRY_RUN) console.log("(modo dry-run — sin escribir archivos)\n");

console.log(`Actualizados: ${report.updated.length}`);
report.updated.forEach((l) => console.log(`  ✓ ${l}`));

console.log(`\nReferenciales Unsplash (reemplazar en JSON): ${report.referential.length}`);
report.referential.forEach((l) => console.log(`  ⚠ ${l}`));

console.log(`\nOmitidos (ya editables): ${report.skipped.length}`);
if (report.skipped.length <= 8) {
  report.skipped.forEach((l) => console.log(`  · ${l}`));
} else {
  console.log(`  (${report.skipped.length} hoteles con imagenes propias)`);
}

console.log(
  "\nEdita fotos en: data/tours/<tour>.json → opciones_hotel[].hoteles[].imagenes"
);
console.log("Marca imagenes_referenciales: false al subir fotos reales.\n");
