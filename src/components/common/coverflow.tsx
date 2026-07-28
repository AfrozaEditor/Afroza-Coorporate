import React, { useState } from "react";

const cards = [
  { id: 1, title: "Développement", image: "/features/projects/R23.png" },
  { id: 2, title: "Business", image: "/features/projects/R23.png" },
  { id: 3, title: "Design", image: "/features/projects/R23.png" },
  { id: 4, title: "Data & IA", image: "/features/projects/R23.png" },
  { id: 5, title: "Marketing", image: "/features/projects/R23.png" },
];

const CARD_HEIGHT_REM = 38;
// Écart entre les cartes (en vw). Mets 0 si tu veux qu'elles se touchent.
const GAP_VW = 1;
// Les cartes d'extrémité sont EDGE_WIDTH_FACTOR fois plus larges que les
// cartes normales (1.5 = 50% plus large).
const EDGE_WIDTH_FACTOR = 1.5;

// Paramètres du masque elliptique (haut et bas). À ajuster à l'œil :
// - width/height en % : taille de l'ellipse par rapport au conteneur
// - posY en % : position verticale du centre de l'ellipse (0% = haut, 100% = bas)
// - fadeStart / fadeEnd en % : où commence/finit la transition transparent → opaque
const MASK_ELLIPSE_WIDTH = 80; // %
const MASK_ELLIPSE_HEIGHT = 40; // %
const MASK_TOP_POS_Y = 6; // %
const MASK_BOTTOM_POS_Y = 94; // %
const MASK_FADE_START = 68; // %
const MASK_FADE_END = 62; // %

const maskImage = `
  radial-gradient(ellipse ${MASK_ELLIPSE_WIDTH}% ${MASK_ELLIPSE_HEIGHT}% at 50% ${MASK_TOP_POS_Y}%, transparent ${MASK_FADE_START}%, black ${MASK_FADE_END}%),
  radial-gradient(ellipse ${MASK_ELLIPSE_WIDTH}% ${MASK_ELLIPSE_HEIGHT}% at 50% ${MASK_BOTTOM_POS_Y}%, transparent ${MASK_FADE_START}%, black ${MASK_FADE_END}%)
`;

export default function CoverflowDemo() {
  const [active, setActive] = useState(2);
  const maxOffset = Math.floor(cards.length / 2);

  // --- Calcul des largeurs et positions, carte par carte ---
  // 1. Chaque carte reçoit un "poids" : 1 pour les cartes normales,
  //    EDGE_WIDTH_FACTOR pour les deux cartes d'extrémité (offset = ±maxOffset).
  const weights = cards.map((_, i) => {
    const offset = i - active;
    return Math.abs(offset) === maxOffset ? EDGE_WIDTH_FACTOR : 1;
  });

  // 2. On distribue 100vw (moins les espaces entre cartes) proportionnellement
  //    aux poids, pour que la somme des largeurs + espaces fasse EXACTEMENT
  //    100vw → les bords des cartes d'extrémité touchent pile 0vw et 100vw.
  const totalGap = GAP_VW * (cards.length - 1);
  const availableVW = 100 - totalGap;
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  const unit = availableVW / sumWeights;
  const widths = weights.map((w) => w * unit); // largeur de chaque carte en vw

  // 3. On place les cartes les unes après les autres (cumul des largeurs +
  //    espaces), pour obtenir le centre de chaque carte en vw depuis la
  //    gauche de l'écran.
  const centers: number[] = [];
  let cursor = 0;
  widths.forEach((w) => {
    centers.push(cursor + w / 2);
    cursor += w + GAP_VW;
  });

  return (
    <div className="w-full min-h-[720px] bg-white flex flex-col items-center justify-center gap-10 py-10">
      <p className="font-bold text-3xl">Catégories</p>
      <div className="flex gap-8">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActive(i)}
            className={`text-sm transition-all ${
              i === active
                ? "text-black font-semibold border-b-2 border-black pb-1"
                : "text-gray-300 hover:text-gray-500"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* w-full explicite ici : c'est CE conteneur qui doit occuper toute
          la largeur, indépendamment de tout ce qu'il y a à l'intérieur. */}
      <div
        className="relative w-full h-[42rem] flex items-center justify-center overflow-hidden"
        style={{ perspective: "1920px" }}
      >
        {/* Le mask-image est appliqué directement sur la couche qui contient
            les cartes. C'est un vrai masque alpha : les zones "transparent"
            du gradient suppriment réellement les pixels, peu importe le
            rendu 3D des enfants (transform/perspective) — contrairement à
            un overflow+border-radius, qui peut mal se comporter avec des
            enfants transformés en 3D sur certains navigateurs. */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          {cards.map((c, i) => {
            const offset = i - active;
            const isCenter = offset === 0;
            const isEdge = Math.abs(offset) === maxOffset;

            const rotateY = offset * -35;
            // translateX = distance entre le centre de CETTE carte et le
            // centre de l'écran (50vw) — puisque la position de départ
            // (avant transform) est déjà centrée par le flex parent.
            const translateX = `${centers[i] - 50}vw`;
            const translateZ = isCenter ? 0 : -260;
            // Les cartes d'extrémité ne sont plus rétrécies (scale: 1) :
            // leur "grandeur" vient maintenant de leur largeur réelle,
            // pas d'un effet de scale qui les aurait re-diminuées.
            const scale = isCenter || isEdge ? 1 : 0.85;
            const opacity = Math.abs(offset) > maxOffset ? 0 : 1;

            return (
              <div
                key={c.id}
                onClick={() => setActive(i)}
                className="absolute rounded-2xl shadow-2xl
                           cursor-pointer transition-all duration-500 ease-out
                           flex items-end p-6"
                style={{
                  width: `${widths[i]}vw`,
                  height: `${CARD_HEIGHT_REM}rem`,
                  backgroundImage: `url(${c.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: `translateX(${translateX}) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: 10 - Math.abs(offset),
                  opacity,
                }}
              >
                <span className="text-white text-base font-medium">{c.title}</span>
              </div>
            );
          })}
        </div>
        {/* Les anciennes div MASK_COLOR (peinture par-dessus) ont été
            retirées : le mask-image ci-dessus fait un vrai découpage alpha,
            indépendant de la couleur de fond réelle de la page. */}
      </div>

      <h3 className="text-lg font-medium text-gray-700">Détails</h3>
    </div>
  );
}