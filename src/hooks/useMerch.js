import { useQuery } from "@tanstack/react-query";
import { getMerch } from "../services/merchService";
import { unwrapList } from "../utils/apiResponse";

export default function useMerch() {
  return useQuery({
    queryKey: ["merch"],
    queryFn: () => getMerch(),
    select: unwrapList,
  });
}
