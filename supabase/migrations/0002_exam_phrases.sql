-- Table for final exam phrases (easy / medium / hard).

create table if not exists public.exam_phrases (
  id bigint generated always as identity primary key,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  question_number integer not null,
  telugu text not null,
  pronunciation text not null,
  english text not null,
  sort_order integer not null default 1
);

create index if not exists idx_exam_phrases_difficulty_order
  on public.exam_phrases (difficulty, question_number);

alter table public.exam_phrases enable row level security;

-- Exams are read-only content; allow all authenticated users to read.
drop policy if exists "exam_phrases_read_all" on public.exam_phrases;
create policy "exam_phrases_read_all"
on public.exam_phrases
for select
to authenticated
using (true);

