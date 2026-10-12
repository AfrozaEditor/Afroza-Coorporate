"use server";

import { revalidatePath } from "next/cache";

import { getCurrentEditor } from "@/lib/auth";
import { slugify, SLUG_PATTERN } from "@/lib/news/format";
import {
  EXCERPT_MAX,
  NEWS_CATEGORIES,
  NEWS_COLUMNS,
  TITLE_MAX,
  effectiveStatus,
  formToColumns,
  rowToForm,
  type NewsForm,
  type NewsRow,
  type NewsStatus,
} from "@/lib/news/types";
import { NEWS_IMAGES_BUCKET } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const SAVE_INTENTS = ["autosave", "draft", "publish", "schedule"] as const;
export type SaveIntent = (typeof SAVE_INTENTS)[number];

export type SaveNewsResult =
  | {
      ok: true;
      id: string;
      status: NewsStatus;
      publishedAt: string | null;
      hasPending: boolean;
      savedAt: string;
      updatedByName: string | null;
    }
  | { ok: false; error: string; field?: keyof NewsForm };

type Failure = Extract<SaveNewsResult, { ok: false }>;

const SESSION_EXPIRED: Failure = {
  ok: false,
  error: "Votre session a expiré : reconnectez-vous dans un autre onglet puis réessayez.",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateForm(input: NewsForm): { form: NewsForm } | Failure {
  const title = String(input.title ?? "").trim();
  if (!title) return { ok: false, field: "title", error: "Le titre est obligatoire." };
  if (title.length > TITLE_MAX) {
    return { ok: false, field: "title", error: `Le titre ne doit pas dépasser ${TITLE_MAX} caractères.` };
  }

  const slug = String(input.slug ?? "").trim() || slugify(title);
  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    return {
      ok: false,
      field: "slug",
      error: "Le lien ne peut contenir que des lettres minuscules sans accents, des chiffres et des tirets.",
    };
  }

  const excerpt = String(input.excerpt ?? "").trim();
  if (excerpt.length > EXCERPT_MAX) {
    return { ok: false, field: "excerpt", error: `Le résumé ne doit pas dépasser ${EXCERPT_MAX} caractères.` };
  }

  const content = String(input.content ?? "");
  if (content.length > 500_000) {
    return { ok: false, field: "content", error: "L'article est trop long." };
  }

  const coverUrl = input.coverUrl ? String(input.coverUrl) : null;
  if (coverUrl && !isHttpUrl(coverUrl) && !coverUrl.startsWith("/")) {
    return { ok: false, field: "coverUrl", error: "Image de couverture invalide." };
  }

  if (!NEWS_CATEGORIES.includes(input.category)) {
    return { ok: false, field: "category", error: "Choisissez une catégorie." };
  }
  if (input.source !== "written" && input.source !== "whatsapp") {
    return { ok: false, field: "source", error: "Origine de la news invalide." };
  }

  const whatsappUrl = String(input.whatsappUrl ?? "").trim();
  if (whatsappUrl && !isHttpUrl(whatsappUrl)) {
    return { ok: false, field: "whatsappUrl", error: "Le lien du post doit commencer par https://." };
  }
  const whatsappPostedOn = String(input.whatsappPostedOn ?? "").trim();
  if (whatsappPostedOn && !/^\d{4}-\d{2}-\d{2}$/.test(whatsappPostedOn)) {
    return { ok: false, field: "whatsappPostedOn", error: "Date du post invalide." };
  }

  const keywords = Array.isArray(input.keywords)
    ? [...new Set(input.keywords.map((k) => String(k).trim()).filter(Boolean))].slice(0, 30).map((k) => k.slice(0, 50))
    : [];

  return {
    form: {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      category: input.category,
      source: input.source,
      authorName: String(input.authorName ?? "").trim().slice(0, 120),
      featured: Boolean(input.featured),
      keywords,
      whatsappUrl,
      whatsappPostedOn,
      whatsappCta: Boolean(input.whatsappCta),
    },
  };
}

// Compteurs et liste du back-office (la barre latérale est dans un layout).
function revalidateAdmin() {
  revalidatePath("/admin/news", "layout");
}

