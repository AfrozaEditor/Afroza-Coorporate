import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers3,
  Wallet,
} from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { getServiceBySlug, services } from "@/data/services";
import { createPageMetadata, SITE_URL } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  serviceSchema,
} from "@/lib/seo/structured-data";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service introuvable — Afroza Editor",
    };
  }

  return createPageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 2);

  return (
    <div className="bg-white text-ink">
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.description,
          url: `${SITE_URL}/services/${service.slug}`,
          category: service.category,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title, href: `/services/${service.slug}` },
        ])}
      />
      <section className="relative overflow-hidden px-4 pb-16 pt-36 text-white sm:px-6 sm:pb-24 sm:pt-44 lg:px-8">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-brand/75" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-accent"
            >
              <ArrowLeft size={18} />
              Retour aux services
            </Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-accent">
              {service.category}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              {service.description}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/15 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <Clock className="text-accent" size={24} />
                  <p className="mt-3 text-sm text-white/60">Delai indicatif</p>
                  <p className="mt-1 font-bold">{service.timeline}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <Wallet className="text-accent" size={24} />
                  <p className="mt-3 text-sm text-white/60">Budget</p>
                  <p className="mt-1 font-bold">{service.startingPrice}</p>
                </div>
              </div>
              <Link
                href="/#contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-all hover:bg-brand-dark"
              >
                Demander ce service
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Livrables
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Ce que vous recevez concretement.
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.deliverables.map((item, index) => (
              <Reveal key={item} delay={index * 70}>
                <div className="h-full rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100">
                  <CheckCircle2 className="text-brand" size={24} />
                  <p className="mt-4 font-bold leading-7">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Methode
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Une execution par etapes.
            </h2>
            <div className="mt-8 grid gap-4">
              {service.process.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-zinc-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="leading-7  ">{step}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl bg-ink p-6 text-white shadow-xl sm:p-8">
              <Layers3 className="text-accent" size={32} />
              <h3 className="mt-5 text-3xl font-black">Benefices</h3>
              <div className="mt-6 grid gap-4">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={18} />
                    <p className="text-sm leading-7 text-white/80">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {service.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
                Autres services
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Explorer aussi
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
            >
              Tous les services
              <ArrowRight size={16} />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {relatedServices.map((item, index) => (
              <Reveal key={item.slug} delay={index * 100}>
                <Link
                  href={`/services/${item.slug}`}
                  className="group grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[14rem_1fr]"
                >
                  <div className="relative aspect-video sm:aspect-auto">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-bold text-brand">{item.category}</p>
                    <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7  ">
                      {item.summary}
                    </p>
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
