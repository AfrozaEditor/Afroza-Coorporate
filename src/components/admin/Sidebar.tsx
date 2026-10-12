"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/admin/_actions/auth";
import { compactName, initials } from "@/lib/news/format";

import { Icon, type IconName } from "./icons";

const itemClass =
  "flex items-center gap-3 rounded-[10px] px-3 py-[11px] font-medium text-bo-mist no-underline transition-colors";

// Sections prévues par la maquette, pas encore développées.
function UpcomingItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span className={`${itemClass} group relative cursor-default`} aria-disabled="true" title="Bientôt disponible">
      <Icon name={icon} />
      {label}
      <span className="absolute right-3 text-[11px] font-bold tracking-[0.06em] text-bo-sage opacity-0 transition-opacity group-hover:opacity-100">
        BIENTÔT
      </span>
    </span>
  );
}

export default function Sidebar({
  fullName,
  jobTitle,
  newsCount,
}: {
  fullName: string;
  jobTitle: string;
  newsCount: number;
}) {
  const pathname = usePathname();
  const onNewsList = pathname === "/admin/news";
  const inNews = pathname.startsWith("/admin/news");

  return (
    <aside className="flex flex-[1_1_248px] flex-col gap-7 bg-bo-night px-4 py-6 text-white">
      <div className="flex items-center gap-3 px-2">
        <Image src="/images/logo-mark.png" alt="" width={34} height={43} className="h-[43px] w-[34px] object-contain" />
        <div className="flex flex-col">
          <span className="text-[17px] font-black tracking-[0.02em]">AFROZA EDITOR</span>
          <span className="text-xs font-medium text-bo-mint">Back-office</span>
        </div>
      </div>

      <nav aria-label="Navigation principale" className="flex flex-col gap-1">
        <span className="px-3 pb-1 pt-2 text-[11px] font-bold tracking-[0.12em] text-bo-sage">CONTENU</span>
        <UpcomingItem icon="dashboard" label="Tableau de bord" />
        <Link
          href="/admin/news"
          aria-current={inNews ? "page" : undefined}
          className={
            inNews
              ? `${itemClass} bg-bo-cyan font-bold text-bo-night`
              : `${itemClass} hover:bg-bo-night-2 hover:text-white`
          }
        >
          <Icon name="news" />
          Nouvelles
          {onNewsList ? (
            <span className="ml-auto rounded-full bg-bo-night px-2 py-px text-xs font-bold text-bo-cyan">
              {newsCount}
            </span>
          ) : null}
        </Link>
        <UpcomingItem icon="tag" label="Catégories" />
        <UpcomingItem icon="image" label="Médiathèque" />
        <UpcomingItem icon="users" label="Auteurs" />

        <span className="px-3 pb-1 pt-5 text-[11px] font-bold tracking-[0.12em] text-bo-sage">SITE</span>
        <a href="/news" target="_blank" rel="noopener" className={`${itemClass} hover:bg-bo-night-2 hover:text-white`}>
          <Icon name="external" />
          Voir la page News
        </a>
        <UpcomingItem icon="settings" label="Paramètres" />
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl bg-bo-night-2 px-3 py-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bo-blue text-sm font-bold text-white">
          {initials(fullName)}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-bold">{compactName(fullName)}</span>
          <span className="text-xs text-bo-mint">{jobTitle}</span>
        </div>
        <form action={signOut} className="ml-auto">
          <button
            type="submit"
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="flex size-11 cursor-pointer items-center justify-center rounded-[10px] border-none bg-transparent text-bo-mist transition-colors hover:bg-bo-night hover:text-white"
          >
            <Icon name="logout" />
          </button>
        </form>
      </div>
    </aside>
  );
}
