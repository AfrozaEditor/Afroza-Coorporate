"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems: { label: string; href: string; dropdown?: string[] }[] = [
  { label: "Maison", href: "#" },
  { label: "Pages", href: "#about", dropdown: ["Notre équipe", "Tarifs", "FAQ"] },
  {
    label: "Nos Services",
    href: "#services",
    dropdown: ["Tous les services", "Détail d'un service"],
  },
  { label: "Caractéristiques", href: "#about" },
  { label: "Nouvelles", href: "#news" },
  { label: "Contact", href: "#contact" },
];

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.24 1L6.6 10.8z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7L4.2 6.8 4 7v.2l8 5.3 8-5.3V7l-.2-.2L12 12z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
function CaretIcon() {
  return (
    <svg className="ml-1 inline-block" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 16l-6-6h12z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

const socials = ["Facebook", "Twitter", "Google+", "LinkedIn", "Instagram"];

function NavList({ dark }: { dark: boolean }) {
  const linkColor = dark ? "text-ink hover:text-brand" : "text-white/90 hover:text-white";
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navItems.map((item) => (
        <div key={item.label} className="group relative">
          <a
            href={item.href}
            className={`flex items-center text-sm font-semibold uppercase tracking-wide transition-colors ${linkColor}`}
          >
            {item.label}
            {item.dropdown && <CaretIcon />}
          </a>
          {item.dropdown && (
            <div className="invisible absolute left-0 top-full z-50 min-w-48 translate-y-3 rounded-xl bg-white py-2 opacity-0 shadow-2xl ring-1 ring-black/5 transition-all duration-300 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
              {item.dropdown.map((sub) => (
                <a
                  key={sub}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-brand/5 hover:text-brand"
                >
                  {sub}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      <button type="button" aria-label="Rechercher" className={`transition-colors ${linkColor}`}>
        <SearchIcon />
      </button>
    </nav>
  );
}

export default function SiteHeader() {
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
      <div className="absolute inset-x-0 top-0 z-40">
        <div className="hidden border-b border-white/10 bg-black/25 backdrop-blur-sm lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 text-xs text-white/85">
            <ul className="flex items-center gap-7">
              <li className="flex items-center gap-2"><span className="text-accent"><PhoneIcon /></span>+237 659 974 106</li>
              <li className="flex items-center gap-2"><span className="text-accent"><MailIcon /></span>Afrozaeditor@yahoo.com</li>
              <li className="flex items-center gap-2"><span className="text-accent"><PinIcon /></span>CRADAT, Yaoundé — Cameroun</li>
            </ul>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  title={s}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/80 transition-all hover:scale-110 hover:bg-brand hover:text-white"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="#" aria-label="Afroza Editor — Accueil">
              <Image src="/images/logo.png" alt="Afroza Editor" width={150} height={150} priority className="h-16 w-auto drop-shadow-lg" />
            </a>
            <NavList dark={false} />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="text-white lg:hidden"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Solid sticky navbar that slides in smoothly on scroll */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-white shadow-lg transition-transform duration-500 ease-out ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
          <a href="#" aria-label="Afroza Editor — Accueil">
            <Image src="/images/logo.png" alt="Afroza Editor" width={120} height={120} className="h-12 w-auto" />
          </a>
          <NavList dark />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="text-ink lg:hidden"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
