"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, ChevronDown, Search, Menu, X} from "lucide-react";
import { SocialIcon } from "../ui/social-icon";
import { socials } from "@/config/social";

const navItems: { label: string; href: string; dropdown?: string[] }[] = [
  { label: "Acceuil", href: "/" },
  { label: "À propos", href: "/about", dropdown: ["Notre équipe", "Tarifs", "FAQ"] },
  {
    label: "Nos Services",
    href: "/services",
    dropdown: ["Tous les services", "Détail d'un service"],
  },
  { label: "Réalisations", href: "/features" },
  { label: "Nouvelles", href: "/news" },
  { label: "Contact", href: "/contact" },
];

function CaretIcon() {
  return (
    <svg className="ml-1 inline-block" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 16l-6-6h12z" />
    </svg>
  );
}

function NavList({ dark }: { dark: boolean }) {
  const pathname = usePathname()
  const linkColor = dark ? "text-ink hover:text-brand" : "text-white/90";
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navItems.map(item => {
        const isActive = pathname === item.href
        console.log(isActive)
        return (
        <div key={item.label} className="group relative h-full">
                  <Link
                    href={item.href}
                    className={`flex h-full items-center text-sm font-semibold uppercase tracking-wide transition-colors border-b-2  ${
                      isActive ? 'border-brand' : 'border-transparent hover:border-brand'
                    }
                    ${linkColor}
                    `}
                  >
                    {item.label}
                    {item.dropdown && <CaretIcon />}
                  </Link>
                  {item.dropdown &&  (
                    <div className="invisible absolute left-0 top-full z-50 min-w-48 translate-y-3 rounded-xl bg-black  py-2 opacity-0 shadow-2xl ring-1 ring-black/5 transition-all duration-300 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub}
                          href={item.href}
                          className="block px-4 py-4 text-sm text-white transition-colors hover:bg-brand/5 hover:text-brand"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
        )
      
      })}
      <button type="button" aria-label="Rechercher" className={`transition-colors ${linkColor}`}>
        <Search size={18} />
      </button>
    </nav>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Transparent header sitting over the hero */}
      <div className="absolute inset-x-0 top-0 z-40 justify-center items-center ">
        <div className="items-center flex justify-center">
          <div className="py-3 flex justify-between max-w-6xl w-full">
          <div className="text-white hidden md:block">
            <ul className="flex items-center gap-7 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-accent"><Phone size={14} /></span>
                +237 659 974 106
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent"><Mail size={14} /></span>
                Afrozaeditor@yahoo.com
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent"><MapPin size={14} /></span>
                CRADAT, Yaoundé — Cameroun
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
        </div>
      

        <header className="flex items-center justify-center">
          <div className="relative flex w-full bg-black/50 max-w-6xl justify-between">
            {/* Fond : du bord droit de la zone contenu jusqu'au bord droit de l'écran */}
            <div className="absolute inset-y-0 left-full right-[calc(50%-50vw)] -z-10 bg-black/50" />

            <div className="pl-7.5 py-1.25">
              <a href="#" aria-label="Afroza Editor — Accueil">
                <Image src="/images/logo.png" alt="Afroza Editor" width={80} height={80} />
              </a>
            </div>
            <NavList dark={false} />
          </div>
        </header>

      </div>

      {/* Solid sticky navbar that slides in smoothly on scroll */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-black/50 shadow-lg transition-transform duration-500 ease-out h-22.5 ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl justify-between px-6 h-full">
          <div className="flex items-center">
            <a href="#" aria-label="Afroza Editor — Accueil">
              <Image src="/images/logo.png" alt="Afroza Editor" width={80} height={80} className="" />
            </a>
          </div>
          <NavList dark={false} />
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <nav className="fixed inset-x-0 top-0 z-[60] bg-ink px-6 pb-6 pt-5 shadow-2xl lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <Image src="/images/logo.png" alt="Afroza Editor" width={120} height={120} className="h-12 w-auto" />
            <button type="button" aria-label="Fermer" onClick={() => setMobileOpen(false)} className="text-white">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-white/10 py-3 text-sm font-semibold uppercase tracking-wide text-white/90 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
