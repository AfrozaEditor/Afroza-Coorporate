import Image from "next/image";
import type { ReactNode } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Mise en page des écrans de connexion : panneau de marque + formulaire. */
export default function AuthShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-wrap bg-white">
      <section className="relative flex min-h-[560px] flex-[1_1_480px] flex-col justify-between gap-12 overflow-hidden bg-bo-night px-6 py-12 text-white sm:px-14">
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -right-40 size-[520px] rounded-full border-[64px] border-bo-teal opacity-55"
        />
        <div aria-hidden="true" className="absolute right-[140px] top-[120px] size-3.5 rounded-full bg-bo-orange" />

        <div className="relative flex items-center gap-3.5">
          <Image src="/images/logo-mark.png" alt="" width={44} height={56} className="h-14 w-11 object-contain" priority />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.02em]">AFROZA EDITOR</span>
            <span className="text-[13px] font-medium text-bo-mint">Back-office</span>
          </div>
        </div>

        <div className="relative flex max-w-[520px] flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start text-[13px] font-bold uppercase tracking-[0.08em] text-bo-cyan">
            <span className="h-0.5 w-7 bg-bo-cyan" />
            Espace équipe
          </span>
          <h1 className="m-0 text-[34px] font-black leading-[1.1] tracking-[-0.01em] sm:text-[46px]">
            Racontez ce que <span className="text-bo-cyan">nous bâtissons</span>.
          </h1>
          <p className="m-0 max-w-[440px] text-[17px] text-bo-foam">
            Rédigez une actualité ou repartagez un post de la chaîne WhatsApp : il apparaît sur la page News du
            site en quelques clics.
          </p>
        </div>

        <span className="relative text-[13px] text-bo-sage">CRADAT, Yaoundé — Cameroun</span>
      </section>

      <section className="flex flex-[1_1_480px] items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[420px] flex-col gap-7">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[32px] font-black leading-[1.2]">{title}</h2>
            <p className="m-0 text-bo-muted">{intro}</p>
          </div>
          {!isSupabaseConfigured ? (
            <p role="status" className="m-0 rounded-[10px] bg-bo-warn-bg px-4 py-3.5 text-[13px] text-bo-warn">
              Supabase n&apos;est pas encore configuré : renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (voir <code>supabase/README.md</code>).
            </p>
          ) : null}
          {children}
        </div>
      </section>
    </div>
  );
}
