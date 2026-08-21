import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Blog et Actualités",
  description:
    "Suivez les actualités d'AFROZA Editor : projets en cours, innovations, participations aux hackathons et nouvelles de l'équipe basée à Yaoundé, Cameroun.",
  path: "/news",
});

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", href: "/" },
          { name: "Blog", href: "/news" },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: "Blog et Actualités",
          description:
            "Suivez les actualités d'AFROZA Editor : projets en cours, innovations, participations aux hackathons et nouvelles de l'équipe.",
          url: "https://afroza-editor.tech/news",
        })}
      />
      {children}
    </>
  );
}
