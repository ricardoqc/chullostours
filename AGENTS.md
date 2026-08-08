# Antigravity & AI Agent Engineering Guidelines for Chullos Tours Migration

## 🚀 Overview
This repository is a modern web application for **Chullos Tours**, migrating from a legacy WordPress site to a high-performance **Next.js 16+ (App Router)** codebase written in **TypeScript 5.x** and **Tailwind CSS v4**.

All AI agents (Antigravity, Claude, ChatGPT, Cursor, etc.) contributing to this codebase **MUST** strictly adhere to the standards, architecture, and constraints detailed in this guide.

---

## 🛠️ Tech Stack Specifications

- **Framework**: Next.js 16.2.12 (App Router, Turbopack, React Server Components)
- **Runtime / UI**: React 19.2.4
- **Language**: TypeScript 5.x (Strict mode enabled)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Vanilla CSS
- **Data Source**: Local JSON files (`/data/*.json`) with ready-to-use SEO & GEO schema mappings.

---

## 🧠 AI Agent Skills & Required Capabilities

Any AI agent interacting with this project MUST possess and execute the following capabilities:

### 1. Next.js 16 Asynchronous Standards
- `params` and `searchParams` in Page components and `generateMetadata` **MUST** be typed as `Promise<{ slug: string }>` and unwrapped using `await params`.
  ```tsx
  // CORRECT (Next.js 16+)
  interface PageProps {
    params: Promise<{ slug: string }>;
  }

  export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    // ...
  }
  ```

### 2. Strict Type Safety (No `any` Policy)
- Never use `any` or loose casting unless dealing with third-party untyped JSON-LD schemas.
- Rely on `@/types/tour.ts` for all product, itinerary, SEO, and GEO data attributes.

### 3. Server-First Architecture (RSC)
- Default to **React Server Components** for data fetching and layout composition.
- Use `'use client'` strictly when interactive hooks (`useState`, `useEffect`, event handlers) are necessary.

### 4. Modular & Clean Architecture
Keep a clean separation of concerns:
```
src/
├── app/          # Pure Routing & Page Controllers (Next.js App Router)
├── components/   # Modular, Single-Responsibility UI Components
│   ├── layout/   # Header, Footer, Navigation
│   ├── tours/    # TourItinerary, TourGallery, TourBookingWidget, TourFAQs
│   └── ui/       # Buttons, Badges, Modals, Cards
├── lib/          # Data Access Layer & Business Utilities (e.g. tours.ts)
└── types/        # TypeScript Interfaces & Contracts
```

---

## 🎯 Current Project Scope & Phase Boundaries

> [!IMPORTANT]
> **CURRENT PHASE**: Structural & Route Verification Phase.
> - **DO NOT** implement final UI colors, complex branding, or heavy visual design yet.
> - Focus purely on **route navigation, data wiring, dynamic parameters, SEO head tag generation, and layout skeleton correctness**.
> - Styling must remain clean, minimal, and structural (neutral Tailwind classes: `slate-50`, `bg-white`, `border`, `rounded`).

---

## 📋 Rules for AI Agents Working on New Pages

1. **Verify Routes**: Refer to `data/rutas_migracion.json` before creating new page routes.
2. **Data Provider**: Use helper functions in `src/lib/tours.ts` (`getAllTours()`, `getTourBySlug(slug)`). Never read raw filesystem contents directly inside client components.
3. **SEO & Schema.org**: Every tour page MUST inject the `seo_schema` via `<script type="application/ld+json">` and provide `generateMetadata` for OpenGraph and Twitter cards.
4. **Verification**: Always run `npm run build` or inspect runtime logs before concluding a task to ensure zero TypeScript errors or missing imports.

---

## 🧪 Quick Reference Commands

- **Development Server**: `npm run dev`
- **Type Check & Production Build**: `npm run build`
- **Linting**: `npm run lint`
