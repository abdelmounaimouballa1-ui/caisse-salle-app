-- ═══════════════════════════════════════════════════════════════
-- CAISSE SALLE — Supabase Schema
-- ─ Exécuter dans l'éditeur SQL Supabase (onglet SQL Editor).
-- ─ Activer Email/Password Auth dans Authentication > Providers.
-- ═══════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text        not null default '',
  role         text        not null default 'viewer'
                           check (role in ('admin','viewer')),
  created_at   timestamptz not null default now()
);

create table if not exists public.transactions (
  id             uuid         primary key default gen_random_uuid(),
  date           date         not null default current_date,
  kind           text         not null
                              check (kind in ('income','expense','deposit','withdrawal','opening')),
  label          text         not null,
  category       text         not null default 'Autre',
  payment_method text         not null default 'Cash'
                              check (payment_method in ('Cash','Carte TPE','Virement','Chèque','Autre')),
  amount         numeric(12,2) not null check (amount > 0),
  notes          text         not null default '',
  created_by     uuid         not null references auth.users(id),
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

create table if not exists public.cash_closings (
  id            uuid         primary key default gen_random_uuid(),
  date          date         not null unique,
  expected_cash numeric(12,2) not null,
  actual_cash   numeric(12,2) not null,
  difference    numeric(12,2) not null,
  notes         text         not null default '',
  closed_by     uuid         not null references auth.users(id),
  created_at    timestamptz  not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TRIGGER : met à jour updated_at automatiquement
-- ─────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- INDEX DE PERFORMANCE
-- ─────────────────────────────────────────────────────────────

-- Lecture par date (tri principal du journal)
create index if not exists idx_transactions_date
  on public.transactions (date desc);

-- Lecture par utilisateur créateur
create index if not exists idx_transactions_created_by
  on public.transactions (created_by);

-- Lecture par type d'opération (stats dashboard)
create index if not exists idx_transactions_kind
  on public.transactions (kind);

-- Lecture par mode de paiement (filtres et KPI)
create index if not exists idx_transactions_payment_method
  on public.transactions (payment_method);

-- Index composite pour les calculs de solde cash (filtre le plus fréquent)
create index if not exists idx_transactions_kind_pm
  on public.transactions (kind, payment_method);

-- Clôtures triées par date
create index if not exists idx_closings_date
  on public.cash_closings (date desc);

-- ─────────────────────────────────────────────────────────────
-- HELPER : rôle de l'utilisateur courant
-- ─────────────────────────────────────────────────────────────

create or replace function public.current_user_role()
returns text language sql stable security definer
set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.transactions  enable row level security;
alter table public.cash_closings enable row level security;

-- profiles : lecture de son propre profil + admin voit tous
drop policy if exists "profiles: self read"   on public.profiles;
drop policy if exists "profiles: admin read"  on public.profiles;
create policy "profiles: self read"
  on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "profiles: admin read"
  on public.profiles for select to authenticated
  using (public.current_user_role() = 'admin');

-- transactions : lecture par admin et viewer
drop policy if exists "transactions: read"   on public.transactions;
drop policy if exists "transactions: insert" on public.transactions;
drop policy if exists "transactions: update" on public.transactions;
drop policy if exists "transactions: delete" on public.transactions;
create policy "transactions: read"
  on public.transactions for select to authenticated
  using (public.current_user_role() in ('admin','viewer'));
create policy "transactions: insert"
  on public.transactions for insert to authenticated
  with check (public.current_user_role() = 'admin' and created_by = auth.uid());
create policy "transactions: update"
  on public.transactions for update to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
create policy "transactions: delete"
  on public.transactions for delete to authenticated
  using (public.current_user_role() = 'admin');

-- cash_closings : lecture par admin et viewer, écriture admin seulement
drop policy if exists "closings: read"   on public.cash_closings;
drop policy if exists "closings: manage" on public.cash_closings;
create policy "closings: read"
  on public.cash_closings for select to authenticated
  using (public.current_user_role() in ('admin','viewer'));
create policy "closings: manage"
  on public.cash_closings for all to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin' and closed_by = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- CRÉER LE PREMIER COMPTE ADMIN
-- ─────────────────────────────────────────────────────────────
-- 1. Créez un utilisateur dans Supabase Auth (Authentication > Users > Add user).
-- 2. Copiez son UUID, puis exécutez :
--
--   insert into public.profiles (id, display_name, role)
--   values ('VOTRE-UUID-ICI', 'Votre Nom', 'admin')
--   on conflict (id) do update
--     set display_name = excluded.display_name,
--         role         = excluded.role;
--
-- Pour un compte lecture seule (propriétaire salle) :
--   insert into public.profiles (id, display_name, role)
--   values ('UUID-DU-VIEWER', 'Nom du propriétaire', 'viewer')
--   on conflict (id) do update
--     set display_name = excluded.display_name,
--         role         = excluded.role;
-- ─────────────────────────────────────────────────────────────
