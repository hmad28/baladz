import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export const SANTRI_COOKIE_NAME = "baladz_santri_session";

export interface SantriSessionPayload {
  id: number;
  no_pendaftaran: string;
  nama_santri: string;
  jenjang: string;
  nama_wali: string;
  no_wa: string;
  role: "santri";
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "baladz_santri_jwt_secret_key_2026_secure";
  return new TextEncoder().encode(secret);
}

export async function signSantriToken(payload: SantriSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifySantriToken(token: string): Promise<SantriSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: Number(payload.id),
      no_pendaftaran: String(payload.no_pendaftaran),
      nama_santri: String(payload.nama_santri),
      jenjang: String(payload.jenjang),
      nama_wali: String(payload.nama_wali),
      no_wa: String(payload.no_wa),
      role: "santri",
    };
  } catch {
    return null;
  }
}

export async function getSantriSession(): Promise<SantriSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SANTRI_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySantriToken(token);
}

export async function authenticateSantri(
  identifier: string, // no_pendaftaran atau no_wa
  passwordOrPin: string
): Promise<SantriSessionPayload | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const cleanIdentifier = identifier.trim();
    const cleanPass = passwordOrPin.trim();

    const rows = await sql`
      SELECT id, no_pendaftaran, password_hash, plain_password, nama_santri, jenjang, nama_wali, no_wa
      FROM pendaftar
      WHERE LOWER(no_pendaftaran) = LOWER(${cleanIdentifier})
         OR no_wa = ${cleanIdentifier}
         OR no_wa = ${cleanIdentifier.replace(/^0/, "62")}
         OR no_wa = ${cleanIdentifier.replace(/^62/, "0")}
      ORDER BY id DESC
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return null;
    }

    const santri = rows[0];

    // Cek password hash
    let isValid = false;
    if (santri.password_hash) {
      isValid = await bcrypt.compare(cleanPass, santri.password_hash);
    }
    // Fallback cek plain_password jika ada
    if (!isValid && santri.plain_password && santri.plain_password === cleanPass) {
      isValid = true;
    }
    // Fallback cek 6 digit terakhir nomor WA jika pengguna belum set password
    if (!isValid && santri.no_wa && (santri.no_wa.slice(-6) === cleanPass || santri.no_wa === cleanPass)) {
      isValid = true;
    }

    if (!isValid) {
      return null;
    }

    return {
      id: santri.id,
      no_pendaftaran: santri.no_pendaftaran,
      nama_santri: santri.nama_santri,
      jenjang: santri.jenjang,
      nama_wali: santri.nama_wali,
      no_wa: santri.no_wa,
      role: "santri",
    };
  } catch (err) {
    console.error("Error authenticateSantri:", err);
    return null;
  }
}
