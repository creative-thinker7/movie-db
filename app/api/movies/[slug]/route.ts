import { checkSession } from "@/libs/session";
import { generateResponse } from "@/libs";
import { MovieEntity, MovieFormRequest } from "@/types";
import { deleteImage, saveImage } from "@/libs/image";
import { getMovieBySlug, updateMovie } from "@/libs/movies";
import { parseUpdateMoviePayload } from "./validation";

type Params = Promise<{ slug: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { slug } = await params;

  const isAuthenticated = await checkSession();
  if (!isAuthenticated) {
    return generateResponse("Unauthorized", 401);
  }

  // Parse and validate the payload.
  let payload: MovieFormRequest;
  try {
    payload = await parseUpdateMoviePayload(request);
  } catch (error) {
    return generateResponse((error as Error).message || "Bad request", 400);
  }

  const movie = await getMovieBySlug(slug);
  if (!movie) {
    return generateResponse("Movie not found", 404);
  }

  // Store image.
  let imageName: string | undefined;
  let oldImage: string | undefined;
  if (payload.image) {
    imageName = await saveImage(payload.image);
    oldImage = movie.image;
  }

  const updatedMovie = await updateMovie(movie.id, {
    title: payload.title,
    year: payload.year,
    image: imageName,
  });

  // Delete an old image.
  if (oldImage) {
    deleteImage(oldImage);
  }

  return Response.json({
    movie: {
      id: updatedMovie.id,
      title: updatedMovie.title,
      year: updatedMovie.year,
      image: updatedMovie.image,
      slug: updatedMovie.slug,
    } as MovieEntity,
  });
}
