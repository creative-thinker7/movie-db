import { callApiWithFormData } from "@/libs";
import { MovieFormRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "./useSession";

export function useCreateMovie() {
  const { handleUnauthorized } = useSession();

  return useMutation({
    mutationFn: async (data: MovieFormRequest) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("year", data.year.toString());
      formData.append("image", data.image!);

      const response = await callApiWithFormData({
        url: "/movies",
        body: formData,
      });

      if (response.status === 401) {
        await handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const jsonRes = await response.json();
        throw new Error(jsonRes.message || "GENERIC_ERROR");
      }
    },
  });
}
