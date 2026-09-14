import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] py-16 text-stone-800">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          href="/"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <h1 className="mt-8 font-serif text-4xl sm:text-5xl font-bold text-[#0F4C3A]">
          Syarat & Ketentuan
        </h1>
        <div className="mt-8 space-y-4 text-sm sm:text-base leading-relaxed text-stone-600">
          <p>
            Selamat datang di website resmi Baladil Huffaadz (Yayasan Baladz Cerdas Mulia). Dengan mengakses situs ini atau mendaftarkan putra-putri Anda dalam program PSB, Anda menyetujui ketentuan berikut:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Pendaftaran santri baru mengikuti jadwal resmi yang ditetapkan panitia ({`1 Februari s/d 15 Juni 2027`}) atau sampai kuota 13 santri terpenuhi.
            </li>
            <li>
              Kelulusan calon santri ditentukan berdasarkan hasil tes seleksi tilawah, daya ingat hafalan, serta wawancara kesiapan orang tua/wali santri.
            </li>
            <li>
              Biaya pendaftaran sebesar Rp 150.000,- tidak dapat ditarik kembali setelah proses verifikasi berkas berjalan.
            </li>
            <li>
              Pelunasan biaya daftar ulang dilakukan sebelum batas waktu yang ditentukan. Keterlambatan tanpa konfirmasi dianggap pengunduran diri.
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
