"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset, type FormState } from "@/app/admin/_actions/auth";
import { Icon } from "@/components/admin/icons";
import { fieldClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(requestPasswordReset, {});

  return (
    <form action={formAction} className="flex flex-col gap-7" noValidate>
      <div className="flex flex-col gap-[18px]">
        {state.error ? (
          <p role="alert" className="m-0 flex items-start gap-2.5 rounded-[10px] bg-bo-warn-bg px-4 py-3.5 text-sm text-bo-warn">
            <Icon name="info" className="mt-px shrink-0" />
            <span>{state.error}</span>
          </p>
        ) : null}
        {state.success ? (
          <p role="status" className="m-0 flex items-start gap-2.5 rounded-[10px] bg-bo-teal-soft px-4 py-3.5 text-sm text-bo-teal">
            <Icon name="check" className="mt-px shrink-0" strokeWidth={2} />
            <span>{state.success}</span>
          </p>
        ) : null}
        <label className="flex flex-col gap-2 text-sm font-bold">
          Adresse e-mail
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            defaultValue={state.email}
            placeholder="prenom@afroza-editor.tech"
            className={cn(fieldClass, "h-[50px] font-normal")}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-none bg-bo-cyan text-base font-bold text-bo-night transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Envoi…" : "Recevoir le lien"}
        <Icon name="arrowRight" strokeWidth={2} />
      </button>

      <Link
        href="/admin/login"
        className="inline-flex min-h-8 items-center gap-1.5 self-start text-sm font-bold text-bo-teal no-underline hover:text-bo-blue"
      >
        <Icon name="arrowLeft" size={16} strokeWidth={2} />
        Retour à la connexion
      </Link>
    </form>
  );
}
