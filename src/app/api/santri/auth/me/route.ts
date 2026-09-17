import { NextResponse } from "next/server";
import { getSantriSession } from "@/lib/santri-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSantriSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Sesi login santri tidak ditemukan" },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database tidak terhubung" }, { status: 500 });
  }

  try {
    const rows = await sql`
      SELECT 
        id, no_pendaftaran, nama_santri, tgl_lahir_usia, jenjang, nama_wali, no_wa, alamat,
        foto_santri, jenis_kelamin, cita_cita, status_asrama, asal_sekolah, nama_ibu,
        status, status_berkas, status_pembayaran, bukti_pembayaran_url, nominal_bayar,
        tanggal_bayar, nomor_kuitansi, metode_bayar, catatan_pembayaran, catatan_panitia,
        jadwal_seleksi, lokasi_seleksi, instruksi_seleksi, undangan_terbit,
        hasil_seleksi, pengumuman_terbit, catatan_pengumuman,
        status_daftar_ulang, bukti_daftar_ulang_url, is_locked, created_at
      FROM pendaftar
      WHERE id = ${session.id}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Data pendaftar tidak ditemukan" },
        { status: 404 }
      );
    }

    const santri = rows[0];

    // Ambil berkas-berkas yang sudah diunggah
    const berkasRows = await sql`
      SELECT id, kode_berkas, nama_berkas, file_url, status, catatan_admin, created_at, updated_at
      FROM pendaftar_berkas
      WHERE pendaftar_id = ${session.id}
      ORDER BY id ASC;
    `;

    return NextResponse.json({
      success: true,
      data: {
        ...santri,
        berkasList: berkasRows,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error fetching santri me:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
