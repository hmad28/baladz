import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  // 1. Proteksi Halaman Admin
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // Jika sedang di halaman login dan sudah terautentikasi -> arahkan ke dashboard admin
    if (isLoginPage && session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Jika belum login dan mencoba mengakses halaman selain login -> tendang ke login
    if (!isLoginPage && !session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteksi API Endpoints Terbatas
  // POST ke /api/content hanya untuk admin
  if (pathname === "/api/content" && request.method === "POST") {
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
        { status: 401 }
      );
    }
  }

  // GET, PATCH, DELETE ke /api/pendaftar hanya untuk admin
  // (POST tetap diizinkan untuk formulir publik PSB)
  if (pathname.startsWith("/api/pendaftar") && ["GET", "PATCH", "DELETE"].includes(request.method)) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/content",
    "/api/pendaftar",
  ],
};
