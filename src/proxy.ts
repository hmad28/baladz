import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth-token";
import { SANTRI_COOKIE_NAME, verifySantriToken } from "@/lib/santri-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Area Protection
  const adminToken = request.cookies.get(COOKIE_NAME)?.value;
  const adminSession = adminToken ? await verifyAdminToken(adminToken) : null;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage && adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!isLoginPage && !adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/api/content" && request.method === "POST" && !adminSession) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  if (
    pathname.startsWith("/api/pendaftar") &&
    ["GET", "PATCH", "DELETE"].includes(request.method) &&
    !adminSession
  ) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  // 2. Calon Santri Dashboard Area Protection
  if (pathname.startsWith("/dashboard")) {
    const santriToken = request.cookies.get(SANTRI_COOKIE_NAME)?.value;
    const santriSession = santriToken ? await verifySantriToken(santriToken) : null;
    const isSantriLoginPage = pathname === "/dashboard/login";

    if (isSantriLoginPage && santriSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isSantriLoginPage && !santriSession) {
      const loginUrl = new URL("/dashboard/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/pendaftar", "/dashboard/:path*"],
};
