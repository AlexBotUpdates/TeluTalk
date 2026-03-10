import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Zap, Trophy, BookOpen, Lock, CheckCircle2, PlayCircle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useLessons } from "@/hooks/useLessons";
import { useAuth } from "@/auth/AuthProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { progress, getLevel, loading: progressLoading } = useProgress();
  const { data: days = [], isLoading: lessonsLoading } = useLessons();
  const { signOut } = useAuth();
  const level = getLevel();
  const xpToNext = 100 - (progress.xp % 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 font-black text-primary text-lg">
            <span className="text-2xl">తె</span> Telugu
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut().then(() => navigate("/"))}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
            <div className="flex items-center gap-1 text-streak font-bold">
              <Flame className="w-5 h-5" />
              <span>{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-xp font-bold">
              <Zap className="w-5 h-5" />
              <span>{progress.xp}</span>
            </div>
            <div className="flex items-center gap-1 text-gold font-bold">
              <Trophy className="w-5 h-5" />
              <span>Lv {level}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {(progressLoading || lessonsLoading) && (
          <div className="bg-card rounded-2xl border border-border p-5 mb-6">
            <p className="text-muted-foreground text-sm">Loading your lessons and progress…</p>
          </div>
        )}

        {/* Stats Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-2xl border border-border p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Your Progress</h2>
            <button
              onClick={() => navigate("/progress")}
              className="text-sm text-primary font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-2xl font-black text-foreground">{progress.completedLessons.length}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-2xl font-black text-foreground">{progress.phrasesMastered}</p>
              <p className="text-xs text-muted-foreground">Phrases</p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-2xl font-black text-foreground">{progress.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level {level}</span>
              <span>{xpToNext} XP to Level {level + 1}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xp % 100)}%` }}
                className="h-full bg-xp rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Lessons
        </h2>

        <div className="space-y-3">
          {days.map((day, i) => {
            const isCompleted = progress.completedLessons.includes(day.day);
            const isUnlocked = day.day <= progress.currentDay;
            const isCurrent = day.day === progress.currentDay && !isCompleted;

            return (
              <motion.button
                key={day.day}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && navigate(`/lesson/${day.day}`)}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all flex items-center gap-4 ${
                  isCurrent
                    ? "border-primary bg-card shadow-md"
                    : isCompleted
                    ? "border-correct/30 bg-correct/5"
                    : isUnlocked
                    ? "border-border bg-card"
                    : "border-border bg-muted opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                    isCompleted
                      ? "bg-correct text-correct"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isUnlocked
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  ) : !isUnlocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    day.day
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">Day {day.day}: {day.topic}</h3>
                  <p className="text-sm text-muted-foreground">{day.phrases.length} phrases</p>
                </div>
                {isCurrent && (
                  <PlayCircle className="w-8 h-8 text-primary shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
