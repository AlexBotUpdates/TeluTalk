export interface Phrase {
  telugu: string;
  pronunciation: string;
  english: string;
}

export interface DayLesson {
  day: number;
  topic: string;
  phrases: Phrase[];
}

export type ExerciseType = "listening" | "speaking" | "meaning-match";

export interface Exercise {
  type: ExerciseType;
  phrase: Phrase;
  options?: string[];
  correctAnswer: string;
}

export interface UserProgress {
  currentDay: number;
  xp: number;
  streak: number;
  lastSessionDate: string | null;
  completedLessons: number[];
  phrasesMastered: number;
}

export type SessionLength = 5 | 10 | 15;
