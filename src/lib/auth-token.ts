import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "baladz_admin_session";

export interface AdminUserPayload {
  id: number | string;
  username: string;
  nama: string;
  role: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "baladz_super_secret_jwt_key_2025_neondb_secure_auth";
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminUserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: (payload.id as number | string) || 1,
      username: (payload.username as string) || "",
      nama: (payload.nama as string) || "Admin",
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}
