import { useQuery } from "@tanstack/react-query";
import { getPublicReels } from "../services/reelsService";

export default function usePublicReels() {
  return useQuery({
    queryKey: ["public-reels"],
    queryFn: getPublicReels,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
