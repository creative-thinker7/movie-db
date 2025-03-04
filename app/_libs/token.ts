import "server-only";
import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET);
const algo = "HS256";

export async function encodeToken(userID: string, rememberMe: boolean) {
  return new SignJWT({ id: userID })
    .setProtectedHeader({ alg: algo })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? "7d" : "1d")
    .sign(key);
}

export async function decodeToken(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: [algo],
  });
  return payload;
}
