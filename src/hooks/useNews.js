import { useQuery } from "@tanstack/react-query";
import { getNews } from "../services/newsService";
import { unwrapList } from "../utils/apiResponse";

export default function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => getNews(),
    select: unwrapList,
  });
}
