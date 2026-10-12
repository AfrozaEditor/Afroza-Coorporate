"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { signIn, type FormState } from "@/app/admin/_actions/auth";
import { Icon } from "@/components/admin/icons";
import { fieldClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signIn, {});
  const [showPassword, setShowPassword] = useState(false);
  const message = state.error ?? notice;

  return (
    <form action={formAction} className="flex flex-col gap-7" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-[18px]">
        {message ? (
          <p
            role="alert"
            className="m-0 flex items-start gap-2.5 rounded-[10px] bg-bo-warn-bg px-4 py-3.5 text-sm text-bo-warn"
          >
            <Icon name="info" className="mt-px shrink-0" />
            <span>{message}</span>
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

        <label className="flex flex-col gap-2 text-sm font-bold">
          Mot de passe
          <span className="flex h-[50px] items-center rounded-[10px] border-[1.5px] border-bo-field pl-4 transition-[border-color,box-shadow] focus-within:border-bo-cyan focus-within:shadow-[0_0_0_4px_#E0F8F6]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              className="min-w-0 flex-1 border-none bg-transparent font-[inherit] text-[15px] font-normal text-bo-ink outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
              className="flex size-[46px] cursor-pointer items-center justify-center border-none bg-transparent text-bo-muted hover:text-bo-ink"
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} />
            </button>
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-2.5 text-sm">
          <label className="flex min-h-11 items-center gap-2.5 font-medium text-bo-slate">
            <input type="checkbox" name="remember" defaultChecked className="size-[18px] accent-bo-teal" />
            Rester connecté
          </label>
          <Link href="/admin/mot-de-passe-oublie" className="font-bold text-bo-teal hover:text-bo-blue">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-none bg-bo-cyan text-base font-bold text-bo-night transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bo-teal-soft disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Connexion…" : "Se connecter"}
        <Icon name="arrowRight" strokeWidth={2} />
      </button>

      <div className="flex items-start gap-2.5 rounded-[10px] bg-bo-bg px-4 py-3.5 text-[13px] text-bo-slate">
        <Icon name="lock" className="mt-px shrink-0 text-bo-teal" />
        <span>
          Les comptes sont créés par l&apos;administrateur. Après 5 essais infructueux, la connexion est bloquée 15
          minutes.
        </span>
      </div>
    </form>
  );
}
