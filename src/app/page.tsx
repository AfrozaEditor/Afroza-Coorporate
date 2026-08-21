import Image from "next/image";
import Counter from "../components/common/Counter";
import HeroSlider from "../components/common/HeroSlider";
import Reveal from "../components/common/Reveal";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/ui/social-icon";
import Link from "next/link";
import { teamMembers } from "@/data/team";
import { services as serviceCatalog } from "@/data/services";

/* ---------- Icons ---------- */
function IconTarget() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconBulb() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3z" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5.2" />
    </svg>
  );
}
function IconRocket() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 15c-1.5 1-2 4-2 4s3-.5 4-2M14 4c3 0 6 3 6 6 0 4-5 8-8 9l-3-3c1-3 5-8 9-8" />
      <circle cx="14" cy="10" r="1.5" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 7l-2 10" />
    </svg>
  );
}
function IconDesign() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="9.5" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="8.5" r="1.1" fill="currentColor" />
      <circle cx="16" cy="13" r="1.1" fill="currentColor" />
      <path d="M12 21c-2 0-3-1.5-2-3s3-1 3-3-2-2-1-3" />
    </svg>
  );
}
function IconMega() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11v2a1 1 0 0 0 1 1h2l6 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </svg>
  );
}

/* ---------- Data ---------- */
const features = [
  {
    icon: <IconTarget />,
    title: "Vision Stratégique",
    description:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business.",
    bg: "/features/feature1.jpg",
    overlay: "bg-brand/85",
  },
  {
    icon: <IconBulb />,
    title: "Innovation",
    description:
      "Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    bg: "/features/feature2.jpg",
    overlay: "bg-ink/85",
  },
  {
    icon: <IconClock />,
    title: "Livraison à temps",
    description:
      "Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.",
    bg: "/features/feature3.jpg",
    overlay: "bg-brand-dark/85",
  },
];

const serviceIcons = {
  "developpement-web-mobile": <IconCode />,
  "conception-ui-ux-design-visuel": <IconDesign />,
  "contenu-marketing-digital": <IconMega />,
};

const services = serviceCatalog.map((service) => ({
  ...service,
  icon: serviceIcons[service.slug as keyof typeof serviceIcons],
}));

const stats = [
  { icon: <IconChart />, value: 3, suffix: "", label: "Projets réalisés" },
  { icon: <IconStar />, value: 95, suffix: "%", label: "Satisfaction client" },
  { icon: <IconUsers />, value: 2, suffix: "+", label: "Clients actifs" },
  { icon: <IconRocket />, value: 2024, suffix: "", label: "Année de lancement" },
];

/* ---------- Section title ---------- */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-10 text-center sm:mb-14">
      <p className="text-base leading-normal text-[rgb(98,108,132)] sm:text-[18px]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-[44px]">
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-0.5 w-15 rounded-full bg-brand" />
    </Reveal>
  );
}

