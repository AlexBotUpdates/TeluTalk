import { useState } from "react";
import { Volume2, CheckCircle2, XCircle } from "lucide-react";
import type { Exercise } from "@/types/course";
import { speakTelugu } from "@/lib/speech";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const MeaningMatchExercise = ({ exercise, onAnswer }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    onAnswer(option === exercise.correctAnswer);
  };

  const handlePlay = (text: string) => {
    speakTelugu(text);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-foreground">
        Which phrase means "{exercise.phrase.english}"?
      </h2>

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
              <span className="flex-1 font-semibold">{option}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(option);
                }}
                className="text-primary shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
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

export default MeaningMatchExercise;
