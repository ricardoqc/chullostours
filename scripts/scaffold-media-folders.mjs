/**
 * Crea la estructura de carpetas para fotos en public/.
 * Lee slugs de data/tours/*.json + data/media-structure.json
 *
 * Uso: node scripts/scaffold-media-folders.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const TOURS_DIR = path.join(ROOT, "data", "tours");
const STRUCTURE_PATH = path.join(ROOT, "data", "media-structure.json");

const structure = JSON.parse(fs.readFileSync(STRUCTURE_PATH, "utf8"));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeKeep(dir, note) {
  ensureDir(dir);
  const keepPath = path.join(dir, ".gitkeep");
  if (!fs.existsSync(keepPath)) {
    fs.writeFileSync(keepPath, note ? `# ${note}\n` : "", "utf8");
  }
}

function writeInventory(dir, lines) {
  const file = path.join(dir, "_INVENTARIO.txt");
  fs.writeFileSync(file, lines.join("\n") + "\n", "utf8");
}

const created = [];

function track(p) {
  created.push(p);
}

// --- img/ ---
const imgDirs = [
  ["public/img/brand", "Logos e identidad → /img/brand/"],
  ["public/img/marketing", "Banners y fondos → /img/marketing/"],
  ["public/img/legal-brands", "Certificaciones → /img/legal-brands/"],
  ["public/img/placeholders", "Placeholder → /img/placeholders/placeholder.jpg"],
];

for (const [rel, note] of imgDirs) {
  const abs = path.join(ROOT, rel);
  writeKeep(abs, note);
  track(rel);
}

writeInventory(path.join(PUBLIC, "img"), [
  "CARPETAS DE MARCA Y UI",
  "brand/          Logos (Chullos-Tourslogo.png, favicon)",
  "marketing/      Fondos home, footer, perfiles",
  "legal-brands/   TripAdvisor, MINCETUR, ESSNA, etc.",
  "placeholders/   placeholder.jpg genérico",
  "",
  "Rutas en código: /img/brand/... o /img/... (legacy en raíz img/)",
]);

// --- tours/ ---
const tourFiles = fs.readdirSync(TOURS_DIR).filter((f) => f.endsWith(".json"));
const slugs = [];

for (const file of tourFiles) {
  const tour = JSON.parse(fs.readFileSync(path.join(TOURS_DIR, file), "utf8"));
  if (!tour.slug) continue;
  slugs.push(tour.slug);

  const tourDir = path.join(PUBLIC, "media", "tours", tour.slug);
  writeKeep(tourDir, `Tour: ${tour.titulo || tour.slug}`);
  writeKeep(path.join(tourDir, "gallery"), "Fotos extra opcionales");
  writeKeep(path.join(tourDir, "og"), "og.jpg para Open Graph");

  writeInventory(tourDir, [
    `TOUR: ${tour.titulo || tour.slug}`,
    `Slug JSON: ${tour.slug}`,
    "",
    "Convención (en esta carpeta):",
    "  01.jpg       Hero principal",
    "  02.jpg … 08.jpg   Galería detalle",
    "  og/og.jpg    Imagen redes (opcional)",
    "  gallery/     Extras sin renumerar",
    "",
    "URL web: /media/tours/" + tour.slug + "/01.jpg",
  ]);
  track(`public/media/tours/${tour.slug}/`);
}

writeInventory(path.join(PUBLIC, "media", "tours"), [
  "FOTOS DE TOURS — una carpeta por slug",
  `Total tours: ${slugs.length}`,
  "",
  "Cada subcarpeta = slug del JSON en data/tours/",
  "Ver _INVENTARIO.txt dentro de cada tour.",
]);

// --- hoteles/ ---
for (const hotel of structure.hoteles) {
  const hotelDir = path.join(PUBLIC, "hoteles", hotel.slug);
  writeKeep(hotelDir, hotel.nombre);

  writeInventory(hotelDir, [
    `HOTEL: ${hotel.nombre}`,
    `Ciudad: ${hotel.ciudad}`,
    hotel.nota ? `Nota: ${hotel.nota}` : "",
    "",
    "Convención:",
    "  01-fachada.jpg",
    "  02-habitacion.jpg",
    "  03-lobby.jpg      (opcional)",
    "",
    "JSON tour → opciones_hotel[].hoteles[].imagenes:",
    `  ["/hoteles/${hotel.slug}/01-fachada.jpg", "/hoteles/${hotel.slug}/02-habitacion.jpg"]`,
    "  imagenes_referenciales: false",
  ].filter(Boolean));

  track(`public/hoteles/${hotel.slug}/`);
}

writeInventory(path.join(PUBLIC, "hoteles"), [
  "FOTOS DE HOTELES — una carpeta por establecimiento",
  "Editar rutas en data/tours/*.json → hoteles[].imagenes",
  "",
  ...structure.hoteles.map((h) => `  ${h.slug}/  ${h.nombre}`),
]);

// --- destinos/ ---
for (const placeId of structure.destinos) {
  const destDir = path.join(PUBLIC, "media", "destinos", placeId);
  writeKeep(destDir, `Destino: ${placeId}`);
  writeInventory(destDir, [
    `DESTINO: ${placeId}`,
    "  hero.jpg   Imagen principal (mapa + landings)",
    "  thumb.jpg  Miniatura (opcional)",
    "",
    "URL: /media/destinos/" + placeId + "/hero.jpg",
    "JSON: data/places.json → imagen",
  ]);
  track(`public/media/destinos/${placeId}/`);
}

// --- blog/ ---
writeKeep(path.join(PUBLIC, "media", "blog"), "Una subcarpeta por slug de artículo");
track("public/media/blog/");

// --- Raíz public ---
writeInventory(PUBLIC, [
  "ESTRUCTURA DE MEDIOS — Chullos Tours",
  "Generado por: npm run media:scaffold",
  "",
  "public/",
  "├── img/                    Marca, marketing, legal, placeholders",
  "├── media/tours/{slug}/     Fotos de cada tour (01.jpg, 02.jpg …)",
  "├── hoteles/{slug}/         Fotos de hoteles por paquete",
  "├── media/destinos/{id}/    Imágenes de mapa y landings",
  "└── media/blog/{slug}/      Artículos del blog",
  "",
  "Manifiesto editable: data/media-structure.json",
  "Helpers TypeScript: src/lib/media-paths.ts",
]);

fs.writeFileSync(
  path.join(PUBLIC, "MEDIA-ESTRUCTURA.txt"),
  fs.readFileSync(path.join(PUBLIC, "_INVENTARIO.txt"), "utf8"),
  "utf8"
);

console.log(`\n✓ Estructura creada/actualizada (${created.length} rutas)\n`);
console.log("Raíz: public/");
console.log(`  tours/     ${slugs.length} carpetas`);
console.log(`  hoteles/   ${structure.hoteles.length} carpetas`);
console.log(`  destinos/  ${structure.destinos.length} carpetas`);
console.log("\nLee public/MEDIA-ESTRUCTURA.txt y cada _INVENTARIO.txt\n");
