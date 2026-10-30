import { useQuery } from "@tanstack/react-query";
import { getPublicNews } from "../services/newsService";

export default function usePublicNews() {
  return useQuery({
    queryKey: ["public-news"],
    queryFn: getPublicNews,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
