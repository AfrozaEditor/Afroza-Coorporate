export type TeamSocial = {
  id: string;
  name: string;
  href: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  headline: string;
  bio: string;
  location: string;
  focus: string[];
  skills: string[];
  highlights: string[];
  socials: TeamSocial[];
};

const defaultSocials: TeamSocial[] = [
  { id: "linkedin", name: "LinkedIn", href: "https://linkedin.com/in/votreprofil" },
  { id: "facebook", name: "Facebook", href: "https://facebook.com/votrepage" },
  { id: "github", name: "Github", href: "https://github.com/AfrozaEditor" },
];

export const teamMembers: TeamMember[] = [
  {
    slug: "karel-ondo",
    name: "Karel Ondo",
    role: "CEO",
    photo: "/images/team/team1.jpg",
    headline: "Vision produit, stratégie et développement commercial.",
    bio:
      "Karel pilote la vision d'Afroza Editor et transforme les besoins clients en feuilles de route concrètes. Il coordonne les priorités business, les partenariats et la qualité de l'expérience livrée.",
    location: "Yaoundé, Cameroun",
    focus: ["Stratégie digitale", "Pilotage produit", "Partenariats"],
    skills: ["Leadership", "Business development", "Analyse marché", "Gestion de projet"],
    highlights: [
      "Structure la vision long terme d'Afroza Editor.",
      "Accompagne les clients de l'idée à la mise en production.",
      "Aligne les équipes autour d'objectifs mesurables.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "fokou-sheryle",
    name: "Fokou Sheryle",
    role: "COO",
    photo: "/images/team/team2.jpg",
    headline: "Organisation, opérations et excellence de livraison.",
    bio:
      "Sheryle veille à la fluidité des opérations et à la bonne coordination des projets. Elle sécurise les délais, les échanges clients et la progression de chaque chantier.",
    location: "Yaoundé, Cameroun",
    focus: ["Opérations", "Suivi client", "Qualité de livraison"],
    skills: ["Coordination", "Process", "Communication", "Planification"],
    highlights: [
      "Met en place des routines de suivi claires.",
      "Fluidifie la relation entre les clients et l'équipe technique.",
      "Maintient le niveau d'exigence sur les livrables.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "jedidia-kamdem-souop",
    name: "Jedidia Kamdem Souop",
    role: "CTO",
    photo: "/images/team/team4.jpeg",
    headline: "Architecture technique, développement et choix technologiques.",
    bio:
      "Jedidia conçoit les architectures techniques et encadre les décisions d'ingénierie. Son rôle consiste à choisir les bons outils, garder le code maintenable et transformer les maquettes en produits robustes.",
    location: "Yaoundé, Cameroun",
    focus: ["Architecture logicielle", "Web & mobile", "Industrialisation"],
    skills: ["Next.js", "React", "TypeScript", "Backend", "DevOps"],
    highlights: [
      "Définit les standards techniques des projets.",
      "Encadre les choix d'architecture et de stack.",
      "Travaille sur la performance, la sécurité et la maintenabilité.",
    ],
    socials: [
      { id: "linkedin", name: "LinkedIn", href: "https://linkedin.com/in/jedidia-kamdem-souop-ba58753b0/" },
      { id: "github", name: "Github", href: "https://github.com/JedidiaDev" },
      { id: "instagram", name: "Instagram", href: "https://instagram.com/kamdemjedidia" },
      { id: "facebook", name: "Facebook", href: "https://facebook.com/jedidia.kamdem" },
    ],
  },
  {
    slug: "cheik-hassan-feze",
    name: "Cheik Hassan Feze",
    role: "CMO",
    photo: "/images/team/team3.jpg",
    headline: "Communication, acquisition et image de marque.",
    bio:
      "Cheik accompagne les marques dans leur positionnement digital. Il structure les campagnes, les contenus et les messages pour créer une présence claire et mémorable.",
    location: "Yaoundé, Cameroun",
    focus: ["Marketing digital", "Branding", "Contenu"],
    skills: ["Stratégie de marque", "Social media", "Campagnes", "Copywriting"],
    highlights: [
      "Conçoit des stratégies de communication adaptées au marché local.",
      "Coordonne les contenus créatifs et les campagnes.",
      "Aide les clients à clarifier leur promesse de marque.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "bell-aqil",
    name: "Bell Aqil",
    role: "DevOps / Lead Backend",
    photo: "/images/team/team5.jpg",
    headline: "Infrastructure, déploiement et fiabilité des services.",
    bio:
      "Bell intervient sur la mise en production, l'automatisation et la stabilité des plateformes. Il aide l'équipe à livrer plus vite sans perdre le contrôle opérationnel.",
    location: "Yaoundé, Cameroun",
    focus: ["Déploiement", "Automatisation", "Monitoring"],
    skills: ["Docker", "CI/CD", "Linux", "Cloud", "PostgreSQL"],
    highlights: [
      "Prépare les environnements de développement et production.",
      "Automatise les tâches répétitives de livraison.",
      "Surveille la disponibilité et la performance des services.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "jires-nana",
    name: "Jires Nana",
    role: "Data / IA Analyst",
    photo: "/images/team/team6.jpg",
    headline: "Analyse de données, automatisation et intelligence artificielle.",
    bio:
      "Jires transforme les données en informations utiles pour les décisions produit et business. Il explore les usages IA pertinents et les automatisations qui réduisent les tâches manuelles.",
    location: "Yaoundé, Cameroun",
    focus: ["Data analysis", "IA appliquée", "Automatisation"],
    skills: ["Python", "Analyse", "Tableaux de bord", "Prompting", "Recherche"],
    highlights: [
      "Identifie les indicateurs qui comptent pour les clients.",
      "Prototype des assistants et workflows augmentés par l'IA.",
      "Produit des analyses lisibles pour guider l'action.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "simo-menelik",
    name: "Simo Menelik",
    role: "Dev Backend",
    photo: "/images/team/team7.jpeg",
    headline: "APIs, logique métier et sécurité serveur.",
    bio:
      "Simo construit les fondations backend des produits Afroza. Il travaille sur les APIs, la modélisation des données et les intégrations nécessaires aux applications web et mobiles.",
    location: "Yaoundé, Cameroun",
    focus: ["Backend", "APIs", "Bases de données"],
    skills: ["Node.js", "PHP", "PostgreSQL", "Sécurité", "Intégrations"],
    highlights: [
      "Conçoit des APIs propres et évolutives.",
      "Modélise les données selon les besoins métier.",
      "Renforce les bases techniques des plateformes livrées.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "franck-azab",
    name: "Franck Azab",
    role: "Dev Mobile",
    photo: "/images/team/team1.jpg",
    headline: "Applications mobiles et expériences multiplateformes.",
    bio:
      "Franck se concentre sur les interfaces mobiles et l'expérience utilisateur en situation réelle. Il transforme les parcours en écrans fluides, accessibles et pratiques.",
    location: "Yaoundé, Cameroun",
    focus: ["Mobile", "UI implementation", "Expérience utilisateur"],
    skills: ["React Native", "TypeScript", "UI mobile", "Tests", "Performance"],
    highlights: [
      "Développe des parcours mobiles simples à utiliser.",
      "Travaille l'ergonomie des interfaces sur petits écrans.",
      "Optimise les expériences pour les contraintes du terrain.",
    ],
    socials: defaultSocials,
  },
  {
    slug: "melotech",
    name: "Melotech",
    role: "Marketing Digital",
    photo: "/images/team/team9.jpg",
    headline: "Contenus, campagnes et présence digitale au quotidien.",
    bio:
      "Melotech accompagne l'exécution des actions marketing d'Afroza Editor : création de contenus, animation des réseaux et suivi des campagnes. Il traduit la stratégie de marque en actions concrètes sur le terrain digital.",
    location: "Yaoundé, Cameroun",
    focus: ["Contenu digital", "Réseaux sociaux", "Suivi de campagnes"],
    skills: ["Social media", "Création de contenu", "Community management", "Reporting"],
    highlights: [
      "Anime les réseaux sociaux et la présence en ligne de l'équipe.",
      "Produit des contenus alignés avec l'identité de marque.",
      "Suit la performance des campagnes et ajuste les actions.",
    ],
    socials: defaultSocials,
  },
];

export function getTeamMemberBySlug(slug: string) {
  return teamMembers.find((member) => member.slug === slug);
}
