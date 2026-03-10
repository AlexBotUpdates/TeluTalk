import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Zap, Trophy, Star, RotateCcw } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useLessons } from "@/hooks/useLessons";

const ProgressPage = () => {
  const navigate = useNavigate();
  const { progress, getLevel, resetProgress, loading: progressLoading } = useProgress();
  const { data: days = [], isLoading: lessonsLoading } = useLessons();
  const level = getLevel();
  const totalPhrases = days.reduce((sum, d) => sum + d.phrases.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-card border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-foreground text-lg">Progress</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {(progressLoading || lessonsLoading) && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-muted-foreground text-sm">Loading…</p>
          </div>
        )}

        {/* Level Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl border border-border p-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-3xl font-black text-foreground">Level {level}</h2>
          <p className="text-muted-foreground">{progress.xp} XP total</p>
          <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-xp rounded-full transition-all"
              style={{ width: `${progress.xp % 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{100 - (progress.xp % 100)} XP to next level</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Flame, label: "Day Streak", value: progress.streak, color: "text-streak" },
            { icon: Zap, label: "Total XP", value: progress.xp, color: "text-xp" },
            { icon: Star, label: "Phrases Learned", value: `${progress.phrasesMastered}/${totalPhrases}`, color: "text-gold" },
            { icon: Trophy, label: "Lessons Done", value: `${progress.completedLessons.length}/${days.length}`, color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Completed Days */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-3">Completed Days</h3>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              const done = progress.completedLessons.includes(day.day);
              return (
                <div
                  key={day.day}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm("Reset all progress? This cannot be undone.")) {
              resetProgress();
            }
          }}
          className="w-full flex items-center justify-center gap-2 text-destructive font-semibold py-3"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Progress
        </button>
      </main>
    </div>
  );
};

export default ProgressPage;
