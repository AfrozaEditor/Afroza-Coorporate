import type { Metadata } from "next";

import AuthShell from "@/components/admin/AuthShell";

import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      intro="Saisissez l'adresse de votre compte : nous vous envoyons un lien pour choisir un nouveau mot de passe."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
