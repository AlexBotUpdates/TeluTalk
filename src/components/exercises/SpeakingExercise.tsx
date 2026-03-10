import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, CheckCircle2, XCircle, SkipForward } from "lucide-react";
import type { Exercise } from "@/types/course";
import { speakTelugu, startSpeechRecognition } from "@/lib/speech";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const SpeakingExercise = ({ exercise, onAnswer }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "error">("idle");

  const handleListen = () => {
    speakTelugu(exercise.phrase.telugu);
  };

  const handleSpeak = async () => {
    setIsListening(true);
    setResult(null);
    setStatus("idle");

    try {
      const transcript = await startSpeechRecognition();
      setResult(transcript);
      setIsListening(false);

      // Simple comparison - normalize and check similarity
      const normalize = (s: string) => s.toLowerCase().trim().replace(/[^\w\s]/g, "");
      const spoken = normalize(transcript);
      const expected = normalize(exercise.phrase.telugu);

      if (spoken.includes(expected) || expected.includes(spoken) || levenshteinSimilarity(spoken, expected) > 0.5) {
        setStatus("correct");
        onAnswer(true);
      } else {
        setStatus("incorrect");
        onAnswer(false);
      }
    } catch {
      setIsListening(false);
      setStatus("error");
    }
  };

  const handleSkip = () => {
    onAnswer(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-foreground">Repeat this phrase</h2>

      {/* Phrase display */}
      <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
        <p className="text-2xl font-black text-foreground mb-2">{exercise.phrase.telugu}</p>
        <p className="text-muted-foreground italic mb-4">({exercise.phrase.pronunciation})</p>
        <p className="text-sm text-muted-foreground">{exercise.phrase.english}</p>

        <button
          onClick={handleListen}
          className="mt-4 inline-flex items-center gap-2 text-primary font-semibold"
        >
          <Volume2 className="w-5 h-5" />
          Listen first
        </button>
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpeak}
          disabled={isListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isListening
              ? "bg-destructive animate-pulse"
              : status === "correct"
              ? "bg-correct"
              : status === "incorrect"
              ? "bg-destructive"
              : "bg-primary"
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-primary-foreground" />
          ) : (
            <Mic className="w-8 h-8 text-primary-foreground" />
          )}
        </motion.button>

        <p className="text-sm text-muted-foreground">
          {isListening ? "Listening..." : "Tap to speak"}
        </p>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-2xl p-4 flex items-center gap-3 ${
            status === "correct"
              ? "bg-correct/10 border-2 border-correct"
              : "bg-destructive/10 border-2 border-destructive"
          }`}
        >
          {status === "correct" ? (
            <CheckCircle2 className="w-6 h-6 text-correct shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-destructive shrink-0" />
          )}
          <div>
            <p className="font-semibold text-foreground">You said: "{result}"</p>
            {status === "incorrect" && (
              <p className="text-sm text-muted-foreground">Expected: "{exercise.phrase.telugu}"</p>
            )}
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Speech recognition unavailable in this browser.</p>
          <button onClick={handleSkip} className="btn-duo-accent text-sm">
            <SkipForward className="w-4 h-4 inline mr-1" />
            Skip this exercise
          </button>
        </div>
      )}

      {status === "idle" && !isListening && (
        <button onClick={handleSkip} className="w-full text-center text-sm text-muted-foreground underline">
          Skip
        </button>
      )}
    </div>
  );
};

function levenshteinSimilarity(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - matrix[b.length][a.length] / maxLen;
}

export default SpeakingExercise;
