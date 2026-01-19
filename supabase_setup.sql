-- Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  role text default 'user',
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

-- Trigger the function every time a user is created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Admin Panel Schema Updates

-- Add is_blocked to profiles (if running fresh)
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

alter table public.articles enable row level security;

create policy "Admins can do everything on articles"
  on public.articles
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can view assigned articles"
  on public.articles
  for select
  using (
    auth.uid() = user_id
  );

create policy "Admins can update any profile"
  on public.profiles
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
