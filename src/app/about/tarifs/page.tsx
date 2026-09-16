import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { services } from "@/data/services";

const packages = [
  {
    name: "Starter",
    price: "Sur devis",
    description:
      "Pour lancer une presence digitale propre: site vitrine, identite simple ou premiere campagne.",
    items: [
      "Cadrage du besoin",
      "Design responsive",
      "Livraison rapide",
      "Accompagnement de mise en ligne",
    ],
  },
  {
    name: "Business",
    price: "Sur devis",
    description:
      "Pour construire un produit plus complet avec parcours, contenus, integrations et suivi.",
    items: [
      "Ateliers de conception",
      "Developpement web ou mobile",
      "Tableau de bord ou back-office",
      "Tests et corrections",
    ],
    featured: true,
  },
  {
    name: "Scale",
    price: "Sur devis",
    description:
      "Pour les plateformes evolutives, automatisations, maintenance et croissance continue.",
    items: [
      "Architecture evolutive",
      "Automatisation et DevOps",
      "Support mensuel",
      "Optimisation continue",
    ],
  },
];

const billingNotes = [
  "Chaque devis depend du perimetre, du nombre d'ecrans et des integrations.",
  "Les projets peuvent etre livres par lots pour reduire le risque.",
  "Une maintenance mensuelle peut etre ajoutee apres la mise en production.",
];

export default function PricingPage() {
  return (
    <main className="bg-white text-ink">
      <section className="relative flex min-h-[30rem] items-center overflow-hidden px-4 pb-16 pt-36 text-white sm:min-h-[38rem] sm:px-6 sm:pt-44 lg:px-8">
        <Image
          src="/images/notre_philosophie.jpg"
          alt="Tarifs Afroza Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand/70" />
        <Reveal className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Tarifs
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Des offres adaptees au niveau de maturite de votre projet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Nous travaillons principalement sur devis pour garder un budget
            coherent avec les objectifs, les delais et la complexite reelle.
          </p>
        </Reveal>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {packages.map((item, index) => (
            <Reveal key={item.name} delay={index * 100}>
              <div
                className={`flex h-full flex-col rounded-2xl p-6 ring-1 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                  item.featured
                    ? "bg-ink text-white ring-ink"
                    : "bg-white ring-zinc-100"
                }`}
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
                  {item.name}
                </p>
                <p className="mt-5 text-4xl font-black">{item.price}</p>
                <p
                  className={`mt-4 text-sm leading-7 ${
                    item.featured ? "text-white/75" : " "
                  }`}
                >
                  {item.description}
                </p>
                <div className="mt-8 grid gap-3">
                  {item.items.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={18} />
                      <span className="text-sm leading-6">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/#contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                    item.featured
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "bg-ink text-white hover:bg-brand"
                  }`}
                >
                  Demander un devis
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Ce qui influence le prix
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Le bon budget depend du resultat attendu.
            </h2>
          </Reveal>
          <div className="grid gap-4">
            {billingNotes.map((note, index) => (
              <Reveal key={note} delay={index * 90}>
                <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-100 sm:p-6">
                  <p className="text-base leading-7  ">{note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Services
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Comparez les perimetres avant de demander un devis.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 100}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block h-full rounded-2xl bg-white p-6 ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-sm font-bold text-brand">{service.category}</p>
                  <h3 className="mt-3 text-xl font-black">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7  ">
                    {service.summary}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand">
                    Voir le detail
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
