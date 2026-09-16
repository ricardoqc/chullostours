import type { Metadata } from "next";
import { Manrope, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { I18nProvider } from "@/i18n/I18nContext";
import { MarketProvider } from "@/components/layout/MarketProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { MediaProtection } from "@/components/ui/MediaProtection";
import { PublicAnalytics } from "@/components/analytics/PublicAnalytics";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chullostours.com"),
  icons: {
    icon: [
      { url: "/cropped-chullos-icono.png", sizes: "32x32", type: "image/png" },
      { url: "/cropped-chullos-icono.png", sizes: "192x192", type: "image/png" },
      { url: "/cropped-chullos-icono.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/cropped-chullos-icono.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/cropped-chullos-icono.png",
  },
  title: {
    default: "Chullos Tours - Agencia Oficial de Viajes & Tours en Cusco y Perú",
    template: "%s | Chullos Tours",
  },
  description:
    "Descubre Machu Picchu, el Valle Sagrado, Camino Inca y los mejores destinos en Perú con Chullos Tours. Guías locales expertos, itinerarios todo incluido y precios transparentes.",
  keywords: [
    "Tours Cusco",
    "Machu Picchu 2026",
    "Camino Inca",
    "Valle Sagrado",
    "Laguna Humantay",
    "Montaña de 7 Colores",
    "Agencia de Viajes Cusco",
    "Chullos Tours",
  ],
  authors: [{ name: "Chullos Tours", url: "https://chullostours.com" }],
  creator: "Chullos Tours",
  publisher: "Chullos Tours",
  openGraph: {
    title: "Chullos Tours - Experiencias Auténticas en Cusco y Perú",
    description: "Aventuras inolvidables a Machu Picchu, Camino Inca y Cusco guiadas por expertos locales.",
    url: "https://chullostours.com",
    siteName: "Chullos Tours",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chullos Tours - Agencia Oficial de Viajes en Cusco",
    description: "Tours todo incluido a Machu Picchu y destinos sagrados de Perú con guías andinos locales.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${jost.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/cropped-chullos-icono.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/cropped-chullos-icono.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-body-bg text-body">
        <PublicAnalytics />
        <I18nProvider>
          <MarketProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ScrollToTop />
            <MediaProtection />
          </MarketProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
