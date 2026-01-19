-- Add full_name to profiles
alter table public.profiles add column if not exists full_name text;

-- Update handle_new_user to capture full_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name, is_blocked)
  values (
    new.id, 
    new.email, 
    'user', 
    new.raw_user_meta_data->>'full_name',
    false
  );
  return new;
end;
$$;

-- Create tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  is_completed boolean default false,
  user_id uuid references public.profiles(id) on delete cascade not null
);

-- Enable RLS for tasks
alter table public.tasks enable row level security;

-- Policies for tasks
create policy "Users can do everything on their own tasks"
  on public.tasks
  for all
  using ( auth.uid() = user_id );

-- Admin policies (optional, but good for management)
create policy "Admins can view all tasks"
  on public.tasks
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Update: Add description and summary for summarization feature
alter table public.tasks add column if not exists description text;
alter table public.tasks add column if not exists summary text;
