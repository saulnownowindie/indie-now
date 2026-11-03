import { useQuery } from "@tanstack/react-query";
import { getReels } from "../services/reelsService";

export default function useReels(page = 1) {
  return useQuery({
    queryKey: ["reels", page],
    queryFn: () => getReels({ page, limit: 50 }),
  });
}
