import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { useLessons } from "@/hooks/useLessons";
import { useProgress } from "@/hooks/useProgress";
import { fetchExamByDifficulty, type ExamDifficulty } from "@/lib/supabaseExams";

const DIFFICULTY_LABEL: Record<ExamDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const DIFFICULTY_TIME_SECONDS: Record<ExamDifficulty, number> = {
  easy: 5 * 60,
  medium: 10 * 60,
  hard: 15 * 60,
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const ExamPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ difficulty: string }>();
  const difficulty = (params.difficulty ?? "easy") as ExamDifficulty;

  const { data: days = [], isLoading: lessonsLoading } = useLessons();
  const { progress, loading: progressLoading } = useProgress();

  const allLessonsCount = days.length || 0;
  const allLessonsCompleted =
    allLessonsCount > 0 && progress.completedLessons.length >= allLessonsCount;

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["exam", difficulty],
    queryFn: () => fetchExamByDifficulty(difficulty),
    enabled: allLessonsCompleted,
  });

  const [secondsLeft, setSecondsLeft] = useState(
    DIFFICULTY_TIME_SECONDS[difficulty] ?? DIFFICULTY_TIME_SECONDS.easy
  );
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    // Reset timer if difficulty changes
    setSecondsLeft(DIFFICULTY_TIME_SECONDS[difficulty] ?? DIFFICULTY_TIME_SECONDS.easy);
    setIsTimeUp(false);
  }, [difficulty]);

  useEffect(() => {
    if (!allLessonsCompleted) return;
    if (secondsLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const id = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft, allLessonsCompleted]);

  const loading = lessonsLoading || progressLoading || questionsLoading;

  const headerSubtitle = useMemo(() => {
    if (!allLessonsCompleted) {
      return "Complete all 30 lessons to unlock this final exam.";
    }
    return "Answer as many questions as you can before the timer ends.";
  }, [allLessonsCompleted]);

  const safeQuestions = questions ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-foreground text-lg">
              Final Exam – {DIFFICULTY_LABEL[difficulty]}
            </h1>
            <p className="text-xs text-muted-foreground">{headerSubtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {loading && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-muted-foreground text-sm">Loading exam…</p>
          </div>
        )}

        {!loading && !allLessonsCompleted && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-5 flex gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-destructive mt-1 shrink-0" />
            <div>
              <h2 className="font-bold text-foreground mb-1">Exam locked</h2>
              <p className="text-sm text-muted-foreground mb-3">
                You need to complete all lessons before taking this final exam.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground"
              >
                Back to lessons
              </button>
            </div>
          </motion.div>
        )}

        {allLessonsCompleted && (
          <>
            {/* Timer + status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time remaining</p>
                  <p className="font-black text-xl tabular-nums">{formatTime(secondsLeft)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-streak" />
                <span>{safeQuestions.length} questions</span>
              </div>
            </motion.div>

            {/* Questions list */}
            <div className="space-y-3">
              {safeQuestions.map((q, idx) => (
                <motion.div
                  key={q.questionNumber}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-card rounded-2xl border border-border p-4"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Question {q.questionNumber}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">{q.telugu}</p>
                  <p className="text-sm text-muted-foreground italic mb-1">
                    {q.pronunciation}
                  </p>
                  <p className="text-sm text-muted-foreground">{q.english}</p>
                </motion.div>
              ))}

              {safeQuestions.length === 0 && !loading && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">
                    No exam questions found for this difficulty. Please check your{" "}
                    <code className="text-xs">exam_phrases</code> table in Supabase.
                  </p>
                </div>
              )}
            </div>

            {isTimeUp && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <h2 className="font-bold text-foreground mb-1">Time is up!</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Great work reaching the end of the exam. Review your answers and try
                  another difficulty if you like.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-muted text-foreground"
                  >
                    Back to dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ExamPage;

