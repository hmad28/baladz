import { NextResponse } from "next/server";
import { authenticateSantri, signSantriToken, SANTRI_COOKIE_NAME } from "@/lib/santri-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Nomor Pendaftaran / No. WA dan Kata Sandi wajib diisi" },
        { status: 400 }
      );
    }

    const santri = await authenticateSantri(identifier, password);
    if (!santri) {
      return NextResponse.json(
        {
          success: false,
          error: "Nomor pendaftaran atau kata sandi tidak sesuai. Silakan periksa kembali atau hubungi Panitia PSB.",
        },
        { status: 401 }
      );
    }

    const token = await signSantriToken(santri);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: santri,
    });

    response.cookies.set({
      name: SANTRI_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error santri login:", errorMsg);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
