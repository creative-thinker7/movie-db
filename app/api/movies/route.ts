import { checkSession } from "@/libs/session";
import { generateResponse, parsePositiveNumber } from "@/libs";
import { MovieEntity, MovieFormRequest } from "@/types";
import { parseCreateMoviePayload } from "./validation";
import { saveImage } from "@/libs/image";
import { createMovie, getMovies } from "@/libs/movies";

export async function GET(request: Request) {
  const isAuthenticated = await checkSession();
  if (!isAuthenticated) {
    return generateResponse("Unauthorized", 401);
  }

  const url = new URL(request.url);
  const perPage = parsePositiveNumber(url.searchParams.get("per_page"), 8);
  const page = parsePositiveNumber(url.searchParams.get("page"), 1);

  const { movies, total } = await getMovies({ perPage, page });

  return Response.json({
    movies,
    total,
  });
}

export async function POST(request: Request) {
  const isAuthenticated = await checkSession();
  if (!isAuthenticated) {
    return generateResponse("Unauthorized", 401);
  }

  // Parse and validate the payload.
  let payload: MovieFormRequest;
  try {
    payload = await parseCreateMoviePayload(request);
  } catch (error) {
    return generateResponse((error as Error).message || "Bad request", 400);
  }

  // Store image.
  const imageName = await saveImage(payload.image!);

  const movie = await createMovie({
    title: payload.title,
    year: payload.year,
    image: imageName,
  });

  return Response.json({
    movie: {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      image: movie.image,
      slug: movie.slug,
    } as MovieEntity,
  });
}
