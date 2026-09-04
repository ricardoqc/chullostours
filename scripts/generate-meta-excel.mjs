import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// 1. Configuración y Metadatos Globales (RootLayout)
const DEFAULT_TITLE = "Chullos Tours - Agencia Oficial de Viajes & Tours en Cusco y Perú";
const DEFAULT_DESC = "Descubre Machu Picchu, el Valle Sagrado, Camino Inca y los mejores destinos en Perú con Chullos Tours. Guías locales expertos, itinerarios todo incluido y precios transparentes.";
const SITE_URL = "https://chullostours.com";

// Funciones de Diagnóstico SEO
function evaluarTitle(title, isInherited = false) {
  if (!title || isInherited) return "⚠️ Heredado / Falta específico";
  const len = title.length;
  if (len < 40) return "🟡 Corto (< 40 caracteres)";
  if (len > 65) return "🔴 Largo (> 65 caracteres - Posible truncamiento en SERP)";
  return "🟢 Óptimo (40-65 caracteres)";
}

function evaluarDesc(desc, isInherited = false) {
  if (!desc || isInherited) return "⚠️ Heredada / Falta específica";
  const len = desc.length;
  if (len < 110) return "🟡 Corta (< 110 caracteres)";
  if (len > 165) return "🔴 Larga (> 165 caracteres - Posible truncamiento en SERP)";
  return "🟢 Óptima (110-165 caracteres)";
}

function formatRobots(robots) {
  if (!robots) return "index, follow (predeterminado)";
  if (typeof robots === "string") return robots;
  if (robots.index === false) return "noindex, nofollow";
  return "index, follow";
}

// ==========================================
// 2. Extracción de Tours (data/tours/*.json)
// ==========================================
const toursDir = path.join(process.cwd(), "data", "tours");
const tourFiles = fs.readdirSync(toursDir).filter(f => f.endsWith(".json") && f !== "rutas_migracion.json");

const toursList = [];
for (const file of tourFiles) {
  try {
    const raw = fs.readFileSync(path.join(toursDir, file), "utf-8");
    const data = JSON.parse(raw);
    if (!data || !data.slug) continue;

    const slug = data.slug;
    const title = data.seo?.meta_title || `${data.titulo} | Chullos Tours`;
    const desc = data.seo?.meta_description || data.resumen || data.metas?.description || "";
    const canonical = data.seo?.canonical || `${SITE_URL}/tours/${slug}/`;
    const ogTitle = data.seo?.open_graph?.og_title || data.metas?.og_title || title;
    const ogDesc = data.seo?.open_graph?.og_description || data.metas?.description || desc;
    const ogImage = data.seo?.open_graph?.og_image || (data.galeria && data.galeria[0]?.src) || "";
    const twitterCard = data.seo?.twitter_card?.card || "summary_large_image";
    const twitterTitle = data.seo?.twitter_card?.title || title;
    const twitterDesc = data.seo?.twitter_card?.description || desc;
    const twitterImage = data.seo?.twitter_card?.image || ogImage;
    const focusKeyword = data.seo?.focus_keyword || "";
    const schemaTypes = data.seo_schema?.["@type"] || "TouristTrip, Product";
    const duration = data.atributos?.duracion || "";
    const difficulty = data.atributos?.dificultad || "";
    const priceUsd = data.precio_usd || data.precio || "";
    const pricePen = data.precio_pen || "";
    const visible = data.visible !== false ? "Publicado" : "Borrador/Oculto";

    toursList.push({
      slug,
      file,
      tituloOficial: data.titulo,
      urlRelativa: `/tours/${slug}/`,
      urlCanonica: canonical,
      metaTitle: title,
      titleLength: title.length,
      titleStatus: evaluarTitle(title),
      metaDescription: desc,
      descLength: desc.length,
      descStatus: evaluarDesc(desc),
      focusKeyword,
      ogTitle,
      ogDesc,
      ogImage: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
      ogType: data.seo?.open_graph?.og_type || "product",
      twitterCard,
      twitterTitle,
      twitterDesc,
      twitterImage: twitterImage.startsWith("http") ? twitterImage : `${SITE_URL}${twitterImage}`,
      robots: data.seo?.robots || "index, follow",
      schemaType: Array.isArray(schemaTypes) ? schemaTypes.join(", ") : String(schemaTypes),
      precioUsd: priceUsd ? `$${priceUsd} USD` : "",
      precioPen: pricePen ? `S/ ${pricePen} PEN` : "",
      duracion: duration,
      dificultad: difficulty,
      estado: visible,
      archivoFuente: `data/tours/${file}`,
    });
  } catch (err) {
    console.error(`Error leyendo tour ${file}:`, err);
  }
}

// ==========================================
// 3. Extracción de Blog Posts (data/blogs)
// ==========================================
const blogIndexPath = path.join(process.cwd(), "data", "blogs", "posts", "index.json");
const blogPostsList = [];
const blogRedirectsList = [];

if (fs.existsSync(blogIndexPath)) {
  const blogData = JSON.parse(fs.readFileSync(blogIndexPath, "utf-8"));
  for (const post of blogData.posts || []) {
    const slug = post.slug;
    const title = post.seo_title || `${post.title} | Chullos Tours`;
    const desc = post.seo_desc || "";
    const canonical = `${SITE_URL}/blog/${slug}/`;
    const image = post.featured_image || "";

    blogPostsList.push({
      id: post.id,
      slug,
      titulo: post.title,
      urlRelativa: `/blog/${slug}/`,
      urlCanonica: canonical,
      metaTitle: title,
      titleLength: title.length,
      titleStatus: evaluarTitle(title),
      metaDescription: desc,
      descLength: desc.length,
      descStatus: evaluarDesc(desc),
      readingTime: post.reading_time ? `${post.reading_time} min` : "",
      pageViews: post.page_views || 0,
      fecha: post.date || "",
      ogTitle: title,
      ogDesc: desc,
      ogImage: image,
      ogType: "article",
      twitterCard: "summary_large_image",
      robots: "index, follow",
      schemaType: "BlogPosting, Article",
      archivoFuente: `data/blogs/posts/${post.filename}`,
    });
  }

  for (const red of blogData.redirects || []) {
    blogRedirectsList.push({
      tipo: "Redirección Blog 301",
      origenSlug: red.from_slug,
      urlOrigen: `${SITE_URL}/blog/${red.from_slug}/`,
      destinoSlug: red.to_slug,
      urlDestino: `${SITE_URL}/blog/${red.to_slug}/`,
      codigoHttp: red.type || 301,
      motivo: red.reason || "Fusión / Actualización",
      origenConfig: "data/blogs/posts/index.json + next.config.ts"
    });
  }
}

// ==========================================
// 4. Extracción de Destinos (data/places.json)
// ==========================================
const placesPath = path.join(process.cwd(), "data", "places.json");
const placesData = JSON.parse(fs.readFileSync(placesPath, "utf-8"));

// Calcular conteo de tours por destino
const destinoTourCounts = {};
for (const t of toursList) {
  // leemos data cruda
  const rawData = JSON.parse(fs.readFileSync(path.join(toursDir, t.file), "utf-8"));
  for (const did of rawData.destino_ids || []) {
    const norm = did === "cusco-ciudad" ? "cusco" : did;
    destinoTourCounts[norm] = (destinoTourCounts[norm] || 0) + 1;
  }
}

