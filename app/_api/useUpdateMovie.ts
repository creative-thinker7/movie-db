import { callApiWithFormData } from "@/libs";
import { MovieFormRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "./useSession";

export function useUpdateMovie() {
  const { handleUnauthorized } = useSession();

  return useMutation({
    mutationFn: async (payload: { slug: string; data: MovieFormRequest }) => {
      const { slug, data } = payload;

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("year", data.year.toString());
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await callApiWithFormData({
        url: `/movies/${slug}`,
        method: "PATCH",
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
