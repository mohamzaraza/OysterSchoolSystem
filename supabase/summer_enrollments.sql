-- Run in Supabase → SQL → New query

create table if not exists public.summer_enrollments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  student_name text not null,
  grade text not null,
  parent_name text not null,
  phone text not null,
  email text,
  preferred_campus text not null,
  message text,
  status text not null default 'New'
);

alter table public.summer_enrollments enable row level security;

grant insert on public.summer_enrollments to anon, authenticated;
grant select, update, delete on public.summer_enrollments to authenticated;

create policy "Anyone can submit summer enrollment"
  on public.summer_enrollments for insert
  with check (true);

create policy "Authenticated users can view summer enrollments"
  on public.summer_enrollments for select
  to authenticated
  using (true);

create policy "Authenticated users can update summer enrollments"
  on public.summer_enrollments for update
  to authenticated
  using (true);

create policy "Authenticated users can delete summer enrollments"
  on public.summer_enrollments for delete
  to authenticated
  using (true);
