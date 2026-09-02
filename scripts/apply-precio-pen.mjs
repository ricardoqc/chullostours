/**
 * Calcula y escribe precio_pen / precio_soles en tours JSON.
 * Uso: node scripts/apply-precio-pen.mjs
 */
import fs from "fs";
import path from "path";

const TOURS_DIR = path.join(process.cwd(), "data", "tours");
const SITE_CONFIG = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "site-config.json"), "utf8")
);
const RATE = SITE_CONFIG.pricing?.exchangeRatePen || 3.75;

function toPen(usd) {
  if (typeof usd !== "number" || usd <= 0) return undefined;
  return Math.round(usd * RATE);
}

function patchTour(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const tour = JSON.parse(raw);
  let changed = false;

  if (typeof tour.precio_usd === "number" && tour.precio_usd > 0) {
    const pen = toPen(tour.precio_usd);
    if (tour.precio_pen !== pen) {
      tour.precio_pen = pen;
      changed = true;
    }
  }

  if (Array.isArray(tour.opciones_hotel)) {
    for (const opt of tour.opciones_hotel) {
      if (typeof opt.precio_usd === "number" && opt.precio_usd > 0) {
        const pen = toPen(opt.precio_usd);
        if (opt.precio_pen !== pen) {
          opt.precio_pen = pen;
          changed = true;
        }
        if (opt.precio_soles !== pen) {
          opt.precio_soles = pen;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(tour, null, 2)}\n`, "utf8");
  }
  return changed;
}

const files = fs.readdirSync(TOURS_DIR).filter((f) => f.endsWith(".json"));
let updated = 0;
for (const file of files) {
  if (patchTour(path.join(TOURS_DIR, file))) {
    updated += 1;
    console.log(`✓ ${file}`);
  }
}
console.log(`\nListo: ${updated}/${files.length} tours actualizados (TC ${RATE}).`);
