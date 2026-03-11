import { supabase } from "@/lib/supabaseClient";

export type ExamDifficulty = "easy" | "medium" | "hard";

export type ExamQuestion = {
  difficulty: ExamDifficulty;
  questionNumber: number;
  telugu: string;
  pronunciation: string;
  english: string;
};

type ExamRow = {
  difficulty: string;
  question_number: number;
  telugu: string;
  pronunciation: string;
  english: string;
};

export async function fetchExamByDifficulty(
  difficulty: ExamDifficulty
): Promise<ExamQuestion[]> {
  const { data, error } = await supabase
    .from("exam_phrases")
    .select("difficulty, question_number, telugu, pronunciation, english")
    .eq("difficulty", difficulty)
    .order("question_number", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as ExamRow[];

  return rows.map((row) => ({
    difficulty: row.difficulty as ExamDifficulty,
    questionNumber: row.question_number,
    telugu: row.telugu,
    pronunciation: row.pronunciation,
    english: row.english,
  }));
}

