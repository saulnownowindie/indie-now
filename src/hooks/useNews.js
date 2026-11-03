import { useQuery } from "@tanstack/react-query";
import { getNews } from "../services/newsService";

export default function useNews(page = 1) {
  return useQuery({
    queryKey: ["news", page],
    queryFn: () => getNews({ page, limit: 50 }),
  });
}
