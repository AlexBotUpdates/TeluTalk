import { useQuery } from "@tanstack/react-query";
import { fetchLessonByDay } from "@/lib/supabaseLessons";

export function useLesson(day: number) {
  return useQuery({
    queryKey: ["lesson", day],
    queryFn: () => fetchLessonByDay(day),
    enabled: Number.isFinite(day) && day > 0,
    staleTime: 1000 * 60 * 5,
  });
}

