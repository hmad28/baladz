"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { resolvePopupCtaUrl, type BeritaKabar } from "@/content/site-content";

// Helper formatter mata uang rupiah
function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatRupiahRange(minimum: number, maximum?: number): string {
  if (maximum && maximum > minimum) {
    return `${formatRupiah(minimum)}–${formatRupiah(maximum)}`;
  }
  return formatRupiah(minimum);
}

export function PublicSite() {
  const { content } = useSiteContent();

  const [activeTab, setActiveTab] = useState<"beranda" | "kabar">("beranda");

  // Popup cukup sekali per sesi agar tidak mengganggu saat pengunjung berpindah tab.
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupScheduledRef = useRef(false);

  useEffect(() => {
    if (!content.popup?.aktif || popupScheduledRef.current) return;

    const sessionKey = "baladz-popup-shown";
    if (window.sessionStorage.getItem(sessionKey)) return;

    popupScheduledRef.current = true;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(sessionKey, "true");
      setIsPopupOpen(true);
    }, 400);

    return () => {
      window.clearTimeout(timer);
      popupScheduledRef.current = false;
    };
  }, [content.popup?.aktif]);

  // Mobile menu open/close
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kalkulator biaya jenjang terpilih di Beranda
  const [selectedJenjangId, setSelectedJenjangId] = useState<string>("sd-tahfidz");
  const [includeBoarding, setIncludeBoarding] = useState(false);

  // Modal pendaftaran form
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerJenjang, setRegisterJenjang] = useState<string>("SDTahfidz (Sekolah Sulaiman Homeschooling)");
  const [formNamaSantri, setFormNamaSantri] = useState("");
  const [formTglLahir, setFormTglLahir] = useState("");
  const [formNamaWali, setFormNamaWali] = useState("");
  const [formNoWa, setFormNoWa] = useState("");
  const [formAlamat, setFormAlamat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modal baca Kabar Baladz
  const [activeKabarModal, setActiveKabarModal] = useState<BeritaKabar | null>(null);

  // Jenjang kalkulator aktif
  const currentCalcJenjang = content.jenjang.find((j) => j.id === selectedJenjangId) || content.jenjang[0];

  // Submit form pendaftaran online ke Neon DB & WhatsApp resmi
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const waWindow = window.open("about:blank", "_blank");

    try {
      const response = await fetch("/api/pendaftar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_santri: formNamaSantri,
          tgl_lahir_usia: formTglLahir,
          jenjang: registerJenjang,
          nama_wali: formNamaWali,
          no_wa: formNoWa,
          alamat: formAlamat,
        }),
      });
      if (!response.ok) throw new Error("Data pendaftar belum tersimpan");

      const pesan = `*PENDAFTARAN SANTRI BARU BALADZ ${content.psb.tahunAjaran}*%0A%0A`
      + `*Nama Calon Santri:* ${encodeURIComponent(formNamaSantri)}%0A`
      + `*Tanggal Lahir / Usia:* ${encodeURIComponent(formTglLahir)}%0A`
      + `*Pilihan Jenjang:* ${encodeURIComponent(registerJenjang)}%0A`
      + `*Nama Orang Tua / Wali:* ${encodeURIComponent(formNamaWali)}%0A`
      + `*No. WhatsApp:* ${encodeURIComponent(formNoWa)}%0A`
      + `*Alamat Domisili:* ${encodeURIComponent(formAlamat)}%0A%0A`
      + `Data saya sudah masuk melalui website. Mohon tindak lanjut informasi seleksi. Pesan ini belum terkirim sampai saya menekan tombol kirim di WhatsApp.`;

      const waUrl = `https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${pesan}`;
      if (waWindow) waWindow.location.href = waUrl;
      else window.location.href = waUrl;
      setIsRegisterModalOpen(false);
    } catch {
      waWindow?.close();
      setSubmitError("Data belum berhasil disimpan. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C2826] flex flex-col font-sans">
      {/* 1. TOP BAR (Medsos, Logo, Kontak Cepat) */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Kiri: Sosial Media Resmi */}
            <div className="flex items-center gap-4 text-xs text-stone-600 order-2 md:order-1">
              <span className="font-medium hidden sm:inline text-stone-500">Media Sosial:</span>
              <div className="flex items-center gap-2">
                <a
                  href={content.kontak.sosialMedia.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-stone-700"
                  aria-label="Twitter X"
                  title="Twitter X Baladz"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                <a
                  href={content.kontak.sosialMedia.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-stone-700 text-xs font-bold"
                  aria-label="TikTok"
                  title="TikTok Baladz"
                >
                  TT
                </a>
                <a
                  href={content.kontak.sosialMedia.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-stone-700 text-xs font-bold"
                  aria-label="Instagram"
                  title="Instagram Baladz"
                >
                  IG
                </a>
                <a
                  href={content.kontak.sosialMedia.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-stone-700 text-xs font-bold"
                  aria-label="YouTube"
                  title="YouTube Baladz"
                >
                  YT
                </a>
              </div>
            </div>

            {/* Tengah: Logo Resmi Baladz */}
            <div className="order-1 md:order-2 flex items-center justify-center">
              <button
                onClick={() => {
                  setActiveTab("beranda");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group flex flex-col items-center cursor-pointer"
                aria-label="Baladz Logo Beranda"
              >
                <div className="relative h-14 w-48 sm:w-56">
                  <Image
                    src="/images/baladz/logo.png"
                    alt="Logo Baladz"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="max-w-[18rem] text-center text-[10px] uppercase tracking-[0.16em] leading-snug text-emerald-800 font-semibold mt-0.5">
                  Baladil Huffaadz Homeschool
                </span>
              </button>
            </div>

            {/* Kanan: Kontak & Lokasi Cepat */}
            <div className="flex items-center gap-4 text-xs order-3">
              <span className="flex items-center gap-1.5 text-stone-600" title="Area Ma’had Baladz">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span className="hidden lg:inline">Bandung</span>
              </span>
              <a
                href={`mailto:${content.kontak.email}`}
                className="flex items-center gap-1.5 text-stone-600 hover:text-emerald-800 transition-colors"
                title="Email Baladz"
              >
                <Mail className="w-4 h-4 text-emerald-700" />
                <span className="hidden xl:inline">{content.kontak.email}</span>
              </a>
              <a
                href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="WhatsApp Panitia"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{content.kontak.whatsappUtama}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 2. NAVBAR UTAMA */}
      <nav className="bg-[#0F4C3A] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Desktop 3 Menu Sesuai Web Asli baladz.net */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => {
                  setActiveTab("beranda");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-5 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "beranda"
                    ? "bg-white text-[#0F4C3A] shadow font-bold"
                    : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  setActiveTab("kabar");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-5 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "kabar"
                    ? "bg-white text-[#0F4C3A] shadow font-bold"
                    : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"
                }`}
              >
                Kabar Baladz
              </button>
            </div>

            {/* Tombol Aksi Cepat: Daftar Santri Baru */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("beranda");
                  setIsRegisterModalOpen(true);
                }}
                className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-md font-semibold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{content.cta.teksDaftar} (PSB)</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center justify-between w-full">
              <span className="font-serif font-bold text-sm tracking-wide text-amber-300">
                {activeTab === "beranda" ? "Beranda & PSB" : "Kabar Baladz"}
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-800 bg-[#0c3f30] px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => {
                setActiveTab("beranda");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === "beranda" ? "bg-white text-[#0F4C3A] font-bold" : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              Beranda & PSB
            </button>
            <button
              onClick={() => {
                setActiveTab("kabar");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === "kabar" ? "bg-white text-[#0F4C3A] font-bold" : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              Kabar Baladz
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab("beranda");
                  setIsRegisterModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white py-2.5 px-4 rounded-md font-bold text-center text-sm shadow flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                {content.cta.teksDaftar} (PSB)
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 3. KONTEN UTAMA BERDASARKAN TAB */}
      <main className="flex-1">
        {/* ========================================================= */}
        {/* TAB 1: BERANDA (PSB, PROFIL LEMBAGA, PRODUK/JENJANG)       */}
        {/* ========================================================= */}
        {activeTab === "beranda" && (
          <div>
            {/* HERO & ANNOUNCEMENT BANNER */}
            <section className="bg-gradient-to-b from-[#FAF6EE] to-white border-b border-stone-200 py-10 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  {/* Teks Hero */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      {content.psb.jadwalTerverifikasi ? `PSB ${content.psb.tahunAjaran}` : "Jadwal PSB sedang dikonfirmasi"}
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0F4C3A] leading-tight">
                      Membina Generasi Penghafal Al-Qur’an Bersanad & Berakhlak Mulia
                    </h1>

                    <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
                      Baladil Huffaadz (Baladz) menyelenggarakan pendidikan Islam berkualitas dengan kurikulum tilawah Al-Qur’an bersanad 30 Juz, pembentukan adab sejak dini, serta kurikulum akademik berijazah negara.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                      >
                        <GraduationCap className="w-5 h-5" />
                        {content.cta.teksDaftar}
                      </button>
                      <a
                        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent(content.cta.pesanWhatsapp)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold px-5 py-3 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base"
                      >
                        <MessageCircle className="w-5 h-5 text-emerald-700" />
                        {content.cta.teksWhatsapp}
                      </a>
                      <a
                        href="/psb"
                        className="text-stone-600 hover:text-emerald-800 text-sm font-medium underline underline-offset-4 py-3 px-2"
                      >
                        Lihat informasi PSB
                      </a>
                    </div>

                    {/* Ringkasan Fakta Cepat */}
                    <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-200">
                      <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                        <div className="text-xs text-stone-500 font-medium">Metode</div>
                        <div className="text-sm font-bold text-emerald-900 mt-0.5">Bersanad 30 Juz</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                        <div className="text-xs text-stone-500 font-medium">Ijazah</div>
                        <div className="text-sm font-bold text-emerald-900 mt-0.5">Baladz & Negara</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                        <div className="text-xs text-stone-500 font-medium">Pilihan</div>
                        <div className="text-sm font-bold text-[#D97706] mt-0.5">{content.jenjang.length} Program</div>
                      </div>
                    </div>
                  </div>

                  {/* Foto Hero Asli Baladz */}
                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                      <Image
                        src="/images/baladz/about.jpg"
                        alt="KBM Santri Baladz"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[11px] bg-emerald-700/90 backdrop-blur-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider">
                          Ma’had Baladz Bandung
                        </span>
                        <p className="text-sm font-medium mt-1">
                          Suasana belajar interaktif dan pendampingan Asatidzah bersanad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: BALADZ HARI INI (Keunggulan & Fasilitas Lembaga) */}
            <section className="bg-white border-b border-stone-200 py-10 sm:py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">Tentang Baladz</span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A]">
                      Pendidikan Al-Qur&apos;an yang terarah sejak usia dini
                    </h2>
                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-stone-600">{content.lembaga.deskripsi}</p>
                    <a href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent(content.cta.pesanKunjungan)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0F4C3A] hover:text-[#D97706]">
                      Atur kunjungan ke Ma’had <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {content.lembaga.poinKeunggulan.slice(0, 4).map((item) => (
                      <div key={item} className="flex gap-3 rounded-xl border border-stone-200 bg-[#FAF8F5] p-4">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
                        <p className="text-sm leading-relaxed text-stone-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="program-pendidikan">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">Program Pendidikan</span>
                      <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A]">Pilih program sesuai usia anak</h2>
                    </div>
                    <p className="max-w-md text-sm text-stone-600">Jenjang sekolah serta kelas Al-Qur’an reguler dan privat dalam satu daftar.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    {content.jenjang.map((jenjang) => (
                      <article key={jenjang.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
                        <div className="relative h-44">
                          <Image src={jenjang.gambar} alt={jenjang.nama} fill className="object-cover" />
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#0F4C3A] shadow-sm">{jenjang.rentangUsia}</span>
                        </div>
                        <div className="p-5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">{jenjang.tingkat}</p>
                          <h3 className="mt-1 text-lg font-serif font-bold text-[#0F4C3A] leading-snug">{jenjang.nama}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-stone-600">{jenjang.deskripsi}</p>
                          {(jenjang.id === "smp-alquran" || jenjang.kategori === "kelas") && (
                            <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                              {(jenjang.jadwal || jenjang.keunggulan).map((item) => <li key={item}>• {item}</li>)}
                            </ul>
                          )}
                          {jenjang.hargaTerverifikasi === true && jenjang.paketBiaya && jenjang.paketBiaya.length > 0 && (
                            <details className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-700">
                              <summary className="cursor-pointer font-bold text-emerald-900">Lihat rincian biaya</summary>
                              <div className="mt-3 space-y-3">
                                {jenjang.paketBiaya.map((paket) => (
                                  <div key={paket.nama}>
                                    <p className="font-bold text-stone-900">{paket.nama}</p>
                                    <dl className="mt-1.5 space-y-1">
                                      {paket.komponen.map((komponen) => (
                                        <div key={`${paket.nama}-${komponen.nama}`} className="flex items-start justify-between gap-3">
                                          <dt className="text-stone-500">{komponen.nama}</dt>
                                          <dd className="text-right font-semibold">{formatRupiahRange(komponen.nominal, komponen.nominalMaksimal)}{komponen.satuan ? ` · ${komponen.satuan}` : ""}</dd>
                                        </div>
                                      ))}
                                    </dl>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                          <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                            <div>
                              <p className="text-[11px] text-stone-500">
                                {jenjang.hargaTerverifikasi === false
                                  ? "Status harga"
                                  : jenjang.sppBulananMaksimal
                                    ? "Rentang SPP"
                                    : "Biaya bulanan mulai"}
                              </p>
                              <p className="font-bold text-stone-900">
                                {jenjang.hargaTerverifikasi === false ? "Menunggu konfirmasi" : `${formatRupiahRange(jenjang.sppBulanan, jenjang.sppBulananMaksimal)}/bulan`}
                              </p>
                              {jenjang.opsiBiaya?.map((opsi) => <p key={opsi.label} className="mt-1 text-[11px] text-stone-500">{opsi.label}: {formatRupiah(opsi.nominal)}</p>)}
                            </div>
                            <button onClick={() => { setRegisterJenjang(jenjang.nama); setIsRegisterModalOpen(true); }} className="inline-flex items-center gap-1 text-sm font-bold text-[#0F4C3A] hover:text-[#D97706] cursor-pointer">
                              Pilih <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0F4C3A] p-6 sm:p-8 text-white grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                      <span>Informasi PSB</span>
                      <span className="rounded-full bg-white/10 px-2 py-1">Perlu konfirmasi</span>
                    </div>
                    <h2 className="mt-2 text-2xl font-serif font-bold">Cek jadwal dan tahapan pendaftaran</h2>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-100">Timeline dua gelombang sudah disiapkan sebagai draft. Tahun dan penerapan per jenjang belum dipublikasikan sebagai informasi final.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/psb" className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0F4C3A] hover:bg-amber-50">Lihat info PSB</Link>
                    <button onClick={() => setIsRegisterModalOpen(true)} className="rounded-lg bg-[#D97706] px-5 py-3 text-sm font-bold text-white hover:bg-[#B45309] cursor-pointer">Daftar sekarang</button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <div><p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Kabar</p><h2 className="mt-1 text-xl font-serif font-bold text-[#0F4C3A]">Aktivitas terbaru</h2></div>
                      <button onClick={() => setActiveTab("kabar")} className="text-sm font-bold text-[#0F4C3A] cursor-pointer">Lihat semua</button>
                    </div>
                    <div className="space-y-3">
                      {content.kabar.slice(0, 2).map((item) => (
                        <button key={item.id} onClick={() => setActiveKabarModal(item)} className="w-full rounded-xl border border-stone-200 p-4 text-left hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer">
                          <p className="text-xs text-stone-500">{item.tanggal} · {item.kategori}</p><h3 className="mt-1 font-bold text-stone-900 line-clamp-2">{item.judul}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Kunjungi Ma’had Baladz</p>
                      <h2 className="mt-1 text-xl font-serif font-bold text-[#0F4C3A]">Tanya program atau atur survei</h2>
                      <p className="mt-2 text-sm text-stone-600">Tim Baladz akan membantu memilih lokasi dan waktu kunjungan yang sesuai.</p>
                    </div>
                    <div className="space-y-3">
                      {content.lembaga.lokasiKbm.filter((lokasi) => lokasi.dapatDikunjungi).map((lokasi) => (
                        <div key={lokasi.nama} className="rounded-xl border border-stone-200 p-4">
                          <h3 className="font-bold text-stone-900">{lokasi.nama}</h3>
                          <p className="mt-1 text-xs text-stone-500">{lokasi.alamat}</p>
                        </div>
                      ))}
                      <a
                        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent(content.cta.pesanKunjungan)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C3A] px-5 py-3 text-sm font-bold text-white hover:bg-[#0c3f30]"
                      >
                        <MessageCircle className="w-4 h-4" /> {content.cta.teksKunjungan}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Detail lengkap tetap tersedia di halaman PSB dan pengelola konten. */}
            <section className="hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Profil Lembaga</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A] mt-1">
                    Baladil Huffaadz (Baladz) Hari Ini
                  </h2>
                  <p className="text-stone-600 text-sm sm:text-base mt-2">
                    {content.lembaga.deskripsi}
                  </p>
                </div>

                {/* 5 Pilar Keunggulan */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  {content.lembaga.poinKeunggulan.map((poin, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:border-emerald-300 hover:shadow-xs transition-all flex gap-3.5 items-start"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm text-stone-700 leading-relaxed font-medium">{poin}</p>
                      </div>
                    </div>
                  ))}
                  {/* Box Ringkasan Kontak */}
                  <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/70 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Layanan Konsultasi</span>
                      <h3 className="font-serif font-bold text-emerald-950 text-base mt-1">
                        Ingin Berkunjung ke Ma’had?
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        Silakan hubungi WhatsApp panitia untuk penjadwalan survey lokasi dan konsultasi langsung.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Hubungi WA Baladz →
                    </a>
                  </div>
                </div>

                {/* Fasilitas & Ma’had */}
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-stone-200">
                  <h3 className="font-serif font-bold text-xl text-[#0F4C3A] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D97706]" />
                    Lokasi Ma’had & Sarana KBM Baladz
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {content.lembaga.lokasiKbm.map((lokasi, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {idx === 2 ? "Rencana Pesantren" : `Ma’had ${idx + 1}`}
                        </span>
                        <h4 className="font-bold text-stone-900 text-base mt-2">{lokasi.nama}</h4>
                        <p className="text-xs text-stone-600 mt-1">{lokasi.alamat}</p>
                        <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-medium text-emerald-800">
                          ✓ {lokasi.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: 3 JENJANG PENDIDIKAN (PRODUK PENDIDIKAN UTAMA) */}
            <section id="jenjang-pendidikan" className="hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Produk Pendidikan</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A] mt-1">
                    Jenjang Pendidikan Baladz
                  </h2>
                  <p className="text-stone-600 text-sm sm:text-base mt-2">
                    Pilihan program terpadu disesuaikan dengan tahapan tumbuh kembang anak untuk mencetak generasi berkarakter Qur’ani.
                  </p>
                </div>

                {/* 3 Kartu Jenjang */}
                <div className="grid md:grid-cols-3 gap-8">
                  {content.jenjang.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      {/* Gambar Jenjang */}
                      <div className="relative h-48 w-full bg-stone-100">
                        <Image
                          src={item.gambar}
                          alt={item.nama}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-xs">
                          {item.rentangUsia}
                        </div>
                      </div>

                      {/* Konten Card */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                            {item.tingkat}
                          </span>
                          <h3 className="text-lg font-serif font-bold text-[#0F4C3A] mt-0.5">{item.nama}</h3>
                          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">{item.deskripsi}</p>

                          {/* Ijazah Badge */}
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200">
                            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Ijazah: {item.ijazah}</span>
                          </div>

                          {/* Keunggulan List */}
                          <div className="mt-4 space-y-1.5">
                            {item.keunggulan.map((k, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{k}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rincian Biaya */}
                        <div className="pt-4 border-t border-stone-100 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-stone-500">Uang Pangkal:</span>
                            <span className="font-bold text-stone-800">{formatRupiah(item.uangPangkal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-stone-500">SPP / Syahriyah:</span>
                            <span className="font-bold text-emerald-800">{formatRupiah(item.sppBulanan)}/bln</span>
                          </div>
                          {item.isBoardingTersedia && item.biayaBoarding && (
                            <div className="flex justify-between items-center text-xs text-amber-800 font-medium">
                              <span>Opsi Boarding (Asrama):</span>
                              <span>+{formatRupiah(item.biayaBoarding)}/bln</span>
                            </div>
                          )}

                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => {
                                setRegisterJenjang(item.nama);
                                setIsRegisterModalOpen(true);
                              }}
                              className="flex-1 bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer text-center"
                            >
                              Daftar Jenjang Ini
                            </button>
                            <a
                              href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=Assalamu%27alaikum%20Baladz%2C%20saya%20ingin%20bertanya%20mengenai%20jenjang%20${encodeURIComponent(item.nama)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 text-xs flex items-center justify-center"
                              title="Tanya via WA"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-700" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION: KALKULATOR BIAYA INTERAKTIF (Ramah Orang Tua) */}
            <section id="biaya-psb" className="hidden">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <div className="text-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Transparansi Biaya</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-1">
                      Kalkulator Estimasi Biaya Masuk Awal
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      Pilih jenjang pendidikan untuk melihat simulasi rincian biaya awal secara transparan.
                    </p>
                  </div>

                  {/* Selector Jenjang */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-stone-200/60 rounded-xl mb-6">
                    {content.jenjang.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => {
                          setSelectedJenjangId(j.id);
                          if (!j.isBoardingTersedia) setIncludeBoarding(false);
                        }}
                        className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          selectedJenjangId === j.id
                            ? "bg-[#0F4C3A] text-white shadow-xs"
                            : "text-stone-700 hover:bg-white/60"
                        }`}
                      >
                        {j.nama.split("(")[0]}
                      </button>
                    ))}
                  </div>

                  {/* Boarding Switcher untuk SDTahfidz */}
                  {currentCalcJenjang.isBoardingTersedia && (
                    <div className="mb-6 flex items-center justify-between p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                      <div>
                        <div className="text-xs font-bold text-amber-950">Pilihan Boarding (Asrama)</div>
                        <div className="text-[11px] text-amber-800">Tersedia kamar & fasilitas asrama santri (+Rp 400.000/bln)</div>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeBoarding}
                          onChange={(e) => setIncludeBoarding(e.target.checked)}
                          className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
                        />
                        <span className="ml-2 text-xs font-semibold text-stone-800">Sertakan Asrama</span>
                      </label>
                    </div>
                  )}

                  {/* Breakdown Table */}
                  <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 text-sm overflow-hidden mb-6">
                    <div className="p-3.5 flex justify-between items-center">
                      <span className="text-stone-600">1. Biaya Formulir Pendaftaran</span>
                      <span className="font-semibold text-stone-800">{formatRupiah(content.psb.biayaPendaftaran)}</span>
                    </div>
                    <div className="p-3.5 flex justify-between items-center">
                      <div>
                        <div className="text-stone-600">2. Uang Pangkal</div>
                        <div className="text-[11px] text-stone-400">Termasuk sarana, fasilitas, dan ijazah</div>
                      </div>
                      <span className="font-semibold text-stone-800">{formatRupiah(currentCalcJenjang.uangPangkal)}</span>
                    </div>
                    <div className="p-3.5 flex justify-between items-center">
                      <div>
                        <div className="text-stone-600">3. SPP Bulan Pertama</div>
                        <div className="text-[11px] text-stone-400">Pembelajaran tilawah bersanad & kurikulum</div>
                      </div>
                      <span className="font-semibold text-stone-800">{formatRupiah(currentCalcJenjang.sppBulanan)}</span>
                    </div>
                    {includeBoarding && currentCalcJenjang.biayaBoarding && (
                      <div className="p-3.5 flex justify-between items-center bg-amber-50/50">
                        <span className="text-amber-900">4. Asrama (Boarding) Bulan Pertama</span>
                        <span className="font-semibold text-amber-900">{formatRupiah(currentCalcJenjang.biayaBoarding)}</span>
                      </div>
                    )}
                    <div className="p-4 flex justify-between items-center bg-emerald-50/70 border-t-2 border-emerald-600">
                      <div>
                        <div className="font-bold text-emerald-950 text-base">Total Biaya Awal Masuk</div>
                        <div className="text-xs text-emerald-800">Biaya pendaftaran + uang pangkal + SPP awal</div>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-900">
                        {formatRupiah(
                          content.psb.biayaPendaftaran +
                          currentCalcJenjang.uangPangkal +
                          currentCalcJenjang.sppBulanan +
                          (includeBoarding && currentCalcJenjang.biayaBoarding ? currentCalcJenjang.biayaBoarding : 0)
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rekening Pembayaran */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 space-y-1">
                    <div className="font-bold text-stone-800">Pembayaran Rekening Resmi:</div>
                    <div className="text-emerald-900 font-semibold text-sm">
                      {content.psb.rekeningPembayaran.bank} — No. Rek: <span className="font-mono">{content.psb.rekeningPembayaran.nomorRekening}</span> a.n. {content.psb.rekeningPembayaran.atasNama}
                    </div>
                    <div className="text-stone-500">{content.psb.rekeningPembayaran.catatanTransfer}</div>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setRegisterJenjang(currentCalcJenjang.nama);
                        setIsRegisterModalOpen(true);
                      }}
                      className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-6 py-3 rounded-lg font-bold text-sm shadow cursor-pointer"
                    >
                      Lanjutkan Pendaftaran Jenjang Ini →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: INFORMASI PSB & ALUR SELEKSI LENGKAP */}
            <section id="informasi-psb" className="hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-12 gap-10">
                  {/* Kiri: Alur Pendaftaran */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Tahapan Pendaftaran</span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A] mt-1">
                        Alur Penerimaan Santri Baru
                      </h2>
                      <p className="text-stone-600 text-sm mt-1">
                        Pendaftaran dibuka mulai <strong className="text-emerald-900">{content.psb.tanggalBuka}</strong> s/d <strong className="text-emerald-900">{content.psb.tanggalTutup}</strong> atau sampai kuota 13 santri terpenuhi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {content.psb.alurPendaftaran.map((step) => (
                        <div
                          key={step.nomor}
                          className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex gap-4 items-start"
                        >
                          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {step.nomor}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 text-base">{step.judul}</h3>
                            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                              {step.keterangan}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kanan: Persyaratan Berkas & Materi Tes */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Syarat Berkas */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
                      <h3 className="font-serif font-bold text-lg text-[#0F4C3A] flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
                        Berkas Persyaratan (Format JPG, Max 5MB)
                      </h3>
                      <ul className="space-y-2.5 text-xs text-stone-700">
                        {content.psb.syaratBerkas.map((syarat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 font-bold shrink-0">•</span>
                            <span>{syarat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Materi Seleksi */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
                      <h3 className="font-serif font-bold text-lg text-[#0F4C3A] flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-emerald-700" />
                        Materi Seleksi
                      </h3>
                      <ul className="space-y-2 text-xs text-stone-700">
                        {content.psb.materiSeleksi.map((materi, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-md">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="font-medium">{materi}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                        Lokasi seleksi dan detail kunjungan mengikuti konfirmasi resmi tim Baladz.
                      </div>
                    </div>

                    {/* CTA Box */}
                    <div className="p-6 rounded-2xl bg-[#0F4C3A] text-white space-y-3">
                      <h4 className="font-serif font-bold text-lg">Ada Pertanyaan Seputar PSB?</h4>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        Jika ada hal yang kurang jelas mengenai proses pendaftaran atau seleksi, panitia siap membantu melalui WhatsApp.
                      </p>
                      <a
                        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20ingin%20bertanya%20terkait%20persyaratan%20pendaftaran.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat Panitia: {content.kontak.whatsappUtama}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KABAR BALADZ (WARTA & UPDATE LEMBAGA)               */}
        {/* ========================================================= */}
        {activeTab === "kabar" && (
          <section className="py-12 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Warta Lembaga</span>
                <h1 className="text-3xl font-serif font-bold text-[#0F4C3A] mt-1">Kabar dari Baladz</h1>
                <p className="text-stone-600 text-sm mt-2">
                  Informasi terkini seputar kegiatan santri, perkembangan sarana KBM, dan progres wakaf pembangunan pesantren.
                </p>
              </div>

              {/* Grid Berita */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.kabar.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-stone-100">
                      <Image
                        src={item.gambar}
                        alt={item.judul}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#0F4C3A] text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                        {item.kategori}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-xs text-stone-400 flex items-center gap-1.5 mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.tanggal}</span>
                          <span>•</span>
                          <span>{item.penulis}</span>
                        </div>
                        <h2 className="font-serif font-bold text-lg text-stone-900 leading-snug hover:text-emerald-800 transition-colors">
                          {item.judul}
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                          {item.ringkasan}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100">
                        <button
                          onClick={() => setActiveKabarModal(item)}
                          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                        >
                          Baca Selengkapnya →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* 4. FOOTER RESMI BALADZ */}
      <footer className="bg-[#0F4C3A] text-white border-t-4 border-[#D97706]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Info Lembaga & Yayasan */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                  <Image src="/images/baladz/emblem.png" alt="Baladz" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg leading-tight">{content.lembaga.nama}</h4>
                  <p className="text-xs text-emerald-200">{content.lembaga.yayasan}</p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed pr-4">
                {content.lembaga.deskripsi}
              </p>
              <div className="pt-2 text-xs text-emerald-200">
                Alamat yayasan: {content.kontak.alamatLengkap}
              </div>
            </div>

            {/* Menu Cepat */}
            <div className="md:col-span-3 space-y-2">
              <h5 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-3">Navigasi</h5>
              <ul className="space-y-1.5 text-xs text-emerald-100">
                <li>
                  <button onClick={() => setActiveTab("beranda")} className="hover:text-white cursor-pointer">
                    • Beranda & Pendaftaran PSB
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("kabar")} className="hover:text-white cursor-pointer">
                    • Kabar dari Baladz
                  </button>
                </li>
                <li>
                  <Link href="/kebijakan-privasi" className="hover:text-white">
                    • Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/syarat-ketentuan" className="hover:text-white">
                    • Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Layanan Informasi & Kontak Rekening */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-2">Kontak Panitia PSB</h5>
              <div className="text-xs text-emerald-100 space-y-1.5">
                <div>WhatsApp Utama: <strong>{content.kontak.whatsappUtama}</strong></div>
                <div>Email: <strong>{content.kontak.email}</strong></div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-100">
                <div className="font-bold text-amber-300">Rekening Resmi Pendaftaran:</div>
                <div className="font-mono text-white text-sm font-semibold">{content.psb.rekeningPembayaran.nomorRekening}</div>
                <div className="text-[11px] text-emerald-300">a.n. {content.psb.rekeningPembayaran.atasNama}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300 gap-3">
            <div>
              © {new Date().getFullYear()} {content.lembaga.yayasan}. Seluruh Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-emerald-400 hover:text-white text-[11px] underline">
                Panel Admin / Update Konten
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. FLOATING WHATSAPP BUTTON (Ramah Orang Tua) */}
      <a
        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20ingin%20konsultasi.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105"
        aria-label="Tanya Panitia PSB Baladz"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="font-bold text-xs sm:text-sm tracking-wide">Tanya Panitia PSB</span>
      </a>

      {/* 6. MODAL FORMULIR PENDAFTARAN ONLINE */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Formulir PSB</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-1">
                Pendaftaran Santri Baru {content.psb.tahunAjaran}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Data masuk ke dashboard staf terlebih dahulu. Setelah itu WhatsApp terbuka dengan pesan siap kirim.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nama Calon Santri *</label>
                <input
                  type="text"
                  required
                  value={formNamaSantri}
                  onChange={(e) => setFormNamaSantri(e.target.value)}
                  placeholder="Contoh: Muhammad Fatih Al-Qurthubi"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tanggal Lahir / Usia *</label>
                  <input
                    type="text"
                    required
                    value={formTglLahir}
                    onChange={(e) => setFormTglLahir(e.target.value)}
                    placeholder="Contoh: 15 Mei 2021 (5 Th)"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pilihan Jenjang *</label>
                  <select
                    value={registerJenjang}
                    onChange={(e) => setRegisterJenjang(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800 bg-white"
                  >
                    {content.jenjang.map((j) => (
                      <option key={j.id} value={j.nama}>
                        {j.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nama Orang Tua / Wali *</label>
                <input
                  type="text"
                  required
                  value={formNamaWali}
                  onChange={(e) => setFormNamaWali(e.target.value)}
                  placeholder="Contoh: Abdullah / Ummu Fatih"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">No. WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  value={formNoWa}
                  onChange={(e) => setFormNoWa(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Alamat Domisili / Kota *</label>
                <textarea
                  rows={2}
                  required
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Contoh: Jatihandap, Kec. Mandalajati, Bandung"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-stone-800 resize-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200">
                Membuka WhatsApp belum mengirim pesan. Periksa pesan yang sudah disiapkan, lalu tekan Kirim di WhatsApp agar tim Baladz dapat menindaklanjuti.
              </div>

              {submitError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{submitError}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Menyimpan data..." : "Simpan Data & Buka WhatsApp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL BACA KABAR BALADZ LENGKAP */}
      {activeKabarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveKabarModal(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              {activeKabarModal.kategori}
            </span>
            <div className="text-xs text-stone-400 mt-2 mb-1">
              {activeKabarModal.tanggal} • {activeKabarModal.penulis}
            </div>

            <h2 className="font-serif font-bold text-2xl text-[#0F4C3A] leading-tight mt-1 mb-4">
              {activeKabarModal.judul}
            </h2>

            <div className="relative h-60 w-full rounded-xl overflow-hidden mb-6 bg-stone-100">
              <Image
                src={activeKabarModal.gambar}
                alt={activeKabarModal.judul}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3.5 text-stone-700 text-sm sm:text-base leading-relaxed">
              {activeKabarModal.isiLengkap.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveKabarModal(null)}
                className="px-5 py-2 rounded-lg bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. POPUP PENGUMUMAN */}
      {isPopupOpen && content.popup && content.popup.aktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          {(() => {
            const popupCtaUrl = resolvePopupCtaUrl(content.popup, content.kontak?.whatsappUtama);
            const isFullPoster =
              content.popup.modeTampilan === "gambar_saja" ||
              (!content.popup.judul && !content.popup.subjudul);

            return isFullPoster ? (
              /* ============================================================ */
              /* MODE 1: POSTER PENUH (MENYESUAIKAN UKURAN GAMBAR, TANPA CROP)*/
              /* ============================================================ */
              <div className="relative max-w-md sm:max-w-lg w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                {/* Tombol Close X Floating */}
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute -top-3.5 -right-2 sm:-top-4 sm:-right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-900/90 hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 shadow-2xl border-2 border-white cursor-pointer"
                  aria-label="Tutup Pengumuman"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Box Poster */}
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col items-center">
                  <a
                    href={popupCtaUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsPopupOpen(false)}
                    className="block group relative w-full text-center cursor-pointer bg-stone-50"
                    title="Klik untuk membuka pengumuman / WhatsApp"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.popup.gambarPoster}
                      alt={content.popup.judul || "Pengumuman Baladz"}
                      className="w-auto max-w-full h-auto max-h-[78vh] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01] block"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </a>

                  {/* Tombol CTA Opsional di bawah poster */}
                  {content.popup.teksCta && (
                    <div className="p-3.5 bg-white border-t border-stone-100 w-full flex flex-col items-center gap-2">
                      <a
                        href={popupCtaUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsPopupOpen(false)}
                        className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{content.popup.teksCta}</span>
                      </a>
                      {content.popup.teksTutup && (
                        <button
                          onClick={() => setIsPopupOpen(false)}
                          className="text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors cursor-pointer py-0.5"
                        >
                          {content.popup.teksTutup}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Tombol Tutup Di Bawah Modal jika tidak ada tombol CTA */}
                {!content.popup.teksCta && (
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="mt-3 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer py-1.5 px-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs"
                  >
                    {content.popup.teksTutup || "Tutup Pengumuman ✕"}
                  </button>
                )}
              </div>
            ) : (
              /* ============================================================ */
              /* MODE 2: GAMBAR + TEKS KETERANGAN (MENYESUAIKAN GAMBAR)       */
              /* ============================================================ */
              <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
                {/* Tombol Close X */}
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Pengumuman"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Poster Banner: Menyesuaikan gambar asli agar tidak terpotong */}
                {content.popup.gambarPoster && (
                  <div className="w-full bg-stone-100 border-b border-stone-100 flex items-center justify-center overflow-hidden max-h-72">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.popup.gambarPoster}
                      alt={content.popup.judul || "Pengumuman"}
                      className="w-auto max-w-full h-auto max-h-64 object-contain mx-auto"
                    />
                  </div>
                )}

                {/* Konten Popup */}
                <div className="p-6 text-center space-y-3">
                  {content.popup.judul && (
                    <h3 className="font-serif font-bold text-xl text-[#0F4C3A] leading-snug">
                      {content.popup.judul}
                    </h3>
                  )}
                  {content.popup.subjudul && (
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {content.popup.subjudul}
                    </p>
                  )}

                  <div className="pt-3 space-y-2">
                    {content.popup.teksCta && (
                      <a
                        href={popupCtaUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsPopupOpen(false)}
                        className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{content.popup.teksCta}</span>
                      </a>
                    )}
                    <button
                      onClick={() => setIsPopupOpen(false)}
                      className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                    >
                      {content.popup.teksTutup || "Lanjutkan ke Website"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
