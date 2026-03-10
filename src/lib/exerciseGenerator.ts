import type { Phrase, Exercise, DayLesson } from "@/types/course";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDistractors(correct: string, pool: string[], count = 2): string[] {
  const filtered = pool.filter((p) => p !== correct);
  return shuffle(filtered).slice(0, count);
}

function getAllEnglish(lessons: DayLesson[]): string[] {
  return lessons.flatMap((d) => d.phrases.map((p) => p.english));
}

function getAllTelugu(lessons: DayLesson[]): string[] {
  return lessons.flatMap((d) => d.phrases.map((p) => p.telugu));
}

export function generateExercisesFromLesson(
  lesson: DayLesson,
  allLessons: DayLesson[],
  maxMinutes: number
): Exercise[] {
  if (!lesson) return [];

  const phrasesPerMinute = 0.8;
  const totalPhrases = Math.min(
    Math.ceil(maxMinutes * phrasesPerMinute),
    lesson.phrases.length
  );
  const selectedPhrases = shuffle(lesson.phrases).slice(0, totalPhrases);

  const allEnglish = getAllEnglish(allLessons);
  const allTelugu = getAllTelugu(allLessons);
  const exercises: Exercise[] = [];

  for (const phrase of selectedPhrases) {
    // Listening exercise
    const listeningDistractors = getDistractors(phrase.english, allEnglish);
    exercises.push({
      type: "listening",
      phrase,
      options: shuffle([phrase.english, ...listeningDistractors]),
      correctAnswer: phrase.english,
    });

    // Speaking exercise
    exercises.push({
      type: "speaking",
      phrase,
      correctAnswer: phrase.telugu,
    });

    // Meaning match
    const matchDistractors = getDistractors(phrase.telugu, allTelugu);
    exercises.push({
      type: "meaning-match",
      phrase,
      options: shuffle([phrase.telugu, ...matchDistractors]),
      correctAnswer: phrase.telugu,
    });
  }

  return shuffle(exercises);
}
