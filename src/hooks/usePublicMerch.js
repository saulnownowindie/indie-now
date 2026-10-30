import { useQuery } from "@tanstack/react-query";
import { getPublicMerch } from "../services/merchService";

export default function usePublicMerch() {
  return useQuery({
    queryKey: ["public-merch"],
    queryFn: getPublicMerch,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
