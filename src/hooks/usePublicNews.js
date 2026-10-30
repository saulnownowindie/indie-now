import { useQuery } from "@tanstack/react-query";
import { getPublicNews } from "../services/newsService";

export default function usePublicNews(section, options = {}) {
  return useQuery({
    queryKey: ["public-news", section ?? "all"],
    queryFn: () => getPublicNews(section),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: options.enabled ?? true,
  });
}
