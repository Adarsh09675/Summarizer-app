-- Add is_blocked to profiles
alter table public.profiles add column if not exists is_blocked boolean default false;

-- Create articles table
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  summary text,
  user_id uuid references public.profiles(id) on delete set null
);

-- Enable RLS
alter table public.articles enable row level security;

-- Policies for Articles

-- Admins can do everything
create policy "Admins can do everything on articles"
  on public.articles
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can view assigned articles
create policy "Users can view assigned articles"
  on public.articles
  for select
  using (
    auth.uid() = user_id
  );

-- Policies for Profiles (Admins need to update is_blocked)

create policy "Admins can update any profile"
  on public.profiles
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
