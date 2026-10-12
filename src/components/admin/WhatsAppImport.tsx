"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import { saveNews } from "@/app/admin/_actions/news";
import { slugify } from "@/lib/news/format";
import { checkImageFile, uploadNewsImage } from "@/lib/news/storage";
import { EXCERPT_MAX, NEWS_CATEGORIES, TITLE_MAX, type NewsCategory, type NewsForm } from "@/lib/news/types";
import { prepareWhatsAppPost, type WhatsAppOptions } from "@/lib/news/whatsapp";
import { cn } from "@/lib/utils";

import { Icon } from "./icons";
import type { AuthorOption } from "./NewsEditor";
import { cardClass, fieldClass } from "./ui";

type PostImage = { key: string; preview: string; url: string | null; failed: boolean };

const STEPS = [
  { label: "Coller le post", hint: "Texte, images et lien" },
  { label: "Vérifier la news", hint: "Titre, résumé, catégorie" },
  { label: "Publier", hint: "Sur afroza-editor.tech/news" },
];

export default function WhatsAppImport({
  authors,
  defaultAuthor,
}: {
  authors: AuthorOption[];
  defaultAuthor: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Le post d'origine
  const [text, setText] = useState("");
  const [images, setImages] = useState<PostImage[]>([]);
  const [postUrl, setPostUrl] = useState("");
  const [postedOn, setPostedOn] = useState("");
  const [dragging, setDragging] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);

  // 2. La news préparée
  const [ready, setReady] = useState(false);
  const [options, setOptions] = useState<WhatsAppOptions & { mention: boolean }>({
    convertFormatting: true,
    removeHashtags: true,
    mention: true,
    removeEmojis: false,
  });
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [excerptOverride, setExcerptOverride] = useState<string | null>(null);
  const [category, setCategory] = useState<NewsCategory>("Business");
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [busy, setBusy] = useState<"draft" | "publish" | null>(null);

  const prepared = useMemo(() => prepareWhatsAppPost(text, options), [text, options]);
  const title = titleOverride ?? prepared.title;
  const excerpt = excerptOverride ?? prepared.excerpt;
  const uploading = images.some((image) => !image.url && !image.failed);

  // Libère les aperçus locaux.
  const previewsRef = useRef<string[]>([]);
  useEffect(() => {
    previewsRef.current = images.map((image) => image.preview);
  }, [images]);
  useEffect(() => () => previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview)), []);

  const addFiles = (files: File[]) => {
    for (const file of files) {
      const problem = checkImageFile(file);
      if (problem) {
        toast.error(problem);
        continue;
      }
      const key = crypto.randomUUID();
      setImages((current) => [...current, { key, preview: URL.createObjectURL(file), url: null, failed: false }]);
      uploadNewsImage(file, "whatsapp")
        .then((url) => setImages((current) => current.map((image) => (image.key === key ? { ...image, url } : image))))
        .catch((error: unknown) => {
          toast.error(error instanceof Error ? error.message : "Envoi de l'image impossible.");
          setImages((current) => current.map((image) => (image.key === key ? { ...image, failed: true } : image)));
        });
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeImage = (key: string) =>
    setImages((current) => {
      const image = current.find((item) => item.key === key);
      if (image) URL.revokeObjectURL(image.preview);
      return current.filter((item) => item.key !== key);
    });

  const makeCover = (key: string) =>
    setImages((current) => {
      const image = current.find((item) => item.key === key);
      return image ? [image, ...current.filter((item) => item.key !== key)] : current;
    });

  const prepare = () => {
    if (!text.trim()) {
      setTextError("Collez le texte du post copié depuis la chaîne.");
      return;
    }
    setTextError(null);
    setTitleOverride(null);
    setExcerptOverride(null);
    setReady(true);
  };

  const reset = () => {
    setReady(false);
    setTitleOverride(null);
    setExcerptOverride(null);
  };

  const submit = async (intent: "draft" | "publish") => {
    if (!title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    if (uploading) {
      toast.error("Patientez : des images sont encore en cours d'envoi.");
      return;
    }
    const uploaded = images.filter((image) => image.url).map((image) => image.url as string);
    const [cover, ...others] = uploaded;
    const form: NewsForm = {
      title: title.trim().slice(0, TITLE_MAX),
      slug: slugify(title),
      excerpt: excerpt.trim().slice(0, EXCERPT_MAX),
      content: prepared.html + others.map((src) => `<img src="${src}" alt="">`).join(""),
      coverUrl: cover ?? null,
      category,
      source: "whatsapp",
      authorName,
      featured: false,
      keywords: prepared.keywords,
      whatsappUrl: postUrl.trim(),
      whatsappPostedOn: postedOn,
      whatsappCta: options.mention,
    };

    setBusy(intent);
    const result = await saveNews({ form, intent }).catch(() => null);
    setBusy(null);
    if (!result?.ok) {
      toast.error(result?.error ?? "Connexion au serveur impossible. Vérifiez votre réseau.");
      return;
    }
    if (intent === "publish") {
      toast.success("News publiée sur la page News.");
      router.push("/admin/news");
    } else {
      router.push(`/admin/news/${result.id}`);
    }
  };

  const current = busy === "publish" ? 2 : ready ? 1 : 0;
  const dropSpan = 3 - (images.length % 3);

  const optionRows: { key: keyof typeof options; label: string }[] = [
    { key: "convertFormatting", label: "Mise en forme WhatsApp (*gras*, _italique_) convertie" },
    { key: "removeHashtags", label: "Hashtags retirés du texte, gardés comme mots-clés" },
    { key: "mention", label: "Mention « Publié d'abord sur notre chaîne WhatsApp » ajoutée" },
    { key: "removeEmojis", label: "Retirer les emojis" },
  ];

  return (
    <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 px-4 pb-12 pt-7 sm:px-10">
      <header className="flex flex-col gap-1.5">
        <Link
          href="/admin/news"
          className="inline-flex min-h-8 items-center gap-1.5 self-start text-sm font-bold text-bo-teal no-underline hover:text-bo-blue"
        >
          <Icon name="arrowLeft" size={16} strokeWidth={2} />
          Retour aux nouvelles
        </Link>
        <h1 className="m-0 text-[30px] font-black leading-[1.2]">Repartager un post de la chaîne WhatsApp</h1>
        <p className="m-0 max-w-[720px] text-bo-muted">
          Copiez le post depuis la chaîne Afroza Editor, collez-le ici avec ses images : le back-office prépare une
          news prête à relire.
        </p>
      </header>

      <ol aria-label="Étapes" className="m-0 flex list-none flex-wrap gap-3 p-0">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li
              key={step.label}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex flex-[1_1_200px] items-center gap-3 rounded-xl px-4 py-3.5",
                active ? "border-2 border-bo-cyan bg-white" : "border-[1.5px] border-bo-line bg-transparent"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black",
                  done ? "bg-bo-teal text-white" : active ? "bg-bo-cyan text-bo-night" : "bg-bo-line text-bo-slate"
                )}
              >
                {done ? <Icon name="check" size={16} strokeWidth={2.4} /> : index + 1}
              </span>
              <span className="flex flex-col">
                <span className={cn("text-[15px] font-bold", done || active ? "text-bo-ink" : "text-bo-slate")}>
                  {step.label}
                </span>
                <span className="text-[13px] text-bo-muted">{step.hint}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-start gap-6">
        {/* 1. Le post d'origine */}
        <section aria-label="Post de la chaîne" className={cn(cardClass, "flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] p-6")}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[10px] bg-bo-night text-bo-cyan">
              <Icon name="whatsapp" size={20} />
            </span>
            <span className="flex flex-col">
              <span className="text-[17px] font-black">1. Le post d&apos;origine</span>
              <span className="text-[13px] text-bo-muted">Chaîne WhatsApp · Afroza Editor</span>
            </span>
          </div>

          <label className="flex flex-col gap-2 text-sm font-bold">
            Texte du post
            <textarea
              rows={7}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (textError) setTextError(null);
              }}
              placeholder="Collez ici le texte copié depuis la chaîne…"
              aria-invalid={Boolean(textError)}
              className={cn(fieldClass, "resize-y bg-bo-bg-2 py-3.5 font-normal leading-[1.6]")}
            />
            {textError ? <span className="text-[13px] font-bold text-bo-danger">{textError}</span> : null}
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">Images du post</span>
            <div className="grid grid-cols-3 gap-2.5">
              {images.map((image, index) => (
                <div key={image.key} className="group relative h-[110px] overflow-hidden rounded-[10px] bg-bo-line">
                  {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
                  <img src={image.preview} alt="Image importée du post" className="block size-full object-cover" />
                  {index === 0 ? (
                    <span className="absolute left-2 top-2 rounded-md bg-bo-cyan px-2 py-0.5 text-[11px] font-bold text-bo-night">
                      Couverture
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(image.key)}
                      className="absolute left-2 top-2 cursor-pointer rounded-md border-none bg-white/90 px-2 py-0.5 font-[inherit] text-[11px] font-bold text-bo-ink opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                    >
                      Mettre en couverture
                    </button>
                  )}
                  {!image.url && !image.failed ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-bo-night/55 text-xs font-bold text-white">
                      Envoi…
                    </span>
                  ) : null}
                  {image.failed ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-bo-danger/75 px-2 text-center text-xs font-bold text-white">
                      Échec de l&apos;envoi
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label="Retirer l'image"
                    onClick={() => removeImage(image.key)}
                    className="absolute right-1.5 top-1.5 flex size-8 cursor-pointer items-center justify-center rounded-lg border-none bg-bo-ink/85 text-white hover:bg-bo-ink"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{ gridColumn: `span ${dropSpan}` }}
                className={cn(
                  "flex h-[110px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed px-2 text-center font-[inherit] text-[13px] font-bold text-bo-slate",
                  dragging ? "border-bo-cyan bg-bo-teal-wash" : "border-bo-gray bg-bo-bg-2"
                )}
              >
                <Icon name="upload" size={22} />
                Glissez les images ou cliquez pour ajouter
                <span className="font-medium text-bo-muted">JPG, PNG ou WebP · 5 Mo max</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(event) => {
                addFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              Lien du post (facultatif)
              <input
                type="url"
                value={postUrl}
                onChange={(event) => setPostUrl(event.target.value)}
                placeholder="https://whatsapp.com/channel/…"
                className={cn(fieldClass, "h-[46px] min-w-0 px-3.5 text-sm font-normal")}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold">
              Date du post
              <input
                type="date"
                value={postedOn}
                onChange={(event) => setPostedOn(event.target.value)}
                className={cn(fieldClass, "h-[46px] min-w-0 px-3.5 text-sm font-normal")}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={prepare}
            className="inline-flex h-[50px] cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-none bg-bo-ink font-[inherit] text-[15px] font-bold text-white hover:bg-bo-night"
          >
            <Icon name="sparkle" />
            Préparer la news
          </button>
        </section>

        {/* 2. La news préparée */}
        <section aria-label="News préparée" className={cn(cardClass, "flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] p-6")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-bo-cyan text-bo-night">
                <Icon name="news" size={20} />
              </span>
              <span className="flex flex-col">
                <span className="text-[17px] font-black">2. La news préparée</span>
                <span className="text-[13px] text-bo-muted">Relisez et ajustez avant de publier</span>
              </span>
            </div>
            {ready ? (
              <button
                type="button"
                onClick={reset}
                className="h-10 cursor-pointer border-none bg-transparent px-3 font-[inherit] text-sm font-bold text-bo-teal hover:text-bo-blue"
              >
                Recommencer
              </button>
            ) : null}
          </div>

          {!ready ? (
            <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-bo-off p-6 text-center text-bo-muted">
              <Icon name="arrowRight" size={40} strokeWidth={1.5} className="text-bo-teal" />
              <span className="text-base font-bold text-bo-ink">La news apparaîtra ici</span>
              <span className="max-w-[320px]">Collez le post à gauche puis cliquez sur « Préparer la news ».</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-2 text-sm font-bold">
                  Titre
                  <span className="rounded-md bg-bo-teal-soft px-2 py-0.5 text-[11px] font-bold text-bo-teal">
                    {titleOverride === null ? "Extrait de la 1re ligne" : `${title.length} / ${TITLE_MAX}`}
                  </span>
                </span>
                <input
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={(event) => setTitleOverride(event.target.value)}
                  className={cn(fieldClass, "h-[50px] min-w-0 px-3.5 text-lg font-bold")}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-2 text-sm font-bold">
                  Résumé
                  <span className="rounded-md bg-bo-teal-soft px-2 py-0.5 text-[11px] font-bold text-bo-teal">
                    {excerptOverride === null ? "160 premiers caractères" : `${excerpt.length} / ${EXCERPT_MAX}`}
                  </span>
                </span>
                <textarea
                  rows={2}
                  value={excerpt}
                  maxLength={EXCERPT_MAX}
                  onChange={(event) => setExcerptOverride(event.target.value.replace(/\n/g, " "))}
                  className={cn(fieldClass, "resize-y px-3.5 py-3 text-sm leading-[1.5]")}
                />
              </label>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                <label className="flex flex-col gap-1.5 text-sm font-bold">
                  Catégorie
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as NewsCategory)}
                    className={cn(fieldClass, "h-[46px] cursor-pointer px-3 text-sm font-medium")}
                  >
                    {NEWS_CATEGORIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-bold">
                  Auteur
                  <select
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    className={cn(fieldClass, "h-[46px] cursor-pointer px-3 text-sm font-medium")}
                  >
                    {authors.some((author) => author.name === authorName) ? null : (
                      <option value={authorName}>{authorName}</option>
                    )}
                    {authors.map((author) => (
                      <option key={author.name} value={author.name}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="m-0 flex flex-col gap-2.5 rounded-xl border-none bg-bo-bg p-4">
                <legend className="float-left mb-0.5 p-0 text-[13px] font-bold tracking-[0.04em] text-bo-slate">
                  NETTOYAGE AUTOMATIQUE
                </legend>
                {optionRows.map((row) => (
                  <label key={row.key} className="flex min-h-8 items-center gap-2.5 text-sm text-bo-ink">
                    <input
                      type="checkbox"
                      checked={options[row.key]}
                      onChange={(event) => setOptions((value) => ({ ...value, [row.key]: event.target.checked }))}
                      className="size-[18px] shrink-0 accent-bo-teal"
                    />
                    {row.label}
                  </label>
                ))}
              </fieldset>

              <div className="flex items-start gap-2.5 rounded-[10px] bg-bo-warn-bg px-3.5 py-3 text-[13px] text-bo-warn">
                <Icon name="info" className="mt-px shrink-0" />
                <span>
                  Un titre de post WhatsApp est souvent trop court pour le site. Reformulez-le pour qu&apos;il se
                  comprenne sans contexte.
                </span>
              </div>

              {prepared.keywords.length ? (
                <p className="m-0 text-[13px] text-bo-muted">
                  Mots-clés : <span className="font-bold text-bo-slate">{prepared.keywords.map((k) => `#${k}`).join(" ")}</span>
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => void submit("draft")}
                  disabled={busy !== null || uploading}
                  className="inline-flex h-[50px] flex-[1_1_180px] cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-bo-teal bg-white font-[inherit] text-[15px] font-bold text-bo-teal hover:bg-bo-teal-wash disabled:cursor-wait disabled:opacity-60"
                >
                  <Icon name="pencil" />
                  {busy === "draft" ? "Création du brouillon…" : "Compléter dans l'éditeur"}
                </button>
                <button
                  type="button"
                  onClick={() => void submit("publish")}
                  disabled={busy !== null || uploading}
                  className="h-[50px] flex-[1_1_180px] cursor-pointer rounded-[10px] border-none bg-bo-cyan font-[inherit] text-[15px] font-bold text-bo-night hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
                >
                  {busy === "publish" ? "Publication…" : "Publier sur la page News"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
