import { MovieEntity } from "@/types";
import MovieCard from "./MovieCard";
import { Pagination } from "@/components";

const PER_PAGE = 8;

interface Props {
  movies: MovieEntity[];
  total: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}

export default function MovieList({
  movies,
  total,
  currentPage,
  onChangePage,
}: Props) {
  return (
    <div className="m-6 mt-default-sm flex w-full flex-col gap-6 md:m-0 md:mt-default">
      <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        total={Math.ceil(total / PER_PAGE)}
        onChange={onChangePage}
      />
    </div>
  );
}
