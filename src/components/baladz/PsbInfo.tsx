"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function PsbInfo() {
  const { content } = useSiteContent();

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C2826] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-36">
              <Image
                src="/images/baladz/logo.png"
                alt="Baladz Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Hero Banner PSB */}
      <section className="bg-gradient-to-b from-[#FAF6EE] to-white border-b border-stone-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Penerimaan Santri Baru
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F4C3A]">
            Informasi Pendaftaran Santri Baru {content.psb.tahunAjaran}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Baladil Huffaadz membuka kesempatan bagi <strong>{content.psb.kuotaSantri} calon santri baru</strong> untuk dididik dalam lingkungan Qur&apos;ani beradab dan bersanad 30 Juz.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20ingin%20mendaftar.`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-6 py-3 rounded-lg font-bold text-sm shadow flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Daftar Sekarang via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Rincian Alur & Biaya */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Biaya Jenjang */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#0F4C3A]">
            Rincian Biaya Daftar Ulang Berdasarkan Jenjang
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-emerald-50 text-emerald-950 uppercase text-[11px] font-bold border-b border-emerald-100">
                <tr>
                  <th className="py-3 px-4">Jenjang Level</th>
                  <th className="py-3 px-4">Uang Pangkal</th>
                  <th className="py-3 px-4">SPP / Syahriyah</th>
                  <th className="py-3 px-4">Boarding (Asrama)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {content.jenjang.map((j) => (
                  <tr key={j.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{j.nama}</td>
                    <td className="py-3.5 px-4 text-stone-700">{formatRupiah(j.uangPangkal)}</td>
                    <td className="py-3.5 px-4 text-emerald-800 font-medium">{formatRupiah(j.sppBulanan)}/bln</td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {j.isBoardingTersedia && j.biayaBoarding ? `${formatRupiah(j.biayaBoarding)}/bln` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200">
            <strong>Penting:</strong> Biaya daftar ulang ditransfer ke Rekening: <strong>{content.psb.rekeningPembayaran.nomorRekening}</strong> a.n. {content.psb.rekeningPembayaran.atasNama} sebelum batas waktu {content.psb.batasDaftarUlang}.
          </div>
        </div>

        {/* Alur PSB */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#0F4C3A]">
            Alur Pendaftaran (1 Februari – 15 Juni 2027)
          </h2>
          <div className="space-y-4">
            {content.psb.alurPendaftaran.map((step) => (
              <div key={step.nomor} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {step.nomor}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{step.judul}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{step.keterangan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <section className="bg-[#0F4C3A] text-white py-12 text-center">
        <div className="max-w-xl mx-auto px-4 space-y-3">
          <h3 className="font-serif font-bold text-2xl">Butuh Panduan Pendaftaran?</h3>
          <p className="text-xs sm:text-sm text-emerald-100">
            Panitia PSB siap membimbing proses registrasi hingga selesai melalui WhatsApp.
          </p>
          <a
            href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Panitia PSB ({content.kontak.whatsappUtama})
          </a>
        </div>
      </section>
    </main>
  );
}
