import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, CheckCircle2, XCircle } from "lucide-react";
import type { Exercise } from "@/types/course";
import { speakTelugu } from "@/lib/speech";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const ListeningExercise = ({ exercise, onAnswer }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handlePlay = () => {
    speakTelugu(exercise.phrase.telugu);
  };

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === exercise.correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-foreground">What does this mean?</h2>

      {/* Audio button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePlay}
        className="w-full bg-card border-2 border-primary rounded-2xl p-6 flex flex-col items-center gap-3"
      >
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Volume2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Tap to listen</p>
        <p className="font-semibold text-foreground text-lg">{exercise.phrase.telugu}</p>
        <p className="text-sm text-muted-foreground italic">({exercise.phrase.pronunciation})</p>
      </motion.button>

      {/* Options */}
      <div className="space-y-3">
        {exercise.options?.map((option, i) => {
          let className = "option-card";
          if (answered) {
            if (option === exercise.correctAnswer) className = "option-correct";
            else if (option === selected) className = "option-incorrect";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`${className} flex items-center gap-3`}
            >
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {answered && option === exercise.correctAnswer && (
                <CheckCircle2 className="w-6 h-6 text-primary-foreground shrink-0" />
              )}
              {answered && option === selected && option !== exercise.correctAnswer && (
                <XCircle className="w-6 h-6 text-destructive-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListeningExercise;
