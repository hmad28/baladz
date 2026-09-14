import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { COOKIE_NAME, verifyAdminToken, type AdminUserPayload } from "./auth-token";

export * from "./auth-token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Memastikan tabel admin_users tersedia di database Neon
 * dan menyisipkan akun default jika belum ada.
 */
export async function ensureAdminTableAndSeed() {
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        nama VARCHAR(150) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const defaultUsername = process.env.ADMIN_DEFAULT_USER || "admin";
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminbaladz2025";

    const rows = await sql`
      SELECT id FROM admin_users WHERE username = ${defaultUsername} LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      const hashed = await hashPassword(defaultPassword);
      await sql`
        INSERT INTO admin_users (username, password_hash, nama, role)
        VALUES (${defaultUsername}, ${hashed}, 'Admin Baladz', 'admin')
        ON CONFLICT (username) DO NOTHING
      `;
    }
  } catch (err) {
    console.error("Gagal inisialisasi tabel admin_users:", err);
  }
}

/**
 * Autentikasi username & password dengan pengecekan ke Neon DB,
 * dengan fallback ke environment variables jika DB sedang tidak terjangkau.
 */
export async function authenticateAdmin(username: string, password: string): Promise<AdminUserPayload | null> {
  const defaultUser = process.env.ADMIN_DEFAULT_USER || "admin";
  const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || "adminbaladz2025";

  const sql = getDb();
  if (sql) {
    try {
      await ensureAdminTableAndSeed();
      const rows = await sql`
        SELECT id, username, password_hash, nama, role 
        FROM admin_users 
        WHERE username = ${username} 
        LIMIT 1
      `;

      if (rows && rows.length > 0) {
        const user = rows[0];
        const match = await verifyPassword(password, user.password_hash);
        if (match) {
          return {
            id: user.id,
            username: user.username,
            nama: user.nama || "Admin",
            role: user.role || "admin",
          };
        }
      }
    } catch (err) {
      console.error("Gagal memeriksa kredensial di database:", err);
    }
  }

  // Fallback ke kredensial env jika DB belum sinkron / akun default
  if (username === defaultUser && password === defaultPass) {
    return {
      id: 1,
      username: defaultUser,
      nama: "Admin Baladz",
      role: "admin",
    };
  }

  return null;
}

/**
 * Mengambil sesi admin dari Cookie HTTP-only server-side
 */
export async function getAdminSession(): Promise<AdminUserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Mengubah password admin yang sedang aktif
 */
export async function changeAdminPassword(username: string, oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
  const sql = getDb();
  if (!sql) {
    return { success: false, error: "Koneksi database tidak tersedia" };
  }

  try {
    const rows = await sql`
      SELECT id, password_hash FROM admin_users WHERE username = ${username} LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return { success: false, error: "User tidak ditemukan" };
    }

    const match = await verifyPassword(oldPass, rows[0].password_hash);
    if (!match) {
      return { success: false, error: "Password lama tidak sesuai" };
    }

    const newHash = await hashPassword(newPass);
    await sql`
      UPDATE admin_users 
      SET password_hash = ${newHash}, updated_at = NOW() 
      WHERE username = ${username}
    `;

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
