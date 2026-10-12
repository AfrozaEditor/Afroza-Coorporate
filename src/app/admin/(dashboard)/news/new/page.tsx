import type { Metadata } from "next";

import NewsEditor from "@/components/admin/NewsEditor";
import { requireEditorPage } from "@/lib/auth";

import { authorOptions } from "../authors";

export const metadata: Metadata = { title: "Rédiger une news" };

export default async function NewNewsPage() {
  const editor = await requireEditorPage();

  return (
    <NewsEditor
      authors={authorOptions}
      initial={{
        id: null,
        status: "draft",
        publishedAt: null,
        hasPending: false,
        updatedByName: null,
        savedAt: null,
        form: {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverUrl: null,
          category: "Développement",
          source: "written",
          authorName: editor.fullName,
          featured: false,
          keywords: [],
          whatsappUrl: "",
          whatsappPostedOn: "",
          whatsappCta: true,
        },
      }}
    />
  );
}
