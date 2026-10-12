export const NEWS_CATEGORIES = [
  "Développement",
  "Business",
  "Design",
  "Data & IA",
  "Marketing",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type NewsSource = "written" | "whatsapp";
export type NewsStatus = "draft" | "published" | "scheduled";

export const TITLE_MAX = 90;
export const EXCERPT_MAX = 160;

/** Ligne de la table `news` (colonnes utilisées par l'application). */
export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: NewsCategory;
  source: NewsSource;
  status: NewsStatus;
  published_at: string | null;
  featured: boolean;
  author_name: string;
  keywords: string[];
  whatsapp_url: string | null;
  whatsapp_posted_on: string | null;
  whatsapp_cta: boolean;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
};

export const NEWS_COLUMNS =
  "id, slug, title, excerpt, content, cover_url, category, source, status, published_at, featured, author_name, keywords, whatsapp_url, whatsapp_posted_on, whatsapp_cta, updated_by_name, created_at, updated_at";

export type NewsListItem = Pick<
  NewsRow,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "cover_url"
  | "category"
  | "source"
  | "status"
  | "published_at"
  | "author_name"
  | "updated_at"
>;

export const NEWS_LIST_COLUMNS =
  "id, slug, title, excerpt, cover_url, category, source, status, published_at, author_name, updated_at";

/** Contenu modifiable d'une news, tel qu'édité dans le back-office. */
export type NewsForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  category: NewsCategory;
  source: NewsSource;
  authorName: string;
  featured: boolean;
  keywords: string[];
  whatsappUrl: string;
  whatsappPostedOn: string;
  whatsappCta: boolean;
};

export function rowToForm(row: NewsRow): NewsForm {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverUrl: row.cover_url,
    category: row.category,
    source: row.source,
    authorName: row.author_name,
    featured: row.featured,
    keywords: row.keywords ?? [],
    whatsappUrl: row.whatsapp_url ?? "",
    whatsappPostedOn: row.whatsapp_posted_on ?? "",
    whatsappCta: row.whatsapp_cta,
  };
}

export function formToColumns(form: NewsForm) {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    content: form.content,
    cover_url: form.coverUrl,
    category: form.category,
    source: form.source,
    author_name: form.authorName,
    featured: form.featured,
    keywords: form.keywords,
    whatsapp_url: form.whatsappUrl || null,
    whatsapp_posted_on: form.whatsappPostedOn || null,
    whatsapp_cta: form.whatsappCta,
  };
}

/** Une news programmée dont la date est passée est en ligne. */
export function effectiveStatus(
  status: NewsStatus,
  publishedAt: string | null,
  now: number = Date.now()
): NewsStatus {
  if (status === "scheduled" && publishedAt && new Date(publishedAt).getTime() <= now) {
    return "published";
  }
  return status;
}

export const STATUS_STYLES: Record<NewsStatus, { label: string; bg: string; fg: string }> = {
  published: { label: "Publiée", bg: "#E0F8F6", fg: "#0F6562" },
  draft: { label: "Brouillon", bg: "#EEF1F4", fg: "#4A5468" },
  scheduled: { label: "Programmée", bg: "#E7EEFB", fg: "#18409E" },
};
