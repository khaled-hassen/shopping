import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { protectedRoutes, route, unProtectedRoutes } from "@/router";

const PUBLIC_FILE = /\.(.*)$/;
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  )
    return res;

  const token = await getToken({ req });

  const isProtected = protectedRoutes.some(
    ([_, route]) => route.path === pathname,
  );
  if (isProtected) {
    if (!token) {
      const url = new URL(route("login"), req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  const notProtected = unProtectedRoutes.some(
    ([_, route]) => route.path === pathname,
  );
  if (notProtected) {
    if (token) {
      const url = new URL(pathname, req.url);
      const referer = req.headers.get("referer");
      if (!referer || referer === url.toString())
        return NextResponse.redirect(new URL(route("home"), req.url));
      return NextResponse.redirect(referer, { status: 301 });
    }
  }
  return res;
}
