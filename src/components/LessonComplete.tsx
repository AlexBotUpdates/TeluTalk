import { motion } from "framer-motion";
import { Star, Zap, CheckCircle2 } from "lucide-react";

interface Props {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  dayNum: number;
  topic: string;
  onContinue: () => void;
}

const LessonComplete = ({ correctCount, totalCount, xpEarned, dayNum, topic, onContinue }: Props) => {
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6"
        >
          <Star className="w-12 h-12 text-gold" />
        </motion.div>

        <h1 className="text-3xl font-black text-foreground mb-2">Lesson Complete!</h1>
        <p className="text-muted-foreground mb-8">Day {dayNum}: {topic}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-card rounded-2xl border border-border p-4">
            <CheckCircle2 className="w-6 h-6 text-correct mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4">
            <Zap className="w-6 h-6 text-xp mx-auto mb-1" />
            <p className="text-2xl font-black text-foreground">+{xpEarned}</p>
            <p className="text-xs text-muted-foreground">XP Earned</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {correctCount}/{totalCount} correct answers
        </p>

        <button onClick={onContinue} className="btn-duo-primary w-full text-lg">
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default LessonComplete;
