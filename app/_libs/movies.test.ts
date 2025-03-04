import { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import { getMovies, createMovie, updateMovie } from "./movies";

import prisma from "@/prisma/client";

jest.mock("@/prisma/client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

describe("getMovies()", () => {
  it("should fetch movies with pagination", async () => {
    const mockMovies = [
      {
        id: "1",
        title: "Movie 1",
        year: 2020,
        image: "image1",
        slug: "movie-1",
      },
      {
        id: "2",
        title: "Movie 2",
        year: 2021,
        image: "image2",
        slug: "movie-2",
      },
    ];
    const mockTotal = 10;

    (prisma.movie.findMany as jest.Mock).mockResolvedValue(mockMovies);
    (prisma.movie.count as jest.Mock).mockResolvedValue(mockTotal);

    const result = await getMovies({ perPage: 10, page: 1 });

    expect(result.movies).toEqual(mockMovies);
    expect(result.total).toBe(mockTotal);
    expect(prisma.movie.findMany).toHaveBeenCalledWith({
      select: { id: true, title: true, year: true, image: true, slug: true },
      skip: 0,
      take: 10,
    });
    expect(prisma.movie.count).toHaveBeenCalled();
  });

  it("should fetch movies with a different page", async () => {
    const mockMovies = [
      {
        id: "3",
        title: "Movie 3",
        year: 2022,
        image: "image3",
        slug: "movie-3",
      },
    ];
    const mockTotal = 10;

    (prisma.movie.findMany as jest.Mock).mockResolvedValue(mockMovies);
    (prisma.movie.count as jest.Mock).mockResolvedValue(mockTotal);

    const result = await getMovies({ perPage: 5, page: 2 });

    expect(result.movies).toEqual(mockMovies);
    expect(result.total).toBe(mockTotal);
    expect(prisma.movie.findMany).toHaveBeenCalledWith({
      select: { id: true, title: true, year: true, image: true, slug: true },
      skip: 5,
      take: 5,
    });
    expect(prisma.movie.count).toHaveBeenCalled();
  });
});

describe("createMovie()", () => {
  it("should create a new movie with a unique slug", async () => {
    const mockMovie = {
      id: "1",
      title: "New Movie",
      year: 2023,
      image: "image-url",
      slug: "new-movie",
    };

    (prisma.movie.create as jest.Mock).mockResolvedValue(mockMovie);
    (prisma.movie.findMany as jest.Mock).mockResolvedValue([]);

    const result = await createMovie({
      title: "New Movie",
      year: 2023,
      image: "image-url",
    });

    expect(result).toEqual(mockMovie);
    expect(prisma.movie.create).toHaveBeenCalledWith({
      data: {
        title: "New Movie",
        year: 2023,
        image: "image-url",
        slug: "new-movie",
      },
    });
  });

  it("should create a movie with a duplicate title and generate a unique slug", async () => {
    const mockMovie = {
      id: "2",
      title: "Existing Movie",
      year: 2023,
      image: "image-url",
      slug: "existing-movie-1",
    };

    (prisma.movie.create as jest.Mock).mockResolvedValue(mockMovie);
    (prisma.movie.findMany as jest.Mock)
      .mockResolvedValueOnce([{ slug: "existing-movie" }])
      .mockResolvedValueOnce([]);

    const result = await createMovie({
      title: "Existing Movie",
      year: 2023,
      image: "image-url",
    });

    expect(result).toEqual(mockMovie);
    expect(prisma.movie.create).toHaveBeenCalledWith({
      data: {
        title: "Existing Movie",
        year: 2023,
        image: "image-url",
        slug: "existing-movie-1",
      },
    });
  });
});

describe("updateMovie()", () => {
  it("should update an existing movie with a unique slug", async () => {
    const mockMovie = {
      id: "1",
      title: "Updated Movie",
      year: 2024,
      image: "image-url",
      slug: "updated-movie",
    };

    (prisma.movie.update as jest.Mock).mockResolvedValue(mockMovie);
    (prisma.movie.findMany as jest.Mock).mockResolvedValue([]);

    const result = await updateMovie("1", {
      title: "Updated Movie",
      year: 2024,
    });

    expect(result).toEqual(mockMovie);
    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Updated Movie",
        year: 2024,
        slug: "updated-movie",
      },
    });
  });

  it("should update an existing movie with a duplicate title and generate a unique slug", async () => {
    const mockMovie = {
      id: "1",
      title: "Existing Movie",
      year: 2024,
      image: "image-url",
      slug: "existing-movie-1",
    };

    (prisma.movie.update as jest.Mock).mockResolvedValue(mockMovie);
    (prisma.movie.findMany as jest.Mock)
      .mockResolvedValueOnce([{ slug: "existing-movie" }]) // First call: slug exists
      .mockResolvedValueOnce([]); // Second call: slug is unique

    const result = await updateMovie("1", {
      title: "Existing Movie",
      year: 2024,
    });

    expect(result).toEqual(mockMovie);
    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Existing Movie",
        year: 2024,
        slug: "existing-movie-1",
      },
    });
  });

  it("should update an existing movie with a new image", async () => {
    const mockMovie = {
      id: "1",
      title: "Updated Movie",
      year: 2024,
      image: "new-image-url",
      slug: "updated-movie",
    };

    (prisma.movie.update as jest.Mock).mockResolvedValue(mockMovie);
    (prisma.movie.findMany as jest.Mock).mockResolvedValue([]);

    const result = await updateMovie("1", {
      title: "Updated Movie",
      year: 2024,
      image: "new-image-url",
    });

    expect(result).toEqual(mockMovie);
    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Updated Movie",
        year: 2024,
        slug: "updated-movie",
        image: "new-image-url",
      },
    });
  });
});
