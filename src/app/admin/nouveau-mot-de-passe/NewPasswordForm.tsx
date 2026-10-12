"use client";

import { useActionState } from "react";

import { updatePassword, type FormState } from "@/app/admin/_actions/auth";
import { Icon } from "@/components/admin/icons";
import { fieldClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default function NewPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updatePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-7" noValidate>
      <div className="flex flex-col gap-[18px]">
        {state.error ? (
          <p role="alert" className="m-0 flex items-start gap-2.5 rounded-[10px] bg-bo-warn-bg px-4 py-3.5 text-sm text-bo-warn">
            <Icon name="info" className="mt-px shrink-0" />
            <span>{state.error}</span>
          </p>
        ) : null}
        <label className="flex flex-col gap-2 text-sm font-bold">
          Nouveau mot de passe
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={cn(fieldClass, "h-[50px] font-normal")}
          />
          <span className="text-[13px] font-medium text-bo-muted">8 caractères minimum.</span>
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold">
          Confirmer le mot de passe
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            minLength={8}
            required
            className={cn(fieldClass, "h-[50px] font-normal")}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-none bg-bo-cyan text-base font-bold text-bo-night transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Enregistrement…" : "Enregistrer et continuer"}
        <Icon name="arrowRight" strokeWidth={2} />
      </button>
    </form>
  );
}