export default function Home() {
  return (
    <div className="flex w-full flex-1 overflow-x-hidden flex-col bg-white text-ink">
      <div className="relative">
        <HeroSlider />
      </div>

      {/* Features — full-bleed panels */}
      <section className="grid md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative flex min-h-80 items-center justify-center overflow-hidden sm:min-h-96 lg:min-h-[29rem]"
          >
            <Image
              src={feature.bg}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 ${feature.overlay} transition-opacity duration-500 group-hover:opacity-95`} />
            <div className="relative z-10 flex flex-col items-center px-8 py-14 text-center text-white">
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 transition-transform duration-500 group-hover:scale-110">
                {feature.icon}
              </span>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-white/85">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section id="services" className="relative overflow-hidden bg-zinc-50">
        <div className="left-0 absolute">
          <img src="/pattern/pattern_arrow.png" alt="" />
        </div>
        <div className="absolute right-0 bottom-0">
          <img src="/pattern/pattern_box.png" alt="" />
        </div>
        <div
          className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-30">
          <SectionTitle eyebrow="Nos Services" title="Que Faisons-Nous ?" />
          <div className="grid gap-10 lg:grid-cols-3 ">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 130}>
                <div className="group flex h-full flex-col overflow-hidden bg-transparent transition-all duration-500 hover:-translate-y-3">
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={600}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{height: 'auto'}}
                    />
                  </div>
                  <div className="relative flex flex-1 flex-col pt-6 sm:pt-8">
                    <span className="pointer-events-none absolute right-0 top-4 -z-1 text-brand/10">
                      {service.icon}
                    </span>
                    <h3 className="mb-4 text-xl font-bold transition-colors duration-300 group-hover:text-brand sm:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed sm:text-base">
                      {service.summary}
                    </p>
                    <ul className="space-y-3 px-1 text-sm sm:px-4 sm:text-base">
                      {service.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-0.5 ">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant="link"
                      className="mt-8 justify-start text-brand text-md transition-all"
                    >
                      <Link href={`/services/${service.slug}`}>
                        En savoir plus <span>→</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facts — 2 ans d'expérience */}
      <section className="mt-4 bg-white sm:mt-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <Reveal>
            <div className="relative">
              <span className="absolute -left-5 -top-5 hidden h-28 w-28 rounded-2xl border-4 border-accent/40 sm:block" />
              <span className="absolute -bottom-5 -right-5 hidden h-28 w-28 rounded-2xl bg-brand/10 sm:block" />
              <div className="group relative aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl">
                <Image
                  src="/images/experience.jpg"
                  alt="Afroza Editor en action"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-brand px-5 py-4 text-white shadow-xl shadow-brand/30 sm:left-8 sm:px-7 sm:py-5">
                <span className="text-3xl font-extrabold leading-none sm:text-4xl">2+</span>
                <span className="text-xs font-medium leading-tight">
                  années
                  <br />
                  d&apos;expérience
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              Notre parcours
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">
              2 Ans d&apos;Expérience
            </h2>
            <span className="mt-5 block h-1.5 w-24 rounded-full bg-brand" />
            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              Une expertise tech jeune mais déterminée, au service de vos projets
              digitaux — de la stratégie jusqu&apos;à la mise en production.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-4 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:p-7"
                >
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white sm:h-16 sm:w-16">
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-3xl font-extrabold text-ink sm:text-4xl">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Culture & philosophie — parallax */}
      <section
        className="relative flex min-h-[42rem] items-center bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: "url(/images/notre_philosophie.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-28">
          <Reveal className="w-full max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Intégrité
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Notre culture &amp; philosophie
            </h2>
            <span className="mt-4 block h-1 w-20 rounded-full bg-accent" />
            <p className="mt-6 leading-relaxed text-white/80">
              Chez Afroza Editor, nous cultivons un environnement où
              l&apos;innovation rencontre l&apos;excellence, guidés par une vision
              ancrée dans la transformation digitale de l&apos;Afrique. Notre force
              réside dans une collaboration authentique et une agilité qui nous
              permettent d&apos;adopter continuellement les nouvelles technologies.
            </p>
            <Link
              href="#services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:gap-3 hover:bg-accent-dark"
            >
              Explorer nos projets <span>→</span>
            </Link>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: <IconUsers />, title: "Collaboration", text: "Une équipe soudée qui partage ses connaissances." },
              { icon: <IconRocket />, title: "Agilité", text: "Rapidité d'exécution et adaptation continue." },
              { icon: <IconBulb />, title: "Innovation", text: "Adoption des dernières technologies du marché." },
              { icon: <IconStar />, title: "Excellence", text: "Une exigence de qualité sur chaque projet." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 110}>
                <div className="h-full rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                    {v.icon}
                  </span>
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-100 px-4 py-16 sm:px-6 sm:py-24 lg:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, var(--color-brand) 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <SectionTitle eyebrow="Notre équipe" title="La Meilleure Équipe" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.slice(0, 8).map((member, i) => (
              <Reveal key={member.name} delay={(i % 4) * 110}>
                <div className="group relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Always-visible bottom label */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 transition-opacity duration-300 group-hover:opacity-0">
                      <h3 className="text-lg font-bold text-white drop-shadow">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-accent">
                        {member.role}
                      </p>
                    </div>
                    {/* Hover overlay — slides up from bottom to center */}
                    <div className="absolute inset-0 flex translate-y-1/2 flex-col items-center justify-center gap-4 bg-gradient-to-t from-brand/95 via-brand/80 to-brand/60 px-5 text-center opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <h3 className="text-xl font-extrabold text-white drop-shadow">
                        {member.name}
                      </h3>
                      <p className="-mt-2 text-sm font-medium uppercase tracking-wide text-white/90">
                        {member.role}
                      </p>
                      <div className="flex justify-center gap-2.5">
                        {member.socials.map((s) => (
                          <Link
                            key={s.id}
                            href={s.href}
                            className="flex h-9 w-9 items-center justify-center rounded-full  text-xs font-bold text-white backdrop-blur transition-colors hover:bg-white hover:text-brand"
                          >
                            <SocialIcon id={s.id} size={16} />
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/membres/${member.slug}`}
                        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand"
                      >
                      Voir le profil
                      </Link>
                    </div>
                    </div>
                  </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16 text-center">
            <Link
              href="/about#team"
              className="inline-block rounded-full border-2 border-brand px-9 py-3.5 text-sm font-semibold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg hover:shadow-brand/30"
            >
              Voir tous les membres
            </Link>
          </Reveal>
        </div>
      </section>

      {/* News / Projets */}
      <section id="news" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <SectionTitle eyebrow="Nouveauté" title="Projets Réalisés" />
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Featured project */}
            {/* <Reveal> */}
              <article className="group relative min-h-[28rem] overflow-hidden rounded-2xl shadow-xl sm:min-h-[32rem] lg:rounded-none">
                <Image
                  src="/news/news1.jpg"
                  alt="Projet vedette Afroza"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="flex flex-col absolute inset-0 justify-between text-white">
                  <div className="p-6 sm:p-10">
                    <span className="inline-block py-1.5 text-sm italic font-[400] tracking-wide sm:text-md">
                      News
                    </span>
                  </div>

                  <div className="p-6 sm:p-10">
                    <span className="inline-block text-sm italic font-[400] tracking-wide sm:text-md">
                      13 juin, 2026
                    </span>
                    <h3 className="mt-5 text-2xl font-extrabold leading-snug sm:text-3xl lg:text-4xl">
                    Mise sur pied du prototype final d&apos;AS pour une éventuelle
                    mise en circulation
                  </h3>
                  <Button className="mt-4 rounded-full bg-brand px-6 py-5 text-sm font-semibold sm:px-8 sm:py-6 sm:text-md">
                      Lire la suite <span>→</span>
                  </Button>
                  </div>
                </div>
              
              </article>
            {/* </Reveal> */}

            {/* Secondary posts */}
            <div className="flex flex-col lg:flex-row gap-10">
              {[
                {
                  id: 1,
                  date: "20 mai, 2026",
                  title: "Construction de l'application APS pour le hackathon ID4Africa",
                  text: "Une solution d'identité numérique conçue et présentée lors du hackathon ID4Africa.",
                },
                {
                  id: 2,
                  date: "02 avril, 2026",
                  title: "Refonte de la plateforme e-commerce d'un client local",
                  text: "Migration complète, nouvelle UX et performances multipliées pour un commerçant camerounais.",
                },
              ].map((post, i) => (
                // <Reveal key={post.title} delay={i * 150} className="flex-1">
                  <article className="group flex flex-col justify-between h-full items-start p-8 gap-6 border bg-zinc-50  ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                    <div className="">
                      <span className="nline-block py-1.5 text-md italic font-normal ">
                        News
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[22px] font-bold transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <span className="inline-block text-[14px] italic font-normal py-4">
                        {post.date}
                      </span>
                      <p className="text-base leading-relaxed">
                        {post.text}
                      </p>
                    </div>

                    <div className="flex justify-end w-full">
                      <a
                        href="/news"
                        className=" text-base font-semibold text-brand transition-all hover:gap-2"
                      >
                        Lire la suite <span>→</span>
                      </a>
                    </div>
                      
                  </article>
                // </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact — image en arrière-plan plein écran */}
      {/* Contact — Image en arrière-plan */}
      <section 
        id="contact" 
        className="relative bg-cover bg-fixed bg-center my-30 h-[500px]"
        style={{ backgroundImage: "url(/images/notre_philosophie.jpg)" }}
      >
        {/* Overlay de fond */}
        <div className="absolute inset-0 bg-brand/70" />

        {/* CE BLOC FAIT TOUT LE TRAVAIL :
          Il fait la taille exacte des autres sections (max-w-7xl) et s'auto-centre (mx-auto).
          En utilisant une grille à 2 colonnes (lg:grid-cols-2), le formulaire se place automatiquement sur la droite.
        */}
        <div className="absolute inset-0 mx-auto max-w-360 px-6 lg:px-12 grid lg:grid-cols-2 items-center pointer-events-none">

          {/* Colonne Droite (Contient le formulaire) */}
          {/* On réactive les événements de souris avec 'pointer-events-auto' pour pouvoir cliquer sur les inputs */}
          <div className="relative -top-15 z-20  w-full max-w-lg justify-self-center lg:justify-self-start pointer-events-auto">
            
            <form
              action="#"
              aria-label="Formulaire de contact"
              className="bg-[#1F1F1F] px-10 py-16 w-full  shadow-2xl"
            >
              <h3 className="text-sm text-white/70 uppercase tracking-wider">
                Toujours disponibles
              </h3>
              <p className="mt-2 text-3xl font-bold text-white">
                Demandez un rappel
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="home-name" className="sr-only">Nom complet</label>
                  <input
                    id="home-name"
                    className="border-b py-4 border-white text-white outline-none focus:border-brand w-full"
                    placeholder="Nom complet"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="home-email" className="sr-only">Adresse e-mail</label>
                  <input
                    id="home-email"
                    className="border-b py-4 border-white text-white outline-none focus:border-brand w-full"
                    placeholder="Adresse e-mail"
                    type="email"
                    required
                  />
                </div>
              </div>
              <label htmlFor="home-subject" className="sr-only">Sujet</label>
              <input
                id="home-subject"
                className="mt-4 w-full border-b py-4 border-white text-white outline-none focus:border-brand"
                placeholder="Sujet"
              />
              <label htmlFor="home-message" className="sr-only">Votre message</label>
              <textarea
                id="home-message"
                className="mt-4 w-full border-b py-4 border-white text-white outline-none focus:border-brand"
                placeholder="Votre message"
                rows={5}
              />
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="rounded-full bg-brand text-white font-bold px-8 py-6 text-md hover:bg-brand-dark transition-colors"
                >
                  Envoyer le message
                </Button>
              </div>
            </form>

          </div>
          
          {/* Colonne Gauche (Vide pour laisser de la place ou pour y remettre le texte commenté plus tard) */}
          <div className="hidden lg:block" />

        </div>
      </section>
      {/* Map / Localisation */}
      <section className="relative flex h-80 items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-200">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <span className="pulse-ring absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40" />
            <Image
              src="/images/location_logo.png"
              alt="CRADAT, Yaoundé"
              width={64}
              height={84}
              className="float-anim relative drop-shadow-xl"
            />
          </div>
          <p className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink shadow-md">
            CRADAT, Yaoundé — Cameroun
          </p>
        </div>
      </section>

      {/* Footer main — team photo as full background */}
    </div>
  );
}
