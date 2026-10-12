import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleView from "@/components/news/ArticleView";
import { getPublishedNewsBySlug } from "@/lib/news/queries";

// Mise en cache 60 s ; la publication depuis le back-office rafraîchit la page aussitôt.
export const revalidate = 60;

// Aucune page générée au build : chaque article est rendu à sa première visite
// puis mis en cache (ISR). Requis pour que `revalidate` s'applique.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const news = await getPublishedNewsBySlug(slug);
  if (!news) return { title: "News introuvable" };

  const images = news.cover_url ? [{ url: news.cover_url, width: 1200, height: 630, alt: news.title }] : undefined;
  return {
    title: news.title,
    description: news.excerpt || undefined,
    keywords: news.keywords,
    alternates: { canonical: `/news/${news.slug}` },
    openGraph: {
      type: "article",
      locale: "fr_CM",
      url: `/news/${news.slug}`,
      title: news.title,
      description: news.excerpt || undefined,
      publishedTime: news.published_at ?? undefined,
      authors: news.author_name ? [news.author_name] : undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.excerpt || undefined,
      images: news.cover_url ? [news.cover_url] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const news = await getPublishedNewsBySlug(slug);
  if (!news) notFound();
  return <ArticleView news={news} />;
}
