"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  FileText,
  GraduationCap,
  MessageCircle,
  Users,
} from "lucide-react";
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
          <Link href="/" className="relative h-10 w-36">
            <Image src="/images/baladz/logo.png" alt="Logo Baladz" fill className="object-contain" priority />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 sm:text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke beranda</span>
          </Link>
        </div>
      </header>

      {/* HERO / HEADER SECTION */}
      <section className="border-b border-stone-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#D97706] border border-amber-200">
            <span>Penerimaan Santri Baru</span>
            {content.psb.tahunAjaran && (
              <>
                <span className="text-amber-400">•</span>
                <span>TA {content.psb.tahunAjaran}</span>
              </>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-serif font-bold tracking-tight text-[#0F4C3A] sm:text-4xl lg:text-5xl">
            Jadwal, Biaya, dan Tahapan PSB
          </h1>
          {content.psb.tahunAjaran && (
            <p className="mt-2 text-base sm:text-lg font-semibold text-emerald-800">
              Tahun Ajaran {content.psb.tahunAjaran}
            </p>
          )}
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
            Semua informasi pendaftaran dikumpulkan di halaman ini agar orang tua dapat memeriksa prosesnya secara lengkap, transparan, dan terstruktur.
          </p>

          {/* Quick Summary Badges (Langsung tersinkronisasi dengan CMS) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
            {content.psb.tanggalBuka && content.psb.tanggalTutup && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 shadow-2xs text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="text-left">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Periode Pendaftaran</span>
                  <span className="font-semibold text-emerald-950">{content.psb.tanggalBuka} – {content.psb.tanggalTutup}</span>
                </div>
              </div>
            )}
            {content.psb.biayaPendaftaran > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 shadow-2xs text-stone-700">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="text-left">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Biaya Formulir</span>
                  <span className="font-semibold text-emerald-950">{formatRupiah(content.psb.biayaPendaftaran)}</span>
                </div>
              </div>
            )}
            {content.psb.kuotaSantri > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 shadow-2xs text-stone-700">
                <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="text-left">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Kuota Penerimaan</span>
                  <span className="font-semibold text-emerald-950">{content.psb.kuotaSantri} Santri</span>
                </div>
              </div>
            )}
          </div>

          {!content.psb.jadwalTerverifikasi && (
            <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-950">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <strong>Draft untuk review.</strong> {content.psb.catatanKonfirmasi || "Jadwal dan kuota masih dalam proses konfirmasi final panitia PSB."}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        {/* SECTION 1: TIMELINE GELOMBANG */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Timeline Terkonfirmasi</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-serif font-bold text-[#0F4C3A]">Jadwal Gelombang Pendaftaran</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Berlaku untuk {content.psb.cakupanJenjang ? content.psb.cakupanJenjang.toLowerCase() : "semua jenjang"}
              </span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {content.psb.gelombang.map((gelombang) => (
              <article key={gelombang.nama} className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0F4C3A]">{gelombang.nama}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    TA {content.psb.tahunAjaran}
                  </span>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Pendaftaran & berkas", gelombang.pendaftaranBerkas],
                    ["Seleksi", gelombang.seleksi],
                    ["Pengumuman", gelombang.pengumuman],
                    ["Pelunasan", gelombang.pelunasan],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                      <dt className="text-stone-500">{label}</dt>
                      <dd className="text-right font-semibold text-stone-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          {content.psb.pertemuanOrangTua && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950 flex items-center gap-2 border border-emerald-200/80">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{content.psb.pertemuanOrangTua}</span>
            </div>
          )}
        </section>

        {/* SECTION 2: BIAYA PROGRAM & PEMBAYARAN */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0F4C3A]">Rincian Biaya Pendidikan</h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Rincian ditampilkan per komponen tanpa menjumlahkan paksa. Biaya transparan sesuai program yang dipilih.
              </p>
            </div>

            {/* Biaya Formulir Pendaftaran Box */}
            {content.psb.biayaPendaftaran > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Biaya Formulir Pendaftaran</span>
                  <p className="text-xs text-stone-600 mt-0.5">Biaya seleksi & administrasi formulir awal pendaftaran</p>
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-900 shrink-0">
                  {formatRupiah(content.psb.biayaPendaftaran)}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {content.jenjang.map((program) => (
                <article key={program.id} className="rounded-xl border border-stone-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-900">{program.nama}</h3>
                    {program.hargaTerverifikasi !== true && (
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
                        Menunggu konfirmasi
                      </span>
                    )}
                  </div>

                  {program.hargaTerverifikasi === true && program.paketBiaya && program.paketBiaya.length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {program.paketBiaya.map((paket) => (
                        <div key={paket.nama} className="rounded-xl bg-[#FAF8F5] p-4">
                          <h4 className="text-sm font-bold text-[#0F4C3A]">{paket.nama}</h4>
                          <dl className="mt-3 space-y-2 text-xs">
                            {paket.komponen.map((komponen) => (
                              <div
                                key={`${paket.nama}-${komponen.nama}`}
                                className="flex items-start justify-between gap-3 border-b border-stone-200 pb-2 last:border-0 last:pb-0"
                              >
                                <dt className="text-stone-500">{komponen.nama}</dt>
                                <dd className="text-right font-semibold text-stone-900">
                                  {formatRupiahRange(komponen.nominal, komponen.nominalMaksimal)}
                                  {komponen.satuan ? <span className="block font-normal text-stone-500">{komponen.satuan}</span> : null}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  ) : program.hargaTerverifikasi === true && program.opsiBiaya ? (
                    <dl className="mt-3 space-y-2 text-sm">
                      {program.opsiBiaya.map((opsi) => (
                        <div key={opsi.label} className="flex justify-between gap-3">
                          <dt className="text-stone-500">{opsi.label}</dt>
                          <dd className="font-semibold">{formatRupiah(opsi.nominal)}/bulan</dd>
                        </div>
                      ))}
                    </dl>
                  ) : program.hargaTerverifikasi === true ? (
                    <p className="mt-3 text-sm text-stone-600">
                      SPP: <strong className="text-stone-900">{formatRupiah(program.sppBulanan)}/bulan</strong>
                    </p>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-stone-500">
                      Rincian biaya program masih menunggu konfirmasi.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* Pembayaran & Rekening Resmi (Sticky Sidebar on Desktop) */}
          <div className="h-fit self-start lg:sticky lg:top-8 rounded-2xl bg-[#0F4C3A] p-6 text-white sm:p-8 shadow-sm border border-emerald-800 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-2 border border-white/10">
                Instruksi Resmi
              </div>
              <h2 className="text-xl font-serif font-bold">Pembayaran & Verifikasi</h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-100">
                Transfer biaya formulir dan daftar ulang hanya dilakukan ke rekening resmi yayasan. Bukti transfer diverifikasi secara manual oleh staf PSB.
              </p>

              <div className="mt-5 rounded-xl bg-white/10 p-4 border border-white/10 space-y-1">
                <p className="text-xs text-emerald-200 font-medium uppercase tracking-wider">
                  {content.psb.rekeningPembayaran.bank || "Rekening Resmi Yayasan"}
                </p>
                <p className="mt-1 font-mono text-xl sm:text-2xl font-bold tracking-wider text-white">
                  {content.psb.rekeningPembayaran.nomorRekening}
                </p>
                <p className="text-sm text-emerald-100">
                  a.n. <span className="font-semibold text-white">{content.psb.rekeningPembayaran.atasNama}</span>
                </p>
              </div>

              {content.psb.rekeningPembayaran.catatanTransfer && (
                <p className="mt-3 text-xs text-emerald-200 leading-relaxed italic">
                  {content.psb.rekeningPembayaran.catatanTransfer}
                </p>
              )}

              {content.psb.batasDaftarUlang && (
                <div className="mt-4 rounded-lg bg-emerald-950/50 p-3 border border-emerald-600/40 text-xs">
                  <span className="text-emerald-300 font-bold block">Batas Pelunasan / Daftar Ulang:</span>
                  <span className="text-white font-semibold">{content.psb.batasDaftarUlang}</span>
                </div>
              )}

              {/* Tombol Konfirmasi ditempatkan tepat setelah informasi pembayaran */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97706] hover:bg-[#b56405] px-5 py-3 text-sm font-bold text-white transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Konfirmasi via WhatsApp</span>
                </a>
                <p className="mt-2 text-center text-[11px] text-emerald-200/80">
                  Kirim bukti transfer ke WhatsApp resmi panitia PSB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ALUR PENDAFTARAN */}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Langkah Demi Langkah</p>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-1">Alur Pendaftaran Santri Baru</h2>
            </div>
            {content.psb.batasDaftarUlang && (
              <span className="text-xs text-stone-500">
                Batas daftar ulang: <strong className="text-stone-800">{content.psb.batasDaftarUlang}</strong>
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.psb.alurPendaftaran.map((step) => (
              <div key={step.nomor} className="flex gap-3 rounded-xl bg-[#FAF8F5] p-4 border border-stone-200/60">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">
                  {step.nomor}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{step.judul}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{step.keterangan}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Persyaratan Berkas & Materi Seleksi dari CMS */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 pt-6 border-t border-stone-100">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-3">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <span>Persyaratan Berkas</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-600">
                {content.psb.syaratBerkas.map((syarat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{syarat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-3">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Materi & Pelaksanaan Seleksi</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-600">
                {content.psb.materiSeleksi.map((materi, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{materi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER CTA */}
      <section className="bg-[#0F4C3A] py-11 text-center text-white">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-serif font-bold">Perlu dibantu memilih program?</h2>
          <p className="mt-2 text-sm text-emerald-100">
            Hubungi panitia PSB resmi Baladz melalui nomor {content.kontak.whatsappUtama}.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0F4C3A] hover:bg-stone-100 transition-colors shadow-sm"
          >
            <GraduationCap className="h-4 w-4 text-emerald-800" />
            <span>Tanya Panitia PSB via WhatsApp</span>
          </a>
        </div>
      </section>
    </main>
  );
}
