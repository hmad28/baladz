import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Kebijakan Privasi
        </h1>
        <div className="mt-8 space-y-4 text-sm sm:text-base leading-relaxed text-stone-600">
          <p>
            Yayasan Baladz Cerdas Mulia berkomitmen menjaga kerahasiaan data pribadi calon santri dan orang tua/wali santri yang dikirimkan melalui formulir pendaftaran online maupun WhatsApp resmi.
          </p>
          <p>
            Data yang dikumpulkan (seperti nama, nomor telepon, tanggal lahir, dan berkas administratif) semata-mata digunakan untuk kepentingan administrasi penerimaan santri baru (PSB), komunikasi kegiatan akademik, dan verifikasi kelayakan calon santri.
          </p>
          <p>
            Baladz tidak akan pernah menjual, menyebarluaskan, atau membagikan data pribadi Anda kepada pihak ketiga manapun di luar kepentingan resmi operasional pendidikan lembaga.
          </p>
        </div>
      </article>
    </main>
  );
}
