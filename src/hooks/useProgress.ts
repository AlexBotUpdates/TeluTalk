import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UserProgress } from "@/types/course";
import { useAuth } from "@/auth/AuthProvider";
import { defaultProgress, loadOrCreateProgress, saveProgress } from "@/lib/supabaseProgress";

export function useProgress() {
  const { user } = useAuth();
  const userId = user?.id;

  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);

  const isHydrated = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    loadOrCreateProgress(userId)
      .then((p) => {
        setProgress(p);
        isHydrated.current = true;
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    if (!isHydrated.current) return;

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveProgress(userId, progress).catch(() => {
        // If saving fails, keep local state (user can continue).
      });
    }, 500);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [userId, progress]);

  const addXP = useCallback((amount: number) => {
    setProgress((p) => ({ ...p, xp: p.xp + amount }));
  }, []);

  const completeLesson = useCallback((day: number, phrasesCount: number) => {
    setProgress((p) => {
      const today = new Date().toDateString();
      const lastDate = p.lastSessionDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = p.streak;
      if (lastDate === yesterday) {
        newStreak = p.streak + 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      const completedLessons = p.completedLessons.includes(day)
        ? p.completedLessons
        : [...p.completedLessons, day];

      const nextDay = Math.max(p.currentDay, day + 1);

      return {
        ...p,
        currentDay: nextDay,
        completedLessons,
        streak: newStreak,
        lastSessionDate: today,
        phrasesMastered: p.phrasesMastered + phrasesCount,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  const getLevel = useCallback(() => {
    return Math.floor(progress.xp / 100) + 1;
  }, [progress.xp]);

  const api = useMemo(
    () => ({ progress, loading, addXP, completeLesson, resetProgress, getLevel }),
    [progress, loading, addXP, completeLesson, resetProgress, getLevel]
  );

  return api;
}
