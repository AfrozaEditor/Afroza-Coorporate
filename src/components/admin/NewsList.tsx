"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { deleteNews, setNewsStatus } from "@/app/admin/_actions/news";
import { formatShortDate } from "@/lib/news/format";
import { STATUS_STYLES, type NewsListItem, type NewsStatus } from "@/lib/news/types";
import { cn } from "@/lib/utils";

import { DotsIcon, Icon } from "./icons";
import { ConfirmDialog } from "./ui";

export type ListItem = NewsListItem & { effective: NewsStatus };

type Tab = "all" | NewsStatus;
type SourceFilter = "all" | "written" | "whatsapp";

const PAGE_SIZE = 10;
const COLUMNS =
  "grid grid-cols-[minmax(0,2.8fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_148px] gap-4";

function StatCard({
  label,
  value,
  hint,
  icon,
  iconClass,
  dark = false,
}: {
  label: string;
  value: number;
  hint: string;
  icon: "check" | "pencil" | "clock" | "whatsapp";
  iconClass: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-[14px] p-5",
        dark ? "bg-bo-night text-white" : "border border-bo-line bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-medium", dark ? "text-bo-mint" : "text-bo-muted")}>{label}</span>
        <span className={cn("flex size-9 items-center justify-center rounded-[10px]", iconClass)}>
          <Icon name={icon} strokeWidth={icon === "check" ? 2 : 1.8} />
        </span>
      </div>
      <span className="text-[32px] font-black leading-none">{value}</span>
      <span className={cn("text-[13px]", dark ? "text-bo-foam" : "text-bo-muted")}>{hint}</span>
    </div>
  );
}

function siteHref(item: ListItem) {
  return item.effective === "published" ? `/news/${item.slug}` : `/admin/apercu/${item.id}`;
}

