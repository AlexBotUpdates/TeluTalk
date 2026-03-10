import type { DayLesson, Phrase } from "@/types/course";
import { supabase } from "@/lib/supabaseClient";

// Expected table shape (you can adjust names/columns if yours differ):
// table: phrases
// columns: day (int), topic (text), telugu (text), pronunciation (text), english (text), sort_order (int, optional)
type PhraseRow = {
  day: number;
  topic?: string | null;
  telugu: string;
  pronunciation?: string | null;
  english: string;
  sort_order?: number | null;
};

function toPhrase(row: PhraseRow): Phrase {
  return {
    telugu: row.telugu,
    pronunciation: row.pronunciation ?? "",
    english: row.english,
  };
}

export async function fetchAllLessons(): Promise<DayLesson[]> {
  const { data, error } = await supabase
    .from("phrases")
    .select("day, topic, telugu, pronunciation, english, sort_order")
    .order("day", { ascending: true })
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (error) throw error;

  const rows = (data ?? []) as PhraseRow[];
  const byDay = new Map<number, { topic: string; phrases: Phrase[] }>();

  for (const row of rows) {
    const existing = byDay.get(row.day);
    const topic = (row.topic ?? "").trim() || `Day ${row.day}`;
    if (!existing) {
      byDay.set(row.day, { topic, phrases: [toPhrase(row)] });
    } else {
      // Prefer the first non-empty topic seen for this day
      if (!existing.topic || existing.topic.startsWith("Day ")) {
        existing.topic = topic;
      }
      existing.phrases.push(toPhrase(row));
    }
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, v]) => ({ day, topic: v.topic, phrases: v.phrases }));
}

export async function fetchLessonByDay(day: number): Promise<DayLesson | null> {
  const { data, error } = await supabase
    .from("phrases")
    .select("day, topic, telugu, pronunciation, english, sort_order")
    .eq("day", day)
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (error) throw error;

  const rows = (data ?? []) as PhraseRow[];
  if (rows.length === 0) return null;

  const topic = (rows.find((r) => (r.topic ?? "").trim())?.topic ?? "").trim() || `Day ${day}`;
  return { day, topic, phrases: rows.map(toPhrase) };
}

