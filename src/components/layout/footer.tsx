import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { socials } from "@/config/social";
import { Mail, Phone, Pin } from "lucide-react";
import { SocialIcon } from "../ui/social-icon";

export default function Footer() {
    return (
        <footer className="relative bg-ink text-white pt-12 sm:pt-14">
        <Image
          src="/images/footer-bg.jpg"
          alt="L'équipe Afroza Editor"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#092025]/90" />

        {/* Head office bar — overlaps the top of the footer, height adapts naturally */}
        <div className="relative z-10 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl -mt-25  gap-px overflow-hidden rounded-2xl bg-[#0F6562] sm:grid-cols-3 sm:rounded-full">
            {[
              { icon: <Pin />, title: "Head Office", text: "CRADAT, Yaoundé — Cameroun" },
              { icon: <Phone />, title: "Call Us", text: "+237 659 974 106" },
              { icon: <Mail />, title: "Mail Us", text: "Afrozaeditor@yahoo.com" },
            ].map((box, i) => (
              <Reveal key={box.title} delay={i * 120}>
                <div className="group flex items-center gap-4 px-5 py-6 text-left sm:justify-center sm:px-4 sm:text-left">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/40 transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent sm:h-14 sm:w-14">
                    {box.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold sm:text-lg">{box.title}</h3>
                    <p className="break-words text-sm text-white/85">{box.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-3">
          <Reveal>
            <Image
              src="/images/logo.png"
              alt="Afroza Editor"
              width={150}
              height={70}
              className="h-12 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Conception et développement de systèmes numériques innovants pour
              répondre à vos besoins spécifiques. Nous transformons vos idées en
              solutions digitales performantes.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:gap-4">
              {socials.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/80 transition-all hover:scale-110 hover:text-brand"
              >
                <SocialIcon id={s.id} size={16} />
              </Link>
            ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h4 className="mb-5 text-xl font-bold tracking-wide sm:text-2xl">
              Liens Utiles
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/70 sm:gap-x-6 sm:text-sm">
              {[
                { label: "À propos", href: "/about" },
                { label: "Nos services", href: "/services" },
                { label: "Projets", href: "/features" },
                { label: "Notre équipe", href: "/about#team" },
                { label: "Tarifs", href: "/about/tarifs" },
                { label: "Blog", href: "/news" },
                { label: "FAQ", href: "/about/faq" },
                { label: "Consultation", href: "/contact" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <div key={link.label} className="flex items-center justify-start gap-2 pb-2">
                  <div className="h-0.5 w-2 flex-shrink-0 bg-brand"/>
                  <Link href={link.href} className="font-bold transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={240} className="sm:col-span-2 md:col-span-1">
            <h4 className="mb-5 text-xl font-bold tracking-wide sm:text-2xl">
              S&apos;abonner
            </h4>
            <p className="text-sm text-white/70">
              Ne manquez pas nos actualités, inscrivez-vous via le formulaire
              ci-dessous.
            </p>
            <form action="#" className="mt-4 flex flex-col gap-3 lg:gap-0 sm:flex-row sm:overflow-hidden sm:rounded-full sm:bg-transparent sm:ring-1 sm:ring-white/15">
              <input
                type="email"
                placeholder="Adresse Email"
                className="w-full rounded-full bg-white px-5 py-3 text-sm text-black/70 placeholder:text-gray-500 outline-none sm:rounded-none"
              />
              <button
                type="submit"
                aria-label="S'abonner"
                className="flex items-center justify-center rounded-full bg-brand px-5 py-3 text-white transition-colors hover:bg-accent-dark sm:rounded-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 11l18-8-8 18-2.5-7.5z" />
                </svg>
              </button>
            </form>
          </Reveal>
        </div>
        <div className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-white/60">
          Copyright © 2026 Afroza Editor. Tous droits réservés.
        </div>
      </footer>
    );
}