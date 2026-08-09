import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import TeamShowcase from "@/components/common/TeamShowcase";
import { teamMembers } from "@/data/team";

const stats = [
  { value: "2024", label: "Lancement d'Afroza Editor" },
  { value: "3+", label: "Produits et projets accompagnés" },
  { value: "95%", label: "Objectif de satisfaction client" },
  { value: "8", label: "Profils complémentaires" },
];

const values = [
  {
    icon: <Lightbulb size={28} />,
    title: "Innovation utile",
    text:
      "Nous privilégions les solutions qui résolvent un vrai problème, pas la technologie pour la technologie.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Exigence",
    text:
      "Chaque interface, API et livraison doit rester claire, fiable et défendable dans le temps.",
  },
  {
    icon: <Users size={28} />,
    title: "Collaboration",
    text:
      "Nous travaillons avec les clients comme avec des partenaires, avec des retours courts et des décisions visibles.",
  },
  {
    icon: <Globe2 size={28} />,
    title: "Ancrage local",
    text:
      "Nos produits tiennent compte des réalités du terrain camerounais et africain.",
  },
];

const steps = [
  {
    title: "Comprendre",
    text: "Clarifier le besoin, les utilisateurs, les contraintes et les objectifs business.",
  },
  {
    title: "Concevoir",
    text: "Transformer les idées en parcours, maquettes, architecture et priorités de livraison.",
  },
  {
    title: "Construire",
    text: "Développer, tester et itérer avec une équipe légère, concentrée et réactive.",
  },
  {
    title: "Déployer",
    text: "Mettre en production, mesurer, stabiliser et préparer les prochaines évolutions.",
  },
];

export default function About() {
  return (
    <main className="bg-white text-ink">
      <section className="relative flex min-h-[34rem] items-center overflow-hidden px-4 pb-16 pt-36 text-white sm:min-h-[42rem] sm:px-6 sm:pt-44 lg:px-8">
        <Image
          src="/images/footer-bg.jpg"
          alt="Equipe Afroza Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-brand/70" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Qui sommes-nous ?
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Une équipe qui conçoit des produits numériques utiles.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Afroza Editor accompagne les entreprises dans la conception, le
              développement et le déploiement de solutions web, mobiles et
              digitales. Notre travail relie stratégie, design, ingénierie et
              communication pour livrer des produits solides.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Voir nos projets
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand"
              >
                Nous contacter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="vision" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/experience.jpg"
                  alt="Afroza Editor au travail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Notre vision
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Accélérer la transformation digitale avec des solutions
              accessibles et bien pensées.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
              Nous aidons les organisations à passer d'une idée floue à un
              produit exploitable: une plateforme, une application, une identité
              visuelle, une campagne ou un système interne qui simplifie le
              travail quotidien.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: <Target size={24} />, label: "Stratégie claire" },
                { icon: <Rocket size={24} />, label: "Exécution rapide" },
                { icon: <CheckCircle2 size={24} />, label: "Qualité mesurable" },
                { icon: <Users size={24} />, label: "Equipe engagée" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 font-bold ring-1 ring-zinc-100"
                >
                  <span className="text-brand">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <div className="h-full rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                <p className="text-4xl font-black text-accent">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="values" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Nos valeurs
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Une culture de travail simple: comprendre, construire, améliorer.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 90}>
                <div className="h-full rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                    {value.icon}
                  </span>
                  <h3 className="mt-6 text-xl font-black">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Notre méthode
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Un accompagnement lisible du cadrage au déploiement.
            </h2>
          </Reveal>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90}>
                <div className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-100 sm:grid-cols-[4rem_1fr] sm:p-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Notre équipe
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Des profils complémentaires pour couvrir toute la chaîne digitale.
            </h2>
          </Reveal>

          <TeamShowcase members={teamMembers} />
        </div>
      </section>
    </main>
  );
}
