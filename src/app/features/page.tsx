"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import React, { useState } from "react";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
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
      { name: "Tailwind", icon: "/icons/tailwindcss.svg" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Postgres", icon: "/icons/postgresql.svg" },
      // ...
    ],
    screenshots: ["/features/projects/am/screen1.png", "/features/projects/am/screen2.png", "/features/projects/am/screen3.png"],
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
    link:'https://afrozamarketplace.app'
  },
  {
    title: "Afroza Pay System",
    text:
      "Nous analysons votre marché et définissons une stratégie digitale claire et efficace pour atteindre vos objectifs business. Nous intégrons les dernières technologies pour créer des solutions innovantes qui vous démarquent de la concurrence.",
    logo: "/features/projects/logo_aps.png",
    image: "/features/projects/aps.png",
    isVideo: true,
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
    const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

    // Le projet actuellement affiché dans le popup (null = popup fermé)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return(
        <>
            <div className="relative w-full flex items-center justify-center my-auto min-h-[640px] h-screen">
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
                      className="w-full h-full flex justify-end"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute text-white text-8xl font-bold">
                      <p>Nos Projets</p>
                  </div>
              </div>
            </div>
            <div className="w-full overflow-hidden">
              <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
                <div className="flex w-1/2 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.title}
                      className="group relative flex h-116 w-[calc(20%-1.125rem)] shrink-0 items-center justify-center overflow-hidden"
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

                <div className="flex w-1/2 gap-6">
                  {projects.map((project) => (
                    <div
                      key={`${project.title}-dup`}
                      className="group relative flex h-116 w-[calc(20%-1.125rem)] shrink-0 items-center justify-center overflow-hidden"
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
              <div className="flex gap-8">
              {cards1.map((c, i) => (
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