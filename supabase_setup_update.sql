-- Add full_name column to public.profiles
alter table public.profiles 
add column if not exists full_name text;

-- Update the handle_new_user function to include full_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    'user'
  );
  return new;
end;
$$;
