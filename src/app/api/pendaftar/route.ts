import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, data: [] });
  }

  try {
    const rows = await sql`
      SELECT id, nama_santri, tgl_lahir_usia, jenjang, nama_wali, no_wa, alamat, status, created_at
      FROM pendaftar
      ORDER BY id DESC
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
    const { nama_santri, tgl_lahir_usia, jenjang, nama_wali, no_wa, alamat } = await req.json();

    if (!nama_santri || !jenjang || !nama_wali || !no_wa) {
      return NextResponse.json({ success: false, error: "Data wajib belum lengkap" }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO pendaftar (nama_santri, tgl_lahir_usia, jenjang, nama_wali, no_wa, alamat, status, created_at)
      VALUES (${nama_santri}, ${tgl_lahir_usia || ""}, ${jenjang}, ${nama_wali}, ${no_wa}, ${alamat || ""}, 'Baru', NOW())
      RETURNING id, nama_santri, created_at
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error creating pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID dan status diperlukan" }, { status: 400 });
    }

    await sql`
      UPDATE pendaftar
      SET status = ${status}
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error updating pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error deleting pendaftar:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
