import { useQuery } from "@tanstack/react-query";
import { getMerch } from "../services/merchService";

export default function useMerch() {
  return useQuery({
    queryKey: ["merch"],
    queryFn: getMerch,
  });
}