import { QUERY_KEY_MOVIES } from "@/app/constants";
import { useAuthQuery } from "./useAuthQuery";
import { MovieEntity } from "@/types";

interface Props {
  page: number;
}

export function useMovies({ page }: Props) {
  return useAuthQuery<{
    movies: MovieEntity[];
    total: number;
  }>({
    queryKey: [QUERY_KEY_MOVIES, page.toString()],
    url: `/movies?page=${page}`,
  });
}
