-- =============================================================================
-- News actuellement affichées sur le site, à importer une fois après la
-- migration (SQL Editor). Les images pointent vers /public/news du site.
-- Sans effet sur une news dont le lien (slug) existe déjà.
-- =============================================================================

insert into public.news
  (slug, title, excerpt, content, cover_url, category, source, status, published_at, featured, author_name, updated_by_name)
values
(
  'prototype-final-as-mise-en-circulation',
  'Mise sur pied du prototype final d''AS pour une éventuelle mise en circulation',
  'Console portable rétro, rétro-gaming, console nomade, jeux vidéo vintage… le prototype final d''AS est prêt.',
  $html$<p>Console portable rétro, rétro-gaming, console nomade, jeux vidéo vintage… Depuis plus de 45 ans, les joueurs emportent leurs aventures partout avec eux. Des premiers écrans LCD des années 80 aux consoles portables ultra-puissantes d’aujourd’hui, le jeu vidéo nomade n’a cessé d’évoluer.</p><p><a href="https://afrozamarketplace.app" target="_blank" rel="noopener noreferrer">https://afrozamarketplace.app</a></p>$html$,
  '/news/news1.jpg', 'Développement', 'written', 'published', '2026-06-13 09:00:00+01', true, 'Fokou Sheryle', 'Fokou Sheryle'
),
(
  'varjo-xr-4-impact-pour-les-developpeurs',
  'Varjo XR-4 : quel impact pour les développeurs ?',
  'Pour les créateurs d''applications et les ingénieurs logiciels, le XR-4 change la donne.',
  $html$<p>Pour les créateurs d'applications et les ingénieurs logiciels, le Varjo XR-4 change radicalement la donne :</p><ul><li><p><strong>Zéro compromis graphique :</strong> les développeurs testent leurs environnements 3D en taille réelle avec des textures et des éclairages ultra-réalistes.</p></li><li><p><strong>Optimisation par le regard :</strong> le suivi oculaire permet d'intégrer le rendu fovéal, une technique qui concentre la puissance de calcul là où l'utilisateur regarde.</p></li><li><p><strong>Productivité multi-écrans :</strong> il remplace un setup physique complexe par une infinité d'écrans virtuels haute résolution dans un espace de travail virtuel.</p></li></ul><p>Face au manque d'infrastructures de pointe, le XR-4 permet de former les chirurgiens…</p>$html$,
  '/news/news2.jpg', 'Data & IA', 'written', 'published', '2026-05-22 10:00:00+01', false, 'Karel Ondo', 'Karel Ondo'
),
(
  'afroza-editor-cursor-hackathon',
  'Afroza Editor participant au Cursor Hackathon',
  'Repartagé depuis la chaîne WhatsApp Afroza Editor.',
  $html$<p>Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.</p>$html$,
  '/news/news5.jpg', 'Business', 'whatsapp', 'published', '2026-05-22 09:00:00+01', false, 'Simo Menelik', 'Simo Menelik'
),
(
  'felicitations-afroza-editor',
  'Félicitations AFROZA EDITOR',
  'Repartagé depuis la chaîne WhatsApp Afroza Editor.',
  $html$<p>Pour les créateurs d'applications et les ingénieurs logiciels, le Varjo XR-4 change radicalement la donne.</p><img src="/news/news4.jpg" alt="">$html$,
  '/news/news3.jpg', 'Business', 'whatsapp', 'published', '2026-05-22 08:00:00+01', false, 'Cheik Hassan Feze', 'Cheik Hassan Feze'
),
(
  'afroza-solidarity',
  'Afroza Solidarity',
  'Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.',
  $html$<p>Nous nous engageons à livrer vos projets dans les délais impartis, garantissant ainsi la satisfaction de nos clients.</p>$html$,
  '/news/news1.jpg', 'Business', 'written', 'published', '2026-05-21 09:00:00+01', false, 'Fokou Sheryle', 'Fokou Sheryle'
),
(
  'application-aps-hackathon-id4africa',
  'Construction de l''application APS pour le hackathon ID4Africa',
  'Une solution d''identité numérique conçue et présentée lors du hackathon ID4Africa.',
  $html$<p>Une solution d'identité numérique conçue et présentée lors du hackathon ID4Africa.</p>$html$,
  '/news/news5.jpg', 'Développement', 'written', 'published', '2026-05-20 09:00:00+01', true, 'Jedidia Kamdem Souop', 'Jedidia Kamdem Souop'
),
(
  'refonte-plateforme-e-commerce-client-local',
  'Refonte de la plateforme e-commerce d''un client local',
  'Migration complète, nouvelle UX et performances multipliées pour un commerçant camerounais.',
  $html$<p>Migration complète, nouvelle UX et performances multipliées pour un commerçant camerounais.</p>$html$,
  '/news/news3.jpg', 'Design', 'written', 'published', '2026-04-02 09:00:00+01', true, 'Karel Ondo', 'Karel Ondo'
)
on conflict (slug) do nothing;