function revalidateSite(...slugs: (string | null | undefined)[]) {
  revalidateAdmin();
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/news/${slug}`);
}

const SLUG_TAKEN: Failure = {
  ok: false,
  field: "slug",
  error: "Ce lien est déjà utilisé par une autre news : modifiez-le.",
};

export async function saveNews(input: {
  id?: string | null;
  form: NewsForm;
  intent: SaveIntent;
  scheduledAt?: string | null;
}): Promise<SaveNewsResult> {
  const editor = await getCurrentEditor();
  if (!editor) return SESSION_EXPIRED;
  if (!SAVE_INTENTS.includes(input.intent)) return { ok: false, error: "Action inconnue." };

  const validated = validateForm(input.form ?? ({} as NewsForm));
  if ("ok" in validated) return validated;
  const { form } = validated;

  const now = new Date();
  let scheduledAt: string | null = null;
  if (input.intent === "schedule") {
    const date = input.scheduledAt ? new Date(input.scheduledAt) : null;
    if (!date || Number.isNaN(date.getTime()) || date.getTime() <= now.getTime() + 60_000) {
      return { ok: false, error: "Choisissez une date et une heure de publication à venir." };
    }
    scheduledAt = date.toISOString();
  }

  const supabase = await createClient();
  const audit = { updated_by: editor.userId, updated_by_name: editor.fullName };
  const columns = formToColumns(form);

  // Le lien doit être libre (vérifié aussi pour les modifications en attente).
  const slugQuery = supabase.from("news").select("id").eq("slug", form.slug).limit(1);
  const { data: sameSlug } = input.id ? await slugQuery.neq("id", input.id) : await slugQuery;
  if (sameSlug && sameSlug.length > 0) return SLUG_TAKEN;

  // --- Création -------------------------------------------------------------
  if (!input.id) {
    const status: NewsStatus =
      input.intent === "publish" ? "published" : input.intent === "schedule" ? "scheduled" : "draft";
    const { data, error } = await supabase
      .from("news")
      .insert({
        ...columns,
        ...audit,
        status,
        published_at: status === "published" ? now.toISOString() : scheduledAt,
      })
      .select("id, status, published_at, updated_at")
      .single();
    if (error) return error.code === "23505" ? SLUG_TAKEN : { ok: false, error: `Enregistrement impossible : ${error.message}` };
    if (status !== "draft") revalidateSite(form.slug);
    else revalidateAdmin();
    return {
      ok: true,
      id: data.id,
      status: data.status,
      publishedAt: data.published_at,
      hasPending: false,
      savedAt: data.updated_at,
      updatedByName: editor.fullName,
    };
  }

  if (typeof input.id !== "string" || !UUID.test(input.id)) return { ok: false, error: "News introuvable." };

  const { data: current } = await supabase
    .from("news")
    .select("status, published_at, slug")
    .eq("id", input.id)
    .maybeSingle();
  if (!current) return { ok: false, error: "Cette news n'existe plus (supprimée entre-temps ?)." };

  // --- Brouillon / enregistrement automatique ------------------------------
  if (input.intent === "autosave" || input.intent === "draft") {
    if (current.status === "draft") {
      const { data, error } = await supabase
        .from("news")
        .update({ ...columns, ...audit })
        .eq("id", input.id)
        .select("updated_at")
        .single();
      if (error) return error.code === "23505" ? SLUG_TAKEN : { ok: false, error: `Enregistrement impossible : ${error.message}` };
      return {
        ok: true,
        id: input.id,
        status: "draft",
        publishedAt: current.published_at,
        hasPending: false,
        savedAt: data.updated_at,
        updatedByName: editor.fullName,
      };
    }

    // News en ligne ou programmée : les modifications restent en attente
    // jusqu'au clic sur « Mettre à jour ».
    const { data, error } = await supabase
      .from("news_pending")
      .upsert({ news_id: input.id, data: form, ...audit })
      .select("updated_at")
      .single();
    if (error) return { ok: false, error: `Enregistrement impossible : ${error.message}` };
    return {
      ok: true,
      id: input.id,
      status: current.status,
      publishedAt: current.published_at,
      hasPending: true,
      savedAt: data.updated_at,
      updatedByName: editor.fullName,
    };
  }

  // --- Publication / programmation -----------------------------------------
  const status: NewsStatus = input.intent === "schedule" ? "scheduled" : "published";
  const alreadyOnline = effectiveStatus(current.status, current.published_at, now.getTime()) === "published";
  const publishedAt =
    status === "scheduled" ? scheduledAt : alreadyOnline ? current.published_at : now.toISOString();

  const { data, error } = await supabase
    .from("news")
    .update({ ...columns, ...audit, status, published_at: publishedAt })
    .eq("id", input.id)
    .select("updated_at")
    .single();
  if (error) return error.code === "23505" ? SLUG_TAKEN : { ok: false, error: `Publication impossible : ${error.message}` };

  await supabase.from("news_pending").delete().eq("news_id", input.id);
  revalidateSite(current.slug, form.slug);

  return {
    ok: true,
    id: input.id,
    status,
    publishedAt,
    hasPending: false,
    savedAt: data.updated_at,
    updatedByName: editor.fullName,
  };
}

/** Abandonne les modifications en attente et renvoie la version en ligne. */
export async function discardPendingChanges(
  id: string
): Promise<{ ok: true; form: NewsForm } | Failure> {
  const editor = await getCurrentEditor();
  if (!editor) return SESSION_EXPIRED;
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "News introuvable." };

  const supabase = await createClient();
  const { error } = await supabase.from("news_pending").delete().eq("news_id", id);
  if (error) return { ok: false, error: `Annulation impossible : ${error.message}` };
  const { data } = await supabase.from("news").select(NEWS_COLUMNS).eq("id", id).maybeSingle();
  if (!data) return { ok: false, error: "Cette news n'existe plus." };
  return { ok: true, form: rowToForm(data as NewsRow) };
}

/** Publier tout de suite ou repasser en brouillon (menu de la liste). */
export async function setNewsStatus(
  id: string,
  status: "published" | "draft"
): Promise<{ ok: true } | Failure> {
  const editor = await getCurrentEditor();
  if (!editor) return SESSION_EXPIRED;
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "News introuvable." };
  if (status !== "published" && status !== "draft") return { ok: false, error: "Statut inconnu." };

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("news")
    .select("status, published_at, slug")
    .eq("id", id)
    .maybeSingle();
  if (!current) return { ok: false, error: "Cette news n'existe plus." };

  const alreadyOnline = effectiveStatus(current.status, current.published_at) === "published";
  const { error } = await supabase
    .from("news")
    .update({
      status,
      published_at: status === "published" && !alreadyOnline ? new Date().toISOString() : current.published_at,
      updated_by: editor.userId,
      updated_by_name: editor.fullName,
    })
    .eq("id", id);
  if (error) return { ok: false, error: `Modification impossible : ${error.message}` };

  revalidateSite(current.slug);
  return { ok: true };
}

function storagePathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${NEWS_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length).split("?")[0]) : null;
}

export async function deleteNews(id: string): Promise<{ ok: true } | Failure> {
  const editor = await getCurrentEditor();
  if (!editor) return SESSION_EXPIRED;
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "News introuvable." };

  const supabase = await createClient();
  const [{ data: row }, { data: pending }] = await Promise.all([
    supabase.from("news").select("slug, cover_url, content").eq("id", id).maybeSingle(),
    supabase.from("news_pending").select("data").eq("news_id", id).maybeSingle(),
  ]);
  if (!row) return { ok: false, error: "Cette news n'existe plus." };

  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { ok: false, error: `Suppression impossible : ${error.message}` };

  // Nettoyage des images hébergées par le back-office (sans bloquer).
  const pendingForm = (pending?.data ?? null) as NewsForm | null;
  const html = `${row.content} ${pendingForm?.content ?? ""}`;
  const urls = [
    row.cover_url,
    pendingForm?.coverUrl,
    ...Array.from(html.matchAll(/src="([^"]+)"/g), (match) => match[1]),
  ];
  const paths = [...new Set(urls.map((url) => (url ? storagePathFromUrl(url) : null)).filter(Boolean))] as string[];
  if (paths.length) await supabase.storage.from(NEWS_IMAGES_BUCKET).remove(paths);

  revalidateSite(row.slug);
  return { ok: true };
}
