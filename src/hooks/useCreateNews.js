import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../services/newsService";

export default function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNews,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["news"],
      });
    },
  });
}