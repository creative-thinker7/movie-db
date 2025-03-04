import { callApi } from "@/libs";
import { SigninFormRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useSignin() {
  return useMutation({
    mutationFn: async (data: SigninFormRequest) => {
      const response = await callApi({
        url: "/signin",
        method: "POST",
        body: data,
      });

      const jsonRes = await response.json();

      if (!response.ok) {
        throw new Error(jsonRes.message || "GENERIC_ERROR");
      }

      return jsonRes;
    },
  });
}
