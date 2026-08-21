import type { Metadata } from "next";
import "./styles/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  LOCALE,
} from "@/lib/seo/metadata";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "AFROZA Editor",
    "solutions numériques Cameroun",
    "développement web Cameroun",
    "développement application mobile",
    "agence digitale Cameroun",
    "UI UX design Cameroun",
    "intelligence artificielle Cameroun",
    "transformation digitale Cameroun",
    "solutions digitales Afrique",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Open Graph — WhatsApp, Facebook, LinkedIn, Telegram, etc.
  openGraph: {
    type: "website",
    locale: LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },

  // Favicon / icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/web-app-manifest-192x192.png",
  },

  // Search engine indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  // Google Search Console verification
  verification: {
    google: "qmQApfJmp4jwt8m3oNtTot7nGNwfsOfLgMnD4FfPkXQ",
  },

  // Manifest
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Global structured data */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />

        <Header/>
        <main id="main-content">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}