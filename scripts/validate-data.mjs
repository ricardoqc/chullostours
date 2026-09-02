/**
 * Valida archivos JSON de tours con Zod.
 * Uso: node scripts/validate-data.mjs
 */
import fs from "fs";
import path from "path";
import { z } from "zod";

const TOURS_DIR = path.join(process.cwd(), "data", "tours");

const tarifaSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  rango_edad: z.string().optional(),
  edad_min: z.number().optional(),
  edad_max: z.number().optional(),
  tipo: z.enum(["fixed", "discount", "free"]).optional(),
  descuento_usd: z.number().optional(),
  precio_usd: z.number().optional(),
});

const hotelCiudadSchema = z.object({
  ciudad: z.string().min(1),
  hotel: z.string().min(1),
  tipo_habitacion: z.string().min(1),
  servicios: z.array(z.string()),
  direccion: z.string().optional(),
  sitio_web: z.string().url().optional(),
  imagenes: z.array(z.string()).optional(),
  imagenes_referenciales: z.boolean().optional(),
});

const hotelOpcionSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  categoria: z.string().min(1),
  precio_usd: z.number().positive(),
  precio_etiqueta: z.string().min(1),
  descripcion: z.string(),
  hoteles: z.array(hotelCiudadSchema),
  precio_soles: z.number().optional(),
  precio_pen: z.number().optional(),
  estrellas: z.union([z.literal(3), z.literal(4), z.literal(5)]).optional(),
});

const mapaDestinoSchema = z.object({
  place_id: z.string().min(1),
  order: z.number().int().positive(),
  dia: z.number().int().positive().optional(),
  marker: z.enum(["city", "airport", "nature", "landmark", "trek"]).optional(),
});

const tourSchema = z
  .object({
    titulo: z.string().min(2),
    slug: z.string().min(2),
    precio_usd: z.number().nonnegative().optional(),
    precio_pen: z.number().nonnegative().optional(),
    visible: z.boolean().optional(),
    entradas_incluidas: z
      .union([
        z.boolean(),
        z.object({
          destacado: z.boolean().optional(),
          titulo: z.string().optional(),
          detalle: z.string().optional(),
          variant: z.enum(["emerald", "gold", "brand"]).optional(),
        }),
      ])
      .optional(),
    aplica_descuentos_edad: z.boolean().optional(),
    tarifas_personas: z.array(tarifaSchema).optional(),
    opciones_hotel: z.array(hotelOpcionSchema).optional(),
    mapa: z
      .object({
        zoom_inicial: z.number().optional(),
        destinos: z.array(mapaDestinoSchema).min(1),
      })
      .optional(),
  })
  .refine(
    (t) => typeof t.precio_usd === "number" || (t.opciones_hotel && t.opciones_hotel.length > 0),
    { message: "Debe tener precio_usd o opciones_hotel con tiers" }
  );

const files = fs.readdirSync(TOURS_DIR).filter((f) => f.endsWith(".json"));
let errors = 0;

for (const file of files) {
  const filePath = path.join(TOURS_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`✗ ${file}: JSON inválido — ${e.message}`);
    errors += 1;
    continue;
  }

  const result = tourSchema.safeParse(data);
  if (!result.success) {
    errors += 1;
    console.error(`✗ ${file}:`);
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  } else {
    console.log(`✓ ${file}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} archivo(s) con errores.`);
  process.exit(1);
}

console.log(`\nValidación OK: ${files.length} tours.`);
