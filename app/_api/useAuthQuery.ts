import { callApi } from "@/libs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSession } from "./useSession";

interface Options {
  queryKey: string[];
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
}

export function useAuthQuery<T>({
  queryKey,
  url,
  method = "GET",
  body,
}: Options) {
  const { handleUnauthorized } = useSession();

  return useQuery<T | null>({
    queryKey,
    queryFn: async () => {
      const response = await callApi({
        url,
        method,
        body,
      });

      if (response.status === 401) {
        await handleUnauthorized();
        return null;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json() as Promise<T>;
    },
    // Keep the previous data while the new query is in progress.
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}
