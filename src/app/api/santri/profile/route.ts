import { NextResponse } from "next/server";
import { getSantriSession } from "@/lib/santri-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const session = await getSantriSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    // Cek apakah data pendaftaran dikunci oleh panitia
    const checkLock = await sql`
      SELECT is_locked FROM pendaftar WHERE id = ${session.id} LIMIT 1;
    `;
    if (checkLock[0]?.is_locked) {
      return NextResponse.json(
        {
          success: false,
          error: "Data pendaftaran telah diverifikasi dan dikunci oleh panitia. Hubungi panitia jika membutuhkan perubahan data.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      nama_santri,
      tgl_lahir_usia,
      jenis_kelamin,
      cita_cita,
      status_asrama,
      asal_sekolah,
      nama_wali,
      nama_ibu,
      no_wa,
      alamat,
      foto_santri,
    } = body;

    await sql`
      UPDATE pendaftar
      SET 
        nama_santri = COALESCE(${nama_santri}, nama_santri),
        tgl_lahir_usia = COALESCE(${tgl_lahir_usia}, tgl_lahir_usia),
        jenis_kelamin = COALESCE(${jenis_kelamin}, jenis_kelamin),
        cita_cita = COALESCE(${cita_cita}, cita_cita),
        status_asrama = COALESCE(${status_asrama}, status_asrama),
        asal_sekolah = COALESCE(${asal_sekolah}, asal_sekolah),
        nama_wali = COALESCE(${nama_wali}, nama_wali),
        nama_ibu = COALESCE(${nama_ibu}, nama_ibu),
        no_wa = COALESCE(${no_wa}, no_wa),
        alamat = COALESCE(${alamat}, alamat),
        foto_santri = COALESCE(${foto_santri}, foto_santri)
      WHERE id = ${session.id};
    `;

    return NextResponse.json({
      success: true,
      message: "Biodata berhasil diperbarui",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error updating santri profile:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
