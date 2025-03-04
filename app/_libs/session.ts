"use server";

import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, TOKEN_COOKIE } from "../constants";
import { decodeToken } from "./token";

export async function createSession(token: string, rememberMe: boolean) {
  const cookieStore = await cookies();
  // When `rememberMe` is checked, save session for 7 days
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    ...(rememberMe
      ? { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      : {}),
  });
}

export async function checkSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const payload = await decodeToken(token);
  return !!(payload && payload.id);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

export async function saveLocale(locale: "en" | "es") {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds,
  });
}

export async function getLocale() {
  const cookieStore = await cookies();
  return cookieStore.get(LOCALE_COOKIE)?.value || "en";
}
