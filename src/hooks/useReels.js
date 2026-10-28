import { useQuery } from "@tanstack/react-query";
import { getReels } from "../services/reelsService";

export default function useReels() {
  return useQuery({
    queryKey: ["reels"],
    queryFn: getReels,
  });
}
