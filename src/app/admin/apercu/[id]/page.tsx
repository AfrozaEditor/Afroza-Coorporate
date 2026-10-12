import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleView from "@/components/news/ArticleView";
import { requireEditorPage } from "@/lib/auth";
import { getNewsForEditor } from "@/lib/news/queries";
import { formToColumns } from "@/lib/news/types";

export const metadata: Metadata = { title: "Aperçu" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Aperçu de la dernière version enregistrée (modifications en attente comprises). */
export default async function PreviewPage({ params }: PageProps<"/admin/apercu/[id]">) {
  await requireEditorPage();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const result = await getNewsForEditor(id);
  if (!result) notFound();

  const { row, pending } = result;
  const news = pending ? { ...row, ...formToColumns(pending.data) } : row;

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-bo-ink px-4 py-3 text-sm text-white sm:px-6">
        <span>
          <span className="font-bold">Aperçu</span>
          {pending || row.status === "draft" ? " · cette version n'est pas encore en ligne" : " · version en ligne"}
        </span>
        <Link href={`/admin/news/${row.id}`} className="font-bold text-bo-cyan hover:text-white">
          Retour à l&apos;éditeur
        </Link>
      </div>
      <ArticleView
        news={{ ...news, published_at: news.published_at ?? new Date().toISOString() }}
        withSiteHeader={false}
      />
    </>
  );
}
