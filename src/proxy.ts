import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage && session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!isLoginPage && !session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/api/content" && request.method === "POST" && !session) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  if (
    pathname.startsWith("/api/pendaftar") &&
    ["GET", "PATCH", "DELETE"].includes(request.method) &&
    !session
  ) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/pendaftar"],
};
