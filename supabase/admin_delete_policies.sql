-- Run in Supabase SQL Editor if admin delete buttons do not persist removals.
-- Allows signed-in admins to permanently delete applications and admissions enquiries.

grant delete on public.applications to authenticated;
grant delete on public.admissions to authenticated;

create policy "Authenticated users can delete applications"
  on public.applications for delete
  to authenticated
  using (true);

create policy "Authenticated users can delete admissions"
  on public.admissions for delete
  to authenticated
  using (true);
