import { SigninFormRequest } from "@/types";
import { encodeToken } from "@/libs/token";
import { createSession } from "@/libs/session";
import { generateResponse } from "@/libs";
import { parseSigninPayload } from "./validation";
import { checkPassword } from "@/libs/auth";

export async function POST(request: Request) {
  // Parse and validate the payload.
  let payload: SigninFormRequest;
  try {
    payload = await parseSigninPayload(request);
  } catch (error) {
    return generateResponse((error as Error).message || "Bad request", 400);
  }

  // Check password.
  const { email, password, rememberMe } = payload;
  const userID = await checkPassword(email, password);
  if (!userID) {
    return generateResponse("WRONG_PASSWORD_ERROR", 401);
  }

  // Generate JWT token.
  const token = await encodeToken(userID, rememberMe);

  // Save cookie.
  await createSession(token, rememberMe);

  return Response.json({});
}
