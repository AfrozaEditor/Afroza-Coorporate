# Back-office News — mise en route avec Supabase

Le back-office (`/admin`) permet à l'équipe de rédiger, programmer et publier les
news du site, ou de repartager un post de la chaîne WhatsApp. Supabase fournit
l'authentification, la base de données et le stockage des images, en attendant
un serveur dédié.

| Écran | Adresse |
| --- | --- |
| Connexion | `/admin/login` |
| Liste des news | `/admin/news` |
| Rédiger une news | `/admin/news/new` |
| Modifier une news | `/admin/news/<id>` |
| Repartager un post WhatsApp | `/admin/news/import` |
| Aperçu avant publication | `/admin/apercu/<id>` |
| Article public | `/news/<lien>` |

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), créez un projet (région conseillée :
   `eu-west` / Paris ou Francfort, la plus proche du Cameroun).
2. **SQL Editor** › collez puis exécutez
   `supabase/migrations/20261011120000_backoffice_news.sql`.
   Il crée les tables `editors`, `news`, `news_pending`, `login_failures`, les
   règles d'accès (RLS) et le bucket d'images `news-images`.
3. *(Facultatif)* exécutez `supabase/seed.sql` pour importer les news déjà
   présentes sur le site.

Avec la CLI Supabase, l'équivalent est `supabase link` puis `supabase db push`.

## 2. Régler l'authentification

Dans **Authentication** :

- **Sign In / Providers › Email** : laissez *Email* activé et **désactivez
  « Allow new users to sign up »**. Les comptes sont créés uniquement par
  l'administrateur.
- **URL Configuration** :
  - *Site URL* : `https://afroza-editor.tech`
  - *Redirect URLs* : ajoutez `https://afroza-editor.tech/admin/auth/confirm`
    et `http://localhost:3000/admin/auth/confirm`.
- **Emails › Reset Password** *(conseillé)* : pour que le lien fonctionne même
  s'il est ouvert sur un autre appareil, remplacez le lien du modèle par :

  ```html
  <a href="{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/nouveau-mot-de-passe">Choisir un nouveau mot de passe</a>
  ```

- **Rate Limits** : les valeurs par défaut conviennent. Le blocage « 5 essais
  infructueux = 15 minutes » est géré par le back-office (table
  `login_failures`), en plus des limites de Supabase.
- Pour la production, configurez un **SMTP** (Project Settings › Authentication
  › SMTP) : le service d'e-mails intégré de Supabase est limité à quelques
  envois par heure.

## 3. Créer les comptes de l'équipe

Pour chaque membre :

1. **Authentication › Users › Add user › Create new user** : e-mail + mot de
   passe provisoire, cochez *Auto Confirm User*.
2. Donnez-lui l'accès au back-office (SQL Editor) :

   ```sql
   insert into public.editors (user_id, full_name, job_title)
   select id, 'Jedidia Kamdem Souop', 'CTO · Éditeur'
   from auth.users
   where email = 'jedidia@afroza-editor.tech';
   ```

Un compte absent de `editors` ne peut ni se connecter au back-office ni
modifier les données, même avec un mot de passe valide. Pour retirer l'accès :
`delete from public.editors where user_id = '…';`

Le membre peut ensuite changer son mot de passe via « Mot de passe oublié ? ».

## 4. Variables d'environnement

Copiez `.env.example` en `.env.local` pour le développement, et renseignez les
mêmes variables dans Vercel (**Settings › Environment Variables**, environnement
*Production*) :

| Variable | Où la trouver |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings › API › Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings › API Keys › *publishable* (ou l'ancienne clé `anon`) |
| `NEXT_PUBLIC_SITE_URL` | `https://afroza-editor.tech` |
| `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` | Lien d'invitation de la chaîne WhatsApp |

Aucune clé secrète (`service_role`) n'est nécessaire : toutes les écritures
passent par la session de l'éditeur et sont contrôlées par les règles RLS.
Redéployez après avoir ajouté les variables.

Tant que ces variables sont absentes, le site public affiche le contenu
historique (`src/data/news.ts`) et le back-office indique que Supabase n'est
pas configuré.

## Fonctionnement

- **Statuts** : *Brouillon* (invisible sur le site), *Publiée*, *Programmée*.
  Une news programmée devient visible d'elle-même à sa date (heure de Yaoundé) :
  aucune tâche planifiée n'est nécessaire, les pages publiques se rafraîchissent
  toutes les 60 secondes et immédiatement après chaque publication.
- **Enregistrement automatique** : un brouillon est enregistré au fil de la
  saisie. Sur une news déjà en ligne, les modifications sont gardées dans
  `news_pending` (« modifications non publiées ») et ne remplacent la version
  du site qu'au clic sur **Mettre à jour**.
- **Mettre à la une** : les 3 news à la une les plus récentes alimentent le bloc
  « Projets réalisés » de l'accueil.
- **Images** : JPG, PNG ou WebP, 5 Mo maximum, envoyées dans le bucket public
  `news-images`. Les images d'une news sont supprimées avec elle.

## Passer plus tard à un vrai serveur

Toute la lecture des données est regroupée dans `src/lib/news/queries.ts` et
toutes les écritures dans `src/app/admin/_actions/news.ts` (Server Actions).
Pour migrer vers une API maison, il suffit de réécrire ces deux fichiers (et
`src/lib/news/storage.ts` pour l'envoi d'images) ; les écrans du back-office ne
changent pas. Les données s'exportent depuis Supabase (Database › Backups, ou
`pg_dump`).
