"use client";

import Image from "next/image";
import BlogProjectRow from "@/components/common/blogFlow";



const news = [
  {
    title: "Mise sur pied du prototype final d'AS pour une éventuelle mise en circulation",
    date: "22-05-2026",
    text:
      "Console portable rétro, rétro-gaming, console nomade, jeux vidéo vintage… Depuis plus de 45 ans, les joueurs emportent leurs aventures partout avec eux. Des premiers écrans LCD des années 80 aux consoles portables ultra-puissantes d’aujourd’hui, le jeu vidéo nomade n’a cessé…",
    images: ["/news/news1.jpg"],
    isVideo: true,
    // avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],:
    overlay: "bg-brand/85",
    link:'https://afrozamarketplace.app',
    auteur: 'Fokou Sheryle'
  },
  {
    title: "Varjo XR-4 Quel Impact pour les Développeurs ?",
    date: "22-05-2026",
    text:
      `Pour les créateurs d'applications et les ingénieurs logiciels, le Varjo XR-4 change radicalement la donne :
        Zéro Compromis Graphique : Les développeurs testent leurs environnements 3D en taille réelle avec des textures et des éclairages ultra-réalistes.
        Optimisation par le Regard : Le suivi oculaire permet d'intégrer le rendu fovéal, une technique qui concentre la puissance de calcul là où l'utilisateur regarde.
        Productivité Multi-Écrans : Il remplace un setup physique complexe par une infinité d'écrans virtuels haute résolution dans un espace de travail virtuel.
        Face au manque d'infrastructures de pointe, le XR-4 permet de former les chirurgiens...`,
    images: ["/news/news2.jpg"],
    isVideo: true,
    // avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
    overlay: "bg-ink/85",
    auteur: 'Karel Ondo'
  },
  {
    title: "Afroza Editor participant au Cursor Hackaton",
    date: "22-05-2026",
    text:
      "Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.",
    logo: "/news/projects/logo_aps.png",
    images: ["/news/news5.jpg"],
    isVideo: true,
    // avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
    overlay: "bg-brand-dark/85",
    auteur: 'Simo Menelik'
  },
  {
    title: "Félicitation AFROZA EDITOR",
    date: "22-05-2026",
    text:
      `Pour les créateurs d'applications et les ingénieurs logiciels, le Varjo XR-4 change radicalement la donne :
        Zéro Compromis Graphique : Les développeurs testent leurs environnements 3D en taille réelle avec des textures et des éclairages ultra-réalistes.
        Optimisation par le Regard : Le suivi oculaire permet d'intégrer le rendu fovéal, une technique qui concentre la puissance de calcul là où l'utilisateur regarde.
        Productivité Multi-Écrans : Il remplace un setup physique complexe par une infinité d'écrans virtuels haute résolution dans un espace de travail virtuel.
        Face au manque d'infrastructures de pointe, le XR-4 permet de former les chirurgiens...`,
    logo: "/images/logo.png",
    images: ["/news/news3.jpg","/news/news4.jpg"],
    isVideo: true,
    avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
    overlay: "bg-brand-dark/85",
    auteur: 'Cheik Hassan Feze'
  },

  {
    title: "Afroza Solidarity",
    date: "22-05-2026",
    text:
      "Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.",
    logo: "/news/projects/logo_as.png",
    images: ["/news/news1.jpg"],
    isVideo: true,
    avatars: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"],
    overlay: "bg-brand-dark/85",
    auteur: 'Fokou Sheryle'
  },
];

export default function News() {
    return(
        <>
            <div className="relative flex h-[70svh] min-h-[30rem] w-full items-center justify-center sm:min-h-[38rem]">
                <div className="relative w-full flex items-center justify-center my-auto bg-transparent h-full overflow-hidden">

                    {/* Coin haut-gauche : copie du dégradé, découpée en forme de coin arrondi
                    <div
                        className="absolute inset-0 z-10 bg-gradient-to-b from-brand to-[#22D51C]"
                        style={{ clipPath: 'inset(0% 75% 75% 0% round 0 0 1rem 0)' }}
                    /> */}

                    {/* Coin bas-droite : idem */}
                    {/* <div
                        className="absolute inset-0 z-10 bg-gradient-to-b from-brand to-[#22D51C]"
                        style={{ clipPath: 'inset(50% 0% 0% 75% round 1rem 0 0 0)' }}
                    /> */}

                    {/* Texte "Projets" positionné indépendamment, pas centré dans tout le bloc */}
                    {/* <p className="absolute z-20 bottom-10 right-10 text-8xl font-bold">Projets</p> */}

                    <Image
                        src="/news/Banner.png"
                        alt=""
                        fill
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute px-4 text-center text-4xl font-bold text-white sm:text-6xl lg:text-8xl">
                        <p>Blog</p>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-center">
            <BlogProjectRow elements={news}/>
            </div>
        </>
    )
}
