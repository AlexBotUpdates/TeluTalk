import type { UserProgress } from "@/types/course";
import { supabase } from "@/lib/supabaseClient";

export const defaultProgress: UserProgress = {
  currentDay: 1,
  xp: 0,
  streak: 0,
  lastSessionDate: null,
  completedLessons: [],
  phrasesMastered: 0,
};

type ProgressRow = {
  user_id: string;
  current_day: number;
  xp: number;
  streak: number;
  last_session_date: string | null;
  completed_lessons: number[]; // int[] in Postgres
  phrases_mastered: number;
  updated_at?: string;
};

function fromRow(row: ProgressRow): UserProgress {
  return {
    currentDay: row.current_day,
    xp: row.xp,
    streak: row.streak,
    lastSessionDate: row.last_session_date,
    completedLessons: row.completed_lessons ?? [],
    phrasesMastered: row.phrases_mastered,
  };
}

function toRow(userId: string, p: UserProgress): Omit<ProgressRow, "updated_at"> {
  return {
    user_id: userId,
    current_day: p.currentDay,
    xp: p.xp,
    streak: p.streak,
    last_session_date: p.lastSessionDate,
    completed_lessons: p.completedLessons,
    phrases_mastered: p.phrasesMastered,
  };
}

export async function loadOrCreateProgress(userId: string): Promise<UserProgress> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return fromRow(data as ProgressRow);

  const { data: inserted, error: insertError } = await supabase
    .from("user_progress")
    .insert([toRow(userId, defaultProgress)])
    .select("*")
    .single();

  if (insertError) throw insertError;
  return fromRow(inserted as ProgressRow);
}

export async function saveProgress(userId: string, p: UserProgress): Promise<UserProgress> {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(toRow(userId, p), { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as ProgressRow);
}

