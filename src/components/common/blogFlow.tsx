import { ChevronDown, ExternalLink, Menu, Play, Share, Share2, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";



type Element = {
  title: string;
  date: string;
  text: string;
  images: string[];
  isVideo?: boolean;
  link?: string;
  auteur?: string;
};

const cards = [
  { id: 1, title: "Développement", image: "/features/projects/R23.png" },
  { id: 2, title: "Business", image: "/features/projects/R23.png" },
  { id: 3, title: "Design", image: "/features/projects/R23.png" },
  { id: 4, title: "Data & IA", image: "/features/projects/R23.png" },
  { id: 5, title: "Marketing", image: "/features/projects/R23.png" },
];


// --- Bloc média : s'adapte selon 1 ou 2 images ---
function MediaBlock({ item }: { item: Element }) {
  // Une seule image → on garde son ratio naturel (portrait ou paysage),
  // avec juste une hauteur MAXIMALE pour éviter qu'une image très haute
  // ne domine tout l'écran (le bug qu'on vient de corriger).
  if (item.images.length === 1) {
    return (
      <div className="relative w-full h-full flex justify-center overflow-hidden shadow-md group">
        <Image
          src={item.images[0]}
          alt={item.title}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-cover"
          style={{height: 'auto'}}
        />
        {item.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="h-5 w-5 text-gray-800 ml-0.5" fill="currentColor" />
            </span>
          </div>
        )}
      </div>
    );
  }
 
  // Deux images → empilées verticalement, chacune avec sa propre hauteur fixe
  // (comme le bloc "Félicitation AFROZA EDITOR" de la maquette)
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {item.images.map((src, i) => (
        <div
          key={i}
          className="relative w-full rounded-xl h-1/2 shadow-md group"
        >
          <Image
            src={src}
            alt={`${item.title} ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full h-full"
          />
          {item.isVideo && i === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="h-4 w-4 text-gray-800 ml-0.5" fill="currentColor" />
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



function BlogProjectRow({
  element,
  reverse,
}: {
  element: Element;
  reverse: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-10 mx-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Bloc média */}
      <div className="w-full md:w-3/5">
         <MediaBlock item={element} />
      </div>

      {/* Bloc texte */}
      <div className="w-full md:w-2/5 flex flex-col justify-between ">
      <div>
        <h3 className="text-4xl font-bold text-gray-900">{element.title}</h3>
        <h3 className="text-xl font-medium italic text-gray-900">{element.date}</h3>
      </div>
        <p className="text-2xl text-gray-500 leading-relaxed whitespace-pre-line">
          {element.text}
        </p>

        <div className="flex flex-col items-start gap-4">

          <div className="flex gap-4">
            <button
            aria-label="Menu"
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <button
            aria-label="Menu"
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share2 className="h-6 w-6 text-gray-700" />
          </button>
          <button
            aria-label="Menu"
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="h-6 w-6 text-gray-700" />
          </button>
          </div>
          <div className="flex gap-4 items-center">
            <button
            aria-label="Menu"
            className="h-9 w-9 flex items-center justify-center rounded-full border-4 border-black hover:bg-gray-100 transition-colors"
          >
            <User className="h-6 w-6 text-gray-700" />
          </button>
          {element.auteur &&
          <p>{element.auteur}</p>
          } 
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsShowcase({
  elements,
}: {
  elements: Element[];
}) {
  const [visibleCount, setVisibleCount] = useState(4); // combien de projets affichés au départ
  const visibleElements = elements.slice(0, visibleCount);
  const hasMore = visibleCount < elements.length;

  return (
    <div className="flex flex-col gap-20 py-10 w-full max-w-7xl items-center justify-center">
      <p className="font-bold text-3xl">Catégories</p>
      <div className="flex gap-8">
        {cards.map((c, i) => (
          <button
            key={c.id}
            // onClick={() => setActive(i)}
            className={`text-sm transition-all ${
              i === 1
                ? "text-black font-semibold border-b-2 border-black pb-1"
                : "text-gray-300 hover:text-gray-500"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>
      {visibleElements.map((element, i) => (
        <BlogProjectRow key={element.title} element={element} reverse={i % 2 === 1} />
      ))}

      {hasMore && (
        <button
          aria-label="Afficher plus de projets"
          onClick={() => setVisibleCount((c) => c + 3)}
          className="mx-auto flex h-13.75 w-13.75 items-center justify-center rounded-full  text-green-500 hover:bg-green-50 transition-colors animate-bounce mb-20"
        >
          <ChevronDown className="h-13.75 w-13.75" />
        </button>
      )}
    </div>
  );
}