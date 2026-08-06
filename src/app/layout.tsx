import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { SITE_CONFIG } from "@/data/content";
import EasterEggs from "@/components/ui/EasterEggs";

// ─── Fonts ──────────────────────────────────────────────────────────────────
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

// ─── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteURL),
  title: SITE_CONFIG.siteTitle,
  description: SITE_CONFIG.siteDescription,
  openGraph: {
    title: SITE_CONFIG.siteTitle,
    description: SITE_CONFIG.siteDescription,
    url: SITE_CONFIG.siteURL,
    siteName: SITE_CONFIG.siteTitle,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.siteTitle,
      },
    ],
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

// ─── Viewport ───────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#141414",
};

// ─── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="bg-netflix-dark text-white antialiased overflow-x-hidden">
        <EasterEggs />
        {children}
      </body>
    </html>
  );
}
