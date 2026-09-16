import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/common/Reveal";

const contactItems = [
  {
    icon: <Phone size={24} />,
    label: "Téléphone",
    value: "+237 656 921 921",
  },
  {
    icon: <Mail size={24} />,
    label: "Email",
    value: "afrozaeditor@yahoo.com",
  },
  {
    icon: <MapPin size={24} />,
    label: "Adresse",
    value: "CRADAT, Yaoundé — Cameroun",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white text-ink">
      <section className="relative flex min-h-[30rem] items-center overflow-hidden px-4 pb-16 pt-36 text-white sm:min-h-[38rem] sm:px-6 sm:pt-44 lg:px-8">
        <Image
          src="/images/contact.jpg"
          alt="Contact Afroza Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <Reveal className="relative mx-auto w-full max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Parlons de votre prochain projet.
          </h1>
        </Reveal>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Coordonnées
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Une question, une idée ou un produit à lancer ?
            </h2>
            <div className="mt-8 grid gap-4">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm  ">{item.label}</p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form className="rounded-2xl bg-ink p-5 text-white shadow-2xl sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="border-b border-white/50 bg-transparent py-4 outline-none placeholder:text-white/50 focus:border-brand"
                  placeholder="Nom complet"
                />
                <input
                  className="border-b border-white/50 bg-transparent py-4 outline-none placeholder:text-white/50 focus:border-brand"
                  placeholder="Adresse e-mail"
                  type="email"
                />
              </div>
              <input
                className="mt-4 w-full border-b border-white/50 bg-transparent py-4 outline-none placeholder:text-white/50 focus:border-brand"
                placeholder="Sujet"
              />
              <textarea
                className="mt-4 w-full border-b border-white/50 bg-transparent py-4 outline-none placeholder:text-white/50 focus:border-brand"
                placeholder="Votre message"
                rows={6}
              />
              <div className="mt-8 flex justify-end">
                <Button className="h-auto rounded-full bg-brand px-8 py-4 text-sm font-bold text-white hover:bg-brand-dark">
                  Envoyer le message
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
