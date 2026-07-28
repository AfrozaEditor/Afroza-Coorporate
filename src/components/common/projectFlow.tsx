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
      className={`flex flex-col md:flex-row gap-10 mx-12  ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Bloc média */}
      <div 
        onClick={() => onSelect(project)}
        className="relative w-full  md:w-3/5 aspect-video rounded-2xl overflow-hidden border-4  shadow-md group">
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
        <h3 className="text-4xl font-bold text-gray-900">{project.title}</h3>
        <p className="text-2xl text-gray-500 leading-relaxed whitespace-pre-line">
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
    <div className="flex flex-col gap-20 py-10 w-full items-center max-w-7xl justify-center">
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