import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { SocialIcon } from "@/components/ui/social-icon";
import { getTeamMemberBySlug, teamMembers } from "@/data/team";
import { SITE_NAME, SITE_URL } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  personSchema,
} from "@/lib/seo/structured-data";

type MemberPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: MemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: "Membre introuvable",
    };
  }

  const imageUrl = `${SITE_URL}${member.photo}`;
  const pageUrl = `${SITE_URL}/membres/${member.slug}`;

  return {
    title: `${member.name} — ${member.role}`,
    description: member.headline,

    openGraph: {
      type: "profile",
      locale: "fr_CM",
      siteName: SITE_NAME,
      title: `${member.name} — ${member.role}`,
      description: member.bio,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: member.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${member.name} — ${member.role}`,
      description: member.bio,
      images: [imageUrl],
    },
  };
}

export default async function MemberDetailPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const otherMembers = teamMembers
    .filter((item) => item.slug !== member.slug)
    .slice(0, 3);

  return (
    <div className="bg-white text-ink">
      <JsonLd
        data={personSchema({
          name: member.name,
          jobTitle: member.role,
          description: member.bio,
          url: `${SITE_URL}/membres/${member.slug}`,
          image: `${SITE_URL}${member.photo}`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", href: "/" },
          { name: "À propos", href: "/about" },
          { name: "Équipe", href: "/about#team" },
          { name: member.name, href: `/membres/${member.slug}` },
        ])}
      />
      <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-36 text-white sm:px-6 sm:pb-24 sm:pt-44 lg:px-8">
        <Image
          src="/images/footer-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-brand/75" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-accent"
            >
              <ArrowLeft size={18} />
              Retour a l'equipe
            </Link>

            <div className="relative mt-8 aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">
              {member.role}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {member.name}
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-white/90">
              {member.headline}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              {member.bio}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/15">
                <MapPin size={16} />
                {member.location}
              </span>
              <div className="flex gap-2">
                {member.socials.map((social) => (
                  <Link
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand"
                  >
                    <SocialIcon id={social.id} size={17} />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand">
              Domaines d'intervention
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Ce que {member.name.split(" ")[0]} apporte aux projets
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {member.focus.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100"
                >
                  <CheckCircle2 className="text-brand" size={24} />
                  <p className="mt-4 font-bold">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl bg-ink p-6 text-white shadow-xl sm:p-8">
              <h3 className="text-2xl font-black">Compétences</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand">
              Impact
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Contributions clés
            </h2>
          </Reveal>

          <div className="grid gap-4">
            {member.highlights.map((highlight, index) => (
              <Reveal key={highlight} delay={index * 90}>
                <div className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-base leading-7  ">{highlight}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand">
                Equipe
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Autres membres
              </h2>
            </div>
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
            >
              Voir toute l'equipe
              <ExternalLink size={16} />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((item, index) => (
              <Reveal key={item.slug} delay={index * 100}>
                <Link
                  href={`/membres/${item.slug}`}
                  className="group flex h-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-black">{item.name}</h3>
                    <p className="mt-1 text-sm text-brand">{item.role}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
