import { GET, POST } from "./route"; // Adjust the import path
import { checkSession } from "@/libs/session";
import { saveImage } from "@/libs/image";
import { createMovie, getMovies } from "@/libs/movies";
import { generateResponse, parsePositiveNumber } from "@/libs";
import { parseCreateMoviePayload } from "./validation";

jest.mock("@/libs/session", () => ({
  checkSession: jest.fn(),
}));

jest.mock("@/libs", () => ({
  generateResponse: jest.fn((message: string, status: number) => ({
    status,
    message,
  })),
  parsePositiveNumber: jest.fn(),
}));

jest.mock("@/libs/movies", () => ({
  getMovies: jest.fn(),
  createMovie: jest.fn(),
}));

jest.mock("./validation", () => ({
  parseCreateMoviePayload: jest.fn(),
}));

jest.mock("@/libs/image", () => ({
  saveImage: jest.fn(),
}));

describe("GET /api/movies", () => {
  const mockRequest = {
    url: "http://localhost/api/movies?per_page=10&page=2",
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 Unauthorized when not authenticated", async () => {
    (checkSession as jest.Mock).mockResolvedValue(false);

    const response = await GET(mockRequest);

    expect(response.status).toBe(401);
    expect(generateResponse).toHaveBeenCalledWith("Unauthorized", 401);
  });

  it("should return a list of movies with pagination when the request is valid", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parsePositiveNumber as jest.Mock).mockImplementation(
      (value, defaultValue) => (value ? Number(value) : defaultValue),
    );

    const mockMovies = [
      { id: "1", title: "Movie 1", year: 2020, image: "image1.jpg" },
      { id: "2", title: "Movie 2", year: 2021, image: "image2.jpg" },
    ];
    const mockTotal = 10;
    (getMovies as jest.Mock).mockResolvedValue({
      movies: mockMovies,
      total: mockTotal,
    });

    const response = await GET(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      movies: mockMovies,
      total: mockTotal,
    });
  });

  it("should use default values for invalid pagination parameters", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parsePositiveNumber as jest.Mock).mockImplementation(
      (_, defaultValue) => defaultValue,
    );

    const mockMovies = [
      { id: "1", title: "Movie 1", year: 2020, image: "image1.jpg" },
      { id: "2", title: "Movie 2", year: 2021, image: "image2.jpg" },
    ];
    const mockTotal = 10;
    (getMovies as jest.Mock).mockResolvedValue({
      movies: mockMovies,
      total: mockTotal,
    });

    const response = await GET({
      url: "http://localhost/api/movies",
    } as Request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      movies: mockMovies,
      total: mockTotal,
    });
    expect(parsePositiveNumber).toHaveBeenCalledWith(null, 8); // per_page
    expect(parsePositiveNumber).toHaveBeenCalledWith(null, 1); // page
  });
});

describe("POST /api/movies", () => {
  const mockRequest = {} as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 Unauthorized when not authenticated", async () => {
    (checkSession as jest.Mock).mockResolvedValue(false);

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(generateResponse).toHaveBeenCalledWith("Unauthorized", 401);
  });

  it("should return 400 Bad Request when the payload is invalid", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (parseCreateMoviePayload as jest.Mock).mockRejectedValue(
      new Error("Invalid payload"),
    );

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(generateResponse).toHaveBeenCalledWith("Invalid payload", 400);
  });

  it("should create a movie and returns 200 OK when the payload is valid", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    const mockPayload = {
      title: "New Movie",
      year: 2023,
      image: new File(["test"], "test.png", { type: "image/png" }),
    };
    (parseCreateMoviePayload as jest.Mock).mockResolvedValue(mockPayload);

    (saveImage as jest.Mock).mockResolvedValue("new-image.jpg");

    (createMovie as jest.Mock).mockResolvedValue({
      id: "1",
      title: "New Movie",
      year: 2023,
      image: "new-image.jpg",
      slug: "new-movie",
    });

    const response = await POST(mockRequest);

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
    expect(saveImage).toHaveBeenCalledWith(mockPayload.image);
    expect(createMovie).toHaveBeenCalledWith({
      title: "New Movie",
      year: 2023,
      image: "new-image.jpg",
    });
  });
});
