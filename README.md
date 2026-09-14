# Baladz Website

Website resmi Baladz — Platform informasi lembaga pendidikan Islam & pesantren, pendaftaran santri baru (PSB), berita/kegiatan, dan manajemen konten.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Bahasa:** TypeScript (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Fitur

- **Beranda (Landing Page):** Profil lembaga, program pendidikan (PAUDQ, LQ, dll.), berita/agenda, fasilitas, testimoni, dan galeri kegiatan.
- **Pendaftaran Santri Baru (PSB):** Informasi alur pendaftaran, persyaratan, dan form pendaftaran online.
- **Panel Admin:** Dashboard untuk memodifikasi konten website secara langsung.
- **Halaman Statis:** Kebijakan Privasi (`/kebijakan-privasi`), Syarat & Ketentuan (`/syarat-ketentuan`), dan Not Found kustom (`/not-found`).
- **Desain Responsif:** Optimal di perangkat seluler maupun desktop.

## Struktur Direktori

```
src/
  app/                    # Next.js App Router pages
    admin/                # Panel admin pengelolaan konten
    kebijakan-privasi/    # Halaman kebijakan privasi
    psb/                  # Informasi & pendaftaran PSB
    syarat-ketentuan/     # Halaman syarat dan ketentuan
    layout.tsx            # Root layout
    page.tsx              # Halaman utama
    globals.css           # Konfigurasi Tailwind CSS v4 & styling global
  components/
    baladz/               # Komponen UI spesifik Baladz
      AdminDashboard.tsx  # Komponen panel admin
      PsbInfo.tsx         # Komponen informasi pendaftaran
      PublicSite.tsx      # Komponen tampilan utama website
      SiteContentProvider.tsx # Provider context state konten
  content/
    site-content.ts       # Data konten default website
public/
  images/
    baladz/               # Aset gambar resmi Baladz
```

## Menjalankan Proyek

### 1. Instal Dependensi

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 3. Build untuk Produksi

```bash
npm run build
```

### 4. Pemeriksaan Kode

```bash
npm run check    # Menjalankan lint + typecheck + build
```
