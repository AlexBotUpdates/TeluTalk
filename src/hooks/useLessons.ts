import { useQuery } from "@tanstack/react-query";
import { fetchAllLessons } from "@/lib/supabaseLessons";

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: fetchAllLessons,
    staleTime: 1000 * 60 * 5,
  });
}

