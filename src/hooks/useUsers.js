import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../services/usersService";

export default function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}