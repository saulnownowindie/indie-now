import { useQuery } from "@tanstack/react-query";

import { getFeaturedPlaylists } from "../services/playlistsService";

export default function usePublicPlaylists() {
  return useQuery({
    queryKey: ["public-playlists"],
    queryFn: getFeaturedPlaylists,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
