"use client";

import Image from "next/image";
import { useState } from "react";
import CoverflowDemo from "../../components/common/coverflow";
import { cards1 } from "@/config/social";
import { Button } from "@/components/ui/button";
import ProjectsShowcase, { type Project } from "@/components/common/projectFlow";
import ProjectDetailModal from "@/components/common/projectDetailModal";



const projects: Project[] = [
  {
    title: "Afroza Marketplace",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/features/projects/logo_am.png",
    image: "/features/projects/afm.png",
    isVideo: true,
    techIcons: [
      { name: "Laravel", icon: "/icons/laravel.svg" },
      { name: "React", icon: "/icons/react.svg" },
      { name: "Typescript", icon: "/icons/typescript-original.svg" },
      { name: "Php", icon: "/icons/php-original.svg" },
      { name: "Tailwind", icon: "/icons/tailwindcss.svg" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Postgres", icon: "/icons/postgresql.svg" },
      // ...
    ],
    screenshots: [
      "/features/projects/am/screen1.png",
      "/features/projects/am/screen2.png",
      "/features/projects/am/screen3.png",
      "/features/projects/am/screen4.png",
      "/features/projects/am/screen5.png",
      "/features/projects/am/screen6.png",
      "/features/projects/am/screen7.png",
      "/features/projects/am/screen8.png",
      "/features/projects/am/screen9.png",
    ],
    // avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],:
    link:'https://afrozamarketplace.app'
  },
  {
    title: "Afroza Latexia",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/features/projects/logo_al.png",
    image: "/features/projects/al.png",
    isVideo: true,
    techIcons: [
      { name: "Laravel", icon: "/icons/laravel.svg" },
      { name: "React", icon: "/icons/react.svg" },
      { name: "Typescript", icon: "/icons/typescript-original.svg" },
      { name: "Php", icon: "/icons/php-original.svg" },
      { name: "Tailwind", icon: "/icons/tailwindcss.svg" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Postgres", icon: "/icons/postgresql.svg" },
      // ...
    ],
    link:'https://afrozamarketplace.app'
  },
  {
    title: "Afroza Pay System",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/features/projects/logo_aps.png",
    image: "/features/projects/aps.png",
    isVideo: true,
    techIcons: [
      { name: "Phoenix", icon: "/icons/phoenix-original.svg" },
      { name: "Elixir", icon: "/icons/elixir-original.svg" },
      { name: "React native", icon: "/icons/reactnative-original.svg" },
      { name: "Typescript", icon: "/icons/typescript-original.svg" },
      { name: "Python", icon: "/icons/python-original.svg" },
      { name: "Tailwind", icon: "/icons/tailwindcss.svg" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Postgres", icon: "/icons/postgresql.svg" },
      // ...
    ],
  },
  {
    title: "Afroza Editor",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/images/logo.png",
    image: "/images/logo.png",
    isVideo: true,
    avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
  },
  {
    title: "Afroza Solidarity",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/features/projects/logo_as.png",
    image: "/features/projects/logo_as.png",
    isVideo: true,
    avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
  },
];

export default function Features() {
    // Le projet actuellement affiché dans le popup (null = popup fermé)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return(
        <>
            <div className="relative flex h-[70svh] min-h-[30rem] w-full items-center justify-center sm:min-h-[38rem]">
              <div className="relative w-full flex items-center justify-center my-auto bg-transparent h-full overflow-hidden">
                  <Image
                      src="/features/project.jpg"
                      alt=""
                      fill
                      className="w-full h-full object-cover"
                  />
                  <Image
                      src="/features/dart.png"
                      alt=""
                      fill
                      className="h-full w-full object-contain object-right opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute px-4 text-center text-4xl font-bold text-white sm:text-6xl lg:text-8xl">
                      <p>Nos Projets</p>
                  </div>
              </div>
            </div>
            <div className="w-full overflow-hidden">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                <div className="flex gap-6 pr-6">
                  {projects.map((project) => (
                    <div
                      key={project.title}
                      className="group relative flex h-32 w-40 shrink-0 items-center justify-center overflow-hidden sm:h-48 sm:w-56 lg:h-72 lg:w-72"
                    >
                      <Image
                        src={project.logo ?? ""}
                        alt=""
                        width={100}
                        height={100}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 pr-6">
                  {projects.map((project) => (
                    <div
                      key={`${project.title}-dup`}
                      className="group relative flex h-32 w-40 shrink-0 items-center justify-center overflow-hidden sm:h-48 sm:w-56 lg:h-72 lg:w-72"
                    >
                      <Image
                        src={project.logo ?? ""}
                        alt=""
                        width={100}
                        height={100}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex max-w-full flex-wrap justify-center gap-3 px-4 sm:gap-8">
              {cards1.map((c) => (
                <Button
                  key={c.id}
                  variant={"link"}
                  className="text-black font-semibold border-0 border-black pb-1"
                >
                  {c.title}
                </Button>
              ))}
            </div>

            {/* onSelect ouvre le popup avec le projet cliqué */}
            <ProjectsShowcase
              projects={projects}
              onSelect={(project) => setSelectedProject(project)}
            />

            </div>

            <CoverflowDemo />

            {/* Le popup ne s'affiche que si un projet est sélectionné */}
            {selectedProject && (
              <ProjectDetailModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
        </>
    )
}
