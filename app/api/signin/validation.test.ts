import { SigninFormRequest } from "@/types";
import { parseSigninPayload } from "./validation";

describe("parseSigninPayload()", () => {
  it("should parse and validate a valid JSON payload", async () => {
    const mockPayload: SigninFormRequest = {
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    };

    const mockRequest = {
      json: () => Promise.resolve(mockPayload),
    } as Request;

    const result = await parseSigninPayload(mockRequest);

    expect(result).toEqual(mockPayload);
  });

  it("should throw an error when the request body is not valid JSON", async () => {
    const mockRequest = {
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Request;

    await expect(parseSigninPayload(mockRequest)).rejects.toThrow(
      "Bad request",
    );
  });

  it("should throw an error when the email is missing or invalid", async () => {
    const mockPayload = {
      email: "invalid-email", // Invalid email
      password: "password123",
      rememberMe: true,
    };

    const mockRequest = {
      json: () => Promise.resolve(mockPayload),
    } as Request;

    await expect(parseSigninPayload(mockRequest)).rejects.toThrow(
      "INVALID_EMAIL_ERROR",
    );
  });

  it("should throw an error when the password is missing or invalid", async () => {
    const mockPayload = {
      email: "test@example.com",
      password: "", // Empty password
      rememberMe: true,
    };

    const mockRequest = {
      json: () => Promise.resolve(mockPayload),
    } as Request;

    await expect(parseSigninPayload(mockRequest)).rejects.toThrow(
      "PASSWORD_ERROR",
    );
  });

  it("should throw an error when the payload does not match the schema", async () => {
    const mockPayload = {
      email: "test@example.com",
      password: "password123",
      rememberMe: "not-a-boolean", // Invalid type
    };

    const mockRequest = {
      json: () => Promise.resolve(mockPayload),
    } as Request;

    await expect(parseSigninPayload(mockRequest)).rejects.toThrow(
      "Expected boolean, received string",
    );
  });
});
