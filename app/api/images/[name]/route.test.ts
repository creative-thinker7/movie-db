import { GET } from "./route";
import { readImage } from "@/libs/image";
import { checkSession } from "@/libs/session";
import { generateResponse } from "@/libs/index";

jest.mock("@/libs/session", () => ({
  checkSession: jest.fn(),
}));

jest.mock("@/libs/image", () => ({
  readImage: jest.fn(),
}));

jest.mock("@/libs", () => ({
  generateResponse: jest.fn((message: string, status: number) => ({
    status,
  })),
}));

describe("GET /api/images/[name]", () => {
  const mockRequest = {} as Request;
  const mockParams = { name: "test-image.jpg" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 Unauthorized when not authenticated", async () => {
    (checkSession as jest.Mock).mockResolvedValue(false);

    const response = await GET(mockRequest, { params: mockParams });

    expect(response.status).toBe(401);
    expect(generateResponse).toHaveBeenCalledWith("Unauthorized", 401);
  });

  it("should return the image file with correct headers when the image is found", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    const mockFileContents = Buffer.from("test-image-content");
    const mockMimeType = "image/jpeg";
    (readImage as jest.Mock).mockResolvedValue({
      fileContents: mockFileContents,
      mimeType: mockMimeType,
    });

    const response = await GET(mockRequest, { params: mockParams });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(mockMimeType);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=86400, immutable",
    );

    expect(response.body).toEqual(mockFileContents);
  });

  it("should return 404 Not Found when the image does not exist", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (readImage as jest.Mock).mockRejectedValue({ code: "ENOENT" });

    const response = await GET(mockRequest, { params: mockParams });

    expect(response.status).toBe(404);
    expect(generateResponse).toHaveBeenCalledWith("Image not found", 404);
  });

  it("should return 500 Internal Server Error when an unexpected error occurs", async () => {
    (checkSession as jest.Mock).mockResolvedValue(true);

    (readImage as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const response = await GET(mockRequest, { params: mockParams });

    expect(response.status).toBe(500);
    expect(generateResponse).toHaveBeenCalledWith("Internal server error", 500);
  });
});
