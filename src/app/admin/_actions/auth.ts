"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { isSupabaseConfigured, REMEMBER_COOKIE } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string; email?: string };

const NOT_CONFIGURED =
  "Supabase n'est pas configuré : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/news";
}

function lockMessage(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `Trop d'essais infructueux : la connexion est bloquée. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.`;
}

async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED, email };
  if (!email || !password) {
    return { error: "Saisissez votre adresse e-mail et votre mot de passe.", email };
  }

  const supabase = await createClient({ remember });

  const { data: lockSeconds } = await supabase.rpc("login_lock_seconds", { p_email: email });
  if (typeof lockSeconds === "number" && lockSeconds > 0) {
    return { error: lockMessage(lockSeconds), email };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (error?.code === "invalid_credentials") {
      const { data: failure } = await supabase.rpc("login_register_failure", { p_email: email });
      const { lock_seconds = 0, remaining = 0 } = (failure ?? {}) as {
        lock_seconds?: number;
        remaining?: number;
      };
      if (lock_seconds > 0) return { error: lockMessage(lock_seconds), email };
      return {
        error: `Adresse e-mail ou mot de passe incorrect. Encore ${remaining} essai${remaining > 1 ? "s" : ""} avant le blocage.`,
        email,
      };
    }
    if (error?.code === "email_not_confirmed") {
      return { error: "Ce compte n'est pas encore confirmé. Contactez l'administrateur.", email };
    }
    if (error?.status === 429) {
      return { error: "Trop de tentatives. Patientez quelques minutes avant de réessayer.", email };
    }
    return { error: "Connexion impossible pour le moment. Réessayez dans un instant.", email };
  }

  const { data: editor } = await supabase
    .from("editors")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!editor) {
    await supabase.auth.signOut();
    return {
      error: "Ce compte n'a pas accès au back-office. Contactez l'administrateur.",
      email,
    };
  }

  await supabase.rpc("login_clear_failures");

  const cookieStore = await cookies();
  if (remember) {
    cookieStore.delete(REMEMBER_COOKIE);
  } else {
    cookieStore.set(REMEMBER_COOKIE, "0", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  (await cookies()).delete(REMEMBER_COOKIE);
  redirect("/admin/login");
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED, email };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Saisissez une adresse e-mail valide.", email };
  }

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/auth/confirm?next=/admin/nouveau-mot-de-passe`,
  });
  if (error?.status === 429) {
    return { error: "Trop de demandes. Patientez quelques minutes avant de réessayer.", email };
  }

  // Même réponse que le compte existe ou non.
  return {
    success:
      "Si un compte correspond à cette adresse, un lien pour choisir un nouveau mot de passe vient de vous être envoyé.",
    email,
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") {
      return { error: "Choisissez un mot de passe différent de l'ancien." };
    }
    if (error.code === "weak_password") {
      return { error: "Mot de passe trop faible : mélangez lettres, chiffres et symboles." };
    }
    if (error.code === "session_not_found" || error.status === 401) {
      return { error: "Le lien a expiré. Demandez un nouveau lien depuis la page de connexion." };
    }
    return { error: "Impossible d'enregistrer le mot de passe. Réessayez dans un instant." };
  }
  redirect("/admin/news");
}
