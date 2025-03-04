import { callApi } from "@/libs";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await callApi({
        url: "/logout",
        method: "POST",
      });
    },
  });
}
