-- Add description and summary columns to tasks
alter table public.tasks add column if not exists description text;
alter table public.tasks add column if not exists summary text;