const destinosList = [];
for (const [slug, place] of Object.entries(placesData)) {
  const toursCount = destinoTourCounts[slug] || 0;
  const hasTours = toursCount > 0;
  const title = hasTours
    ? `Tours en ${place.nombre} | ${toursCount} experiencias | Chullos Tours`
    : `Tours en ${place.nombre} | Chullos Tours`;
  const desc = hasTours
    ? `${toursCount} tours y excursiones en ${place.nombre}. ${place.descripcion}`
    : `Aún no tenemos tours publicados en ${place.nombre}. Escríbenos y armamos un itinerario a medida.`;
  const canonical = `${SITE_URL}/destinos/${slug}/`;
  const image = place.imagen.startsWith("http") ? place.imagen : `${SITE_URL}${place.imagen}`;

  destinosList.push({
    slug,
    nombre: place.nombre,
    tipo: place.tipo,
    urlRelativa: `/destinos/${slug}/`,
    urlCanonica: canonical,
    metaTitle: title,
    titleLength: title.length,
    titleStatus: evaluarTitle(title),
    metaDescription: desc,
    descLength: desc.length,
    descStatus: evaluarDesc(desc),
    toursCount,
    ogTitle: title,
    ogDesc: desc,
    ogImage: image,
    robots: hasTours ? "index, follow" : "noindex, follow",
    schemaType: "TouristDestination",
    archivoFuente: `src/app/destinos/[slug]/page.tsx + data/places.json`
  });
}

