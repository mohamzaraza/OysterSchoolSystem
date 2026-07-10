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
  receipt_url text,
  program text not null default 'leadership_workshop',
  category text,
  fee integer,
  status text not null default 'registered'
);

-- If the table already exists, add the newer columns.
alter table public.workshop_registrations
  add column if not exists receipt_url text;
alter table public.workshop_registrations
  add column if not exists program text not null default 'leadership_workshop';
alter table public.workshop_registrations
  add column if not exists category text;
alter table public.workshop_registrations
  add column if not exists fee integer;

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

-- ---------------------------------------------------------------------------
-- Storage bucket for EasyPaisa payment receipts
-- ---------------------------------------------------------------------------

-- Public bucket so admins can open receipt links directly.
insert into storage.buckets (id, name, public)
values ('workshop-receipts', 'workshop-receipts', true)
on conflict (id) do nothing;

-- Anyone can upload their payment receipt during registration.
create policy "Anyone can upload workshop receipts"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'workshop-receipts');

-- Anyone can read receipts (bucket is public).
create policy "Public can read workshop receipts"
  on storage.objects for select
  using (bucket_id = 'workshop-receipts');
