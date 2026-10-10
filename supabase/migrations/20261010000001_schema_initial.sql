-- Licences : schéma initial (MVP)
-- Cinq tables : entreprises, abonnements, outils, personnes, licences.
-- Sécurité : chaque entreprise ne voit que ses propres lignes (RLS).

-- ---------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------

create table public.entreprises (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(nom) between 1 and 120),
  proprietaire_id uuid not null references auth.users (id) on delete cascade,
  cree_le timestamptz not null default now()
);

-- Remplie uniquement par le webhook Stripe (clé de service côté serveur).
-- entreprise_id est facultatif : le paiement peut précéder la création du compte.
create table public.abonnements (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid references public.entreprises (id) on delete set null,
  email_client text check (email_client is null or char_length(email_client) <= 254),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'actif', 'impaye', 'resilie')),
  cree_le timestamptz not null default now(),
  mis_a_jour_le timestamptz not null default now()
);

create table public.outils (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid not null references public.entreprises (id) on delete cascade,
  nom text not null check (char_length(nom) between 1 and 120),
  fonction text not null default 'autre' check (char_length(fonction) between 1 and 60),
  cout_annuel numeric(10, 2) not null check (cout_annuel >= 0),
  date_renouvellement date,
  rappel_envoye_le date,
  cree_le timestamptz not null default now()
);

create table public.personnes (
  id uuid primary key default gen_random_uuid(),
  entreprise_id uuid not null references public.entreprises (id) on delete cascade,
  nom text not null check (char_length(nom) between 1 and 120),
  email text check (email is null or char_length(email) <= 254),
  statut text not null default 'actif' check (statut in ('actif', 'parti')),
  date_depart date,
  cree_le timestamptz not null default now()
);

create table public.licences (
  id uuid primary key default gen_random_uuid(),
  outil_id uuid not null references public.outils (id) on delete cascade,
  personne_id uuid references public.personnes (id) on delete set null,
  derniere_utilisation date,
  cree_le timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Index
-- ---------------------------------------------------------------

create index on public.abonnements (entreprise_id);
create index on public.outils (entreprise_id);
create index on public.outils (date_renouvellement);
create index on public.personnes (entreprise_id);
create index on public.licences (outil_id);
create index on public.licences (personne_id);

-- ---------------------------------------------------------------
-- Sécurité (RLS)
-- ---------------------------------------------------------------

create or replace function public.est_mon_entreprise (e uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.entreprises
    where id = e and proprietaire_id = auth.uid()
  );
$$;

revoke all on function public.est_mon_entreprise (uuid) from public;
grant execute on function public.est_mon_entreprise (uuid) to authenticated;

alter table public.entreprises enable row level security;
alter table public.abonnements enable row level security;
alter table public.outils enable row level security;
alter table public.personnes enable row level security;
alter table public.licences enable row level security;

create policy "entreprises : propriétaire seulement"
  on public.entreprises for all to authenticated
  using (proprietaire_id = auth.uid())
  with check (proprietaire_id = auth.uid());

-- Lecture seule pour l'entreprise : aucune écriture possible depuis le navigateur.
create policy "abonnements : lecture par l'entreprise"
  on public.abonnements for select to authenticated
  using (entreprise_id is not null and public.est_mon_entreprise (entreprise_id));

create policy "outils : entreprise seulement"
  on public.outils for all to authenticated
  using (public.est_mon_entreprise (entreprise_id))
  with check (public.est_mon_entreprise (entreprise_id));

create policy "personnes : entreprise seulement"
  on public.personnes for all to authenticated
  using (public.est_mon_entreprise (entreprise_id))
  with check (public.est_mon_entreprise (entreprise_id));

create policy "licences : entreprise seulement"
  on public.licences for all to authenticated
  using (
    exists (
      select 1 from public.outils o
      where o.id = outil_id and public.est_mon_entreprise (o.entreprise_id)
    )
  )
  with check (
    exists (
      select 1 from public.outils o
      where o.id = outil_id and public.est_mon_entreprise (o.entreprise_id)
    )
    and (
      personne_id is null
      or exists (
        select 1
        from public.personnes p
        join public.outils o on o.id = outil_id
        where p.id = personne_id and p.entreprise_id = o.entreprise_id
      )
    )
  );
