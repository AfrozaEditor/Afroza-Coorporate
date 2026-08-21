import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80svh] flex-col items-center justify-center bg-white px-4 py-24 text-center text-ink">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
        Erreur 404
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
        Page introuvable
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border-2 border-brand px-7 py-3 text-sm font-bold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white"
        >
          Nous contacter
        </Link>
      </div>

      <nav
        aria-label="Sections principales"
        className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold"
      >
        {[
          { label: "Services", href: "/services" },
          { label: "Réalisations", href: "/features" },
          { label: "À propos", href: "/about" },
          { label: "Blog", href: "/news" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-brand transition-colors hover:text-brand-dark"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
