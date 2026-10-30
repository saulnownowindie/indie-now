import { useQuery } from "@tanstack/react-query";
import { getPublicNewsBySlug } from "../services/newsService";

export default function usePublicNewsDetail(slug) {
  return useQuery({
    queryKey: ["public-news-detail", slug],
    queryFn: () => getPublicNewsBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error?.response?.status !== 404 && failureCount < 1,
  });
}
