import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/management"];
const protectedApiRoutes = ["/api/edgestore"];

export default async function middleare(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (
    protectedApiRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/management/:path*", "/api/edgestore/:path*"],
};
