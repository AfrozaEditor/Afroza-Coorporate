// src/lib/seo/structured-data.tsx
// JSON-LD structured data helpers for AFROZA Editor
// All schemas use only real, verifiable data from the codebase.

import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "./metadata";

/* ─── Generic JSON-LD component ─── */

type JsonLdProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Organization Schema ─── */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2024",
    areaServed: [
      {
        "@type": "Country",
        name: "Cameroun",
      },
      {
        "@type": "Continent",
        name: "Afrique",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yaoundé",
      addressCountry: "CM",
      streetAddress: "CRADAT",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+237656921921",
      email: "afroza.editor@gmail.com",
      contactType: "customer service",
      availableLanguage: "French",
    },
    sameAs: [
      "https://github.com/AfrozaEditor",
      "https://www.tiktok.com/@afrozaeditor",
    ],
  };
}

/* ─── WebSite Schema ─── */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "fr",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/* ─── WebPage Schema ─── */

export function webPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "fr",
  };
}

/* ─── BreadcrumbList Schema ─── */

type BreadcrumbItem = {
  name: string;
  href: string;
};

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/* ─── FAQPage Schema ─── */

type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ─── Service Schema ─── */

export function serviceSchema({
  name,
  description,
  url,
  category,
}: {
  name: string;
  description: string;
  url: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    category,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Cameroun",
    },
  };
}

/* ─── Person Schema (for team members) ─── */

export function personSchema({
  name,
  jobTitle,
  description,
  url,
  image,
  worksFor,
}: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  worksFor?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    url,
    image,
    worksFor: {
      "@type": "Organization",
      name: worksFor ?? SITE_NAME,
      url: SITE_URL,
    },
  };
}
