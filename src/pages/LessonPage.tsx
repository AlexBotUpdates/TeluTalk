import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { generateExercisesFromLesson } from "@/lib/exerciseGenerator";
import { useLesson } from "@/hooks/useLesson";
import { useLessons } from "@/hooks/useLessons";
import type { SessionLength, Exercise } from "@/types/course";
import ListeningExercise from "@/components/exercises/ListeningExercise";
import SpeakingExercise from "@/components/exercises/SpeakingExercise";
import MeaningMatchExercise from "@/components/exercises/MeaningMatchExercise";
import LessonComplete from "@/components/LessonComplete";

const LessonPage = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNum = parseInt(day || "1");
  const { data: lesson, isLoading: lessonLoading } = useLesson(dayNum);
  const { data: allLessons = [], isLoading: allLessonsLoading } = useLessons();

  const [sessionLength, setSessionLength] = useState<SessionLength | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { addXP, completeLesson, loading: progressLoading } = useProgress();

  if (lessonLoading || allLessonsLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading lesson…</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Lesson not found</p>
      </div>
    );
  }

  const startSession = (length: SessionLength) => {
    setSessionLength(length);
    const generated = generateExercisesFromLesson(lesson, allLessons.length ? allLessons : [lesson], length);
    setExercises(generated);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount((c) => c + 1);
      addXP(10);
    }

    setTimeout(() => {
      if (currentIndex + 1 >= exercises.length) {
        completeLesson(dayNum, lesson.phrases.length);
        addXP(50); // bonus
        setIsComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1200);
  };

  // Session length selector
  if (!sessionLength) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-card border-b border-border z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-foreground text-lg">Day {dayNum}: {lesson.topic}</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-black text-foreground mb-2">Choose Session Length</h2>
            <p className="text-muted-foreground">How much time do you have?</p>
          </motion.div>

          <div className="space-y-3">
            {([5, 10, 15] as SessionLength[]).map((len, i) => (
              <motion.button
                key={len}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => startSession(len)}
                className={`w-full text-left rounded-2xl p-5 border-2 border-border bg-card transition-all hover:border-primary flex items-center justify-between`}
              >
                <div>
                  <h3 className="font-bold text-foreground text-lg">{len} minutes</h3>
                  <p className="text-sm text-muted-foreground">
                    {len === 5 ? "Quick practice" : len === 10 ? "Regular lesson" : "Deep dive"}
                  </p>
                </div>
                <div className="text-3xl">
                  {len === 5 ? "⚡" : len === 10 ? "📚" : "🎯"}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Phrases preview */}
          <div className="mt-8 bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground mb-3">Today's Phrases</h3>
            <div className="space-y-2">
              {lesson.phrases.map((p, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-foreground font-semibold">{p.telugu}</span>
                  <span className="text-muted-foreground">{p.english}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isComplete) {
    return (
      <LessonComplete
        correctCount={correctCount}
        totalCount={exercises.length}
        xpEarned={correctCount * 10 + 50}
        dayNum={dayNum}
        topic={lesson.topic}
        onContinue={() => navigate("/dashboard")}
      />
    );
  }

  const exercise = exercises[currentIndex];
  const progressPercent = ((currentIndex) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar header */}
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {currentIndex + 1}/{exercises.length}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {exercise.type === "listening" && (
              <ListeningExercise exercise={exercise} onAnswer={handleAnswer} />
            )}
            {exercise.type === "speaking" && (
              <SpeakingExercise exercise={exercise} onAnswer={handleAnswer} />
            )}
            {exercise.type === "meaning-match" && (
              <MeaningMatchExercise exercise={exercise} onAnswer={handleAnswer} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
