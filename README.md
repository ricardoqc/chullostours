# 🏔️ Chullos Tours — Modern Web Platform (Next.js 16 + React 19 + TypeScript)

Plataforma web de alto rendimiento para **Chullos Tours**, agencia oficial y operador directo de viajes y experiencias en Cusco, Machu Picchu, Valle Sagrado y los Andes peruanos.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.2.12 (App Router, Turbopack, Server-First Architecture)
- **Runtime / UI**: React 19.2.4
- **Lenguaje**: TypeScript 5.x (Strict mode habilitado)
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Vanilla CSS
- **Iconos**: `lucide-react` & `react-icons`
- **Fuente de Datos**: Archivos JSON locales estructurados (`/data/*.json`) con esquemas SEO y GEO listos para indexación.

---

## 📂 Arquitectura del Proyecto

```
app-frontend/
├── data/                       # Base de datos local JSON (Tours, Blogs, Reviews)
│   ├── tours/                  # 34 tours y paquetes con esquemas Schema.org
│   ├── blogs/                  # 15+ artículos de viaje y guías oficiales
│   └── reviews/                # Reseñas verificadas de TripAdvisor
├── docs/                       # Documentación técnica y guías de arquitectura
│   ├── guia-despliegue-hosting-compartido.md  # 📖 Manual de Despliegue en cPanel / Apache
│   ├── auditoria-ui-plan-mejora.md            # Auditoría y mejoras de UI/UX
│   ├── design-guidelines-ui-ux.md             # Guías de diseño y estilos de marca
│   └── recomendaciones-seo-geo.md             # Estrategia de SEO & GEO local
├── src/
│   ├── app/                    # Rutas y controladores de página (Next.js App Router)
│   │   ├── api/                # Endpoints API (envío de correos de reserva)
│   │   ├── blog/               # Portal de Blog y artículos dinámicos
│   │   ├── destinos/           # Landing pages por destino
│   │   ├── resultados-de-busqueda/ # Motor de búsqueda global
│   │   ├── tours/              # Catálogo con filtros y páginas dinámicas de tour
│   │   ├── not-found.tsx       # 404 personalizado temático
│   │   └── layout.tsx          # Root Layout con Header, Footer y ScrollToTop
│   ├── components/             # Componentes modulares y reutilizables
│   │   ├── blog/               # Componentes de blog (cards, autor, FAQ, filtros)
│   │   ├── layout/             # Header sticky dinámico, Footer, LanguageSelector
│   │   ├── tours/              # Timeline, Widget de reserva, Modal, Galería, Filtros
│   │   └── ui/                 # CustomDatePicker, ScrollToTop, Badges, Botones
│   ├── i18n/                   # Sistema de internacionalización ligero (ES / EN)
│   ├── lib/                    # Lógica de negocio y data access (tours, blogs, email)
│   └── types/                  # Contratos e interfaces TypeScript estrictas
└── public/                     # Activos estáticos (imágenes, logos, iconos)
```

---

## ✨ Características Clave

1. **Motor de Búsqueda y Dropdowns Interactivos**: Dropdowns estilizados para destinos y estilos de viaje en el Hero, y barra en el Header con autocompletado y búsquedas populares.
2. **Filtros de Catálogo *Aesthetic***: Chips con dots luminosos, deslizantes de rango de días y tarjetas de presupuesto en tiempo real.
3. **Optimización Móvil (Tour Detail)**: Barra sticky inferior con botón de reserva y acceso directo a WhatsApp sin duplicidades.
4. **Galería de Fotos Centrada**: Adaptación responsiva de fotos verticales y horizontales con visor Lightbox en pantalla completa.
5. **Calendario de Reserva Interactivo (`CustomDatePicker`)**: Selector mensual con bloqueo de fechas pasadas y selección táctil amigable.
6. **Mailing y Notificaciones**: Endpoints `/api/send-reservation` y `/api/send-custom-trip` con SMTP Gmail (nodemailer): correo al admin + confirmación al cliente.
7. **Página 404 Temática**: Interfaz personalizada con buscador y sugerencias de rutas turísticas.

---

## 📦 Migración a CMS (Strapi / Directus)

Los tours viven en JSON tipados (`data/tours/*.json`). El acceso pasa por `src/lib/data/tours-repository.ts`.

1. Exporta datos planos: `node scripts/export-tours-for-cms.mjs` → `data/exports/tours-cms-export.json`
2. Crea Content-Types: Tour, HotelOption, Extra, FAQ, GalleryImage
3. Sustituye `jsonRepository` por un cliente Strapi/Directus sin cambiar componentes UI
4. DB recomendada: Postgres o MySQL en Coolify

---

## 🌐 Despliegue en Coolify (producción)

1. Crea una app **Node.js** (no estático) apuntando a este repo.
2. Build: `npm ci && npm run build` — Start: `node .next/standalone/server.js` (o el comando que Coolify detecte con `output: "standalone"`).
3. Copia las variables de [`.env.example`](.env.example) en Coolify:
   - `GOOGLE_MAIL_USER` — cuenta Gmail que envía
   - `GOOGLE_MAIL_APP_PASSWORD` — contraseña de aplicación de Google (no la contraseña normal)
   - `ADMIN_EMAIL` — correos del equipo que reciben leads (coma-separados)
   - `NEXT_PUBLIC_SITE_URL`
4. En Gmail: activa verificación en 2 pasos y genera una [contraseña de aplicación](https://myaccount.google.com/apppasswords).
5. Healthcheck: `GET /` (HTTP 200).
6. Tras editar tours en el CMS, los cambios se invalidan con `revalidatePath` (ISR ~60s). Si no aparecen, revisa volúmenes `/app/data` y `/app/public/media`.

Para hosting compartido / export estático, la API de emails no estará disponible; usa el modo Node en Coolify.

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilación estricta y generación de páginas estáticas
npm run build

# Iniciar servidor en modo producción local
npm run start

# Análisis de linter
npm run lint
```

---

## 🌐 Guía de Despliegue en Servidores / Hosting

Para desplegar la aplicación en un hosting compartido convencional (cPanel, Apache, LiteSpeed) o VPS, consulta la guía completa:

👉 **[📖 Manual de Despliegue en Hosting Compartido (`docs/guia-despliegue-hosting-compartido.md`)](docs/guia-despliegue-hosting-compartido.md)**

