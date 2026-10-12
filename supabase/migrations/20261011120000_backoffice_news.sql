-- =============================================================================
-- Back-office Afroza Editor — gestion des news
-- À exécuter une seule fois (SQL Editor de Supabase ou `supabase db push`).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Éditeurs : seuls les comptes présents dans cette table accèdent au
--    back-office. Les lignes sont ajoutées par l'administrateur (dashboard).
-- -----------------------------------------------------------------------------
create table public.editors (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,
  job_title  text not null default 'Éditeur',
  created_at timestamptz not null default now()
);

alter table public.editors enable row level security;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.editors where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_editor() from public, anon;
grant execute on function public.is_editor() to authenticated;

create policy "editors_read" on public.editors
  for select to authenticated
  using ((select public.is_editor()));

revoke all on public.editors from anon;
revoke insert, update, delete on public.editors from authenticated;

-- -----------------------------------------------------------------------------
-- 2. News
-- -----------------------------------------------------------------------------
create table public.news (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique
                     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title              text not null check (char_length(title) between 1 and 90),
  excerpt            text not null default '' check (char_length(excerpt) <= 160),
  content            text not null default '',
  cover_url          text,
  category           text not null default 'Développement'
                     check (category in ('Développement', 'Business', 'Design', 'Data & IA', 'Marketing')),
  source             text not null default 'written' check (source in ('written', 'whatsapp')),
  status             text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  -- Date affichée sur le site. Pour une news programmée : date de mise en ligne.
  published_at       timestamptz,
  featured           boolean not null default false,
  author_name        text not null default '',
  keywords           text[] not null default '{}',
  whatsapp_url       text,
  whatsapp_posted_on date,
  whatsapp_cta       boolean not null default true,
  created_by         uuid references auth.users (id) on delete set null default auth.uid(),
  updated_by         uuid references auth.users (id) on delete set null default auth.uid(),
  updated_by_name    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint news_dated_when_public check (status = 'draft' or published_at is not null)
);

create index news_public_idx on public.news (published_at desc)
  where status in ('published', 'scheduled');

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger news_touch_updated_at
  before update on public.news
  for each row execute function public.touch_updated_at();

alter table public.news enable row level security;

-- Le site public ne voit que les news en ligne. Une news programmée devient
-- visible d'elle-même à sa date : aucune tâche planifiée n'est nécessaire.
create policy "news_public_read" on public.news
  for select to anon, authenticated
  using (status in ('published', 'scheduled') and published_at <= now());

create policy "news_editor_read" on public.news
  for select to authenticated
  using ((select public.is_editor()));

create policy "news_editor_insert" on public.news
  for insert to authenticated
  with check ((select public.is_editor()));

create policy "news_editor_update" on public.news
  for update to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

create policy "news_editor_delete" on public.news
  for delete to authenticated
  using ((select public.is_editor()));

revoke insert, update, delete on public.news from anon;

-- -----------------------------------------------------------------------------
-- 3. Modifications non publiées d'une news déjà en ligne (enregistrement
--    automatique). Elles remplacent la version du site au clic sur
--    « Mettre à jour ». Table séparée pour ne jamais les exposer au public.
-- -----------------------------------------------------------------------------
create table public.news_pending (
  news_id         uuid primary key references public.news (id) on delete cascade,
  data            jsonb not null,
  updated_by      uuid references auth.users (id) on delete set null default auth.uid(),
  updated_by_name text,
  updated_at      timestamptz not null default now()
);

create trigger news_pending_touch_updated_at
  before update on public.news_pending
  for each row execute function public.touch_updated_at();

alter table public.news_pending enable row level security;

create policy "news_pending_editor_all" on public.news_pending
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

revoke all on public.news_pending from anon;

-- -----------------------------------------------------------------------------
-- 4. Images (couvertures, images d'articles, images WhatsApp)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('news-images', 'news-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lecture via l'API (nécessaire pour supprimer ou remplacer un fichier).
-- L'affichage public passe par l'URL publique du bucket, sans RLS.
create policy "news_images_editor_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'news-images' and (select public.is_editor()));

create policy "news_images_editor_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'news-images' and (select public.is_editor()));

create policy "news_images_editor_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'news-images' and (select public.is_editor()));

create policy "news_images_editor_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'news-images' and (select public.is_editor()));

-- -----------------------------------------------------------------------------
-- 5. Blocage de la connexion : 5 essais infructueux en 15 minutes bloquent
--    l'adresse e-mail pendant 15 minutes après le dernier essai.
--    La table n'est accessible qu'au travers des fonctions ci-dessous.
-- -----------------------------------------------------------------------------
create table public.login_failures (
  id        bigint generated always as identity primary key,
  email     text not null,
  failed_at timestamptz not null default now()
);

create index login_failures_email_idx on public.login_failures (email, failed_at desc);

alter table public.login_failures enable row level security;
revoke all on public.login_failures from anon, authenticated;

-- Secondes restantes avant de pouvoir réessayer (0 = connexion autorisée).
create or replace function public.login_lock_seconds(p_email text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  with recent as (
    select failed_at
    from public.login_failures
    where email = lower(trim(p_email))
      and failed_at > now() - interval '30 minutes'
    order by failed_at desc
    limit 5
  )
  select case
    when count(*) = 5
      and max(failed_at) - min(failed_at) <= interval '15 minutes'
      and max(failed_at) + interval '15 minutes' > now()
    then ceil(extract(epoch from (max(failed_at) + interval '15 minutes' - now())))::integer
    else 0
  end
  from recent;
$$;

-- Enregistre un échec et renvoie { lock_seconds, remaining }.
create or replace function public.login_register_failure(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_recent integer;
begin
  if v_email = '' or char_length(v_email) > 320 then
    return jsonb_build_object('lock_seconds', 0, 'remaining', 5);
  end if;

  delete from public.login_failures where failed_at < now() - interval '1 day';
  insert into public.login_failures (email) values (v_email);

  select count(*) into v_recent
  from public.login_failures
  where email = v_email and failed_at > now() - interval '15 minutes';

  return jsonb_build_object(
    'lock_seconds', public.login_lock_seconds(v_email),
    'remaining', greatest(0, 5 - v_recent)
  );
end;
$$;

-- Efface les échecs de l'utilisateur connecté (appelée après une connexion réussie).
create or replace function public.login_clear_failures()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.login_failures
  where email = lower((select auth.jwt()) ->> 'email');
$$;

revoke all on function public.login_lock_seconds(text) from public;
revoke all on function public.login_register_failure(text) from public;
revoke all on function public.login_clear_failures() from public, anon;
grant execute on function public.login_lock_seconds(text) to anon, authenticated;
grant execute on function public.login_register_failure(text) to anon, authenticated;
grant execute on function public.login_clear_failures() to authenticated;
