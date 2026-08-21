"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, LogIn } from "lucide-react";
import type { Project } from "./projectFlow";

function ProjectGallery({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const galleryImages: string[] =
    project.screenshots && project.screenshots.length > 0
      ? project.screenshots
      : [project.image, project.logo].filter(
          (src): src is string => Boolean(src),
        );

  useEffect(() => {
    setActive(0);
  }, [project.title]);

  if (galleryImages.length === 0) {
    return null;
  }

  const goTo = (index: number) => {
    setActive((index + galleryImages.length) % galleryImages.length);
  };

  const visibleSlides = galleryImages.map((src, index) => {
    let offset = index - active;
    const half = galleryImages.length / 2;

    if (offset > half) offset -= galleryImages.length;
    if (offset < -half) offset += galleryImages.length;

    return { src, index, offset };
  });

  return (
    <div className="relative bg-[linear-gradient(180deg,#f8f8f8_0%,#d7d7d7_100%)] px-2 py-5 sm:px-4 sm:py-6">
      <div
        className="relative mx-auto h-80 w-full max-w-6xl overflow-hidden rounded-b-3xl"
        style={{ perspective: "1200px" }}
      >
        {visibleSlides.map(({ src, index, offset }) => {
          const distance = Math.abs(offset);
          const hidden = distance > 2;
          const x = offset * 300;
          const scale = distance === 0 ? 1.08 : distance === 1 ? 0.96 : 0.86;
          const rotateY = offset * -6;
          const opacity = hidden ? 0 : distance === 2 ? 0.78 : 1;

          return (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Afficher la capture ${index + 1}`}
              onClick={() => goTo(index)}
              className="absolute left-1/2 top-1/2 h-64 w-52 origin-center overflow-hidden bg-transparent transition-all duration-500 ease-out sm:h-72 sm:w-60 lg:h-80 lg:w-64"
              style={{
                opacity,
                zIndex: 30 - distance,
                transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${
                  distance === 0 ? 90 : -distance * 54
                }px) rotateY(${rotateY}deg) scale(${scale})`,
                pointerEvents: hidden ? "none" : "auto",
              }}
            >
              <Image
                src={src}
                alt={`${project.title} capture ${index + 1}`}
                fill
                sizes="(max-width: 640px) 208px, (max-width: 1024px) 240px, 256px"
                className="object-contain rotate-90"
              />
            </button>
          );
        })}

        {galleryImages.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between">
            <button
              type="button"
              aria-label="Capture precedente"
              onClick={() => goTo(active - 1)}
              className="pointer-events-auto flex h-20 w-12 items-center justify-center text-[#35e75a] transition-transform hover:scale-110 hover:text-[#1fc846] sm:w-16"
            >
              <ChevronLeft size={58} strokeWidth={3.2} />
            </button>
            <button
              type="button"
              aria-label="Capture suivante"
              onClick={() => goTo(active + 1)}
              className="pointer-events-auto flex h-20 w-12 items-center justify-center text-[#35e75a] transition-transform hover:scale-110 hover:text-[#1fc846] sm:w-16"
            >
              <ChevronRight size={58} strokeWidth={3.2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Bloque le scroll de la page tant que le popup est ouvert,
  // et permet de fermer avec la touche Échap.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
        <div className="max-h-[calc(100svh-1.5rem)] w-full max-w-6xl overflow-y-auto rounded-3xl bg-[#FFFCFC] p-3 sm:max-h-[calc(100svh-2rem)] sm:p-5">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full rounded-3xl bg-black/15 shadow-2xl"
          >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute border-1 right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-colors hover:bg-gray-100 md:-top-4 md:right-1/2"
        >
          <LogIn className="h-4 w-4 text-gray-700 rotate-180" />
        </button>

        <div className="relative flex flex-col md:min-h-[31rem] md:flex-row">
          <div className="flex w-full flex-col justify-between gap-4 p-5 sm:p-8 md:w-1/2">
            <div className="flex items-center gap-3">
              {project.logo && (
                <Image src={project.logo} alt="" width={48} height={48} />
              )}
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {project.text}
            </p>

            {/* Liste des technologies utilisées */}
            {project.techIcons && project.techIcons.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2">
                {project.techIcons.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-1"
                    title={tech.name}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        width={22}
                        height={22}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {project.avatars && (
              <div className="flex -space-x-3 mt-2">
                {project.avatars.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand mt-2 w-fit hover:underline"
              >
                Voir le site <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Grande image de couverture à droite, fondue dans le fond gris */}
          <div className="relative h-50 w-full md:h-auto md:w-1/2">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-tr-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-100/90 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-neutral-100" />
          </div>
        </div>

        <ProjectGallery project={project} />
      </div>
       
        </div>
    </div>
  );
}
