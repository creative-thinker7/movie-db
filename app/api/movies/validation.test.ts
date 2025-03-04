import { parseCreateMoviePayload } from "./validation";

const createMockRequest = (formData: FormData | null): Request => {
  return {
    formData: () => Promise.resolve(formData),
  } as unknown as Request;
};

describe("parseCreateMoviePayload()", () => {
  it("should parse and validate a valid FormData object", async () => {
    const formData = new FormData();
    formData.append("title", "Test Movie");
    formData.append("year", "2023");
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    formData.append("image", mockFile);

    const payload = await parseCreateMoviePayload(createMockRequest(formData));

    expect(payload).toEqual({
      title: "Test Movie",
      year: 2023,
      image: mockFile,
    });
  });

  it("should throw an error when the title is missing", async () => {
    const formData = new FormData();
    formData.append("year", "2023");

    await expect(
      parseCreateMoviePayload(createMockRequest(formData)),
    ).rejects.toThrow("TITLE_ERROR");
  });

  it("should throw an error when the year is missing", async () => {
    const formData = new FormData();
    formData.append("title", "Test Movie");

    await expect(
      parseCreateMoviePayload(createMockRequest(formData)),
    ).rejects.toThrow("YEAR_ERROR");
  });

  it("should throw an error when the image is missing", async () => {
    const formData = new FormData();
    formData.append("title", "Test Movie");
    formData.append("year", "2023");

    await expect(
      parseCreateMoviePayload(createMockRequest(formData)),
    ).rejects.toThrow("IMAGE_ERROR");
  });

  it("should throw an error when the title is invalid", async () => {
    const formData = new FormData();
    formData.append("title", ""); // Empty title
    formData.append("year", "2023");

    await expect(
      parseCreateMoviePayload(createMockRequest(formData)),
    ).rejects.toThrow("TITLE_ERROR");
  });

  it("should throw an error when the year is invalid", async () => {
    const formData = new FormData();
    formData.append("title", "Test Movie");
    formData.append("year", "1799"); // Year less than 1800
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    formData.append("image", mockFile);

    await expect(
      parseCreateMoviePayload(createMockRequest(formData)),
    ).rejects.toThrow("YEAR_ERROR");
  });

  it("should throw an error when FormData cannot be parsed", async () => {
    const invalidRequest = {
      formData: () => Promise.reject(new Error("Failed to parse FormData")),
    } as unknown as Request;

    await expect(parseCreateMoviePayload(invalidRequest)).rejects.toThrow(
      "Bad request",
    );
  });

  it("should throw an error when FormData is empty", async () => {
    await expect(
      parseCreateMoviePayload(createMockRequest(null)),
    ).rejects.toThrow("Bad request");
  });
});
