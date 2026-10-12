import type { Metadata } from "next";

import AuthShell from "@/components/admin/AuthShell";

import NewPasswordForm from "./NewPasswordForm";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

// Accessible uniquement avec une session (lien reçu par e-mail) : voir le proxy.
export default function NewPasswordPage() {
  return (
    <AuthShell title="Nouveau mot de passe" intro="Choisissez le mot de passe de votre compte Afroza Editor.">
      <NewPasswordForm />
    </AuthShell>
  );
}
