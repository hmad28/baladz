"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, GraduationCap, MessageCircle } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function formatRupiahRange(minimum: number, maximum?: number): string {
  if (maximum && maximum > minimum) {
    return `${formatRupiah(minimum)}–${formatRupiah(maximum)}`;
  }
  return formatRupiah(minimum);
}

export function PsbInfo() {
  const { content } = useSiteContent();
  const whatsappUrl = `https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent("Assalamu'alaikum tim PSB Baladz, saya ingin menanyakan jadwal dan persyaratan pendaftaran terbaru.")}`;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C2826] font-sans">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative h-10 w-36"><Image src="/images/baladz/logo.png" alt="Logo Baladz" fill className="object-contain" priority /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 sm:text-sm"><ArrowLeft className="h-4 w-4" /> Kembali ke beranda</Link>
        </div>
      </header>

      <section className="border-b border-stone-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">Penerimaan santri baru</span>
          <h1 className="mt-3 text-3xl font-serif font-bold tracking-tight text-[#0F4C3A] sm:text-4xl">Jadwal, biaya, dan tahapan PSB</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">Semua informasi pendaftaran dikumpulkan di halaman ini agar orang tua dapat memeriksa prosesnya tanpa membaca beranda yang panjang.</p>
          {!content.psb.jadwalTerverifikasi && (
            <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-950">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><div><strong>Draft untuk review.</strong> {content.psb.catatanKonfirmasi}</div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Timeline terkonfirmasi</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-serif font-bold text-[#0F4C3A]">Dua gelombang pendaftaran</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Berlaku untuk {content.psb.cakupanJenjang.toLowerCase()}</span>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {content.psb.gelombang.map((gelombang) => (
              <article key={gelombang.nama} className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
                <h3 className="text-lg font-bold text-[#0F4C3A]">{gelombang.nama}</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {[["Pendaftaran & berkas", gelombang.pendaftaranBerkas], ["Seleksi", gelombang.seleksi], ["Pengumuman", gelombang.pengumuman], ["Pelunasan", gelombang.pelunasan]].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0"><dt className="text-stone-500">{label}</dt><dd className="text-right font-semibold text-stone-900">{value}</dd></div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">{content.psb.pertemuanOrangTua}</div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-[#0F4C3A]">Biaya program</h2>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">Rincian ditampilkan per komponen tanpa menjumlahkan biaya awal, bulanan, atau semester. Tidak ada klaim tahun ajaran untuk tabel biaya ini sampai dikonfirmasi tim Baladz.</p>
            <div className="mt-6 space-y-4">
              {content.jenjang.map((program) => (
                <article key={program.id} className="rounded-xl border border-stone-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-900">{program.nama}</h3>
                    {program.hargaTerverifikasi !== true && (
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">Menunggu konfirmasi</span>
                    )}
                  </div>

                  {program.hargaTerverifikasi === true && program.paketBiaya && program.paketBiaya.length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {program.paketBiaya.map((paket) => (
                        <div key={paket.nama} className="rounded-xl bg-[#FAF8F5] p-4">
                          <h4 className="text-sm font-bold text-[#0F4C3A]">{paket.nama}</h4>
                          <dl className="mt-3 space-y-2 text-xs">
                            {paket.komponen.map((komponen) => (
                              <div key={`${paket.nama}-${komponen.nama}`} className="flex items-start justify-between gap-3 border-b border-stone-200 pb-2 last:border-0 last:pb-0">
                                <dt className="text-stone-500">{komponen.nama}</dt>
                                <dd className="text-right font-semibold text-stone-900">{formatRupiahRange(komponen.nominal, komponen.nominalMaksimal)}{komponen.satuan ? <span className="block font-normal text-stone-500">{komponen.satuan}</span> : null}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  ) : program.hargaTerverifikasi === true && program.opsiBiaya ? (
                    <dl className="mt-3 space-y-2 text-sm">
                      {program.opsiBiaya.map((opsi) => (
                        <div key={opsi.label} className="flex justify-between gap-3"><dt className="text-stone-500">{opsi.label}</dt><dd className="font-semibold">{formatRupiah(opsi.nominal)}/bulan</dd></div>
                      ))}
                    </dl>
                  ) : program.hargaTerverifikasi === true ? (
                    <p className="mt-3 text-sm text-stone-600">SPP: <strong className="text-stone-900">{formatRupiah(program.sppBulanan)}/bulan</strong></p>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-stone-500">Rincian biaya program masih menunggu konfirmasi.</p>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0F4C3A] p-6 text-white sm:p-8">
            <h2 className="text-xl font-serif font-bold">Pembayaran & verifikasi</h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100">Transfer hanya setelah mendapat arahan tim Baladz. Bukti transfer diperiksa manual dan tidak otomatis berstatus terverifikasi.</p>
            <div className="mt-5 rounded-xl bg-white/10 p-4"><p className="text-xs text-emerald-200">Rekening terbaru</p><p className="mt-1 font-mono text-lg font-bold">{content.psb.rekeningPembayaran.nomorRekening}</p><p className="text-sm">a.n. {content.psb.rekeningPembayaran.atasNama}</p></div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D97706] px-5 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" /> Konfirmasi via WhatsApp</a>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 sm:p-8">
          <h2 className="text-xl font-serif font-bold text-[#0F4C3A]">Alur pendaftaran</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.psb.alurPendaftaran.map((step) => (
              <div key={step.nomor} className="flex gap-3 rounded-xl bg-[#FAF8F5] p-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">{step.nomor}</div><div><h3 className="text-sm font-bold text-stone-900">{step.judul}</h3><p className="mt-1 text-xs leading-relaxed text-stone-600">{step.keterangan}</p></div></div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-stone-200 p-4 text-sm text-stone-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /> Daftar dokumen dan ketentuan per jenjang masih menunggu konfirmasi final tim Baladz.</div>
        </section>
      </div>

      <section className="bg-[#0F4C3A] py-11 text-center text-white">
        <div className="mx-auto max-w-xl px-4"><h2 className="text-2xl font-serif font-bold">Perlu dibantu memilih program?</h2><p className="mt-2 text-sm text-emerald-100">Hubungi admin resmi Baladz di {content.kontak.whatsappUtama}.</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0F4C3A]"><GraduationCap className="h-4 w-4" /> Tanya admin PSB</a></div>
      </section>
    </main>
  );
}
