import { useQuery } from "@tanstack/react-query";
import { getNews } from "../services/newsService";

export default function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: getNews,
  });
}