// ==========================================
// 5. Páginas Estáticas y Específicas
// ==========================================
const staticPagesMeta = [
  {
    slug: "inicio",
    nombre: "Página de Inicio / Home",
    urlRelativa: "/",
    urlCanonica: `${SITE_URL}/`,
    metaTitle: "Chullos Tours | Tours a Machu Picchu, Camino Inca y Cusco 2026",
    metaDescription: "Descubre el Alma de los Andes con Chullos Tours. Tours a Machu Picchu, Camino Inca 4 Días, Laguna Humantay y Valle Sagrado con guías locales expertos y precios sin cargos ocultos.",
    ogTitle: "Chullos Tours | Tours y Experiencias Auténticas en Cusco y Perú",
    ogDesc: "Explora Machu Picchu y los Andes con guías locales andinos. Itinerarios todo incluido, grupos reducidos y atención personalizada.",
    ogImage: `${SITE_URL}/img/hero-machu-picchu.jpg`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "TravelAgency, Organization, WebSite",
    archivoFuente: "src/app/page.tsx",
    categoria: "Página Principal"
  },
  {
    slug: "acerca-de-chullos-tours",
    nombre: "Acerca de Chullos Tours",
    urlRelativa: "/acerca-de-chullos-tours/",
    urlCanonica: `${SITE_URL}/acerca-de-chullos-tours/`,
    metaTitle: "Acerca de Chullos Tours | Agencia de Viajes en Cusco, Perú",
    metaDescription: "Una Agencia de Viajes Disruptiva - En Chullos Tours nos dedicamos a diseñar experiencias únicas que te conecten con la cultura, la historia y los paisajes impresionantes de Perú.",
    ogTitle: "Acerca de Chullos Tours | Agencia de Viajes en Cusco, Perú",
    ogDesc: "Una Agencia de Viajes Disruptiva - En Chullos Tours nos dedicamos a diseñar experiencias únicas que te conecten con la cultura, la historia y los paisajes impresionantes de Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "AboutPage, Organization",
    archivoFuente: "src/app/acerca-de-chullos-tours/page.tsx",
    categoria: "Institucional"
  },
  {
    slug: "blog-home",
    nombre: "Blog y Guías de Viaje (Portada)",
    urlRelativa: "/blog/",
    urlCanonica: `${SITE_URL}/blog/`,
    metaTitle: "Blog y Guías de Viaje a Machu Picchu, Cusco y Perú 2026 | Chullos Tours",
    metaDescription: "Descubre las mejores guías de viaje, consejos de expertos, circuitos de Machu Picchu, itinerarios y precios actualizados para tu aventura en Perú.",
    ogTitle: "Blog y Guías de Viaje a Machu Picchu, Cusco y Perú 2026 | Chullos Tours",
    ogDesc: "Descubre las mejores guías de viaje, consejos de expertos, circuitos de Machu Picchu, itinerarios y precios actualizados para tu aventura en Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "blog",
    robots: "index, follow",
    schemaType: "Blog, CollectionPage",
    archivoFuente: "src/app/blog/page.tsx",
    categoria: "Blog / Contenidos"
  },
  {
    slug: "tours-home",
    nombre: "Catálogo General de Tours",
    urlRelativa: "/tours/",
    urlCanonica: `${SITE_URL}/tours/`,
    metaTitle: "Catálogo de Tours en Cusco y Machu Picchu | Chullos Tours",
    metaDescription: "Explora todos los tours, caminatas y paquetes turísticos en Cusco y Perú.",
    ogTitle: "Catálogo de Tours en Cusco y Machu Picchu | Chullos Tours",
    ogDesc: "Explora todos los tours, caminatas y paquetes turísticos en Cusco y Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage, OfferCatalog",
    archivoFuente: "src/app/tours/page.tsx",
    categoria: "Catálogo"
  },
  {
    slug: "destinos-home",
    nombre: "Catálogo de Destinos Turísticos",
    urlRelativa: "/destinos/",
    urlCanonica: `${SITE_URL}/destinos/`,
    metaTitle: "Destinos Turísticos en Perú | Chullos Tours",
    metaDescription: "Explora nuestros destinos con tours disponibles: Cusco, Machu Picchu, Valle Sagrado, Puno y Lima. Salidas garantizadas con guías locales.",
    ogTitle: "Destinos Turísticos en Perú | Chullos Tours",
    ogDesc: "Explora nuestros destinos con tours disponibles: Cusco, Machu Picchu, Valle Sagrado, Puno y Lima. Salidas garantizadas con guías locales.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage",
    archivoFuente: "src/app/destinos/page.tsx",
    categoria: "Catálogo"
  },
  {
    slug: "machu-picchu-2026",
    nombre: "Landing Machu Picchu 2026",
    urlRelativa: "/machu-picchu-2026/",
    urlCanonica: `${SITE_URL}/machu-picchu-2026/`,
    metaTitle: "Viaja a Machu Picchu en 2026: Entradas, Circuitos y Paquetes | Chullos Tours",
    metaDescription: "Guía 2026 para Machu Picchu: circuitos, entradas, clima y paquetes con precios reales de Chullos Tours.",
    ogTitle: "Viaja a Machu Picchu en 2026: Entradas, Circuitos y Paquetes | Chullos Tours",
    ogDesc: "Guía 2026 para Machu Picchu: circuitos, entradas, clima y paquetes con precios reales de Chullos Tours.",
    ogImage: `${SITE_URL}/img/machupicchu-2026.jpg`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "ItemPage",
    archivoFuente: "src/app/machu-picchu-2026/page.tsx",
    categoria: "Landing Específica"
  },
  {
    slug: "machu-picchu-2025",
    nombre: "Landing Machu Picchu 2025 (Histórica)",
    urlRelativa: "/machu-picchu-2025/",
    urlCanonica: `${SITE_URL}/machu-picchu-2025/`,
    metaTitle: "Machu Picchu 2025 | Chullos Tours",
    metaDescription: "Todo Sobre Machu Picchu. Descubre el encanto de Machu Picchu en esta sección, donde cada artículo te guiará para explorar a fondo uno de los destinos más emblemáticos del Perú.",
    ogTitle: "Machu Picchu 2025 | Chullos Tours",
    ogDesc: "Todo Sobre Machu Picchu. Descubre el encanto de Machu Picchu en esta sección...",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "ItemPage",
    archivoFuente: "src/app/machu-picchu-2025/page.tsx",
    categoria: "Landing Específica"
  },
  {
    slug: "pe-tours",
    nombre: "Catálogo de Tours Perú (PEN / Soles)",
    urlRelativa: "/pe/tours/",
    urlCanonica: `${SITE_URL}/pe/tours/`,
    metaTitle: "Tours en Cusco y Machu Picchu | Chullos Tours Perú",
    metaDescription: "Catálogo de tours y paquetes en Cusco. Reserva con Chullos Tours, operador directo en Perú.",
    ogTitle: "Tours en Cusco y Machu Picchu | Chullos Tours Perú",
    ogDesc: "Catálogo de tours y paquetes en Cusco. Reserva con Chullos Tours, operador directo en Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage, OfferCatalog",
    archivoFuente: "src/app/pe/tours/page.tsx",
    categoria: "Catálogo Geo-Local"
  },
  {
    slug: "tipo-de-actividades",
    nombre: "Índice de Tipos de Actividades",
    urlRelativa: "/tipo-de-actividades/",
    urlCanonica: `${SITE_URL}/tipo-de-actividades/`,
    metaTitle: "Tipos de Actividades | Chullos Tours",
    metaDescription: "Descubre las diferentes actividades turísticas disponibles: Trekking, Cuatrimoto, City Tour y más.",
    ogTitle: "Tipos de Actividades | Chullos Tours",
    ogDesc: "Descubre las diferentes actividades turísticas disponibles: Trekking, Cuatrimoto, City Tour y más.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage",
    archivoFuente: "src/app/tipo-de-actividades/page.tsx",
    categoria: "Taxonomía / Filtro"
  },
  {
    slug: "tipos-de-viajes",
    nombre: "Índice de Tipos de Viajes",
    urlRelativa: "/tipos-de-viajes/",
    urlCanonica: `${SITE_URL}/tipos-de-viajes/`,
    metaTitle: "Tipos de Viajes y Tours | Chullos Tours",
    metaDescription: "Explora los tipos de tours disponibles: Full Day, Paquetes Cusco Todo Incluido y Paquetes Turísticos en Perú.",
    ogTitle: "Tipos de Viajes y Tours | Chullos Tours",
    ogDesc: "Explora los tipos de tours disponibles: Full Day, Paquetes Cusco Todo Incluido y Paquetes Turísticos en Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage",
    archivoFuente: "src/app/tipos-de-viajes/page.tsx",
    categoria: "Taxonomía / Filtro"
  },
  {
    slug: "tienda",
    nombre: "Tienda de Paquetes y Tours",
    urlRelativa: "/tienda/",
    urlCanonica: `${SITE_URL}/tienda/`,
    metaTitle: "Tienda de Tours y Experiencias | Chullos Tours",
    metaDescription: "Explora nuestra tienda de paquetes de viaje y experiencias turísticas en Cusco y Perú.",
    ogTitle: "Tienda de Tours y Experiencias | Chullos Tours",
    ogDesc: "Explora nuestra tienda de paquetes de viaje y experiencias turísticas en Cusco y Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage, Store",
    archivoFuente: "src/app/tienda/page.tsx",
    categoria: "Comercial"
  },
  {
    slug: "mapa-del-sitio",
    nombre: "Mapa del Sitio (HTML Sitemap)",
    urlRelativa: "/mapa-del-sitio/",
    urlCanonica: `${SITE_URL}/mapa-del-sitio/`,
    metaTitle: "Mapa del Sitio (HTML Sitemap) | Chullos Tours",
    metaDescription: "Explora la estructura completa de Chullos Tours: tours en Cusco, Machu Picchu, Camino Inca, destinos turísticos, guías de viaje y páginas oficiales.",
    ogTitle: "Mapa del Sitio Oficial | Chullos Tours",
    ogDesc: "Explora la estructura completa de Chullos Tours: tours en Cusco, Machu Picchu, Camino Inca, destinos turísticos, guías de viaje y páginas oficiales.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/mapa-del-sitio/page.tsx",
    categoria: "Navegación / SEO"
  },
  {
    slug: "reviews",
    nombre: "Reseñas y Testimonios de Pasajeros",
    urlRelativa: "/reviews/",
    urlCanonica: `${SITE_URL}/reviews/`,
    metaTitle: "Reseñas de Pasajeros - Chullos Tours",
    metaDescription: "Lee las opiniones y experiencias reales de nuestros pasajeros en Cusco, Machu Picchu y más.",
    ogTitle: "Reseñas de Pasajeros - Chullos Tours",
    ogDesc: "Lee las opiniones y experiencias reales de nuestros pasajeros en Cusco, Machu Picchu y más.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "CollectionPage, Review",
    archivoFuente: "src/app/reviews/page.tsx",
    categoria: "Social Proof"
  },
  {
    slug: "informacion-de-viajeros",
    nombre: "Información para Viajeros",
    urlRelativa: "/informacion-de-viajeros/",
    urlCanonica: `${SITE_URL}/informacion-de-viajeros/`,
    metaTitle: "Información de Viajeros | Chullos Tours",
    metaDescription: "Información y recomendaciones esenciales para viajeros en Perú y Cusco.",
    ogTitle: "Información de Viajeros | Chullos Tours",
    ogDesc: "Información y recomendaciones esenciales para viajeros en Perú y Cusco.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/informacion-de-viajeros/page.tsx",
    categoria: "Guía de Viaje"
  },
  {
    slug: "contacto-chullos",
    nombre: "Contacto y Asesoría Personalizada",
    urlRelativa: "/contacto-chullos/",
    urlCanonica: `${SITE_URL}/contacto-chullos/`,
    metaTitle: DEFAULT_TITLE,
    metaDescription: DEFAULT_DESC,
    ogTitle: "Chullos Tours - Experiencias Auténticas en Cusco y Perú",
    ogDesc: "Aventuras inolvidables a Machu Picchu, Camino Inca y Cusco guiadas por expertos locales.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "ContactPage (Recomendado)",
    archivoFuente: "src/app/contacto-chullos/page.tsx",
    categoria: "Contacto / Conversión",
    isInherited: true,
    diagnosticoNota: "⚠️ Componente 'use client' sin export const metadata. Hereda el título general del RootLayout. Se recomienda crear metadata personalizada."
  },
  {
    slug: "viaje-personalizado",
    nombre: "Diseña tu Viaje a Medida (Cotizador)",
    urlRelativa: "/viaje-personalizado/",
    urlCanonica: `${SITE_URL}/viaje-personalizado/`,
    metaTitle: DEFAULT_TITLE,
    metaDescription: DEFAULT_DESC,
    ogTitle: "Chullos Tours - Experiencias Auténticas en Cusco y Perú",
    ogDesc: "Aventuras inolvidables a Machu Picchu, Camino Inca y Cusco guiadas por expertos locales.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/viaje-personalizado/page.tsx",
    categoria: "Conversión",
    isInherited: true,
    diagnosticoNota: "⚠️ Componente 'use client' sin export const metadata. Hereda el título general del RootLayout. Se recomienda agregar metadata especializada para atraer búsquedas de viajes a medida."
  },
  {
    slug: "politicas-de-privacidad",
    nombre: "Políticas de Privacidad",
    urlRelativa: "/politicas-de-privacidad/",
    urlCanonica: `${SITE_URL}/politicas-de-privacidad/`,
    metaTitle: "Políticas de Privacidad | Chullos Tours - Agencia de Viajes en Cusco",
    metaDescription: "Políticas de privacidad y protección de datos personales de Chullos Tours (Viajando con Chullo S.A.C.). Conoce cómo utilizamos tu información.",
    ogTitle: "Políticas de Privacidad | Chullos Tours",
    ogDesc: "Políticas de privacidad y protección de datos personales de Chullos Tours.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/politicas-de-privacidad/page.tsx",
    categoria: "Legal"
  },
  {
    slug: "terminos-y-condiciones",
    nombre: "Términos y Condiciones",
    urlRelativa: "/terminos-y-condiciones/",
    urlCanonica: `${SITE_URL}/terminos-y-condiciones/`,
    metaTitle: "Términos y Condiciones | Chullos Tours - Agencia de Viajes en Cusco",
    metaDescription: "Conoce los términos y condiciones de los servicios de Chullos Tours: reservas, pagos, cancelaciones, modificaciones y responsabilidades. Viajando con Chullo S.A.C.",
    ogTitle: "Términos y Condiciones | Chullos Tours",
    ogDesc: "Conoce los términos y condiciones de los servicios de Chullos Tours...",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "index, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/terminos-y-condiciones/page.tsx",
    categoria: "Legal"
  },
  {
    slug: "carrito",
    nombre: "Carrito de Compras / Solicitud",
    urlRelativa: "/carrito/",
    urlCanonica: `${SITE_URL}/carrito/`,
    metaTitle: "Carrito | Chullos Tours",
    metaDescription: "Las reservas se confirman con un asesor de Chullos Tours.",
    ogTitle: "Carrito | Chullos Tours",
    ogDesc: "Las reservas se confirman con un asesor de Chullos Tours.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
    archivoFuente: "src/app/carrito/page.tsx",
    categoria: "Transaccional / Checkout"
  },
  {
    slug: "finalizar-compra",
    nombre: "Finalizar Compra / Checkout",
    urlRelativa: "/finalizar-compra/",
    urlCanonica: `${SITE_URL}/finalizar-compra/`,
    metaTitle: "Checkout | Chullos Tours",
    metaDescription: "El pago se coordina con tu asesor de viajes.",
    ogTitle: "Checkout | Chullos Tours",
    ogDesc: "El pago se coordina con tu asesor de viajes.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
    archivoFuente: "src/app/finalizar-compra/page.tsx",
    categoria: "Transaccional / Checkout"
  },
  {
    slug: "mi-cuenta",
    nombre: "Mi Cuenta de Pasajero",
    urlRelativa: "/mi-cuenta/",
    urlCanonica: `${SITE_URL}/mi-cuenta/`,
    metaTitle: "Mi cuenta | Chullos Tours",
    metaDescription: "Área de clientes próximamente.",
    ogTitle: "Mi cuenta | Chullos Tours",
    ogDesc: "Área de clientes próximamente.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
    archivoFuente: "src/app/mi-cuenta/page.tsx",
    categoria: "Usuario / Privado"
  },
  {
    slug: "mis-viajes",
    nombre: "Mis Viajes e Itinerarios",
    urlRelativa: "/mis-viajes/",
    urlCanonica: `${SITE_URL}/mis-viajes/`,
    metaTitle: "Mis Viajes | Chullos Tours",
    metaDescription: "Consulta tus reservas e itinerarios contratados con Chullos Tours.",
    ogTitle: "Mis Viajes | Chullos Tours",
    ogDesc: "Consulta tus reservas e itinerarios contratados con Chullos Tours.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/mis-viajes/page.tsx",
    categoria: "Usuario / Privado"
  },
  {
    slug: "wishlist",
    nombre: "Mi Lista de Deseos / Favoritos",
    urlRelativa: "/wishlist/",
    urlCanonica: `${SITE_URL}/wishlist/`,
    metaTitle: "Mi Lista de Deseos | Chullos Tours",
    metaDescription: "Tours y experiencias guardadas en tu lista de favoritos.",
    ogTitle: "Mi Lista de Deseos | Chullos Tours",
    ogDesc: "Tours y experiencias guardadas en tu lista de favoritos.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, follow",
    schemaType: "WebPage",
    archivoFuente: "src/app/wishlist/page.tsx",
    categoria: "Usuario / Privado"
  },
  {
    slug: "muchas-gracias",
    nombre: "Página de Agradecimiento por Reserva",
    urlRelativa: "/muchas-gracias/",
    urlCanonica: `${SITE_URL}/muchas-gracias/`,
    metaTitle: DEFAULT_TITLE,
    metaDescription: DEFAULT_DESC,
    ogTitle: "¡Gracias por tu reserva! | Chullos Tours",
    ogDesc: "Recibimos tu solicitud correctamente.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
    archivoFuente: "src/app/muchas-gracias/page.tsx",
    categoria: "Transaccional / Confirmación",
    isInherited: true,
    diagnosticoNota: "⚠️ Página de conversión de reserva. Debe tener 'noindex, nofollow' explícito para evitar indexar confirmaciones vacías."
  },
  {
    slug: "resultados-de-busqueda",
    nombre: "Resultados de Búsqueda de Tours",
    urlRelativa: "/resultados-de-busqueda/",
    urlCanonica: `${SITE_URL}/resultados-de-busqueda/`,
    metaTitle: DEFAULT_TITLE,
    metaDescription: DEFAULT_DESC,
    ogTitle: "Resultados de Búsqueda | Chullos Tours",
    ogDesc: "Encuentra el tour ideal para tu aventura en Perú.",
    ogImage: `${SITE_URL}/cropped-chullos-icono.png`,
    ogType: "website",
    robots: "noindex, follow",
    schemaType: "SearchResultsPage",
    archivoFuente: "src/app/resultados-de-busqueda/page.tsx",
    categoria: "Utilidad / Búsqueda",
    isInherited: true,
    diagnosticoNota: "⚠️ Las páginas de resultados de búsqueda interna deben configurarse con 'noindex, follow' para seguir las directrices de calidad de Google (Search Quality Rater Guidelines)."
  }
];

