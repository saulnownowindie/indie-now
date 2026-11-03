import { useQuery } from "@tanstack/react-query";
import { getReels } from "../services/reelsService";
import { unwrapList } from "../utils/apiResponse";

export default function useReels() {
  return useQuery({
    queryKey: ["reels"],
    queryFn: () => getReels(),
    select: unwrapList,
  });
}
