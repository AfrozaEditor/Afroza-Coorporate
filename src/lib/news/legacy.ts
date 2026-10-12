import { legacyNews } from "@/data/news";

import { truncate } from "./format";
import { EXCERPT_MAX, type NewsRow } from "./types";

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** « 22-05-2026 » → ISO (9 h, heure de Yaoundé). */
function dashedDateToIso(date: string) {
  const [day, month, year] = date.split("-");
  return new Date(`${year}-${month}-${day}T09:00:00+01:00`).toISOString();
}

/**
 * News historiques au format de la base, pour afficher leur page article
 * tant que Supabase n'est pas configuré.
 */
export function legacyNewsAsRows(): NewsRow[] {
  return legacyNews.map((item) => {
    const paragraphs = item.text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeHtml(line)}</p>`);
    const extraImages = item.images.slice(1).map((src) => `<img src="${escapeHtml(src)}" alt="">`);
    const link = item.link
      ? [`<p><a href="${escapeHtml(item.link)}">${escapeHtml(item.link)}</a></p>`]
      : [];
    const publishedAt = dashedDateToIso(item.date);

    return {
      id: item.slug,
      slug: item.slug,
      title: item.title,
      excerpt: truncate(item.text, EXCERPT_MAX),
      content: [...paragraphs, ...extraImages, ...link].join(""),
      cover_url: item.images[0] ?? null,
      category: item.category,
      source: item.source,
      status: "published",
      published_at: publishedAt,
      featured: false,
      author_name: item.auteur ?? "",
      keywords: [],
      whatsapp_url: null,
      whatsapp_posted_on: null,
      whatsapp_cta: false,
      updated_by_name: null,
      created_at: publishedAt,
      updated_at: publishedAt,
    };
  });
}
