import type { Metadata } from "next";
import "./styles/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const siteUrl = "https://afroza-editor.tech"; // remplace par ton vrai domaine

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Afroza Editor — Solutions numériques au Cameroun",
    template: "%s | Afroza Editor",
  },
  description:
    "Afroza Editor conçoit des solutions web, mobiles et digitales innovantes pour les entreprises au Cameroun.",
  keywords: [
    "Afroza Editor",
    "karel ondo jean",
    "bell aqil",
    "jedidia kamdem souop",
    "solutions numériques Cameroun",
    "applications web Cameroun",
    "applications mobiles Cameroun",
    "agence digitale Cameroun",
    "afroza",
    "développement web Cameroun",
    "solutions digitales Afrique",
    "SaaS Cameroun",
    "cybersécurité Cameroun",
    "identité numérique",
  ],
  authors: [{ name: "Afroza Editor" }],
  creator: "Afroza Editor",
  publisher: "Afroza Editor",

  // Open Graph — utilisé par WhatsApp, Facebook, LinkedIn, Telegram, etc.
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Afroza Editor",
    title: "Afroza Editor — Solutions numériques au Cameroun",
    description:
      "Afroza Editor conçoit des solutions web, mobiles et digitales innovantes pour les entreprises au Cameroun.",
    images: [
      {
        url: "https://storage.googleapis.com/gpt-engineer-file-uploads/fMqgEAyw9HNCy1L4GQvdCxNBn9P2/social-images/social-1762628047737-afroza_editor(VERTICAL)bleu.png", // idéalement 1200x630
        width: 1200,
        height: 630,
        alt: "Afroza Editor",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "Afroza Editor — Solutions numériques au Cameroun",
    description:
      "Afroza Editor conçoit des solutions web, mobiles et digitales innovantes pour les entreprises au Cameroun.",
    images: ["https://storage.googleapis.com/gpt-engineer-file-uploads/fMqgEAyw9HNCy1L4GQvdCxNBn9P2/social-images/social-1762628047737-afroza_editor(VERTICAL)bleu.png"],
  },

  // Favicon / icônes onglet + partage
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/favicon-32x32.png",
  },

  // Indexation par les moteurs de recherche
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  verification: {
    google: "qmQApfJmp4jwt8m3oNtTot7nGNwfsOfLgMnD4FfPkXQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Header/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}