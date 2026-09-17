import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pendaftarId = searchParams.get("pendaftar_id");
    if (!pendaftarId) {
      return NextResponse.json({ success: false, error: "pendaftar_id diperlukan" }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, pendaftar_id, kode_berkas, nama_berkas, file_url, status, catatan_admin, created_at, updated_at
      FROM pendaftar_berkas
      WHERE pendaftar_id = ${Number(pendaftarId)}
      ORDER BY id ASC;
    `;

    return NextResponse.json({ success: true, data: rows });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error fetching pendaftar berkas:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const { id, status, catatan_admin } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID dan status diperlukan" }, { status: 400 });
    }

    const updated = await sql`
      UPDATE pendaftar_berkas
      SET status = ${status}, catatan_admin = ${catatan_admin || null}, updated_at = NOW()
      WHERE id = ${Number(id)}
      RETURNING pendaftar_id;
    `;

    if (updated.length > 0) {
      const pId = updated[0].pendaftar_id;
      // Periksa apakah semua berkas sudah disetujui atau ada yang perlu perbaikan
      const allBerkas = await sql`
        SELECT status FROM pendaftar_berkas WHERE pendaftar_id = ${pId};
      `;
      const hasRejected = allBerkas.some((b) => b.status === "perlu_perbaikan");
      const allApproved = allBerkas.length >= 4 && allBerkas.every((b) => b.status === "disetujui");

      let newStatusBerkas = "Menunggu Verifikasi";
      if (hasRejected) {
        newStatusBerkas = "Perlu Perbaikan";
      } else if (allApproved) {
        newStatusBerkas = "Terverifikasi";
      }

      await sql`
        UPDATE pendaftar
        SET status_berkas = ${newStatusBerkas}
        WHERE id = ${pId};
      `;
    }

    return NextResponse.json({ success: true, message: "Status berkas berhasil diperbarui" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error updating pendaftar berkas:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
