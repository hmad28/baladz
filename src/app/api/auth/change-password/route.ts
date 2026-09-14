import { NextResponse } from "next/server";
import { getAdminSession, changeAdminPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password lama dan baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const res = await changeAdminPassword(session.username, oldPassword, newPassword);

    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error || "Gagal mengubah password" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
