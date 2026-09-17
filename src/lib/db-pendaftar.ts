import { getDb } from "./db";
import bcrypt from "bcryptjs";

export async function ensurePendaftarTables() {
  const sql = getDb();
  if (!sql) return;

  try {
    // 1. Add missing columns to pendaftar
    await sql`
      ALTER TABLE pendaftar
      ADD COLUMN IF NOT EXISTS no_pendaftaran VARCHAR(50),
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
      ADD COLUMN IF NOT EXISTS plain_password VARCHAR(100),
      ADD COLUMN IF NOT EXISTS foto_santri TEXT,
      ADD COLUMN IF NOT EXISTS jenis_kelamin VARCHAR(20),
      ADD COLUMN IF NOT EXISTS cita_cita VARCHAR(100),
      ADD COLUMN IF NOT EXISTS status_asrama VARCHAR(50) DEFAULT 'Ya, asrama',
      ADD COLUMN IF NOT EXISTS asal_sekolah VARCHAR(150),
      ADD COLUMN IF NOT EXISTS nama_ibu VARCHAR(150),
      ADD COLUMN IF NOT EXISTS status_berkas VARCHAR(50) DEFAULT 'Belum Lengkap',
      ADD COLUMN IF NOT EXISTS status_pembayaran VARCHAR(50) DEFAULT 'Belum Bayar',
      ADD COLUMN IF NOT EXISTS bukti_pembayaran_url TEXT,
      ADD COLUMN IF NOT EXISTS nominal_bayar INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tanggal_bayar TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS nomor_kuitansi VARCHAR(100),
      ADD COLUMN IF NOT EXISTS metode_bayar VARCHAR(100),
      ADD COLUMN IF NOT EXISTS catatan_pembayaran TEXT,
      ADD COLUMN IF NOT EXISTS catatan_panitia TEXT,
      ADD COLUMN IF NOT EXISTS undangan_terbit BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS lokasi_seleksi VARCHAR(255),
      ADD COLUMN IF NOT EXISTS instruksi_seleksi TEXT,
      ADD COLUMN IF NOT EXISTS hasil_seleksi VARCHAR(50) DEFAULT 'Belum Tersedia',
      ADD COLUMN IF NOT EXISTS pengumuman_terbit BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS catatan_pengumuman TEXT,
      ADD COLUMN IF NOT EXISTS status_daftar_ulang VARCHAR(50) DEFAULT 'Belum Dimulai',
      ADD COLUMN IF NOT EXISTS bukti_daftar_ulang_url TEXT,
      ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
    `;

    // 2. Ensure unique index on no_pendaftaran
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_pendaftar_no_pendaftaran ON pendaftar(no_pendaftaran);
    `;

    // 3. Backfill any existing rows missing no_pendaftaran or password
    const existingWithoutNo = await sql`
      SELECT id, no_wa FROM pendaftar WHERE no_pendaftaran IS NULL OR no_pendaftaran = '' ORDER BY id ASC;
    `;

    for (const row of existingWithoutNo) {
      const padId = String(row.id).padStart(4, "0");
      const generatedNo = `BLZ-26${padId}`;
      const defaultPass = row.no_wa ? row.no_wa.slice(-6) : `blz${row.id}`;
      const hashed = await bcrypt.hash(defaultPass, 10);
      await sql`
        UPDATE pendaftar
        SET no_pendaftaran = ${generatedNo},
            password_hash = ${hashed},
            plain_password = ${defaultPass}
        WHERE id = ${row.id};
      `;
    }

    // 4. Create pendaftar_berkas table
    await sql`
      CREATE TABLE IF NOT EXISTS pendaftar_berkas (
        id SERIAL PRIMARY KEY,
        pendaftar_id INTEGER NOT NULL REFERENCES pendaftar(id) ON DELETE CASCADE,
        kode_berkas VARCHAR(100) NOT NULL,
        nama_berkas VARCHAR(200) NOT NULL,
        file_url TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'menunggu_verifikasi',
        catatan_admin TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT uq_pendaftar_berkas UNIQUE (pendaftar_id, kode_berkas)
      );
    `;

    // 5. Create index for fast lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pendaftar_berkas_pid ON pendaftar_berkas(pendaftar_id);
    `;

    console.log("ensurePendaftarTables successfully ran");
  } catch (err) {
    console.error("Error running ensurePendaftarTables:", err);
  }
}
