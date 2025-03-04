/* eslint-disable @next/next/no-img-element */
import { MovieEntity } from "@/types";
import Link from "next/link";

interface Props {
  movie: MovieEntity;
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link href={`/movie/${movie.slug}`} role="link" aria-label={movie.title}>
      <div className="backdrp-blur-[200px] flex flex-col gap-y-4 rounded-xl bg-prospectory-card pb-4 text-white md:px-2 md:pt-2">
        <span className="h-card-image-sm w-full overflow-hidden rounded-t-xl md:h-card-image md:rounded-none">
          <img
            src={`/api/images/${movie.image}`}
            className="h-full w-full object-cover"
            alt={movie.title}
            title={movie.title}
          />
        </span>
        <span
          className="w-full truncate px-2 text-body-large font-bold md:px-0"
          title={movie.title}
        >
          {movie.title}
        </span>
        <span className="px-2 text-body-small md:px-0">{movie.year}</span>
      </div>
    </Link>
  );
}
