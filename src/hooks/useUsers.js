import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../services/usersService";
import { unwrapList } from "../utils/apiResponse";

export default function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    select: unwrapList,
  });
}
