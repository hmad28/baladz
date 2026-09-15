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
              Pendaftaran santri baru mengikuti jadwal resmi per gelombang dan per jenjang yang telah dikonfirmasi oleh tim Baladz.
            </li>
            <li>
              Mekanisme seleksi, persyaratan, dan keputusan penerimaan mengikuti informasi terbaru yang disampaikan tim Baladz kepada pendaftar.
            </li>
            <li>
              Nominal dan ketentuan pembayaran harus dikonfirmasi terlebih dahulu melalui WhatsApp resmi Baladz sebelum melakukan transfer.
            </li>
            <li>
              Pelunasan biaya daftar ulang dilakukan sebelum batas waktu yang ditentukan. Keterlambatan tanpa konfirmasi dianggap pengunduran diri.
            </li>
            <li>Bukti transfer diperiksa manual oleh tim Baladz. Pengiriman bukti tidak berarti pembayaran sudah otomatis terverifikasi.</li>
          </ul>
        </div>
      </article>
    </main>
  );
}
