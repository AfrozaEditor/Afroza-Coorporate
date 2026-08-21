import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Nos Réalisations",
  description:
    "Découvrez les projets réalisés par AFROZA Editor : plateformes web, applications mobiles, solutions SaaS et produits numériques conçus au Cameroun.",
  path: "/features",
});

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", href: "/" },
          { name: "Réalisations", href: "/features" },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: "Nos Réalisations",
          description:
            "Découvrez les projets réalisés par AFROZA Editor : plateformes web, applications mobiles, solutions SaaS et produits numériques conçus au Cameroun.",
          url: "https://afroza-editor.tech/features",
        })}
      />
      {children}
    </>
  );
}
