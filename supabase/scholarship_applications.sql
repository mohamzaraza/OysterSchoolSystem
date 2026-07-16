-- Run in Supabase → SQL → New query
-- Sets up the scholarship application table, its policies, and the storage
-- bucket used by the public form at /scholarship/apply.

-- ── Table ────────────────────────────────────────────────────────────────────

create table if not exists public.scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scholarship_type text not null,            -- 'basheer_memorial' | 'asif_jah_bahadur' | 'umeed_e_naseem' | 'almas_asif_sole_grant'
  student_name text not null,
  father_name text not null,
  mother_name text not null,
  date_of_birth date,
  grade_applying_for text,
  campus text,
  current_school text,
  guardian_name text not null,
  relationship text not null,
  guardian_phone text not null,
  -- All document columns hold arrays of public URLs (multiple uploads allowed).
  guardian_id_url text[] not null default '{}',
  academic_records text[] not null default '{}',            -- report cards, past 5 years
  death_or_disability_cert_url text[] not null default '{}',
  certificates_url text[] not null default '{}',
  residence_photo_url text[] not null default '{}',
  -- Almas Asif Sole Grant documents
  single_mother_proof_url text[] not null default '{}',     -- divorce certificate / court document
  report_card_url text[] not null default '{}',             -- most recent report card
  additional_documents_url text[] not null default '{}',    -- financial statements, affidavits, etc.
  supporting_documents text[] not null default '{}',        -- any extra documents
  eligibility_description text not null,
  email text not null,
  address text not null,
  status text not null default 'New'
);

alter table public.scholarship_applications enable row level security;

grant insert on public.scholarship_applications to anon, authenticated;
grant select, update, delete on public.scholarship_applications to authenticated;

create policy "Anyone can submit a scholarship application"
  on public.scholarship_applications for insert
  with check (true);

create policy "Authenticated users can view scholarship applications"
  on public.scholarship_applications for select
  to authenticated
  using (true);

create policy "Authenticated users can update scholarship applications"
  on public.scholarship_applications for update
  to authenticated
  using (true);

create policy "Authenticated users can delete scholarship applications"
  on public.scholarship_applications for delete
  to authenticated
  using (true);

-- ── Storage bucket ───────────────────────────────────────────────────────────
-- Public bucket so admins can open uploaded documents via their public URL.

insert into storage.buckets (id, name, public)
values ('scholarship-documents', 'scholarship-documents', true)
on conflict (id) do nothing;

create policy "Anyone can upload scholarship documents"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'scholarship-documents');

create policy "Anyone can read scholarship documents"
  on storage.objects for select
  using (bucket_id = 'scholarship-documents');