export default function NewsList({ items }: { items: ListItem[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<ListItem | null>(null);

  const counts = useMemo(
    () => ({
      all: items.length,
      published: items.filter((item) => item.effective === "published").length,
      draft: items.filter((item) => item.effective === "draft").length,
      scheduled: items.filter((item) => item.effective === "scheduled").length,
      whatsapp: items.filter((item) => item.source === "whatsapp").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const needle = query
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
    return items.filter((item) => {
      if (tab !== "all" && item.effective !== tab) return false;
      if (source !== "all" && item.source !== source) return false;
      if (!needle) return true;
      return [item.title, item.excerpt, item.author_name, item.category]
        .join(" ")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .includes(needle);
    });
  }, [items, tab, source, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const tabs: [Tab, string, number][] = [
    ["all", "Toutes", counts.all],
    ["published", "Publiées", counts.published],
    ["draft", "Brouillons", counts.draft],
    ["scheduled", "Programmées", counts.scheduled],
  ];
  const sources: [SourceFilter, string][] = [
    ["all", "Toutes sources"],
    ["written", "Rédigées"],
    ["whatsapp", "WhatsApp"],
  ];

  const changeStatus = async (item: ListItem, status: "published" | "draft") => {
    const result = await setNewsStatus(item.id, status);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(status === "published" ? "News publiée sur le site." : "News repassée en brouillon.");
    router.refresh();
  };

  const copyLink = async (item: ListItem) => {
    const url = `${window.location.origin}/news/${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié.");
    } catch {
      toast.error(`Copie impossible : ${url}`);
    }
  };

  return (
    <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-7 px-4 pb-12 pt-8 sm:px-10">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-bo-muted">
            Contenu&nbsp;&nbsp;/&nbsp;&nbsp;<span className="font-bold text-bo-teal">Nouvelles</span>
          </span>
          <h1 className="m-0 text-[34px] font-black leading-[1.15] tracking-[-0.01em]">Nouvelles</h1>
          <p className="m-0 text-bo-muted">
            Les actualités publiées ici apparaissent sur la page{" "}
            <a href="/news" target="_blank" rel="noopener" className="font-bold text-bo-teal hover:text-bo-blue">
              afroza-editor.tech/news
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/news/import"
            className="inline-flex h-[46px] items-center gap-2.5 rounded-[10px] border-[1.5px] border-bo-teal bg-white px-[18px] font-bold text-bo-teal no-underline hover:bg-bo-teal-wash"
          >
            <Icon name="whatsappLines" />
            Repartager un post WhatsApp
          </Link>
          <Link
            href="/admin/news/new"
            className="inline-flex h-[46px] items-center gap-2.5 rounded-[10px] bg-bo-cyan px-5 font-bold text-bo-night no-underline hover:brightness-95"
          >
            <Icon name="plus" strokeWidth={2.2} />
            Rédiger une news
          </Link>
        </div>
      </header>

      <section aria-label="Résumé" className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard label="Publiées" value={counts.published} hint="Visibles sur le site" icon="check" iconClass="bg-bo-teal-soft text-bo-teal" />
        <StatCard label="Brouillons" value={counts.draft} hint="En cours de rédaction" icon="pencil" iconClass="bg-bo-line-soft text-bo-slate" />
        <StatCard label="Programmées" value={counts.scheduled} hint="Publication automatique" icon="clock" iconClass="bg-bo-blue-soft text-bo-blue" />
        <StatCard
          label="Repartages WhatsApp"
          value={counts.whatsapp}
          hint="Issus de la chaîne Afroza"
          icon="whatsapp"
          iconClass="bg-bo-cyan text-bo-night"
          dark
        />
      </section>

      <section aria-label="Liste des news" className="flex flex-col rounded-[14px] border border-bo-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bo-line px-5 py-[18px]">
          <div role="tablist" aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
            {tabs.map(([id, label, count]) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setTab(id);
                    setPage(1);
                  }}
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center gap-2 rounded-[9px] border-none px-3.5 font-[inherit] text-sm font-bold",
                    selected ? "bg-bo-ink text-white" : "bg-transparent text-bo-slate hover:bg-bo-bg"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-[7px] py-px text-xs",
                      selected ? "bg-bo-cyan text-bo-night" : "bg-bo-line-soft text-bo-slate"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div role="group" aria-label="Filtrer par source" className="flex gap-0.5 rounded-[10px] bg-bo-bg p-1">
              {sources.map(([id, label]) => {
                const selected = source === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setSource(id);
                      setPage(1);
                    }}
                    className={cn(
                      "h-9 cursor-pointer rounded-[7px] border-none px-3 font-[inherit] text-[13px] font-bold",
                      selected ? "bg-white text-bo-ink shadow-[0_1px_3px_rgba(27,36,51,0.12)]" : "bg-transparent text-bo-muted"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <label className="flex h-11 min-w-[220px] items-center gap-2 rounded-[10px] border border-bo-line px-3.5 text-bo-muted focus-within:border-bo-cyan focus-within:shadow-[0_0_0_4px_#E0F8F6]">
              <Icon name="search" size={17} />
              <span className="sr-only">Rechercher une news</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher une news…"
                className="min-w-0 flex-1 border-none bg-transparent font-[inherit] text-sm text-bo-ink outline-none"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div
              className={cn(
                COLUMNS,
                "bg-bo-bg-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.06em] text-bo-muted"
              )}
            >
              <span>News</span>
              <span>Catégorie</span>
              <span>Source</span>
              <span>Auteur</span>
              <span>Date</span>
              <span>Statut</span>
              <span className="text-right">Actions</span>
            </div>

            {rows.map((item) => {
              const status = STATUS_STYLES[item.effective];
              const isWhatsapp = item.source === "whatsapp";
              return (
                <div key={item.id} className={cn(COLUMNS, "items-center border-t border-bo-line-soft px-5 py-3.5")}>
                  <div className="flex min-w-0 items-center gap-3.5">
                    {item.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- vignette
                      <img src={item.cover_url} alt="" className="h-[52px] w-[72px] shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-[52px] w-[72px] shrink-0 items-center justify-center rounded-lg bg-bo-line-soft text-bo-faint">
                        <Icon name="image" size={20} />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="truncate font-bold text-bo-ink no-underline hover:text-bo-teal"
                      >
                        {item.title}
                      </Link>
                      <span className="truncate text-[13px] text-bo-muted">{item.excerpt || "—"}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.category}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      isWhatsapp ? "text-bo-teal" : "text-bo-slate"
                    )}
                  >
                    <Icon name={isWhatsapp ? "whatsapp" : "pencil"} size={16} strokeWidth={1.9} />
                    {isWhatsapp ? "Chaîne WhatsApp" : "Rédigée"}
                  </span>
                  <span className="text-sm">{item.author_name || "—"}</span>
                  <span className="text-sm text-bo-slate">
                    {item.effective === "draft" ? "—" : formatShortDate(item.published_at)}
                  </span>
                  <span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold"
                      style={{ background: status.bg, color: status.fg }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: status.fg }} />
                      {status.label}
                    </span>
                  </span>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/news/${item.id}`}
                      aria-label={`Modifier « ${item.title} »`}
                      title="Modifier"
                      className="flex size-11 items-center justify-center rounded-[10px] text-bo-teal hover:bg-bo-bg"
                    >
                      <Icon name="pencil" />
                    </Link>
                    <a
                      href={siteHref(item)}
                      target="_blank"
                      rel="noopener"
                      aria-label={item.effective === "published" ? "Voir sur le site" : "Aperçu"}
                      title={item.effective === "published" ? "Voir sur le site" : "Aperçu"}
                      className="flex size-11 items-center justify-center rounded-[10px] text-bo-slate hover:bg-bo-bg"
                    >
                      <Icon name="eye" />
                    </a>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger
                        aria-label="Plus d'actions"
                        className="flex size-11 cursor-pointer items-center justify-center rounded-[10px] border-none bg-transparent text-bo-slate hover:bg-bo-bg data-[state=open]:bg-bo-bg"
                      >
                        <DotsIcon />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={4}
                          className="z-50 flex min-w-[220px] flex-col gap-0.5 rounded-xl border border-bo-line bg-white p-1.5 font-sans text-sm font-bold text-bo-ink shadow-[0_12px_32px_rgba(9,32,37,0.16)]"
                        >
                          {item.effective === "published" ? (
                            <DropdownMenu.Item
                              onSelect={() => void copyLink(item)}
                              className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-3 outline-none data-[highlighted]:bg-bo-bg"
                            >
                              <Icon name="copy" size={16} />
                              Copier le lien
                            </DropdownMenu.Item>
                          ) : null}
                          {item.effective === "published" ? (
                            <DropdownMenu.Item
                              onSelect={() => void changeStatus(item, "draft")}
                              className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-3 outline-none data-[highlighted]:bg-bo-bg"
                            >
                              <Icon name="undo" size={16} />
                              Repasser en brouillon
                            </DropdownMenu.Item>
                          ) : (
                            <DropdownMenu.Item
                              onSelect={() => void changeStatus(item, "published")}
                              className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-3 outline-none data-[highlighted]:bg-bo-bg"
                            >
                              <Icon name="check" size={16} strokeWidth={2} />
                              Publier maintenant
                            </DropdownMenu.Item>
                          )}
                          <DropdownMenu.Separator className="my-1 h-px bg-bo-line-soft" />
                          <DropdownMenu.Item
                            onSelect={() => setToDelete(item)}
                            className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-bo-danger outline-none data-[highlighted]:bg-[#FBEAEA]"
                          >
                            <Icon name="trash" size={16} />
                            Supprimer
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              );
            })}

            {rows.length === 0 ? (
              <div className="border-t border-bo-line-soft px-5 py-12 text-center text-bo-muted">
                {items.length === 0 ? (
                  <>
                    Aucune news pour l&apos;instant.{" "}
                    <Link href="/admin/news/new" className="font-bold text-bo-teal hover:text-bo-blue">
                      Rédigez la première
                    </Link>
                    .
                  </>
                ) : (
                  "Aucune news ne correspond à ce filtre."
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bo-line px-5 py-3.5 text-sm text-bo-muted">
          <span>
            {filtered.length
              ? `Affichage de ${start + 1} à ${start + rows.length} sur ${filtered.length} news`
              : "Aucun résultat"}
          </span>
          <nav aria-label="Pagination" className="flex gap-1.5">
            <button
              type="button"
              aria-label="Page précédente"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="size-10 cursor-pointer rounded-[9px] border border-bo-line bg-white font-[inherit] text-bo-faint hover:text-bo-ink disabled:cursor-default disabled:hover:text-bo-faint"
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                aria-current={number === currentPage ? "page" : undefined}
                onClick={() => setPage(number)}
                className={cn(
                  "size-10 cursor-pointer rounded-[9px] font-[inherit] font-bold",
                  number === currentPage
                    ? "border-none bg-bo-ink text-white"
                    : "border border-bo-line bg-white text-bo-slate hover:text-bo-ink"
                )}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              aria-label="Page suivante"
              disabled={currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
              className="size-10 cursor-pointer rounded-[9px] border border-bo-line bg-white font-[inherit] text-bo-faint hover:text-bo-ink disabled:cursor-default disabled:hover:text-bo-faint"
            >
              ›
            </button>
          </nav>
        </div>
      </section>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Supprimer cette news ?"
        description={toDelete ? `« ${toDelete.title} » sera supprimée définitivement, avec ses images.` : ""}
        confirmLabel="Supprimer"
        danger
        onConfirm={async () => {
          if (!toDelete) return;
          const result = await deleteNews(toDelete.id);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          setToDelete(null);
          toast.success("News supprimée.");
          router.refresh();
        }}
      />
    </main>
  );
}
