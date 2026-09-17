import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ensurePendaftarTables } from "@/lib/db-pendaftar";
import { signSantriToken, SANTRI_COOKIE_NAME } from "@/lib/santri-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, data: [] });
  }

  try {
    await ensurePendaftarTables();

    const rows = await sql`
      SELECT 
        p.id, p.no_pendaftaran, p.plain_password, p.nama_santri, p.tgl_lahir_usia, p.jenjang,
        p.nama_wali, p.no_wa, p.alamat, p.status, p.created_at,
        p.foto_santri, p.jenis_kelamin, p.cita_cita, p.status_asrama, p.asal_sekolah, p.nama_ibu,
        p.status_berkas, p.status_pembayaran, p.bukti_pembayaran_url, p.nominal_bayar,
        p.tanggal_bayar, p.nomor_kuitansi, p.metode_bayar, p.catatan_pembayaran, p.catatan_panitia,
        p.jadwal_seleksi, p.lokasi_seleksi, p.instruksi_seleksi, p.undangan_terbit,
        p.hasil_seleksi, p.pengumuman_terbit, p.catatan_pengumuman,
        p.status_daftar_ulang, p.bukti_daftar_ulang_url, p.is_locked,
        COALESCE(b.total_berkas, 0) AS total_berkas,
        COALESCE(b.berkas_disetujui, 0) AS berkas_disetujui
      FROM pendaftar p
      LEFT JOIN (
        SELECT 
          pendaftar_id,
          COUNT(*) AS total_berkas,
          COUNT(*) FILTER (WHERE status = 'disetujui') AS berkas_disetujui
        FROM pendaftar_berkas
        GROUP BY pendaftar_id
      ) b ON b.pendaftar_id = p.id
      ORDER BY p.id DESC;
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error fetching pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    await ensurePendaftarTables();

    const body = await req.json();
    const {
      nama_santri,
      tgl_lahir_usia,
      jenjang,
      nama_wali,
      no_wa,
      alamat,
      jenis_kelamin,
      cita_cita,
      status_asrama,
      asal_sekolah,
      nama_ibu,
    } = body;

    if (!nama_santri || !jenjang || !nama_wali || !no_wa) {
      return NextResponse.json({ success: false, error: "Data wajib belum lengkap" }, { status: 400 });
    }

    // Generate plain_password (default 6 digit angka acak atau 6 digit nomor WA)
    const cleanWa = String(no_wa).replace(/\D/g, "");
    const generatedPass = cleanWa.length >= 6 ? cleanWa.slice(-6) : Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(generatedPass, 10);

    // Dapatkan ID berikutnya untuk nomor pendaftaran yang konsisten
    const seqRow = await sql`
      SELECT nextval('pendaftar_id_seq') AS next_id;
    `;
    const nextId = Number(seqRow[0].next_id);
    const noPendaftaran = `BLZ-26${String(nextId).padStart(4, "0")}`;

    const inserted = await sql`
      INSERT INTO pendaftar (
        id, no_pendaftaran, password_hash, plain_password,
        nama_santri, tgl_lahir_usia, jenjang, nama_wali, no_wa, alamat,
        jenis_kelamin, cita_cita, status_asrama, asal_sekolah, nama_ibu,
        status, status_berkas, status_pembayaran, created_at
      )
      VALUES (
        ${nextId}, ${noPendaftaran}, ${hashed}, ${generatedPass},
        ${nama_santri}, ${tgl_lahir_usia || ""}, ${jenjang}, ${nama_wali}, ${no_wa}, ${alamat || ""},
        ${jenis_kelamin || ""}, ${cita_cita || ""}, ${status_asrama || "Ya, asrama"}, ${asal_sekolah || ""}, ${nama_ibu || ""},
        'Pendaftar masuk — belum ditindaklanjuti', 'Belum Lengkap', 'Belum Bayar', NOW()
      )
      RETURNING id, no_pendaftaran, nama_santri, jenjang, nama_wali, no_wa, plain_password, created_at;
    `;

    const newSantri = inserted[0];

    // Buat token session otomatis agar calon santri bisa langsung masuk dashboard
    const token = await signSantriToken({
      id: newSantri.id,
      no_pendaftaran: newSantri.no_pendaftaran,
      nama_santri: newSantri.nama_santri,
      jenjang: newSantri.jenjang,
      nama_wali: newSantri.nama_wali,
      no_wa: newSantri.no_wa,
      role: "santri",
    });

    const response = NextResponse.json({
      success: true,
      data: newSantri,
      no_pendaftaran: newSantri.no_pendaftaran,
      password: newSantri.plain_password,
    });

    // Set cookie login santri
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
    console.error("Error creating pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID diperlukan" }, { status: 400 });
    }

    const pId = Number(id);

    // Ambil field-field yang dapat diperbarui oleh admin
    const {
      status,
      status_berkas,
      status_pembayaran,
      nominal_bayar,
      nomor_kuitansi,
      catatan_pembayaran,
      catatan_panitia,
      jadwal_seleksi,
      lokasi_seleksi,
      instruksi_seleksi,
      undangan_terbit,
      hasil_seleksi,
      pengumuman_terbit,
      catatan_pengumuman,
      status_daftar_ulang,
      is_locked,
    } = body;

    await sql`
      UPDATE pendaftar
      SET 
        status = COALESCE(${status}, status),
        status_berkas = COALESCE(${status_berkas}, status_berkas),
        status_pembayaran = COALESCE(${status_pembayaran}, status_pembayaran),
        nominal_bayar = COALESCE(${nominal_bayar !== undefined ? Number(nominal_bayar) : null}, nominal_bayar),
        nomor_kuitansi = COALESCE(${nomor_kuitansi}, nomor_kuitansi),
        catatan_pembayaran = COALESCE(${catatan_pembayaran}, catatan_pembayaran),
        catatan_panitia = COALESCE(${catatan_panitia}, catatan_panitia),
        jadwal_seleksi = COALESCE(${jadwal_seleksi}, jadwal_seleksi),
        lokasi_seleksi = COALESCE(${lokasi_seleksi}, lokasi_seleksi),
        instruksi_seleksi = COALESCE(${instruksi_seleksi}, instruksi_seleksi),
        undangan_terbit = COALESCE(${undangan_terbit}, undangan_terbit),
        hasil_seleksi = COALESCE(${hasil_seleksi}, hasil_seleksi),
        pengumuman_terbit = COALESCE(${pengumuman_terbit}, pengumuman_terbit),
        catatan_pengumuman = COALESCE(${catatan_pengumuman}, catatan_pengumuman),
        status_daftar_ulang = COALESCE(${status_daftar_ulang}, status_daftar_ulang),
        is_locked = COALESCE(${is_locked}, is_locked)
      WHERE id = ${pId};
    `;

    return NextResponse.json({ success: true, message: "Data pendaftar berhasil diperbarui" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error updating pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Sesi login admin diperlukan." },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID diperlukan" }, { status: 400 });
    }

    await sql`
      DELETE FROM pendaftar
      WHERE id = ${Number(id)};
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error deleting pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
