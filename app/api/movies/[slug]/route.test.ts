import { PATCH } from "./route"; // Adjust the import path
import { checkSession } from "@/libs/session";
import { deleteImage, saveImage } from "@/libs/image";
import { getMovieBySlug, updateMovie } from "@/libs/movies";
import { generateResponse } from "@/libs";
import { parseUpdateMoviePayload } from "./validation";

jest.mock("@/libs/session", () => ({
  checkSession: jest.fn(),
}));

jest.mock("./validation", () => ({
  parseUpdateMoviePayload: jest.fn(),
}));

jest.mock("@/libs/movies", () => ({
  getMovieBySlug: jest.fn(),
  updateMovie: jest.fn(),
}));

jest.mock("@/libs/image", () => ({
  saveImage: jest.fn(),
  deleteImage: jest.fn(),
}));

jest.mock("@/libs", () => ({
  generateResponse: jest.fn((message: string, status: number) => ({
    status,
    message,
  })),
}));

describe("PATCH /api/movies/[slug]", () => {
  const mockRequest = {} as Request;
  const mockParams = { slug: "test-movie" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 Unauthorized when not authenticated", async () => {
    (checkSession as jest.Mock).mockResolvedValue(false);

    const response = await PATCH(mockRequest, { params: mockParams });

    expect(response.status).toBe(401);
    expect(generateResponse).toHaveBeenCalledWith("Unauthorized", 401);
  });

  it("should return 400 Bad Request when the payload is invalid", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parseUpdateMoviePayload as jest.Mock).mockRejectedValue(
      new Error("Invalid payload"),
    );

    const response = await PATCH(mockRequest, { params: mockParams });

    expect(response.status).toBe(400);
    expect(generateResponse).toHaveBeenCalledWith("Invalid payload", 400);
  });

  it("should return 404 Not Found when the movie does not exist", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parseUpdateMoviePayload as jest.Mock).mockResolvedValue({
      title: "Updated Movie",
      year: 2024,
    });

    (getMovieBySlug as jest.Mock).mockResolvedValue(null);

    const response = await PATCH(mockRequest, { params: mockParams });

    expect(response.status).toBe(404);
    expect(generateResponse).toHaveBeenCalledWith("Movie not found", 404);
  });

  it("should update the movie and returns 200 OK when the payload is valid", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parseUpdateMoviePayload as jest.Mock).mockResolvedValue({
      title: "Updated Movie",
      year: 2024,
    });

    const mockMovie = {
      id: "1",
      title: "Test Movie",
      year: 2020,
      image: "test-image.jpg",
    };
    (getMovieBySlug as jest.Mock).mockResolvedValue(mockMovie);

    (updateMovie as jest.Mock).mockResolvedValue({
      id: "1",
      title: "New Movie",
      year: 2023,
      image: "new-image.jpg",
      slug: "new-movie",
    });

    const response = await PATCH(mockRequest, { params: mockParams });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      JSON.stringify({
        movie: {
          id: "1",
          title: "New Movie",
          year: 2023,
          image: "new-image.jpg",
          slug: "new-movie",
        },
      }),
    );
    expect(updateMovie).toHaveBeenCalledWith(mockMovie.id, {
      title: "Updated Movie",
      year: 2024,
      image: undefined, // No image in the payload
    });
  });

  it("should handle image uploads and deletions correctly", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    (parseUpdateMoviePayload as jest.Mock).mockResolvedValue({
      title: "Updated Movie",
      year: 2024,
      image: mockFile,
    });

    const mockMovie = {
      id: "1",
      title: "Test Movie",
      year: 2020,
      image: "old-image.jpg",
    };
    (getMovieBySlug as jest.Mock).mockResolvedValue(mockMovie);

    (saveImage as jest.Mock).mockResolvedValue("new-image.jpg");

    (updateMovie as jest.Mock).mockResolvedValue({
      id: "1",
      title: "New Movie",
      year: 2023,
      image: "new-image.jpg",
      slug: "new-movie",
    });

    const response = await PATCH(mockRequest, { params: mockParams });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      JSON.stringify({
        movie: {
          id: "1",
          title: "New Movie",
          year: 2023,
          image: "new-image.jpg",
          slug: "new-movie",
        },
      }),
    );
    expect(saveImage).toHaveBeenCalledWith(mockFile);
    expect(updateMovie).toHaveBeenCalledWith(mockMovie.id, {
      title: "Updated Movie",
      year: 2024,
      image: "new-image.jpg",
    });
    expect(deleteImage).toHaveBeenCalledWith("old-image.jpg");
  });
});
