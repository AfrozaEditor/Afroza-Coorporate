import Image from "next/image";
import Link from "next/link";

import { whatsappChannelUrl } from "@/config/social";
import { formatLongDate, initials } from "@/lib/news/format";
import { sanitizeNewsHtml } from "@/lib/news/sanitize";
import type { NewsRow } from "@/lib/news/types";

export type ArticleData = Pick<
  NewsRow,
  | "title"
  | "excerpt"
  | "content"
  | "cover_url"
  | "category"
  | "source"
  | "published_at"
  | "author_name"
  | "keywords"
  | "whatsapp_url"
  | "whatsapp_cta"
>;

/** Page article d'une news (site public et aperçu du back-office). */
export default function ArticleView({
  news,
  withSiteHeader = true,
}: {
  news: ArticleData;
  /** L'en-tête du site recouvre le haut de page : on réserve sa place. */
  withSiteHeader?: boolean;
}) {
  const subscribeUrl = whatsappChannelUrl || news.whatsapp_url;
  const showWhatsappCta = news.source === "whatsapp" && news.whatsapp_cta;

  return (
    <article className="w-full bg-white text-[#1B2433]">
      <header className={`bg-[#092025] px-4 pb-14 text-white sm:px-6 ${withSiteHeader ? "pt-36 sm:pt-40" : "pt-12"}`}>
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-[#18CDC4] hover:text-white"
          >
            ← Toutes les nouvelles
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-[#18CDC4] px-2.5 py-0.5 font-bold text-[#092025]">{news.category}</span>
            <span className="text-[#C9E4E5]">{formatLongDate(news.published_at)}</span>
            {news.source === "whatsapp" ? (
              <span className="text-[#9FD9D5]">· Repartagé depuis la chaîne WhatsApp</span>
            ) : null}
          </div>
          <h1 className="m-0 text-3xl font-black leading-tight tracking-[-0.01em] sm:text-5xl">{news.title}</h1>
          {news.excerpt ? <p className="m-0 text-lg text-[#C9E4E5]">{news.excerpt}</p> : null}
          {news.author_name ? (
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#18409E] text-sm font-bold">
                {initials(news.author_name)}
              </span>
              <span className="text-sm">
                Par <span className="font-bold">{news.author_name}</span>
              </span>
            </div>
          ) : null}
        </div>
      </header>

      {news.cover_url ? (
        <div className="mx-auto -mt-6 max-w-4xl px-4 sm:px-6">
          <Image
            src={news.cover_url}
            alt=""
            width={1200}
            height={630}
            sizes="(max-width: 896px) 100vw, 896px"
            className="h-auto w-full rounded-2xl object-cover shadow-xl"
            priority
          />
        </div>
      ) : null}

      {/* pb-36 : le bandeau de contact du pied de page remonte de 100 px sur la page. */}
      <div className={`mx-auto flex max-w-3xl flex-col gap-10 px-4 pt-12 sm:px-6 ${withSiteHeader ? "pb-36" : "pb-12"}`}>
        <div className="news-content" dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(news.content) }} />

        {news.keywords?.length ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Mots-clés">
            {news.keywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-[#EEF1F4] px-3 py-1 text-sm font-medium text-[#4A5468]">
                #{keyword}
              </li>
            ))}
          </ul>
        ) : null}

        {showWhatsappCta ? (
          <aside className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#092025] p-6 text-white">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-black">Publié d&apos;abord sur notre chaîne WhatsApp</span>
              <span className="text-sm text-[#C9E4E5]">Suivez les actualités d&apos;Afroza Editor dès leur parution.</span>
            </div>
            {subscribeUrl ? (
              <a
                href={subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-[10px] bg-[#18CDC4] px-6 font-bold text-[#092025] hover:brightness-95"
              >
                S&apos;abonner
              </a>
            ) : null}
          </aside>
        ) : null}
      </div>
    </article>
  );
}
