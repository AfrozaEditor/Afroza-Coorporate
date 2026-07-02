"use client";

import Image from "next/image";
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
    title: "Nous battissons cameroun numerique de demain",
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
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
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
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
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
            className={`relative z-10 mx-auto flex h-full max-w-6xl items-center pt-24 ${
              index === current ? "slide-active" : ""
            }`}
          >
            <div
              className={`slide-anim flex w-full flex-col gap-6 ${alignClasses[slide.align]}`}
            >
              {slide.subtitle && slide.title && (
                <p className="flex items-center gap-3 text-lg font-medium uppercase tracking-[0.25em] text-white sm:text-xl">
                  {slide.subtitle}
                </p>
              )}
              <h2 className="max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                {slide.title ?? slide.subtitle}
              </h2>
              {slide.description && (
                <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  {slide.description}
                </p>
              )}
              <div
                className={`mt-3 flex flex-wrap gap-4 ${
                  slide.align === "center" ? "justify-center" : ""
                }`}
              >
                <a
                  href="#services"
                  className="rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition-all hover:-translate-y-0.5 hover:bg-brand-light"
                >
                  Nos services
                </a>
                <a
                  href="#contact"
                  className="rounded-full border-2 border-white/80 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand"
                >
                  Contactez-nous
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={prev}
        aria-label="Slide précédent"
        className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-brand"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide suivant"
        className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-brand"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
