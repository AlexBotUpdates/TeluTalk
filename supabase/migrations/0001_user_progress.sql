-- Creates the user_progress table used by the app.
-- Run this in your Supabase project's SQL Editor (or via Supabase CLI migrations).

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_day integer not null default 1,
  xp integer not null default 0,
  streak integer not null default 0,
  last_session_date text null,
  completed_lessons integer[] not null default '{}'::integer[],
  phrases_mastered integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_progress_updated_at on public.user_progress;
create trigger trg_user_progress_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.user_progress enable row level security;

-- Policies: users can only access their own row
drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
on public.user_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
on public.user_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

