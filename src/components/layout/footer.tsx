import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import { socials } from "@/config/social";
import { Mail, Phone, Pin } from "lucide-react";
import { SocialIcon } from "../ui/social-icon";

export default function Footer() {
    return (
        <footer className="relative bg-ink text-white pt-20">
        <Image
          src="/images/footer-bg.jpg"
          alt="L'équipe Afroza Editor"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#092025]/90" />

        {/* Head office bar — semi-transparent so the background shows through */}
        <div className="absolute flex items-center justify-center left-0.5 -top-17 w-full ">
          <div className="mx-auto grid gap-px px-6 py-10 sm:grid-cols-3 bg-[#0F6562] ">
            {[
              { icon: <Pin />, title: "Head Office", text: "CRADAT, Yaoundé — Cameroun" },
              { icon: <Phone />, title: "Call Us", text: "+237 659 974 106" },
              { icon: <Mail />, title: "Mail Us", text: "Afrozaeditor@yahoo.com" },
            ].map((box, i) => (
              <Reveal key={box.title} delay={i * 120}>
                <div className="group flex items-center justify-center gap-4 px-4 text-center sm:text-left">
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/40 transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent">
                    {box.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{box.title}</h3>
                    <p className="text-sm text-white/85">{box.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
          <Reveal>
            {/* <span className=" p-3 shadow-lg"> */}
              <Image
                src="/images/logo.png"
                alt="Afroza Editor"
                width={150}
                height={70}
                className="h-12 w-auto"
              />
            {/* </span> */}
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Conception et développement de systèmes numériques innovants pour
              répondre à vos besoins spécifiques. Nous transformons vos idées en
              solutions digitales performantes.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="flex h-7 w-7 items-center justify-center  text-[10px] font-bold text-white/80 transition-all hover:scale-110 hover:text-brand"
              >
                <SocialIcon id={s.id} size={18} />
              </Link>
            ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h4 className="mb-5 text-base font-bold uppercase tracking-wide">
              Liens utiles
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
              {[
                "À propos",
                "Nos services",
                "Projets",
                "Notre équipe",
                "Carrières",
                "Blog",
                "Investissements",
                "Consultation",
                "Contact",
              ].map((link) => (
                <a key={link} href="#" className="transition-colors hover:text-accent">
                  {link}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={240}>
            <h4 className="mb-5 text-base font-bold uppercase tracking-wide">
              S&apos;abonner
            </h4>
            <p className="text-sm text-white/70">
              Ne manquez pas nos actualités, inscrivez-vous via le formulaire
              ci-dessous.
            </p>
            <form action="#" className="mt-4 flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
              <input
                type="email"
                placeholder="Adresse e-mail"
                className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                aria-label="S'abonner"
                className="flex items-center justify-center bg-accent px-5 text-white transition-colors hover:bg-accent-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 11l18-8-8 18-2.5-7.5z" />
                </svg>
              </button>
            </form>
          </Reveal>
        </div>
        <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/60">
          Copyright © 2026 Afroza Editor. Tous droits réservés.
        </div>
      </footer>
    );
}