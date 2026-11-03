import { useQuery } from "@tanstack/react-query";

import { getPlaylists } from "../services/playlistsService";
import { unwrapList } from "../utils/apiResponse";

export default function usePlaylists() {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: () => getPlaylists(),
    select: unwrapList,
  });
}
