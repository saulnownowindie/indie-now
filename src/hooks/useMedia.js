import { useQuery } from "@tanstack/react-query";
import { getMedia } from "../services/mediaService";

export default function useMedia(page = 1) {
  return useQuery({
    queryKey: ["media", page],
    queryFn: () => getMedia({ page, limit: 50 }),
  });
}
