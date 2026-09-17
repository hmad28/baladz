import { NextResponse } from "next/server";
import { getSantriSession } from "@/lib/santri-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSantriSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const { bukti_daftar_ulang_url } = await req.json();

    if (!bukti_daftar_ulang_url) {
      return NextResponse.json(
        { success: false, error: "Bukti pembayaran / berkas daftar ulang wajib diunggah" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE pendaftar
      SET 
        bukti_daftar_ulang_url = ${bukti_daftar_ulang_url},
        status_daftar_ulang = 'Menunggu Verifikasi'
      WHERE id = ${session.id};
    `;

    return NextResponse.json({
      success: true,
      message: "Bukti daftar ulang berhasil dikirim. Menunggu verifikasi akhir panitia.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error submitting re-registration:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
