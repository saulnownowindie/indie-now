import { useQuery } from "@tanstack/react-query";

import { getPlaylists } from "../services/playlistsService";

export default function usePlaylists() {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
  });
}
