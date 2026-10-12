import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type Editor = {
  userId: string;
  email: string;
  fullName: string;
  jobTitle: string;
};

type AuthState =
  | { status: "anonymous" }
  | { status: "forbidden" }
  | { status: "editor"; editor: Editor };

/**
 * Vérifie le jeton (getClaims) puis la présence du compte dans la table
 * `editors`. Mis en cache pour la durée de la requête.
 */
const getAuthState = cache(async (): Promise<AuthState> => {
  // Toujours rendu à la requête, même si Supabase n'est pas encore configuré.
  await connection();
  if (!isSupabaseConfigured) return { status: "anonymous" };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims?.sub) return { status: "anonymous" };

  const { data } = await supabase
    .from("editors")
    .select("full_name, job_title")
    .eq("user_id", claims.sub)
    .maybeSingle();
  if (!data) return { status: "forbidden" };

  return {
    status: "editor",
    editor: {
      userId: claims.sub,
      email: typeof claims.email === "string" ? claims.email : "",
      fullName: data.full_name as string,
      jobTitle: data.job_title as string,
    },
  };
});

/** Éditeur connecté, ou null. À appeler au début de chaque Server Action. */
export async function getCurrentEditor() {
  const state = await getAuthState();
  return state.status === "editor" ? state.editor : null;
}

/** Pour les pages : redirige vers la connexion si l'accès n'est pas autorisé. */
export async function requireEditorPage() {
  const state = await getAuthState();
  if (state.status === "anonymous") redirect("/admin/login");
  if (state.status === "forbidden") redirect("/admin/login?error=acces");
  return state.editor;
}
