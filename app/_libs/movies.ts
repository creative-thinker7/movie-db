import "server-only";
import prisma from "@/prisma/client";
import { createSlug } from ".";

interface GetMoviesParams {
  perPage: number;
  page: number;
}

export async function getMovies(params: GetMoviesParams) {
  const { perPage, page } = params;

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        image: true,
        slug: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.movie.count(),
  ]);

  return {
    movies,
    total,
  };
}

export function getMovieBySlug(slug: string) {
  return prisma.movie.findFirst({
    select: {
      id: true,
      title: true,
      year: true,
      image: true,
      slug: true,
    },
    where: {
      slug,
    },
  });
}

async function getUniqueSlug(title: string, id?: string) {
  let slug = createSlug(title);
  let isUnique = false;
  let counter = 1;

  // Ensure the slug is unique
  while (!isUnique) {
    const existingRecords = await prisma.movie.findMany({
      where: { slug, ...(id ? { id: { not: id } } : {}) },
    });
    if (!existingRecords.length) {
      isUnique = true;
    } else {
      slug = `${createSlug(title)}-${counter}`;
      counter += 1;
    }
  }

  return slug;
}

interface CreateMovieParams {
  title: string;
  year: number;
  image: string;
}

export async function createMovie(payload: CreateMovieParams) {
  const { title, year, image } = payload;

  const slug = await getUniqueSlug(title);

  return prisma.movie.create({
    data: {
      title,
      year,
      image,
      slug,
    },
  });
}

interface UpdateMovieParams {
  title: string;
  year: number;
  image?: string;
}

export async function updateMovie(id: string, payload: UpdateMovieParams) {
  const { title, year, image } = payload;

  const slug = await getUniqueSlug(title, id);

  return prisma.movie.update({
    where: {
      id,
    },
    data: {
      title,
      year,
      slug,
      ...(image ? { image } : {}),
    },
  });
}
