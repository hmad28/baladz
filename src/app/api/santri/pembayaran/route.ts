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
    const { bukti_pembayaran_url, nominal_bayar, metode_bayar, catatan_pembayaran } = await req.json();

    if (!bukti_pembayaran_url) {
      return NextResponse.json(
        { success: false, error: "Foto / bukti transfer pembayaran wajib diunggah" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE pendaftar
      SET 
        bukti_pembayaran_url = ${bukti_pembayaran_url},
        nominal_bayar = ${Number(nominal_bayar) || 0},
        metode_bayar = ${metode_bayar || "Transfer Bank"},
        catatan_pembayaran = ${catatan_pembayaran || ""},
        tanggal_bayar = NOW(),
        status_pembayaran = 'Menunggu Verifikasi'
      WHERE id = ${session.id};
    `;

    return NextResponse.json({
      success: true,
      message: "Bukti pembayaran berhasil diunggah. Panitia akan segera memverifikasi.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error submitting santri payment:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
