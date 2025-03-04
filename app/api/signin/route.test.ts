import { POST } from "./route";
import { parseSigninPayload } from "./validation";
import { encodeToken } from "@/libs/token";
import { createSession } from "@/libs/session";
import { checkPassword } from "@/libs/auth";
import { generateResponse } from "@/libs";

jest.mock("./validation", () => ({
  parseSigninPayload: jest.fn(),
}));

jest.mock("@/libs/auth", () => ({
  checkPassword: jest.fn(),
}));

jest.mock("@/libs/token", () => ({
  encodeToken: jest.fn(),
}));

jest.mock("@/libs/session", () => ({
  createSession: jest.fn(),
}));

jest.mock("@/libs", () => ({
  generateResponse: jest.fn((message: string, status: number) => ({
    status,
    message,
  })),
}));

describe("POST /api/signin", () => {
  const mockRequest = {} as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 Bad Request when the payload is invalid", async () => {
    (parseSigninPayload as jest.Mock).mockRejectedValue(
      new Error("Invalid payload"),
    );

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(generateResponse).toHaveBeenCalledWith("Invalid payload", 400);
  });

  it("should return 401 Unauthorized when the email or password is incorrect", async () => {
    (parseSigninPayload as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    });

    (checkPassword as jest.Mock).mockResolvedValue(null);

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(generateResponse).toHaveBeenCalledWith("WRONG_PASSWORD_ERROR", 401);
  });

  it("should generate a JWT token, create a session, and return 200 OK when the credentials are valid", async () => {
    (parseSigninPayload as jest.Mock).mockResolvedValue({
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    });

    (checkPassword as jest.Mock).mockResolvedValue("user-id");

    (encodeToken as jest.Mock).mockResolvedValue("jwt-token");

    (createSession as jest.Mock).mockResolvedValue(undefined);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(encodeToken).toHaveBeenCalledWith("user-id", true);
    expect(createSession).toHaveBeenCalledWith("jwt-token", true);
  });
});
