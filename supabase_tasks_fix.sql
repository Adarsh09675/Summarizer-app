
-- Robust fix for the tasks table
-- 1. Create table if it doesn't exist (with all columns)
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text, 
  summary text,
  is_completed boolean default false,
  user_id uuid references auth.users not null
);

-- 2. Add description column if it's missing (for existing tables)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'tasks' and column_name = 'description') then
    alter table public.tasks add column description text;
  end if;
end $$;

-- 3. Ensure RLS is enabled
alter table public.tasks enable row level security;

-- 4. Re-apply policies (dropping existing ones to avoid conflicts or just using IF NOT EXISTS logic implicitly by separate statements usually)
-- Dropping first to be safe and ensure clean state
drop policy if exists "Users can view their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

create policy "Users can view their own tasks"
  on public.tasks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tasks"
  on public.tasks for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using ( auth.uid() = user_id );
