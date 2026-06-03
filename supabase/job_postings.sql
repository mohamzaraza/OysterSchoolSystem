-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  campus text not null,
  employment_type text not null default 'Full Time',
  description text not null,
  requirements text[] not null default '{}'
);

alter table public.job_postings enable row level security;

create policy "Anyone can view job postings"
  on public.job_postings for select
  using (true);

create policy "Authenticated users can create job postings"
  on public.job_postings for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update job postings"
  on public.job_postings for update
  to authenticated
  using (true);

create policy "Authenticated users can delete job postings"
  on public.job_postings for delete
  to authenticated
  using (true);

-- Seed existing postings (safe to re-run: only inserts when table is empty)
insert into public.job_postings (title, campus, employment_type, description, requirements, created_at)
select * from (values
  (
    'Math & Physics Teacher',
    'High School Campus',
    'Full Time',
    'We are seeking a qualified and enthusiastic Math and Physics teacher to join our High School faculty. The ideal candidate will have a strong academic background and a passion for inspiring students.',
    array[
      'Bachelor''s or Master''s degree in relevant subject',
      'Minimum 2 years teaching experience',
      'Strong communication skills in Urdu and English',
      'Ability to engage and motivate students'
    ]::text[],
    '2026-05-01'::timestamptz
  ),
  (
    'Urdu Language Teacher',
    'Early Years Campus',
    'Full Time',
    'We are looking for an experienced Urdu language teacher for our Early Years campus. The role involves teaching foundational Urdu literacy and language skills to young learners.',
    array[
      'Degree in Urdu Literature or Education',
      'Experience with early years / primary age groups',
      'Patient, nurturing teaching style',
      'Familiarity with modern teaching methods'
    ]::text[],
    '2026-04-01'::timestamptz
  )
) as seed(title, campus, employment_type, description, requirements, created_at)
where not exists (select 1 from public.job_postings limit 1);
