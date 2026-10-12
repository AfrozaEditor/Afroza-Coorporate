import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, Megaphone, Palette } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { services } from "@/data/services";

const serviceIcons = {
  "developpement-web-mobile": <Layers3 size={28} />,
  "conception-ui-ux-design-visuel": <Palette size={28} />,
  "contenu-marketing-digital": <Megaphone size={28} />,
};

const commitments = [
  "Interfaces responsives des le depart",
  "Livraison par etapes lisibles",
  "Accompagnement avant et apres mise en ligne",
];

export default function ServicesPage() {
  return (
    <main className="bg-white text-ink">
      <section className="relative flex h-[100svh] min-h-[34rem] items-center overflow-hidden px-4 pb-16 pt-36 text-white sm:min-h-[40rem] sm:px-6 sm:pt-44 lg:px-8">
        <Image
          src="/images/services/service1.jpg"
          alt="Services Afroza Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-brand/70" />
        <Reveal className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Nos services
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Du cadrage a la mise en ligne, nous construisons avec vous.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Afroza Editor couvre la strategie digitale, le design, le
            developpement, le contenu et l'accompagnement de lancement.
          </p>
        </Reveal>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Expertises
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Choisissez le bon accompagnement pour votre besoin.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 100}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                      {serviceIcons[service.slug as keyof typeof serviceIcons]}
                    </span>
                    <p className="mt-6 text-sm font-bold text-brand">
                      {service.category}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">{service.title}</h3>
                    <p className="mt-4 text-sm leading-7  ">
                      {service.summary}
                    </p>
                    <div className="mt-6 grid gap-3">
                      {service.points.map((point) => (
                        <div key={point} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={17} />
                          <span className="text-sm leading-6">{point}</span>
                        </div>
                      ))}
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-brand">
                      Voir le detail
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Notre promesse
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Des solutions utiles, lisibles et pretes a evoluer.
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {commitments.map((item, index) => (
              <Reveal key={item} delay={index * 90}>
                <div className="h-full rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                  <CheckCircle2 className="text-accent" size={26} />
                  <p className="mt-5 text-sm font-bold leading-7 text-white/85">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
