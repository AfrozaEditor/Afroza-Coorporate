"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Phone, Mail, MapPin, ChevronDown, Search, Menu, X } from "lucide-react";
import { SocialIcon } from "../ui/social-icon";
import { socials } from "@/config/social";
import { services } from "@/data/services";
import { teamMembers } from "@/data/team";

const navItems: {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}[] = [
  { label: "Accueil", href: "/" },
  {
    label: "À propos",
    href: "/about",
    dropdown: [
      { label: "Notre équipe", href: "/about#team" },
      { label: "Tarifs", href: "/about/tarifs" },
      { label: "FAQ", href: "/about/faq" },
    ],
  },
  {
    label: "Nos Services",
    href: "/services",
    dropdown: [
      { label: "Tous les services", href: "/services" },
      { label: "Détail d'un service", href: "/services/developpement-web-mobile" },
    ],
  },
  { label: "Réalisations", href: "/features" },
  { label: "Nouvelles", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const staticSearchItems = [
  {
    title: "Accueil",
    href: "/",
    type: "Page",
    description: "Presentation d'Afroza Editor, services, equipe et contact.",
    keywords: "home accueil afroza editor agence digitale",
  },
  {
    title: "A propos",
    href: "/about",
    type: "Page",
    description: "Vision, valeurs, methode et equipe Afroza Editor.",
    keywords: "about apropos qui sommes nous vision valeurs equipe",
  },
  {
    title: "Tarifs",
    href: "/about/tarifs",
    type: "Page",
    description: "Offres, devis et informations de budget.",
    keywords: "prix tarifs budget devis offre starter business scale",
  },
  {
    title: "FAQ",
    href: "/about/faq",
    type: "Page",
    description: "Questions frequentes avant de demarrer un projet.",
    keywords: "faq questions reponses aide",
  },
  {
    title: "Nos Services",
    href: "/services",
    type: "Page",
    description: "Developpement, design, marketing digital et accompagnement.",
    keywords: "services developpement design marketing web mobile",
  },
  {
    title: "Realisations",
    href: "/features",
    type: "Page",
    description: "Projets et produits realises par Afroza Editor.",
    keywords: "projets realisations portfolio features",
  },
  {
    title: "Blog",
    href: "/news",
    type: "Page",
    description: "Actualites et nouvelles d'Afroza Editor.",
    keywords: "blog news nouvelles actualites articles",
  },
  {
    title: "Contact",
    href: "/contact",
    type: "Page",
    description: "Coordonnees et formulaire de contact.",
    keywords: "contact telephone email adresse message",
  },
];

const searchItems = [
  ...staticSearchItems,
  ...services.map((service) => ({
    title: service.title,
    href: `/services/${service.slug}`,
    type: "Service",
    description: service.summary,
    keywords: [
      service.shortTitle,
      service.category,
      service.points.join(" "),
      service.tools.join(" "),
    ].join(" "),
  })),
  ...teamMembers.map((member) => ({
    title: member.name,
    href: `/membres/${member.slug}`,
    type: "Membre",
    description: `${member.role} - ${member.headline}`,
    keywords: [member.role, member.focus.join(" "), member.skills.join(" ")].join(" "),
  })),
];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function CaretIcon() {
  return (
    <svg className="ml-1 inline-block" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 16l-6-6h12z" />
    </svg>
  );
}

function NavList({ dark, onSearch }: { dark: boolean; onSearch: () => void }) {
  const pathname = usePathname()
  const linkColor = dark ? "text-ink hover:text-brand" : "text-white/90";
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navItems.map(item => {
        const baseHref = item.href.split("#")[0] || "/";
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && (pathname === baseHref || pathname.startsWith(`${baseHref}/`)));
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
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-4 text-sm text-white transition-colors hover:bg-brand/5 hover:text-brand"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
        )
      
      })}
      <button
        type="button"
        aria-label="Rechercher"
        onClick={onSearch}
        className={`transition-colors ${linkColor}`}
      >
        <Search size={18} />
      </button>
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const query = normalizeSearchText(searchQuery.trim());

    if (!query) {
      return searchItems.slice(0, 8);
    }

    return searchItems
      .filter((item) => {
        const haystack = normalizeSearchText(
          `${item.title} ${item.type} ${item.description} ${item.keywords}`,
        );
        return haystack.includes(query);
      })
      .slice(0, 10);
  }, [searchQuery]);

  const openSearch = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile quand on change de page
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen, closeSearch]);

  // Bloque le scroll du body quand le menu mobile ou la recherche est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  const toggleSub = (label: string) =>
    setOpenSub((prev) => (prev === label ? null : label));

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
          <div className="hidden md:flex items-center gap-2">
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
              <Link href="/" aria-label="Afroza Editor — Accueil">
                <Image src="/images/logo.png" alt="Afroza Editor" width={80} height={80} />
              </Link>
            </div>
            <NavList dark={false} onSearch={openSearch} />
            <div className="flex items-center pr-6 lg:hidden">
              <button
                type="button"
                aria-label="Ouvrir le menu"
                onClick={() => setMobileOpen(true)}
                className="text-white"
              >
                <Menu size={24} />
              </button>
            </div>
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
            <Link href="/" aria-label="Afroza Editor — Accueil">
              <Image src="/images/logo.png" alt="Afroza Editor" width={80} height={80} className="" />
            </Link>
          </div>
          <NavList dark={false} onSearch={openSearch} />
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
              className="text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu panel */}
      <nav
        className={`fixed inset-y-0 right-0 z-[60] flex w-[85%] max-w-sm flex-col overflow-y-auto bg-ink px-6 pb-8 pt-5 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <Image src="/images/logo.png" alt="Afroza Editor" width={100} height={100} className="h-10 w-auto" />
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setMobileOpen(false)}
            className="text-white"
          >
            <X size={22} />
          </button>
        </div>

        {navItems.map((item) => (
          <div key={item.label} className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link
                href={item.href}
                onClick={() => !item.dropdown && setMobileOpen(false)}
                className="flex-1 py-3 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
              {item.dropdown && (
                <button
                  type="button"
                  aria-label={`Afficher le sous-menu ${item.label}`}
                  onClick={() => toggleSub(item.label)}
                  className="p-3 text-white/70"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openSub === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            {item.dropdown && (
              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  openSub === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden pb-2 pl-4">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-white/70 transition-colors hover:text-brand"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Recherche mobile */}
        <button
          type="button"
          aria-label="Rechercher"
          onClick={openSearch}
          className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/90 hover:text-accent"
        >
          <Search size={16} /> Rechercher
        </button>

        {/* Coordonnées + réseaux sociaux */}
        <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
          <a href="tel:+237659974106" className="flex items-center gap-2 text-sm text-white/80">
            <span className="text-accent"><Phone size={14} /></span>
            +237 659 974 106
          </a>
          <a href="mailto:Afrozaeditor@yahoo.com" className="flex items-center gap-2 text-sm text-white/80">
            <span className="text-accent"><Mail size={14} /></span>
            Afrozaeditor@yahoo.com
          </a>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span className="text-accent"><MapPin size={14} /></span>
            CRADAT, Yaoundé — Cameroun
          </div>
          <div className="flex items-center gap-3 pt-2">
            {socials.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="flex h-8 w-8 items-center justify-center text-white/80 transition-all hover:scale-110 hover:text-brand"
              >
                <SocialIcon id={s.id} size={18} />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm sm:pt-32"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
          onClick={closeSearch}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-4 sm:px-5">
              <Search className="shrink-0 text-brand" size={22} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="search"
                placeholder="Rechercher une page, un service ou un membre..."
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-ink outline-none placeholder:text-zinc-400 sm:text-lg"
              />
              <button
                type="button"
                aria-label="Fermer la recherche"
                onClick={closeSearch}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60svh] overflow-y-auto p-3 sm:p-4">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {searchQuery.trim() ? "Résultats" : "Suggestions"}
              </p>

              {searchResults.length > 0 ? (
                <div className="grid gap-2">
                  {searchResults.map((item) => (
                    <Link
                      key={`${item.type}-${item.href}`}
                      href={item.href}
                      onClick={closeSearch}
                      className="group rounded-2xl p-4 transition-colors hover:bg-zinc-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                            {item.type}
                          </span>
                          <h3 className="mt-3 text-base font-black text-ink group-hover:text-brand sm:text-lg">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-muted">
                            {item.description}
                          </p>
                        </div>
                        <span className="mt-1 text-xl text-brand transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-zinc-50 px-5 py-8 text-center">
                  <p className="font-bold text-ink">Aucun résultat trouvé</p>
                  <p className="mt-2 text-sm text-muted">
                    Essayez avec “service”, “tarifs”, “mobile”, “design” ou le nom
                    d'un membre.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
