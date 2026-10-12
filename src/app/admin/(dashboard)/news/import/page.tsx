import type { Metadata } from "next";

import WhatsAppImport from "@/components/admin/WhatsAppImport";
import { requireEditorPage } from "@/lib/auth";

import { authorOptions } from "../authors";

export const metadata: Metadata = { title: "Repartager un post WhatsApp" };

export default async function ImportPage() {
  const editor = await requireEditorPage();
  return <WhatsAppImport authors={authorOptions} defaultAuthor={editor.fullName} />;
}
