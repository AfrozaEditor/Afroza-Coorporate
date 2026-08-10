"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  image: string;
  align: "left" | "center" | "right";
  title?: string;
  subtitle: string;
  description?: string;
};

const slides: Slide[] = [
  {
    image: "/images/slider/bg1.jpg",
    align: "left",
    title: "Nous bâtissons le Cameroun numérique de demain",
    subtitle: "Innovation & Expertise",
    description: "Solutions informatiques performantes pour votre entreprise.",
  },
  {
    image: "/images/slider/bg2.jpg",
    align: "center",
    subtitle: "Optez pour nos solutions pour booster votre business",
  },
  {
    image: "/images/slider/bg3.jpg",
    align: "right",
    title: "Votre partenaire de transformation digitale",
    subtitle: "Expertise & accompagnement",
    description:
      "Nous concevons des produits digitaux sur mesure qui font évoluer votre activité, de la stratégie à la mise en production.",
  },
];

const AUTOPLAY_MS = 6000;

const alignClasses: Record<Slide["align"], string> = {
  left: "items-center text-center md:items-start md:text-left",
  center: "items-center text-center",
  right: "items-center text-center md:items-end md:text-right",
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="relative group h-[100svh] min-h-[34rem] w-full overflow-hidden sm:min-h-[40rem]">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== current}
        >
          <Image
            src={slide.image}
            alt={slide.subtitle}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-transform duration-[7000ms] ease-out ${
              index === current ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/65" />

          <div
            className={`relative z-10 mx-auto flex h-full max-w-6xl items-center pt-28 ${
              index === current ? "slide-active" : ""
            }`}
          >
            <div
              className={`slide-anim flex w-full flex-col gap-4 sm:gap-6 ${alignClasses[slide.align]}`}
            >
              {slide.subtitle && slide.title && (
                <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-white sm:text-lg sm:tracking-[0.25em] lg:text-xl">
                  {slide.subtitle}
                </p>
              )}
              <h2 className="max-w-4xl text-3xl font-extrabold uppercase leading-[1.08] text-white drop-shadow-lg sm:text-5xl lg:text-7xl">
                {slide.title ?? slide.subtitle}
              </h2>
              {slide.description && (
                <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  {slide.description}
                </p>
              )}
              <div
                className={`mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 ${
                  slide.align === "center" ? "justify-center" : ""
                }`}
              >
                <Button
                  asChild
                  className="h-auto rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition-all hover:-translate-y-0.5 hover:bg-brand-light sm:text-md"
                >
                  <Link href="/#services">Nos services</Link>
                </Button>
                <Button
                  asChild
                  className="h-auto rounded-full border-2 border-white/80 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand sm:text-md"
                >
                  <Link href="/#contact">Contactez-nous</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={prev}
        aria-label="Slide précédent"
        className="invisible absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 p-0 text-white backdrop-blur-sm transition-colors group-hover:visible hover:bg-brand md:flex lg:h-14 lg:w-14"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide suivant"
        className="invisible absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:visible hover:bg-brand md:flex lg:h-14 lg:w-14"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Aller au slide ${index + 1}`}
            className={`h-3 rounded-full border border-white transition-all ${
              index === current ? "w-9 bg-accent" : "w-3 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
