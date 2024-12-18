import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 不需要登录就能访问的路径
const publicPaths = ["/login", "/register", "/share"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // 修改：将 /login 路径添加到公开路径列表中，并修改判断逻辑
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    // 如果已登录用户访问登录页，重定向到首页
    if (token && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 更严格的 token 检查
  if (!token || typeof token !== "object" || !token.id) {
    const url = new URL("/login", request.url);
    if (!pathname.startsWith("/login")) {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