// Procesar diagnósticos de static pages
for (const p of staticPagesMeta) {
  p.titleLength = p.metaTitle.length;
  p.titleStatus = evaluarTitle(p.metaTitle, p.isInherited);
  p.descLength = p.metaDescription.length;
  p.descStatus = evaluarDesc(p.metaDescription, p.isInherited);
}

// ==========================================
// 6. Taxonomías (Categorías, Tipos de Tours, Actividades)
// ==========================================
const taxonomiasList = [
  // Categorías de Blog
  { slug: "adventure", nombre: "Adventure", tipo: "Categoría Blog", url: "/category/adventure/" },
  { slug: "historia-machu-picchu", nombre: "Historia Machu Picchu", tipo: "Categoría Blog", url: "/category/historia-machu-picchu/" },
  { slug: "informacion-machu-picchu", nombre: "Información Machu Picchu", tipo: "Categoría Blog", url: "/category/informacion-machu-picchu/" },
  { slug: "informacion-turistica", nombre: "Información Turística", tipo: "Categoría Blog", url: "/category/informacion-turistica/" },
  { slug: "machu-picchu", nombre: "Machu Picchu", tipo: "Categoría Blog", url: "/category/machu-picchu/" },
  { slug: "recomendaciones", nombre: "Recomendaciones", tipo: "Categoría Blog", url: "/category/recomendaciones/" },
  { slug: "tours", nombre: "Tours", tipo: "Categoría Blog", url: "/category/tours/" },
  { slug: "travel", nombre: "Travel", tipo: "Categoría Blog", url: "/category/travel/" },
  { slug: "viajes", nombre: "Viajes", tipo: "Categoría Blog", url: "/category/viajes/" },
  { slug: "viajes-a-machu-picchu", nombre: "Viajes a Machu Picchu", tipo: "Categoría Blog", url: "/category/viajes-a-machu-picchu/" },
  
  // Actividades
  { slug: "caminata-hiking", nombre: "Caminata / Hiking", tipo: "Tipo de Actividad", url: "/actividades/caminata-hiking/" },
  { slug: "camping", nombre: "Camping", tipo: "Tipo de Actividad", url: "/actividades/camping/" },
  { slug: "city-tour", nombre: "City Tour", tipo: "Tipo de Actividad", url: "/actividades/city-tour/" },
  { slug: "cuatrimoto", nombre: "Cuatrimoto / ATV", tipo: "Tipo de Actividad", url: "/actividades/cuatrimoto/" },
  { slug: "outdoor", nombre: "Outdoor", tipo: "Tipo de Actividad", url: "/actividades/outdoor/" },
  { slug: "trekking", nombre: "Trekking", tipo: "Tipo de Actividad", url: "/actividades/trekking/" },
  
  // Tipos de Tours
  { slug: "tours-full-day", nombre: "Tours Full Day", tipo: "Tipo de Tour", url: "/tipos-de-tours/tours-full-day/" },
  { slug: "paquete-cusco-todo-incluido", nombre: "Paquete Cusco Todo Incluido", tipo: "Tipo de Tour", url: "/tipos-de-tours/paquete-cusco-todo-incluido/" },
  { slug: "paquetes-turisticos-peru", nombre: "Paquetes Turísticos Perú", tipo: "Tipo de Tour", url: "/tipos-de-tours/paquetes-turisticos-peru/" },
  { slug: "trekking", nombre: "Trekking", tipo: "Tipo de Tour", url: "/tipos-de-tours/trekking/" }
];

