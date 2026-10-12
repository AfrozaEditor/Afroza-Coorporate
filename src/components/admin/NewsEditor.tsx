"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import {
  deleteNews,
  discardPendingChanges,
  saveNews,
  type SaveIntent,
  type SaveNewsResult,
} from "@/app/admin/_actions/news";
import {
  formatLongDate,
  formatTime,
  initials,
  isoToSiteLocal,
  shortName,
  siteLocalToIso,
  slugify,
} from "@/lib/news/format";
import { checkImageFile, uploadNewsImage } from "@/lib/news/storage";
import {
  EXCERPT_MAX,
  NEWS_CATEGORIES,
  TITLE_MAX,
  effectiveStatus,
  type NewsForm,
  type NewsStatus,
} from "@/lib/news/types";
import { cn } from "@/lib/utils";

import { Icon } from "./icons";
import RichTextEditor from "./RichTextEditor";
import { cardClass, ConfirmDialog, fieldClass, StatusBadge, Switch } from "./ui";

export type EditorInitial = {
  id: string | null;
  form: NewsForm;
  status: NewsStatus;
  publishedAt: string | null;
  hasPending: boolean;
  updatedByName: string | null;
  savedAt: string | null;
};

export type AuthorOption = { name: string; role: string };

type Meta = Omit<EditorInitial, "form">;
type SaveState = "idle" | "saving" | "error";

const AUTOSAVE_DELAY = 1500;
const HANDOFF_PREFIX = "afz-news-handoff:";

function handoffKey(id: string) {
  return `${HANDOFF_PREFIX}${id}`;
}

function readHandoff(id: string | null): NewsForm | null {
  if (!id || typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(handoffKey(id));
    return raw ? (JSON.parse(raw) as NewsForm) : null;
  } catch {
    return null;
  }
}

function initialSchedule(status: NewsStatus, publishedAt: string | null) {
  if (status === "scheduled" && publishedAt && new Date(publishedAt).getTime() > Date.now()) {
    return { mode: "schedule" as const, ...isoToSiteLocal(publishedAt) };
  }
  return { mode: "now" as const, date: "", time: "09:00" };
}

