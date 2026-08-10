import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import Reveal from "@/components/common/Reveal";

const faqs = [
  {
    question: "Quels types de projets Afroza Editor peut accompagner ?",
    answer:
      "Nous accompagnons les sites vitrines, plateformes web, applications mobiles, outils internes, identites visuelles, contenus digitaux et campagnes de communication.",
  },
  {
    question: "Comment demarre une collaboration ?",
    answer:
      "Nous commencons par un cadrage: objectifs, utilisateurs, contraintes, delais et budget. Ensuite nous proposons une approche, un perimetre et les prochaines etapes.",
  },
  {
    question: "Est-ce possible de commencer avec une petite version ?",
    answer:
      "Oui. Nous recommandons souvent un premier lot fonctionnel pour valider le produit plus vite, puis ajouter les evolutions prioritaires.",
  },
  {
    question: "Travaillez-vous sur des projets existants ?",
    answer:
      "Oui. Nous pouvons auditer, corriger, refondre ou faire evoluer une plateforme deja en ligne, selon l'etat technique et les objectifs.",
  },
  {
    question: "Les pages et applications sont-elles responsives ?",
    answer:
      "Oui. Les interfaces sont pensees pour desktop, tablette et mobile, avec une attention particuliere aux usages reels sur petits ecrans.",
  },
  {
    question: "Proposez-vous la maintenance apres livraison ?",
    answer:
      "Oui. Une maintenance peut couvrir les corrections, sauvegardes, mises a jour, monitoring, petites evolutions et accompagnement mensuel.",
  },
  {
    question: "Combien coute un projet ?",
    answer:
      "Le prix depend du perimetre, du nombre d'ecrans, des integrations et du niveau d'accompagnement. Nous travaillons donc sur devis.",
  },
  {
    question: "Ou est basee l'equipe ?",
    answer:
      "Afroza Editor est basee a Yaounde, au Cameroun, avec une approche adaptee aux realites du marche local et africain.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-white text-ink">
      <section className="relative flex min-h-[30rem] items-center overflow-hidden px-4 pb-16 pt-36 text-white sm:min-h-[38rem] sm:px-6 sm:pt-44 lg:px-8">
        <Image
          src="/images/footer-bg.jpg"
          alt="FAQ Afroza Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-brand/70" />
        <Reveal className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            FAQ
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Les questions frequentes avant de demarrer.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Voici les reponses aux points qui reviennent le plus souvent lors
            des premiers echanges avec nos clients.
          </p>
        </Reveal>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <Reveal>
            <div className="sticky top-28 rounded-2xl bg-ink p-6 text-white shadow-xl sm:p-8">
              <HelpCircle className="text-accent" size={36} />
              <h2 className="mt-5 text-3xl font-black">Besoin d'une reponse precise ?</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Si votre cas est specifique, le plus efficace reste un court
                echange pour cadrer le besoin.
              </p>
              <Link
                href="/#contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-all hover:bg-brand-dark"
              >
                Poser une question
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {faqs.map((item, index) => (
              <Reveal key={item.question} delay={index * 60}>
                <article className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100 sm:p-6">
                  <h3 className="text-lg font-black sm:text-xl">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7   sm:text-base">
                    {item.answer}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
