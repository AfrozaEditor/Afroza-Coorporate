// src/lib/seo/metadata.ts
// Centralized SEO configuration for AFROZA Editor
// All pages import from here to ensure consistency.

import type { Metadata } from "next";

/* ─── Constants ─── */
export const SITE_URL = "https://afroza-editor.tech";
export const SITE_NAME = "AFROZA Editor";
export const DEFAULT_TITLE = "AFROZA Editor — Solutions numériques innovantes";
export const DEFAULT_DESCRIPTION =
  "AFROZA Editor conçoit des solutions numériques innovantes en Afrique : développement web et mobile, UI/UX design, intelligence artificielle, data, jeux vidéo et transformation digitale.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const LOCALE = "fr_CM";

/* ─── Helper ─── */

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string; // e.g. "/services" — without trailing slash
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
};

/**
 * Creates a complete Next.js Metadata object for a page.
 * Handles title, description, canonical, Open Graph, Twitter Cards, and robots.
 */
export function createPageMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: LOCALE,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large" as const,
          },
        },
  };
}
