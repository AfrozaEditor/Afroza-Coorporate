import type { Metadata } from "next";

import AuthShell from "@/components/admin/AuthShell";

import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

const NOTICES: Record<string, string> = {
  acces: "Ce compte n'a pas accès au back-office. Contactez l'administrateur.",
  lien: "Ce lien n'est plus valide. Demandez un nouveau lien depuis « Mot de passe oublié ? ».",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" && params.next.startsWith("/admin/") ? params.next : undefined;
  const error = typeof params.error === "string" ? NOTICES[params.error] : undefined;

  return (
    <AuthShell title="Connexion" intro="Accès réservé aux membres de l'équipe Afroza Editor.">
      <LoginForm next={next} notice={error} />
    </AuthShell>
  );
}
