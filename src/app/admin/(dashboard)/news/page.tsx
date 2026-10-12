import type { Metadata } from "next";

import NewsList, { type ListItem } from "@/components/admin/NewsList";
import { requireEditorPage } from "@/lib/auth";
import { listNewsForAdmin } from "@/lib/news/queries";
import { effectiveStatus, type NewsListItem } from "@/lib/news/types";

export const metadata: Metadata = { title: "Nouvelles" };

function withEffectiveStatus(items: NewsListItem[]): ListItem[] {
  const now = Date.now();
  return items.map((item) => ({ ...item, effective: effectiveStatus(item.status, item.published_at, now) }));
}

export default async function NewsListPage() {
  await requireEditorPage();
  const items = await listNewsForAdmin();
  return <NewsList items={withEffectiveStatus(items)} />;
}
