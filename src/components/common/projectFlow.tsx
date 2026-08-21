import Image from "next/image";
import { useState } from "react";
import { Play, Menu, ExternalLink, ChevronDown } from "lucide-react";


export type TechIcon = {
  name: string;
  icon: string; // chemin vers le SVG/PNG de l'icône
};

export type Project = {
  title: string;
  text: string;
  logo?: string;
  image: string;
  isVideo?: boolean;
  techIcons?: TechIcon[]; // liste des technologies utilisées,
  screenshots?: string[]; // liste des captures d'écran du projet,
  avatars?: string[]; // urls des avatars à empiler
  link?: string;
};

// --- Le composant réutilisable : reçoit image, titre, texte + une position ---
function ProjectRow({
  project,
  reverse,
  onSelect,
}: {
  project: Project;
  reverse: boolean;
  onSelect: (project: Project) => void;
}) {
  return (
    <div
      className={`mx-4 flex flex-col gap-6 sm:mx-6 md:flex-row md:gap-10 lg:mx-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Bloc média */}
      <div 
        onClick={() => onSelect(project)}
        className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border-4 shadow-md md:w-3/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {project.isVideo && (
          <button
            aria-label="Lire la vidéo"
            className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="h-6 w-6 text-gray-800 ml-1" fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      {/* Bloc texte */}
      <div className="w-full md:w-2/5 grid grid-cols-1 gap-4">
        <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{project.title}</h3>
        <p className="whitespace-pre-line text-base leading-7 text-gray-500 sm:text-lg lg:text-2xl lg:leading-relaxed">
          {project.text}
        </p>

        <div className="flex items-center gap-3 mt-2">
          {/* Pile d'avatars qui se chevauchent */}
          <div className="flex -space-x-3">
            {project.avatars && project.avatars.map((src, i) => (
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

          <div className="flex">
            <button
            aria-label="Menu"
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir le lien"
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="h-6 w-6 text-gray-700" />
            </a>
          )}

          </div>
        </div>
      </div>
    </div>
  );
}

// --- Le conteneur qui liste les projets en alternant gauche/droite ---
export default function ProjectsShowcase({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(3); // combien de projets affichés au départ
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-12 py-10 sm:gap-16 lg:gap-20">
      {visibleProjects.map((project, i) => (
        <ProjectRow key={project.title} project={project} reverse={i % 2 === 1} onSelect={onSelect} />
      ))}

      {hasMore && (
        <button
          aria-label="Afficher plus de projets"
          onClick={() => setVisibleCount((c) => c + 3)}
          className="mx-auto flex h-13.75 w-13.75 items-center justify-center rounded-full text-green-500 hover:bg-green-50 transition-colors animate-bounce"
        >
          <ChevronDown className="h-13.75 w-13.75" />
        </button>
      )}
    </div>
  );
}
