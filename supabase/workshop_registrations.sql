-- Run in Supabase → SQL → New query

create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  designation text not null,
  school_name text not null,
  city text not null,
  phone text not null,
  email text,
  payment_method text not null,
  status text not null default 'registered'
);

alter table public.workshop_registrations enable row level security;

grant insert on public.workshop_registrations to anon, authenticated;
grant select, update, delete on public.workshop_registrations to authenticated;

create policy "Anyone can submit workshop registration"
  on public.workshop_registrations for insert
  with check (true);

create policy "Authenticated users can view workshop registrations"
  on public.workshop_registrations for select
  to authenticated
  using (true);

create policy "Authenticated users can update workshop registrations"
  on public.workshop_registrations for update
  to authenticated
  using (true);

create policy "Authenticated users can delete workshop registrations"
  on public.workshop_registrations for delete
  to authenticated
  using (true);
