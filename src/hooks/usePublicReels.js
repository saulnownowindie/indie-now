import { useQuery } from "@tanstack/react-query";
import { getPublicReels } from "../services/reelsService";

export default function usePublicReels(section, options = {}) {
  return useQuery({
    queryKey: ["public-reels", section ?? "all"],
    queryFn: () => getPublicReels(section),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  });
}
