-- Enable full access for Admins on tasks table
create policy "Admins can do everything on tasks"
  on public.tasks
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Note: We already have 'Users can do everything on their own tasks' which covers user access.
-- We also previously added 'Admins can view all tasks' which this new policy supersedes/extends.
-- Supabase policies are additive (multiple permissive policies = OR condition).
-- So simply adding this 'for all' policy grants the new permissions without needing to drop the old one.
