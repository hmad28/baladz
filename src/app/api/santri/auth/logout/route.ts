import { NextResponse } from "next/server";
import { SANTRI_COOKIE_NAME } from "@/lib/santri-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar" });
  response.cookies.delete(SANTRI_COOKIE_NAME);
  return response;
}
