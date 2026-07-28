"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, ExternalLink, LogIn } from "lucide-react";
import type { Project } from "./projectFlow";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";

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
        <div className="bg-[#FFFCFC] p-5 h-[702px] rounded-3xl w-[794px]">
            <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-3xl rounded-3xl bg-black/15 shadow-2xl "
        >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-4 right-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
        >
          <LogIn className="h-4 w-4 text-gray-700 rotate-180" />
        </button>

        <div className="relative flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 flex flex-col gap-4">
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
          <div className="relative w-full md:w-1/2 h-56 md:h-auto">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-100/90 md:to-neutral-100" />
          </div>
        </div>
        {/* Galerie de captures d'écran, via le carousel shadcn/ui */}
        
      </div>
       
        </div>
    </div>
  );
}