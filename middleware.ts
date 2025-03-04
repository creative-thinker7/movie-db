import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/app/constants";
import { decodeToken } from "@/libs/token";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  let isAuthenticated = false;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (token) {
    const payload = await decodeToken(token);
    if (payload && payload.id) {
      isAuthenticated = true;
    }
  }

  if (path !== "/signin" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (path === "/signin" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*.png|.*.svg$).*)",
  ],
};
