import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

import { legacyNewsAsRows } from "./legacy";
import {
  NEWS_COLUMNS,
  NEWS_LIST_COLUMNS,
  type NewsForm,
  type NewsListItem,
  type NewsRow,
} from "./types";

// ---------------------------------------------------------------------------
// Back-office (session de l'éditeur, RLS « editor »)
// ---------------------------------------------------------------------------

export async function listNewsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_LIST_COLUMNS)
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Lecture des news impossible : ${error.message}`);
  return (data ?? []) as NewsListItem[];
}

export async function countNewsForAdmin() {
  const supabase = await createClient();
  const { count } = await supabase.from("news").select("id", { count: "exact", head: true });
  return count ?? 0;
}

export type PendingChanges = {
  data: NewsForm;
  updated_by_name: string | null;
  updated_at: string;
};

export async function getNewsForEditor(id: string) {
  const supabase = await createClient();
  const [{ data: row, error }, { data: pending }] = await Promise.all([
    supabase.from("news").select(NEWS_COLUMNS).eq("id", id).maybeSingle(),
    supabase
      .from("news_pending")
      .select("data, updated_by_name, updated_at")
      .eq("news_id", id)
      .maybeSingle(),
  ]);
  if (error) throw new Error(`Lecture de la news impossible : ${error.message}`);
  if (!row) return null;
  return { row: row as NewsRow, pending: (pending as PendingChanges | null) ?? null };
}

// ---------------------------------------------------------------------------
// Site public (sans session, RLS « public »)
// ---------------------------------------------------------------------------

function publicQuery() {
  const supabase = createPublicClient();
  if (!supabase) return null;
  return supabase
    .from("news")
    .select(NEWS_COLUMNS)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());
}

/** null quand Supabase n'est pas configuré ou indisponible. */
export async function listPublishedNews(): Promise<NewsRow[] | null> {
  const query = publicQuery();
  if (!query) return null;
  const { data, error } = await query.order("published_at", { ascending: false });
  if (error) {
    console.error("[news] lecture publique impossible :", error.message);
    return null;
  }
  return data as NewsRow[];
}

/** Sans Supabase (ou s'il est injoignable), cherche dans les news historiques. */
export async function getPublishedNewsBySlug(slug: string): Promise<NewsRow | null> {
  const legacy = () => legacyNewsAsRows().find((news) => news.slug === slug) ?? null;
  const query = publicQuery();
  if (!query) return legacy();
  const { data, error } = await query.eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[news] lecture publique impossible :", error.message);
    return legacy();
  }
  return data as NewsRow | null;
}

export async function getFeaturedNews(limit: number): Promise<NewsRow[] | null> {
  const query = publicQuery();
  if (!query) return null;
  const { data, error } = await query
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[news] lecture publique impossible :", error.message);
    return null;
  }
  return data as NewsRow[];
}
