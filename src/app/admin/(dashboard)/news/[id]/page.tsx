import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NewsEditor from "@/components/admin/NewsEditor";
import { requireEditorPage } from "@/lib/auth";
import { getNewsForEditor } from "@/lib/news/queries";
import { rowToForm } from "@/lib/news/types";

import { authorOptions } from "../authors";

export const metadata: Metadata = { title: "Modifier une news" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditNewsPage({ params }: PageProps<"/admin/news/[id]">) {
  await requireEditorPage();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const news = await getNewsForEditor(id);
  if (!news) notFound();
  const { row, pending } = news;

  return (
    <NewsEditor
      authors={authorOptions}
      initial={{
        id: row.id,
        // Les modifications en attente priment sur la version en ligne.
        form: pending ? { ...rowToForm(row), ...pending.data } : rowToForm(row),
        status: row.status,
        publishedAt: row.published_at,
        hasPending: Boolean(pending),
        updatedByName: pending?.updated_by_name ?? row.updated_by_name,
        savedAt: pending?.updated_at ?? row.updated_at,
      }}
    />
  );
}