const processedTaxonomias = taxonomiasList.map(item => {
  const formatted = item.slug.replace(/-/g, " ");
  let metaTitle = "";
  let metaDesc = "";
  let fuente = "";

  if (item.tipo === "Categoría Blog") {
    metaTitle = `Categoría: ${formatted} | Chullos Tours`;
    metaDesc = `Artículos y tours relacionados con la categoría ${formatted} en Chullos Tours.`;
    fuente = "src/app/category/[slug]/page.tsx";
  } else if (item.tipo === "Tipo de Tour") {
    metaTitle = `Tours de Tipo: ${formatted} | Chullos Tours`;
    metaDesc = `Catálogo de experiencias y paquetes filtrados por el tipo: ${formatted}.`;
    fuente = "src/app/tipos-de-tours/[slug]/page.tsx";
  } else {
    metaTitle = `Actividades de ${formatted} en Cusco y Perú | Chullos Tours`;
    metaDesc = `Explora tours y aventuras de ${formatted} en Cusco, Valle Sagrado y Machu Picchu con Chullos Tours.`;
    fuente = "src/app/actividades/[slug]/page.tsx";
  }

  return {
    slug: item.slug,
    nombre: item.nombre,
    taxonomia: item.tipo,
    urlRelativa: item.url,
    urlCanonica: `${SITE_URL}${item.url}`,
    metaTitle,
    titleLength: metaTitle.length,
    titleStatus: evaluarTitle(metaTitle),
    metaDescription: metaDesc,
    descLength: metaDesc.length,
    descStatus: evaluarDesc(metaDesc),
    robots: "index, follow",
    schemaType: "CollectionPage",
    archivoFuente: fuente
  };
});