export default function NewsEditor({
  initial,
  authors,
}: {
  initial: EditorInitial;
  authors: AuthorOption[];
}) {
  const router = useRouter();
  const ids = { title: useId(), slug: useId(), excerpt: useId(), content: useId(), author: useId() };

  // Contenu repris après la création (voir `persist`), sinon données du serveur.
  const [handoff] = useState(() => readHandoff(initial.id));
  const [form, setForm] = useState<NewsForm>(handoff ?? initial.form);
  const [meta, setMeta] = useState<Meta>(() => {
    const { form: _form, ...rest } = initial;
    void _form;
    return rest;
  });
  const [slugTouched, setSlugTouched] = useState(
    Boolean(initial.id) && initial.form.slug !== slugify(initial.form.title)
  );
  const [{ mode, date: scheduleDate, time: scheduleTime }, setSchedule] = useState(() =>
    initialSchedule(initial.status, initial.publishedAt)
  );

  const [dirty, setDirty] = useState(Boolean(handoff));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<{ message: string; field?: keyof NewsForm } | null>(null);
  const [busyIntent, setBusyIntent] = useState<SaveIntent | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverDragging, setCoverDragging] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Numéro de version des modifications : une sauvegarde ne marque le
  // formulaire « propre » que si rien n'a changé pendant l'envoi.
  const versionRef = useRef(0);
  const formRef = useRef(form);
  const metaRef = useRef(meta);
  const savingRef = useRef<Promise<SaveNewsResult | null> | null>(null);

  useEffect(() => {
    formRef.current = form;
    metaRef.current = meta;
  });

  // La reprise de saisie ne sert qu'une fois.
  useEffect(() => {
    if (!initial.id) return;
    try {
      window.sessionStorage.removeItem(handoffKey(initial.id));
    } catch {
      // Stockage indisponible.
    }
  }, [initial.id]);

  const update = useCallback((patch: Partial<NewsForm>) => {
    versionRef.current += 1;
    setForm((current) => ({ ...current, ...patch }));
    setDirty(true);
    setSaveError((error) => (error?.field && error.field in patch ? null : error));
  }, []);

  const liveStatus = effectiveStatus(meta.status, meta.publishedAt);
  const isNew = !meta.id;

  /** Envoie le formulaire. Les envois sont sérialisés. */
  const persist = useCallback(
    async (intent: SaveIntent, scheduledAt?: string): Promise<SaveNewsResult | null> => {
      while (savingRef.current) await savingRef.current;
      const version = versionRef.current;
      const snapshot = formRef.current;
      const currentId = metaRef.current.id;

      const run = (async () => {
        setSaveState("saving");
        const result = await saveNews({ id: currentId, form: snapshot, intent, scheduledAt }).catch(
          (): SaveNewsResult => ({ ok: false, error: "Connexion au serveur impossible. Vérifiez votre réseau." })
        );
        if (!result.ok) {
          setSaveState("error");
          setSaveError({ message: result.error, field: result.field });
          return result;
        }
        setSaveState("idle");
        setSaveError(null);
        const nextMeta: Meta = {
          id: result.id,
          status: result.status,
          publishedAt: result.publishedAt,
          hasPending: result.hasPending,
          updatedByName: result.updatedByName,
          savedAt: result.savedAt,
        };
        // Mis à jour tout de suite : un envoi en attente doit viser cette news
        // (et non en créer une seconde) avant le prochain rendu.
        metaRef.current = nextMeta;
        setMeta(nextMeta);
        if (versionRef.current === version) setDirty(false);

        if (!currentId) {
          // Nouvelle news créée : on passe sur son URL en conservant la saisie.
          try {
            window.sessionStorage.setItem(handoffKey(result.id), JSON.stringify(formRef.current));
          } catch {
            // Stockage indisponible : le contenu enregistré suffit.
          }
          router.replace(`/admin/news/${result.id}`);
        }
        return result;
      })();

      savingRef.current = run;
      try {
        return await run;
      } finally {
        savingRef.current = null;
      }
    },
    [router]
  );

  // Enregistrement automatique.
  useEffect(() => {
    if (!dirty || busyIntent || !form.title.trim()) return;
    const timer = window.setTimeout(() => void persist("autosave"), AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [form, dirty, busyIntent, persist]);

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const runAction = useCallback(
    async (intent: "draft" | "publish" | "schedule") => {
      if (!formRef.current.title.trim()) {
        setSaveError({ field: "title", message: "Le titre est obligatoire." });
        document.getElementById(ids.title)?.focus();
        return;
      }
      let scheduledAt: string | undefined;
      if (intent === "schedule") {
        if (!scheduleDate) {
          toast.error("Choisissez la date de publication.");
          return;
        }
        scheduledAt = siteLocalToIso(scheduleDate, scheduleTime);
      }
      setBusyIntent(intent);
      const result = await persist(intent, scheduledAt);
      setBusyIntent(null);
      if (!result?.ok) {
        toast.error(result?.error ?? "Enregistrement impossible.");
        return;
      }
      if (intent === "draft") {
        toast.success(result.hasPending ? "Modifications enregistrées, pas encore publiées." : "Brouillon enregistré.");
      } else if (intent === "schedule") {
        toast.success(`News programmée pour le ${formatLongDate(result.publishedAt)} à ${formatTime(result.publishedAt!)}.`);
      } else {
        toast.success(liveStatus === "published" ? "News mise à jour sur le site." : "News publiée sur le site.");
      }
    },
    [ids.title, liveStatus, persist, scheduleDate, scheduleTime]
  );

  // Ctrl/Cmd + S : enregistrer le brouillon.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void runAction("draft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runAction]);

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    const problem = checkImageFile(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setCoverUploading(true);
    try {
      update({ coverUrl: await uploadNewsImage(file, "covers") });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi de l'image impossible.");
    } finally {
      setCoverUploading(false);
    }
  };

  const onCoverDrop = (event: DragEvent) => {
    event.preventDefault();
    setCoverDragging(false);
    void uploadCover(event.dataTransfer.files[0]);
  };

  const openPreview = async () => {
    const previewWindow = window.open("about:blank", "_blank");
    if (dirty || !meta.id) {
      const result = await persist("autosave");
      if (!result?.ok) {
        previewWindow?.close();
        toast.error(result?.error ?? "Enregistrez la news avant l'aperçu.");
        return;
      }
      if (previewWindow) previewWindow.location.href = `/admin/apercu/${result.id}`;
      return;
    }
    if (previewWindow) previewWindow.location.href = `/admin/apercu/${meta.id}`;
  };

  const publishLabel =
    mode === "schedule" ? "Programmer" : liveStatus === "published" ? "Mettre à jour" : "Publier";

  const displayedDate =
    mode === "schedule" && scheduleDate
      ? formatLongDate(siteLocalToIso(scheduleDate, scheduleTime))
      : liveStatus === "published" && meta.publishedAt
        ? formatLongDate(meta.publishedAt)
        : formatLongDate(new Date().toISOString());

  const authorOptions = authors.some((author) => author.name === form.authorName) || !form.authorName
    ? authors
    : [{ name: form.authorName, role: "" }, ...authors];

  let statusLine: string;
  if (saveState === "saving") statusLine = "Enregistrement…";
  else if (isNew) statusLine = "Enregistrement automatique dès que le titre est saisi";
  else if (liveStatus !== "draft" && (meta.hasPending || dirty))
    statusLine = "Enregistrement automatique activé · modifications non publiées";
  else if (liveStatus !== "draft") statusLine = "Enregistrement automatique activé · identique à la version en ligne";
  else if (dirty) statusLine = "Enregistrement automatique activé · modifications en cours";
  else statusLine = `Enregistrement automatique activé · brouillon enregistré${meta.savedAt ? ` à ${formatTime(meta.savedAt)}` : ""}`;

  const fieldError = (field: keyof NewsForm) => (saveError?.field === field ? saveError.message : null);

  return (
    <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 px-4 pb-12 pt-7 sm:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/news"
            className="inline-flex min-h-8 items-center gap-1.5 self-start text-sm font-bold text-bo-teal no-underline hover:text-bo-blue"
          >
            <Icon name="arrowLeft" size={16} strokeWidth={2} />
            Retour aux nouvelles
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 text-[30px] font-black leading-[1.2]">{isNew ? "Rédiger une news" : "Modifier la news"}</h1>
            {!isNew ? <StatusBadge status={meta.status} publishedAt={meta.publishedAt} /> : null}
          </div>
          <span className="flex flex-wrap items-center gap-x-2 text-[13px] text-bo-muted" role="status">
            {saveState === "error" && saveError ? (
              <span className="font-bold text-bo-danger">{saveError.message}</span>
            ) : (
              statusLine
            )}
            {meta.hasPending && liveStatus !== "draft" && saveState !== "saving" ? (
              <button
                type="button"
                onClick={() => setConfirmDiscard(true)}
                className="cursor-pointer border-none bg-transparent p-0 font-[inherit] text-[13px] font-bold text-bo-teal underline underline-offset-2 hover:text-bo-blue"
              >
                Annuler les modifications
              </button>
            ) : null}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => void openPreview()}
            disabled={!form.title.trim()}
            className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-[10px] border-none bg-transparent px-4 font-[inherit] text-[15px] font-bold text-bo-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="eye" />
            Aperçu
          </button>
          <button
            type="button"
            onClick={() => void runAction("draft")}
            disabled={busyIntent !== null}
            className="h-[46px] cursor-pointer rounded-[10px] border-[1.5px] border-bo-teal bg-white px-[18px] font-[inherit] text-[15px] font-bold text-bo-teal hover:bg-bo-teal-wash disabled:cursor-wait disabled:opacity-60"
          >
            {busyIntent === "draft" ? "Enregistrement…" : "Enregistrer le brouillon"}
          </button>
          <button
            type="button"
            onClick={() => void runAction(mode === "schedule" ? "schedule" : "publish")}
            disabled={busyIntent !== null}
            className="h-[46px] cursor-pointer rounded-[10px] border-none bg-bo-cyan px-[22px] font-[inherit] text-[15px] font-bold text-bo-night hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
          >
            {busyIntent === "publish" || busyIntent === "schedule" ? "Publication…" : publishLabel}
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
          {/* Origine */}
          <section aria-label="Origine de la news" className={cn(cardClass, "flex flex-col gap-4 p-5")}>
            <span className="text-sm font-bold">Origine de la news</span>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
              {(
                [
                  { id: "written", label: "Rédigée par l'équipe", hint: "Article original écrit dans le back-office", icon: "pencil" },
                  { id: "whatsapp", label: "Repartage WhatsApp", hint: "Reprise d’un post de la chaîne Afroza Editor", icon: "whatsapp" },
                ] as const
              ).map((origin) => {
                const selected = form.source === origin.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ source: origin.id })}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl p-4 text-left font-[inherit] text-bo-ink",
                      selected ? "border-2 border-bo-cyan bg-bo-teal-wash" : "border-[1.5px] border-bo-line bg-white hover:border-bo-field"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
                        selected ? "bg-bo-cyan text-bo-night" : "bg-bo-line-soft text-bo-slate"
                      )}
                    >
                      <Icon name={origin.icon} size={20} />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold">{origin.label}</span>
                      <span className="text-[13px] text-bo-muted">{origin.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {form.source === "whatsapp" ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 rounded-xl border border-dashed border-bo-teal-dash bg-bo-teal-wash p-4">
                <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                  Lien du post sur la chaîne (facultatif)
                  <input
                    type="url"
                    value={form.whatsappUrl}
                    onChange={(event) => update({ whatsappUrl: event.target.value })}
                    placeholder="https://whatsapp.com/channel/…"
                    aria-invalid={Boolean(fieldError("whatsappUrl"))}
                    className={cn(fieldClass, "h-[46px] px-3.5 text-sm font-normal")}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                  Date du post original
                  <input
                    type="date"
                    value={form.whatsappPostedOn}
                    onChange={(event) => update({ whatsappPostedOn: event.target.value })}
                    className={cn(fieldClass, "h-[46px] px-3.5 text-sm font-normal")}
                  />
                </label>
                <label className="col-span-full flex min-h-11 items-center gap-2.5 text-sm font-medium text-bo-slate">
                  <input
                    type="checkbox"
                    checked={form.whatsappCta}
                    onChange={(event) => update({ whatsappCta: event.target.checked })}
                    className="size-[18px] shrink-0 accent-bo-teal"
                  />
                  Ajouter « Publié d&apos;abord sur notre chaîne WhatsApp » avec un bouton S&apos;abonner en bas de
                  l&apos;article
                </label>
              </div>
            ) : null}
          </section>

          {/* Contenu */}
          <section aria-label="Contenu" className={cn(cardClass, "flex flex-col gap-[22px] p-6")}>
            <div className="flex flex-col gap-2">
              <label htmlFor={ids.title} className="flex justify-between text-sm font-bold">
                Titre
                <span className="font-medium text-bo-muted">
                  {form.title.length} / {TITLE_MAX}
                </span>
              </label>
              <input
                id={ids.title}
                type="text"
                value={form.title}
                maxLength={TITLE_MAX}
                placeholder="Titre de la news"
                aria-invalid={Boolean(fieldError("title"))}
                onChange={(event) => {
                  const title = event.target.value;
                  update(slugTouched ? { title } : { title, slug: slugify(title) });
                }}
                className={cn(fieldClass, "h-[58px] text-[22px] font-bold")}
              />
              {fieldError("title") ? <span className="text-[13px] font-bold text-bo-danger">{fieldError("title")}</span> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={ids.slug} className="text-sm font-bold">
                Lien de la news
              </label>
              <span
                className={cn(
                  "flex h-[46px] items-center overflow-hidden rounded-[10px] border-[1.5px] font-medium focus-within:border-bo-cyan focus-within:shadow-[0_0_0_4px_#E0F8F6]",
                  fieldError("slug") ? "border-bo-danger" : "border-bo-field"
                )}
              >
                <span className="flex h-full items-center whitespace-nowrap border-r border-bo-line bg-bo-bg px-3 text-sm text-bo-muted">
                  afroza-editor.tech/news/
                </span>
                <input
                  id={ids.slug}
                  type="text"
                  value={form.slug}
                  aria-invalid={Boolean(fieldError("slug"))}
                  onChange={(event) => {
                    setSlugTouched(true);
                    update({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-") });
                  }}
                  onBlur={() => {
                    const clean = slugify(form.slug || form.title);
                    if (clean !== form.slug) update({ slug: clean });
                  }}
                  className="h-full min-w-0 flex-1 border-none px-3 font-[inherit] text-sm text-bo-ink outline-none"
                />
              </span>
              {fieldError("slug") ? <span className="text-[13px] font-bold text-bo-danger">{fieldError("slug")}</span> : null}
            </div>

            <div className="flex flex-col gap-2">
              <span className="flex flex-wrap justify-between gap-2 text-sm font-bold">
                Image de couverture
                <span className="font-medium text-bo-muted">Format conseillé 1200 × 630 px · utilisée aussi au partage</span>
              </span>
              {form.coverUrl ? (
                <div
                  className="relative h-[300px] overflow-hidden rounded-xl bg-bo-line"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onCoverDrop}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- image distante ou locale, aperçu du back-office */}
                  <img src={form.coverUrl} alt="Image de couverture actuelle" className="block size-full object-cover" />
                  {coverUploading ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-bo-night/55 font-bold text-white">
                      Envoi de l&apos;image…
                    </span>
                  ) : null}
                  <div className="absolute bottom-3.5 right-3.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={coverUploading}
                      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[9px] border-none bg-white px-3.5 font-[inherit] text-sm font-bold text-bo-ink hover:bg-bo-bg disabled:cursor-wait"
                    >
                      <Icon name="upload" size={16} />
                      Remplacer
                    </button>
                    <button
                      type="button"
                      aria-label="Retirer l'image"
                      onClick={() => update({ coverUrl: null })}
                      className="flex size-11 cursor-pointer items-center justify-center rounded-[9px] border-none bg-bo-ink text-white hover:bg-bo-night"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setCoverDragging(true);
                  }}
                  onDragLeave={() => setCoverDragging(false)}
                  onDrop={onCoverDrop}
                  disabled={coverUploading}
                  className={cn(
                    "flex h-[220px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed font-[inherit] text-[13px] font-bold text-bo-slate disabled:cursor-wait",
                    coverDragging ? "border-bo-cyan bg-bo-teal-wash" : "border-bo-gray bg-bo-bg-2"
                  )}
                >
                  <Icon name="upload" size={22} />
                  {coverUploading ? "Envoi de l'image…" : "Glissez l'image de couverture ou cliquez pour l'ajouter"}
                  <span className="font-medium text-bo-muted">JPG, PNG ou WebP · 5 Mo max</span>
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(event) => {
                  void uploadCover(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={ids.excerpt} className="flex justify-between gap-2 text-sm font-bold">
                Résumé
                <span className="font-medium text-bo-muted">
                  Affiché sur la carte de la page News · {form.excerpt.length} / {EXCERPT_MAX}
                </span>
              </label>
              <textarea
                id={ids.excerpt}
                rows={2}
                value={form.excerpt}
                maxLength={EXCERPT_MAX}
                onChange={(event) => update({ excerpt: event.target.value.replace(/\n/g, " ") })}
                className={cn(fieldClass, "resize-y py-3 leading-[1.5]")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span id={ids.content} className="text-sm font-bold">
                Contenu de l&apos;article
              </span>
              <RichTextEditor
                key={contentKey}
                initialHtml={form.content}
                labelledBy={ids.content}
                onChange={(content) => update({ content })}
              />
            </div>
          </section>
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          {/* Publication */}
          <section aria-label="Publication" className={cn(cardClass, "flex flex-col gap-4 p-5")}>
            <span className="text-base font-black">Publication</span>
            <div className="flex gap-1 rounded-[10px] bg-bo-bg p-1">
              {(
                [
                  ["now", "Publier maintenant"],
                  ["schedule", "Programmer"],
                ] as const
              ).map(([id, label]) => {
                const selected = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setSchedule((current) => ({
                        ...current,
                        mode: id,
                        date: id === "schedule" && !current.date ? isoToSiteLocal(new Date(Date.now() + 86_400_000).toISOString()).date : current.date,
                      }))
                    }
                    className={cn(
                      "h-10 flex-1 cursor-pointer rounded-lg border-none font-[inherit] text-sm font-bold",
                      selected ? "bg-white text-bo-ink shadow-[0_1px_3px_rgba(27,36,51,0.12)]" : "bg-transparent text-bo-muted"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {mode === "schedule" ? (
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                  Date
                  <input
                    type="date"
                    value={scheduleDate}
                    min={isoToSiteLocal(new Date().toISOString()).date}
                    onChange={(event) => setSchedule((current) => ({ ...current, date: event.target.value }))}
                    className={cn(fieldClass, "h-11 min-w-0 rounded-[9px] px-2.5 text-sm font-normal")}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-bold">
                  Heure
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setSchedule((current) => ({ ...current, time: event.target.value }))}
                    className={cn(fieldClass, "h-11 min-w-0 rounded-[9px] px-2.5 text-sm font-normal")}
                  />
                </label>
                <span className="col-span-full text-xs text-bo-muted">Heure de Yaoundé (UTC+1)</span>
              </div>
            ) : null}
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-bo-muted">Date affichée</span>
                <span className="font-bold">{displayedDate}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-bo-muted">Dernière modification</span>
                <span className="font-bold">{meta.updatedByName ? shortName(meta.updatedByName) : "—"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-bo-line-soft pt-3.5">
              <span className="flex flex-col">
                <span className="text-sm font-bold">Mettre à la une</span>
                <span className="text-[13px] text-bo-muted">Affichée dans « Projets réalisés » sur l&apos;accueil</span>
              </span>
              <Switch checked={form.featured} onChange={(featured) => update({ featured })} label="Mettre à la une" />
            </div>
          </section>

          {/* Catégorie */}
          <section aria-label="Catégorie" className={cn(cardClass, "flex flex-col gap-3.5 p-5")}>
            <span className="text-base font-black">Catégorie</span>
            <div className="flex flex-wrap gap-2">
              {NEWS_CATEGORIES.map((category) => {
                const selected = form.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ category })}
                    className={cn(
                      "h-10 cursor-pointer rounded-full border-[1.5px] px-3.5 font-[inherit] text-sm font-bold",
                      selected ? "border-bo-ink bg-bo-ink text-white" : "border-bo-field bg-white text-bo-slate hover:border-bo-gray"
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Auteur */}
          <section aria-label="Auteur" className={cn(cardClass, "flex flex-col gap-3.5 p-5")}>
            <span className="text-base font-black">Auteur</span>
            <label
              htmlFor={ids.author}
              className="flex items-center gap-3 rounded-[10px] border-[1.5px] border-bo-field px-3 py-2.5 focus-within:border-bo-cyan focus-within:shadow-[0_0_0_4px_#E0F8F6]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bo-blue text-[13px] font-bold text-white">
                {initials(form.authorName || "?")}
              </span>
              <span className="sr-only">Auteur de la news</span>
              <select
                id={ids.author}
                value={form.authorName}
                onChange={(event) => update({ authorName: event.target.value })}
                className="h-9 min-w-0 flex-1 cursor-pointer border-none bg-transparent font-[inherit] text-[15px] font-bold text-bo-ink outline-none"
              >
                {!form.authorName ? <option value="">Choisir l&apos;auteur…</option> : null}
                {authorOptions.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.role ? `${author.name} — ${author.role}` : author.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {/* Aperçu de la carte */}
          <section aria-label="Aperçu de la carte" className={cn(cardClass, "flex flex-col gap-3.5 p-5")}>
            <span className="flex items-center justify-between">
              <span className="text-base font-black">Aperçu sur le site</span>
              <span className="text-xs font-bold tracking-[0.06em] text-bo-muted">PAGE NEWS</span>
            </span>
            <article className="overflow-hidden rounded-xl border border-bo-line">
              {form.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- aperçu
                <img src={form.coverUrl} alt="" className="block h-40 w-full object-cover" />
              ) : (
                <span className="flex h-40 w-full items-center justify-center bg-bo-line-soft text-bo-faint">
                  <Icon name="image" size={28} />
                </span>
              )}
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2.5 text-[13px]">
                  <span className="rounded-md bg-bo-cyan px-2.5 py-0.5 font-bold text-bo-night">{form.category}</span>
                  <span className="text-bo-muted">{displayedDate}</span>
                </div>
                <span className="text-[17px] font-bold leading-[1.3]">{form.title || "Titre de la news"}</span>
                <span className="text-sm text-bo-muted">{form.excerpt || "Le résumé s'affichera ici."}</span>
                <span className="text-sm font-bold text-bo-teal">Lire la suite →</span>
              </div>
            </article>
          </section>

          {meta.id ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-11 cursor-pointer items-center gap-2 self-start border-none bg-transparent px-1 font-[inherit] text-sm font-bold text-bo-danger hover:underline"
            >
              <Icon name="trash" size={16} />
              Supprimer cette news
            </button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Supprimer cette news ?"
        description={
          liveStatus === "draft"
            ? "Le brouillon et ses images seront supprimés définitivement."
            : "Elle disparaîtra de la page News du site. Cette action est définitive."
        }
        confirmLabel="Supprimer"
        danger
        onConfirm={async () => {
          if (!meta.id) return;
          const result = await deleteNews(meta.id);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          setDirty(false);
          setConfirmDelete(false);
          toast.success("News supprimée.");
          router.push("/admin/news");
        }}
      />

      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Annuler les modifications ?"
        description="Les modifications non publiées seront perdues et l'éditeur reprendra la version en ligne."
        confirmLabel="Annuler les modifications"
        onConfirm={async () => {
          if (!meta.id) return;
          const result = await discardPendingChanges(meta.id);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          versionRef.current += 1;
          setForm(result.form);
          setContentKey((key) => key + 1);
          setDirty(false);
          setMeta((current) => ({ ...current, hasPending: false }));
          setConfirmDiscard(false);
          toast.success("Version en ligne rétablie.");
        }}
      />
    </main>
  );
}
