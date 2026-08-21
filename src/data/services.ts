export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  image: string;
  summary: string;
  description: string;
  points: string[];
  deliverables: string[];
  process: string[];
  benefits: string[];
  tools: string[];
  timeline: string;
  startingPrice: string;
};

export const services: Service[] = [
  {
    slug: "developpement-web-mobile",
    title: "Developpement Web & Mobile",
    shortTitle: "Web & Mobile",
    category: "Ingenierie produit",
    image: "/images/services/service1.jpg",
    summary:
      "Sites vitrines, plateformes web, applications mobiles multiplateformes et outils internes sur mesure.",
    description:
      "Nous concevons des produits digitaux fiables, maintenables et adaptes aux usages reels: site vitrine, application metier, plateforme SaaS, application mobile ou interface d'administration.",
    points: [
      "Sites vitrines professionnels et plateformes web",
      "Applications mobiles iOS / Android",
      "Applications de bureau et outils internes",
    ],
    deliverables: [
      "Architecture technique et base de code",
      "Interfaces responsives et parcours utilisateur",
      "API, base de donnees et integrations",
      "Documentation de prise en main",
      "Mise en production accompagnee",
    ],
    process: [
      "Cadrage fonctionnel et priorisation",
      "Maquettes et prototype des ecrans cles",
      "Developpement par lots courts",
      "Tests, recette et deploiement",
    ],
    benefits: [
      "Un produit adapte a vos objectifs business",
      "Une base technique evolutive",
      "Une experience utilisable sur mobile et desktop",
    ],
    tools: ["Next.js", "React", "TypeScript", "Laravel", "PostgreSQL", "Docker"],
    timeline: "3 a 10 semaines selon le perimetre",
    startingPrice: "Sur devis",
  },
  {
    slug: "conception-ui-ux-design-visuel",
    title: "Conception UI/UX & Design Visuel",
    shortTitle: "UI/UX & Design",
    category: "Design digital",
    image: "/images/services/service2.jpg",
    summary:
      "Design d'interfaces, maquettes, prototypage, creation graphique, motion design et supports visuels.",
    description:
      "Nous transformons une idee ou un besoin metier en experience claire: structure des pages, parcours utilisateur, direction visuelle, composants et supports de communication.",
    points: [
      "Design d'interfaces et experience utilisateur",
      "Maquettes et prototypage interactif",
      "Creation graphique pour supports print et digitaux",
    ],
    deliverables: [
      "Audit UX et recommandations",
      "Wireframes et maquettes haute fidelite",
      "Prototype interactif",
      "Mini design system",
      "Assets graphiques prets a l'usage",
    ],
    process: [
      "Analyse des utilisateurs et objectifs",
      "Organisation des contenus et parcours",
      "Creation visuelle et iterations",
      "Transmission aux equipes techniques",
    ],
    benefits: [
      "Des interfaces plus lisibles",
      "Un rendu coherent avec votre marque",
      "Moins d'ambiguites avant le developpement",
    ],
    tools: ["Figma", "Canva", "Illustrator", "After Effects", "Design system"],
    timeline: "1 a 5 semaines selon les livrables",
    startingPrice: "Sur devis",
  },
  {
    slug: "contenu-marketing-digital",
    title: "Contenu & Marketing Digital",
    shortTitle: "Marketing Digital",
    category: "Croissance",
    image: "/images/services/service3.jpg",
    summary:
      "Strategie de communication, social media management, publicite digitale et contenu photo, video ou animation.",
    description:
      "Nous aidons votre marque a clarifier son message, produire des contenus utiles et deployer des campagnes coherentes sur les canaux digitaux pertinents.",
    points: [
      "Strategie de communication digitale",
      "Gestion des reseaux sociaux",
      "Campagnes publicitaires en ligne",
    ],
    deliverables: [
      "Plan editorial et calendrier de publication",
      "Creation de contenus textes, visuels et videos",
      "Parametrage et suivi de campagnes",
      "Reporting de performance",
      "Recommandations d'optimisation",
    ],
    process: [
      "Diagnostic de presence digitale",
      "Definition du message et des audiences",
      "Production et publication des contenus",
      "Mesure, analyse et ajustements",
    ],
    benefits: [
      "Une presence plus reguliere",
      "Des messages mieux alignes avec vos offres",
      "Un suivi concret des performances",
    ],
    tools: ["Meta Business", "Google Ads", "Canva", "CapCut", "Analytics"],
    timeline: "Accompagnement mensuel ou campagne ponctuelle",
    startingPrice: "Sur devis",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
