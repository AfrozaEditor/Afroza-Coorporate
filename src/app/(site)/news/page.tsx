import Image from "next/image";

import BlogProjectRow, { type BlogElement } from "@/components/common/blogFlow";
import { legacyNews } from "@/data/news";
import { formatDashedDate, htmlToText, truncate } from "@/lib/news/format";
import { listPublishedNews } from "@/lib/news/queries";
import type { NewsRow } from "@/lib/news/types";

// Mise en cache 60 s ; la publication depuis le back-office rafraîchit la page aussitôt.
export const revalidate = 60;

function toBlogElement(news: NewsRow): BlogElement {
    return {
        title: news.title,
        date: news.published_at ? formatDashedDate(news.published_at) : "",
        text: news.excerpt || truncate(htmlToText(news.content), 400),
        images: [news.cover_url ?? "/news/Banner.png"],
        isVideo: news.content.includes("data-youtube-video"),
        href: `/news/${news.slug}`,
        auteur: news.author_name || undefined,
        category: news.category,
    };
}

export default async function News() {
    const published = await listPublishedNews();
    const news: BlogElement[] = published
        ? published.map(toBlogElement)
        : legacyNews.map((item) => ({ ...item, href: `/news/${item.slug}` }));

    return(
        <>
            <div className="relative flex h-[100svh] min-h-[34rem] w-full items-center justify-center sm:min-h-[38rem]">
                <div className="relative w-full flex items-center justify-center my-auto bg-transparent h-full overflow-hidden">

                    {/* Coin haut-gauche : copie du dégradé, découpée en forme de coin arrondi
                    <div
                        className="absolute inset-0 z-10 bg-gradient-to-b from-brand to-[#22D51C]"
                        style={{ clipPath: 'inset(0% 75% 75% 0% round 0 0 1rem 0)' }}
                    /> */}

                    {/* Coin bas-droite : idem */}
                    {/* <div
                        className="absolute inset-0 z-10 bg-gradient-to-b from-brand to-[#22D51C]"
                        style={{ clipPath: 'inset(50% 0% 0% 75% round 1rem 0 0 0)' }}
                    /> */}

                    {/* Texte "Projets" positionné indépendamment, pas centré dans tout le bloc */}
                    {/* <p className="absolute z-20 bottom-10 right-10 text-8xl font-bold">Projets</p> */}

                    <Image
                        src="/news/Banner.png"
                        alt=""
                        fill
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute px-4 text-center text-4xl font-bold text-white sm:text-6xl lg:text-8xl">
                        <p>Blog</p>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-center">
            <BlogProjectRow elements={news}/>
            </div>
        </>
    )
}
