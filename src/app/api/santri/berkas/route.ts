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
    const { kode_berkas, nama_berkas, file_url } = await req.json();

    if (!kode_berkas || !nama_berkas || !file_url) {
      return NextResponse.json(
        { success: false, error: "Kode berkas, nama berkas, dan file URL wajib diisi" },
        { status: 400 }
      );
    }

    // Insert or update berkas record
    await sql`
      INSERT INTO pendaftar_berkas (pendaftar_id, kode_berkas, nama_berkas, file_url, status, catatan_admin, updated_at)
      VALUES (${session.id}, ${kode_berkas}, ${nama_berkas}, ${file_url}, 'menunggu_verifikasi', NULL, NOW())
      ON CONFLICT (pendaftar_id, kode_berkas)
      DO UPDATE SET
        nama_berkas = EXCLUDED.nama_berkas,
        file_url = EXCLUDED.file_url,
        status = 'menunggu_verifikasi',
        catatan_admin = NULL,
        updated_at = NOW();
    `;

    // Jika kode_berkas adalah foto_santri, update juga di kolom foto_santri pada pendaftar
    if (kode_berkas === "foto_santri") {
      await sql`
        UPDATE pendaftar
        SET foto_santri = ${file_url}
        WHERE id = ${session.id};
      `;
    }

    // Update status berkas di tabel pendaftar menjadi Menunggu Verifikasi
    await sql`
      UPDATE pendaftar
      SET status_berkas = 'Menunggu Verifikasi'
      WHERE id = ${session.id} AND status_berkas != 'Terverifikasi';
    `;

    return NextResponse.json({
      success: true,
      message: `Berkas ${nama_berkas} berhasil diunggah dan sedang menunggu verifikasi panitia.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error uploading santri berkas:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