// ==========================================
// 7. Redirecciones 301 (next.config.ts)
// ==========================================
const generalRedirects = [
  { origen: "/tours/machupicchu-full-day-con-tren-vistadome/", destino: "/tours/machupicchu-full-day-tren-expedition-vistadome/", tipo: "Tour Redirigido", motivo: "Cambio de nombre comercial / tren" },
  { origen: "/tours/machupicchu-full-day-con-tren-vistadome-observatory/", destino: "/tours/machupicchu-full-day-con-tren-observatory-expedition/", tipo: "Tour Redirigido", motivo: "Cambio de configuración tren" },
  { origen: "/tours/cusco-escenico-city-tour-nocturno/", destino: "/tours/cusco-escenico-city-tour-tarde/", tipo: "Tour Redirigido", motivo: "Horario unificado en la tarde" },
  { origen: "/tours/tour-lago-titicaca-2-dias/", destino: "/tours/tour-puno-2-dias-uros-amantani/", tipo: "Tour Redirigido", motivo: "Renombrado a ruta específica Puno 2D" },
  { origen: "/tours-en-cusco-guia-completa/", destino: "/blog/tours-en-cusco-guia-completa/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/viajar-a-peru-con-chullos-tours/", destino: "/blog/viajar-a-peru-con-chullos-tours/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/guia-completa-para-viajar-a-machupicchu/", destino: "/blog/guia-completa-para-viajar-a-machupicchu/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/cuanto-cuesta-viajar-a-machu-picchu-2025/", destino: "/blog/cuanto-cuesta-viajar-a-machu-picchu-2026/", tipo: "Migración WP -> Next.js", motivo: "Actualización temporal de año (2025 -> 2026)" },
  { origen: "/mejores-fechas-viaje-machu-picchu-en-2025/", destino: "/blog/mejores-fechas-viaje-machu-picchu-en-2026/", tipo: "Migración WP -> Next.js", motivo: "Actualización temporal de año (2025 -> 2026)" },
  { origen: "/machu-picchu-ciudad-perdida-de-los-incas/", destino: "/blog/machu-picchu-ciudad-perdida-de-los-incas/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/como-comprar-tu-boleto-a-machu-picchu-guia-completa/", destino: "/blog/como-comprar-tu-boleto-a-machu-picchu-guia-completa/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/viajar-a-peru-y-machu-picchu-itinerario-ideal-para-6-dias/", destino: "/blog/viajar-a-peru-y-machu-picchu-itinerario-ideal-para-6-dias/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/descubre-machu-picchu-historia-cultura-y-aventura/", destino: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/", tipo: "Fusión de Canibalización", motivo: "Unificación de post duplicado hacia la guía maestra" },
  { origen: "/que-ver-en-machu-picchu-lugares-imperdibles-para-visita/", destino: "/blog/que-ver-en-machu-picchu-lugares-imperdibles-para-visita/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/como-llegar-a-machu-picchu-guia-completa-para-tu-visita/", destino: "/blog/como-llegar-a-machu-picchu-guia-completa-para-tu-visita/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/todo-lo-que-necesitas-saber-sobre-machu-picchu/", destino: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/todo-los-que-necesitas-saber-sobre-machu-picchu/", destino: "/blog/todo-lo-que-necesitas-saber-sobre-machu-picchu/", tipo: "Fusión de Canibalización", motivo: "Corrección ortográfica en slug (los -> lo)" },
  { origen: "/explora-las-maravillas-de-machu-picchu-vacaciones-inolvidables-en-el-corazon-de-los-andes/", destino: "/blog/explora-las-maravillas-de-machu-picchu-vacaciones-inolvidables-en-el-corazon-de-los-andes/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/machu-picchu-viaje-inolvidable/", destino: "/blog/machu-picchu-viaje-inolvidable/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/camino-inca-4-dias-guia-definitiva/", destino: "/blog/camino-inca-4-dias-guia-definitiva/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/montana-de-7-colores-vinicunca-guia-completa/", destino: "/blog/montana-de-7-colores-vinicunca-guia-completa/", tipo: "Migración WP -> Next.js", motivo: "Estructuración canónica en /blog/" },
  { origen: "/destinos/cusco-ciudad/", destino: "/destinos/cusco/", tipo: "Normalización Slug Destino", motivo: "Unificación de slug taxonomía a /destinos/cusco/" },
  { origen: "/destinos/laguna-humantay/", destino: "/destinos/humantay/", tipo: "Normalización Slug Destino", motivo: "Unificación a ID /destinos/humantay/" },
  { origen: "/destinos/machu-picchu-pueblo/", destino: "/destinos/machu-picchu/", tipo: "Normalización Slug Destino", motivo: "Unificación a ID /destinos/machu-picchu/" },
  { origen: "/destinos/puno-ciudad/", destino: "/destinos/puno/", tipo: "Normalización Slug Destino", motivo: "Unificación a ID /destinos/puno/" },
  { origen: "/destinos/lago-titicaca/", destino: "/destinos/puno/", tipo: "Normalización Slug Destino", motivo: "Unificación lago Titicaca bajo destino regional Puno" },
  { origen: "/destinos/qeswachaka/", destino: "/tours/puente-qeswachaka-tour-full-day/", tipo: "Normalización Slug Destino", motivo: "Redirige al tour específico por no tener destino aislado" },
  { origen: "/destinos/valle-sagrado-de-los-incas/", destino: "/destinos/valle-sagrado/", tipo: "Normalización Slug Destino", motivo: "Acortamiento de slug a /destinos/valle-sagrado/" },
  { origen: "/destinos/montana-de-colores-vinicunca/", destino: "/destinos/vinicunca/", tipo: "Normalización Slug Destino", motivo: "Acortamiento de slug a /destinos/vinicunca/" },
  { origen: "/destino/", destino: "/destinos/", tipo: "Normalización Taxonomía", motivo: "Corrección singular -> plural" },
  { origen: "/destinos-disponibles/", destino: "/destinos/", tipo: "Normalización Taxonomía", motivo: "Unificación a directorio principal" },
  { origen: "/shop/", destino: "/tienda/", tipo: "Internacionalización Slug", motivo: "Ruta en español estándar /tienda/" },
  { origen: "/my-account/", destino: "/mi-cuenta/", tipo: "Internacionalización Slug", motivo: "Ruta en español estándar /mi-cuenta/" },
  { origen: "/wishlist-3/", destino: "/wishlist/", tipo: "Limpieza WordPress", motivo: "Eliminación de sufijo numérico generado por plugin WP" }
];

// ==========================================
// 8. CONSOLIDADO MAESTRO (Todas las URLs)
// ==========================================
const masterInventory = [];

// A. Páginas Estáticas
for (const p of staticPagesMeta) {
  masterInventory.push({
    "Sección": p.categoria,
    "Tipo de Contenido": "Página Estática",
    "Nombre / H1": p.nombre,
    "Slug / ID": p.slug,
    "Ruta Relativa": p.urlRelativa,
    "URL Canónica": p.urlCanonica,
    "Meta Title": p.metaTitle,
    "Caract. Title": p.titleLength,
    "Diagnóstico Title": p.titleStatus,
    "Meta Description": p.metaDescription,
    "Caract. Desc": p.descLength,
    "Diagnóstico Description": p.descStatus,
    "Robots": p.robots,
    "Open Graph Title": p.ogTitle,
    "Open Graph Description": p.ogDesc,
    "Open Graph Image": p.ogImage,
    "Open Graph Type": p.ogType,
    "Twitter Card": "summary_large_image",
    "Schema JSON-LD": p.schemaType,
    "Keywords / Focus": "",
    "Archivo Fuente Código": p.archivoFuente,
    "Observaciones / Acción SEO": p.diagnosticoNota || "Metadatos correctos en App Router."
  });
}

// B. Tours (33)
for (const t of toursList) {
  masterInventory.push({
    "Sección": "Catálogo de Tours",
    "Tipo de Contenido": "Tour Dinámico (Producto)",
    "Nombre / H1": t.tituloOficial,
    "Slug / ID": t.slug,
    "Ruta Relativa": t.urlRelativa,
    "URL Canónica": t.urlCanonica,
    "Meta Title": t.metaTitle,
    "Caract. Title": t.titleLength,
    "Diagnóstico Title": t.titleStatus,
    "Meta Description": t.metaDescription,
    "Caract. Desc": t.descLength,
    "Diagnóstico Description": t.descStatus,
    "Robots": t.robots,
    "Open Graph Title": t.ogTitle,
    "Open Graph Description": t.ogDesc,
    "Open Graph Image": t.ogImage,
    "Open Graph Type": t.ogType,
    "Twitter Card": t.twitterCard,
    "Schema JSON-LD": t.schemaType,
    "Keywords / Focus": t.focusKeyword,
    "Archivo Fuente Código": t.archivoFuente,
    "Observaciones / Acción SEO": `Precio: ${t.precioUsd} | Duración: ${t.duracion} | Dificultad: ${t.dificultad} | Estado: ${t.estado}`
  });
}

// C. Blog Posts (15)
for (const b of blogPostsList) {
  masterInventory.push({
    "Sección": "Blog & Contenidos",
    "Tipo de Contenido": "Artículo de Blog",
    "Nombre / H1": b.titulo,
    "Slug / ID": b.slug,
    "Ruta Relativa": b.urlRelativa,
    "URL Canónica": b.urlCanonica,
    "Meta Title": b.metaTitle,
    "Caract. Title": b.titleLength,
    "Diagnóstico Title": b.titleStatus,
    "Meta Description": b.metaDescription,
    "Caract. Desc": b.descLength,
    "Diagnóstico Description": b.descStatus,
    "Robots": b.robots,
    "Open Graph Title": b.ogTitle,
    "Open Graph Description": b.ogDesc,
    "Open Graph Image": b.ogImage,
    "Open Graph Type": b.ogType,
    "Twitter Card": b.twitterCard,
    "Schema JSON-LD": b.schemaType,
    "Keywords / Focus": "",
    "Archivo Fuente Código": b.archivoFuente,
    "Observaciones / Acción SEO": `Lectura: ${b.readingTime} | Visitas históricas: ${b.pageViews} | Fecha: ${b.fecha}`
  });
}

// D. Destinos (10)
for (const d of destinosList) {
  masterInventory.push({
    "Sección": "Destinos Turísticos",
    "Tipo de Contenido": "Página de Destino",
    "Nombre / H1": `Destino: ${d.nombre}`,
    "Slug / ID": d.slug,
    "Ruta Relativa": d.urlRelativa,
    "URL Canónica": d.urlCanonica,
    "Meta Title": d.metaTitle,
    "Caract. Title": d.titleLength,
    "Diagnóstico Title": d.titleStatus,
    "Meta Description": d.metaDescription,
    "Caract. Desc": d.descLength,
    "Diagnóstico Description": d.descStatus,
    "Robots": d.robots,
    "Open Graph Title": d.ogTitle,
    "Open Graph Description": d.ogDesc,
    "Open Graph Image": d.ogImage,
    "Open Graph Type": "website",
    "Twitter Card": "summary_large_image",
    "Schema JSON-LD": d.schemaType,
    "Keywords / Focus": `Destino ${d.nombre}`,
    "Archivo Fuente Código": d.archivoFuente,
    "Observaciones / Acción SEO": `Total Tours Asociados: ${d.toursCount}. Indexación condicionada a tener tours.`
  });
}

// E. Taxonomías (20)
for (const tax of processedTaxonomias) {
  masterInventory.push({
    "Sección": "Taxonomías & Filtros",
    "Tipo de Contenido": tax.taxonomia,
    "Nombre / H1": tax.nombre,
    "Slug / ID": tax.slug,
    "Ruta Relativa": tax.urlRelativa,
    "URL Canónica": tax.urlCanonica,
    "Meta Title": tax.metaTitle,
    "Caract. Title": tax.titleLength,
    "Diagnóstico Title": tax.titleStatus,
    "Meta Description": tax.metaDescription,
    "Caract. Desc": tax.descLength,
    "Diagnóstico Description": tax.descStatus,
    "Robots": tax.robots,
    "Open Graph Title": tax.metaTitle,
    "Open Graph Description": tax.metaDescription,
    "Open Graph Image": `${SITE_URL}/cropped-chullos-icono.png`,
    "Open Graph Type": "website",
    "Twitter Card": "summary_large_image",
    "Schema JSON-LD": tax.schemaType,
    "Keywords / Focus": tax.nombre,
    "Archivo Fuente Código": tax.archivoFuente,
    "Observaciones / Acción SEO": "Filtro de catálogo generado dinámicamente con generateMetadata."
  });
}

// ==========================================
// 9. Resumen Ejecutivo & Auditoría SEO
// ==========================================
const totalUrls = masterInventory.length;
const toursCount = toursList.length;
const blogCount = blogPostsList.length;
const staticCount = staticPagesMeta.length;
const destinosCount = destinosList.length;
const taxonomiasCount = processedTaxonomias.length;
const redirectsCount = generalRedirects.length;

let titlesOptimos = 0, titlesCortos = 0, titlesLargos = 0, titlesHeredados = 0;
let descsOptimas = 0, descsCortas = 0, descsLargas = 0, descsHeredadas = 0;

for (const item of masterInventory) {
  if (item["Diagnóstico Title"].includes("Óptimo")) titlesOptimos++;
  else if (item["Diagnóstico Title"].includes("Corto")) titlesCortos++;
  else if (item["Diagnóstico Title"].includes("Largo")) titlesLargos++;
  else titlesHeredados++;

  if (item["Diagnóstico Description"].includes("Óptima")) descsOptimas++;
  else if (item["Diagnóstico Description"].includes("Corta")) descsCortas++;
  else if (item["Diagnóstico Description"].includes("Larga")) descsLargas++;
  else descsHeredadas++;
}

const resumenEjecutivo = [
  { "Métrica / Indicador": "Total de URLs Activas Auditadas en el Sistema", "Valor": totalUrls, "Porcentaje": "100%", "Benchmark SEO / Estado": "Inventario Completo" },
  { "Métrica / Indicador": "Tours Publicados / Paquetes (Catálogo)", "Valor": toursCount, "Porcentaje": `${Math.round((toursCount/totalUrls)*100)}%`, "Benchmark SEO / Estado": "Productos Comerciales Principales" },
  { "Métrica / Indicador": "Artículos de Blog y Guías de Viaje", "Valor": blogCount, "Porcentaje": `${Math.round((blogCount/totalUrls)*100)}%`, "Benchmark SEO / Estado": "Contenido Inbound / Autoridad Orgánica" },
  { "Métrica / Indicador": "Páginas Estáticas, Legales e Institucionales", "Valor": staticCount, "Porcentaje": `${Math.round((staticCount/totalUrls)*100)}%`, "Benchmark SEO / Estado": "Estructura Base del Sitio" },
  { "Métrica / Indicador": "Páginas de Destinos Específicos", "Valor": destinosCount, "Porcentaje": `${Math.round((destinosCount/totalUrls)*100)}%`, "Benchmark SEO / Estado": "Hubs de Geolocalización" },
  { "Métrica / Indicador": "Taxonomías (Actividades, Categorías, Tipos)", "Valor": taxonomiasCount, "Porcentaje": `${Math.round((taxonomiasCount/totalUrls)*100)}%`, "Benchmark SEO / Estado": "Páginas de Agrupación y Filtro" },
  { "Métrica / Indicador": "Redirecciones 301 Mapeadas (Migración WP)", "Valor": redirectsCount, "Porcentaje": "-", "Benchmark SEO / Estado": "Preservación de Jugo SEO (Link Equity)" },
  { "Métrica / Indicador": "---", "Valor": "---", "Porcentaje": "---", "Benchmark SEO / Estado": "---" },
  { "Métrica / Indicador": "Meta Titles Óptimos (40 a 65 caracteres)", "Valor": titlesOptimos, "Porcentaje": `${Math.round((titlesOptimos/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🟢 100% visible en SERPs de Google" },
  { "Métrica / Indicador": "Meta Titles Cortos (< 40 caracteres)", "Valor": titlesCortos, "Porcentaje": `${Math.round((titlesCortos/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🟡 Desaprovechan espacio de CTR" },
  { "Métrica / Indicador": "Meta Titles Largos (> 65 caracteres)", "Valor": titlesLargos, "Porcentaje": `${Math.round((titlesLargos/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🔴 Riesgo de truncamiento (...)" },
  { "Métrica / Indicador": "Meta Titles Heredados / Genéricos", "Valor": titlesHeredados, "Porcentaje": `${Math.round((titlesHeredados/totalUrls)*100)}%`, "Benchmark SEO / Estado": "⚠️ Requiere Title específico en Page" },
  { "Métrica / Indicador": "---", "Valor": "---", "Porcentaje": "---", "Benchmark SEO / Estado": "---" },
  { "Métrica / Indicador": "Meta Descriptions Óptimas (110 a 165 caracteres)", "Valor": descsOptimas, "Porcentaje": `${Math.round((descsOptimas/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🟢 Cobertura ideal de snippet" },
  { "Métrica / Indicador": "Meta Descriptions Cortas (< 110 caracteres)", "Valor": descsCortas, "Porcentaje": `${Math.round((descsCortas/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🟡 Poco incentivo al clic (CTR)" },
  { "Métrica / Indicador": "Meta Descriptions Largas (> 165 caracteres)", "Valor": descsLargas, "Porcentaje": `${Math.round((descsLargas/totalUrls)*100)}%`, "Benchmark SEO / Estado": "🔴 Se cortarán en vista móvil/desktop" },
  { "Métrica / Indicador": "Meta Descriptions Heredadas / Genéricas", "Valor": descsHeredadas, "Porcentaje": `${Math.round((descsHeredadas/totalUrls)*100)}%`, "Benchmark SEO / Estado": "⚠️ Requiere Description específica" }
];

const hallazgosAuditoria = [
  {
    "Prioridad": "Alta (P1)",
    "Componente / Área": "Páginas con 'use client' sin Metadata",
    "Páginas Afectadas": "/contacto-chullos, /viaje-personalizado, /muchas-gracias, /resultados-de-busqueda",
    "Problema Detectado": "Al ser componentes Client-side puros sin envoltorio de Server Component ni 'export const metadata', Next.js 16 les asigna el Meta Title y Description por defecto del RootLayout. Esto causa canibalización interna de snippets.",
    "Solución Recomendada": "Convertir cada página en un Server Component que defina 'export const metadata' estático o dinámico, y delegar la interacción a un Client Component hijo (ej. <ContactClient />)."
  },
  {
    "Prioridad": "Alta (P1)",
    "Componente / Área": "Protección de Páginas de Confirmación",
    "Páginas Afectadas": "/muchas-gracias/",
    "Problema Detectado": "La página de agradecimiento no cuenta con meta tag robots 'noindex, nofollow' explícito en código.",
    "Solución Recomendada": "Añadir robots: { index: false, follow: false } para prevenir que los rastreadores indexen páginas post-reserva vacías."
  },
  {
    "Prioridad": "Media (P2)",
    "Componente / Área": "Estandarización de Longitud en Tours",
    "Páginas Afectadas": "Varios JSONs en data/tours/",
    "Problema Detectado": "Algunos tours tienen meta_description mayores a 165 caracteres o menores a 110 caracteres.",
    "Solución Recomendada": "Ajustar las descripciones en los archivos JSON individuales usando el archivo Excel como guía de trabajo directa."
  },
  {
    "Prioridad": "Media (P2)",
    "Componente / Área": "Schema.org Rich Snippets",
    "Páginas Afectadas": "Tours, Destinos y Blog",
    "Problema Detectado": "Todos los tours cuentan con datos estructurados 'TouristTrip' y 'Product'. Es indispensable verificar que 'offers.priceCurrency' esté en USD/PEN y 'aggregateRating' sea válido en Google Rich Results.",
    "Solución Recomendada": "Mantener la validación periódica con Google Rich Results Test mediante el script validate-data."
  },
  {
    "Prioridad": "Baja (P3)",
    "Componente / Área": "Redirecciones 301 de Migración",
    "Páginas Afectadas": "34 URLs antiguas de WordPress",
    "Problema Detectado": "Se definieron 34 redirecciones permanentes en next.config.ts para evitar errores 404 de URLs históricas de WordPress.",
    "Solución Recomendada": "Monitorear en Google Search Console para confirmar que el tráfico histórico migre sin pérdidas hacia las rutas App Router."
  }
];

// ==========================================
// 10. Creación del Libro Excel (.xlsx)
// ==========================================
const wb = XLSX.utils.book_new();

// Helper para autoajustar anchos de columnas
function setColWidths(ws, data) {
  if (!data || data.length === 0) return;
  const colKeys = Object.keys(data[0]);
  ws["!cols"] = colKeys.map(key => {
    let maxLen = key.toString().length;
    for (const row of data) {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const len = val.toString().length;
        if (len > maxLen) maxLen = Math.min(len, 60); // tope máx 60 para no distorsionar
      }
    }
    return { wch: Math.max(maxLen + 3, 12) };
  });
}

// 1. Hoja Resumen Ejecutivo
const wsResumen = XLSX.utils.json_to_sheet(resumenEjecutivo);
setColWidths(wsResumen, resumenEjecutivo);
XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen Ejecutivo SEO");

// 2. Hoja Recomendaciones y Auditoría
const wsHallazgos = XLSX.utils.json_to_sheet(hallazgosAuditoria);
setColWidths(wsHallazgos, hallazgosAuditoria);
XLSX.utils.book_append_sheet(wb, wsHallazgos, "Diagnósticos & Auditoria");

// 3. Hoja Consolidada Maestra (All URLs)
const wsMaster = XLSX.utils.json_to_sheet(masterInventory);
setColWidths(wsMaster, masterInventory);
XLSX.utils.book_append_sheet(wb, wsMaster, "Inventario Total URLs (102)");

// 4. Hoja Tours Detallada
const toursClean = toursList.map(t => ({
  "Nombre Tour": t.tituloOficial,
  "Slug": t.slug,
  "URL Canónica": t.urlCanonica,
  "Focus Keyword": t.focusKeyword,
  "Meta Title": t.metaTitle,
  "Long. Title": t.titleLength,
  "Estado Title": t.titleStatus,
  "Meta Description": t.metaDescription,
  "Long. Desc": t.descLength,
  "Estado Desc": t.descStatus,
  "Precio USD": t.precioUsd,
  "Precio PEN": t.precioPen,
  "Duración": t.duracion,
  "Dificultad": t.dificultad,
  "Robots": t.robots,
  "Open Graph Image": t.ogImage,
  "Schema Type": t.schemaType,
  "Archivo JSON": t.archivoFuente
}));
const wsTours = XLSX.utils.json_to_sheet(toursClean);
setColWidths(wsTours, toursClean);
XLSX.utils.book_append_sheet(wb, wsTours, "Tours (33 Paquetes)");

// 5. Hoja Blog Detallada
const blogClean = blogPostsList.map(b => ({
  "Título Artículo": b.titulo,
  "Slug": b.slug,
  "URL Canónica": b.urlCanonica,
  "Meta Title": b.metaTitle,
  "Long. Title": b.titleLength,
  "Estado Title": b.titleStatus,
  "Meta Description": b.metaDescription,
  "Long. Desc": b.descLength,
  "Estado Desc": b.descStatus,
  "Tiempo Lectura": b.readingTime,
  "Vistas Históricas": b.pageViews,
  "Fecha Publicación": b.fecha,
  "Imagen Destacada": b.ogImage,
  "Robots": b.robots,
  "Schema": b.schemaType,
  "Archivo Markdown": b.archivoFuente
}));
const wsBlog = XLSX.utils.json_to_sheet(blogClean);
setColWidths(wsBlog, blogClean);
XLSX.utils.book_append_sheet(wb, wsBlog, "Blog (15 Artículos)");

// 6. Hoja Destinos Detallada
const destinosClean = destinosList.map(d => ({
  "Destino": d.nombre,
  "Slug": d.slug,
  "Tipo": d.tipo,
  "URL Canónica": d.urlCanonica,
  "Meta Title": d.metaTitle,
  "Long. Title": d.titleLength,
  "Estado Title": d.titleStatus,
  "Meta Description": d.metaDescription,
  "Long. Desc": d.descLength,
  "Estado Desc": d.descStatus,
  "Tours Disponibles": d.toursCount,
  "Robots": d.robots,
  "Imagen Destacada": d.ogImage,
  "Schema": d.schemaType,
  "Archivo Fuente": d.archivoFuente
}));
const wsDestinos = XLSX.utils.json_to_sheet(destinosClean);
setColWidths(wsDestinos, destinosClean);
XLSX.utils.book_append_sheet(wb, wsDestinos, "Destinos (10 Hubs)");

// 7. Hoja Páginas Estáticas y Legales
const staticClean = staticPagesMeta.map(s => ({
  "Página": s.nombre,
  "Categoría": s.categoria,
  "Ruta Relativa": s.urlRelativa,
  "URL Canónica": s.urlCanonica,
  "Meta Title": s.metaTitle,
  "Long. Title": s.titleLength,
  "Estado Title": s.titleStatus,
  "Meta Description": s.metaDescription,
  "Long. Desc": s.descLength,
  "Estado Desc": s.descStatus,
  "Robots": s.robots,
  "Schema Type": s.schemaType,
  "Archivo Fuente": s.archivoFuente,
  "Diagnóstico": s.diagnosticoNota || "Correcto"
}));
const wsStatic = XLSX.utils.json_to_sheet(staticClean);
setColWidths(wsStatic, staticClean);
XLSX.utils.book_append_sheet(wb, wsStatic, "Páginas Estáticas (24)");

// 8. Hoja Taxonomías y Filtros
const wsTaxonomias = XLSX.utils.json_to_sheet(processedTaxonomias);
setColWidths(wsTaxonomias, processedTaxonomias);
XLSX.utils.book_append_sheet(wb, wsTaxonomias, "Taxonomías & Filtros (20)");

// 9. Hoja Redirecciones 301 Migración
const wsRedirects = XLSX.utils.json_to_sheet(generalRedirects);
setColWidths(wsRedirects, generalRedirects);
XLSX.utils.book_append_sheet(wb, wsRedirects, "Redirecciones 301 (34)");

// Guardar archivo Excel en la raíz del proyecto
const outputPath = path.join(process.cwd(), "MATRIZ_META_SEO_CHULLOSTOURS.xlsx");
XLSX.writeFile(wb, outputPath);

console.log(`\n======================================================`);
console.log(`✅ ARCHIVO EXCEL GENERADO EXITOSAMENTE`);
console.log(`📁 Ubicación: ${outputPath}`);
console.log(`📊 Estadísticas:`);
console.log(`   - URLs Totales Auditadas: ${totalUrls}`);
console.log(`   - Tours Auditados: ${toursCount}`);
console.log(`   - Artículos Blog: ${blogCount}`);
console.log(`   - Destinos: ${destinosCount}`);
console.log(`   - Páginas Estáticas / Legales: ${staticCount}`);
console.log(`   - Taxonomías & Filtros: ${taxonomiasCount}`);
console.log(`   - Redirecciones 301 Mapeadas: ${redirectsCount}`);
console.log(`   - Hojas en el Excel: ${wb.SheetNames.length} pestañas`);
console.log(`======================================================\n`);
