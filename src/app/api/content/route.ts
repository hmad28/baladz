import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { defaultSiteContent } from "@/content/site-content";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, source: "default", data: defaultSiteContent });
  }

  try {
    const rows = await sql`
      SELECT data FROM site_settings WHERE id = 'default' LIMIT 1
    `;

    if (rows && rows.length > 0 && rows[0].data) {
      return NextResponse.json({ success: true, source: "database", data: rows[0].data });
    }

    return NextResponse.json({ success: false, source: "default", data: defaultSiteContent });
  } catch (err) {
    console.error("Error fetching site_settings from Neon:", err);
    return NextResponse.json({ success: false, source: "fallback", data: defaultSiteContent });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
      { status: 401 }
    );
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();

    await sql`
      INSERT INTO site_settings (id, data, updated_at)
      VALUES ('default', ${JSON.stringify(body)}, NOW())
      ON CONFLICT (id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `;

    return NextResponse.json({ success: true, message: "Konten berhasil disimpan ke database Neon" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error saving site_settings to Neon:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
