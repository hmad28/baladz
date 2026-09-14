"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import type { BeritaKabar, KajianArtikel } from "@/content/site-content";

// Helper formatter mata uang rupiah
function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function PublicSite() {
  const { content } = useSiteContent();

  // Tab utama (Sesuai 3 pilar Baladz: Beranda / Kabar Baladz / Kajian)
  const [activeTab, setActiveTab] = useState<"beranda" | "kabar" | "kajian">("beranda");

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

  // Modal baca artikel (Kabar atau Kajian)
  const [activeKabarModal, setActiveKabarModal] = useState<BeritaKabar | null>(null);
  const [activeKajianModal, setActiveKajianModal] = useState<KajianArtikel | null>(null);

  // Search filter di tab kajian
  const [kajianSearch, setKajianSearch] = useState("");

  // Jenjang kalkulator aktif
  const currentCalcJenjang = content.jenjang.find((j) => j.id === selectedJenjangId) || content.jenjang[0];

  // Submit form pendaftaran online ke WhatsApp resmi
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pesan = `*PENDAFTARAN SANTRI BARU BALADZ ${content.psb.tahunAjaran}*%0A%0A`
      + `*Nama Calon Santri:* ${encodeURIComponent(formNamaSantri)}%0A`
      + `*Tanggal Lahir / Usia:* ${encodeURIComponent(formTglLahir)}%0A`
      + `*Pilihan Jenjang:* ${encodeURIComponent(registerJenjang)}%0A`
      + `*Nama Orang Tua / Wali:* ${encodeURIComponent(formNamaWali)}%0A`
      + `*No. WhatsApp:* ${encodeURIComponent(formNoWa)}%0A`
      + `*Alamat Domisili:* ${encodeURIComponent(formAlamat)}%0A%0A`
      + `Mohon informasi jadwal seleksi dan tahapan selanjutnya. Terima kasih.`;

    const waUrl = `https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${pesan}`;
    window.open(waUrl, "_blank");
    setIsRegisterModalOpen(false);
  };

  // Filter artikel kajian
  const filteredKajian = content.kajian.filter(
    (k) =>
      k.judul.toLowerCase().includes(kajianSearch.toLowerCase()) ||
      k.ringkasan.toLowerCase().includes(kajianSearch.toLowerCase()) ||
      k.kategori.toLowerCase().includes(kajianSearch.toLowerCase())
  );

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
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold mt-0.5">
                  Baladill Huffaadz International School
                </span>
              </button>
            </div>

            {/* Kanan: Kontak & Lokasi Cepat */}
            <div className="flex items-center gap-4 text-xs order-3">
              <a
                href={content.kontak.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-stone-600 hover:text-emerald-800 transition-colors"
                title="Lokasi Google Maps"
              >
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span className="hidden lg:inline">Bandung</span>
              </a>
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

      {/* 2. NAVBAR UTAMA (3 Menu: Beranda, Kabar Baladz, Kajian + Tombol Daftar) */}
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
              <button
                onClick={() => {
                  setActiveTab("kajian");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-5 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "kajian"
                    ? "bg-white text-[#0F4C3A] shadow font-bold"
                    : "text-emerald-100 hover:bg-emerald-800/70 hover:text-white"
                }`}
              >
                Kajian
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
                <span>Daftar Santri Baru (PSB)</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center justify-between w-full">
              <span className="font-serif font-bold text-sm tracking-wide text-amber-300">
                {activeTab === "beranda" ? "Beranda & PSB" : activeTab === "kabar" ? "Kabar Baladz" : "Kajian Islami"}
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
            <button
              onClick={() => {
                setActiveTab("kajian");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === "kajian" ? "bg-white text-[#0F4C3A] font-bold" : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              Kajian
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
                Daftar Santri Baru (PSB)
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
                      Penerimaan Santri Baru {content.psb.tahunAjaran} • Kuota {content.psb.kuotaSantri} Santri
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
                        Daftar Santri Baru
                      </button>
                      <a
                        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20ingin%20konsultasi%20pendaftaran%20santri%20baru.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold px-5 py-3 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base"
                      >
                        <MessageCircle className="w-5 h-5 text-emerald-700" />
                        Konsultasi WhatsApp
                      </a>
                      <a
                        href="#biaya-psb"
                        className="text-stone-600 hover:text-emerald-800 text-sm font-medium underline underline-offset-4 py-3 px-2"
                      >
                        Lihat Rincian Biaya ↓
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
                        <div className="text-xs text-stone-500 font-medium">Kuota PSB</div>
                        <div className="text-sm font-bold text-[#D97706] mt-0.5">{content.psb.kuotaSantri} Santri</div>
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
                          Kampus Baladz Bandung
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
            <section className="py-12 bg-white border-b border-stone-200">
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
                        Ingin Berkunjung ke Kampus?
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

                {/* Fasilitas & Kampus KBM */}
                <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-stone-200">
                  <h3 className="font-serif font-bold text-xl text-[#0F4C3A] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D97706]" />
                    Lokasi Kampus & Sarana KBM Baladz
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {content.lembaga.lokasiKbm.map((lokasi, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {idx === 2 ? "Rencana Pesantren" : `Kampus ${idx + 1}`}
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
            <section id="jenjang-pendidikan" className="py-14 bg-[#FAF8F5] border-b border-stone-200">
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
            <section id="biaya-psb" className="py-12 bg-white border-b border-stone-200">
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
            <section id="informasi-psb" className="py-14 bg-[#FAF8F5]">
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
                        Materi Ujian Seleksi Offline
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
                        Lokasi Tes: Kampus Baladz 1, Jl. Jatihandap Raya No. 7, RT.7/RW.5, Jatihandap, Bandung.
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

        {/* ========================================================= */}
        {/* TAB 3: KAJIAN (EDUKASI ISLAMI & PARENTING QUR'ANI)        */}
        {/* ========================================================= */}
        {activeTab === "kajian" && (
          <section className="py-12 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">Edukasi & Inspirasi</span>
                <h1 className="text-3xl font-serif font-bold text-[#0F4C3A]">Kajian Islami & Parenting</h1>
                <p className="text-stone-600 text-sm">
                  Artikel bermanfaat tentang sirah sahabat, tafsir nilai Qur’ani, dan bekal mendidik anak bagi orang tua.
                </p>

                {/* Input Search Kajian */}
                <div className="pt-2 max-w-md mx-auto">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Cari judul artikel kajian..."
                      value={kajianSearch}
                      onChange={(e) => setKajianSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 rounded-full bg-white focus:outline-none focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Kajian */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredKajian.map((kajian) => (
                  <article
                    key={kajian.id}
                    className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                        <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded border border-emerald-200">
                          {kajian.kategori}
                        </span>
                        <span>{kajian.tanggal}</span>
                      </div>
                      <h2 className="font-serif font-bold text-xl text-[#0F4C3A] leading-snug mt-1">
                        {kajian.judul}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                        {kajian.ringkasan}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 italic">Oleh: {kajian.penulis}</span>
                      <button
                        onClick={() => setActiveKajianModal(kajian)}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        Baca Artikel Lengkap →
                      </button>
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
                Alamat: {content.kontak.alamatLengkap}
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
                  <button onClick={() => setActiveTab("kajian")} className="hover:text-white cursor-pointer">
                    • Kajian Islami & Parenting
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
                <div>WhatsApp Kedua: <strong>{content.kontak.whatsappKedua}</strong></div>
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
                Data akan langsung terhubung ke panitia PSB Baladz via WhatsApp untuk konfirmasi dan jadwal seleksi.
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
                Setelah klik tombol di bawah, Anda akan diarahkan ke WhatsApp Panitia Baladz untuk verifikasi formulir dan pembayaran biaya pendaftaran Rp 150.000,-.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Kirim Formulir via WhatsApp
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

      {/* 8. MODAL BACA KAJIAN LENGKAP */}
      {activeKajianModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveKajianModal(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-900">
              {activeKajianModal.kategori}
            </span>
            <div className="text-xs text-stone-400 mt-2 mb-1">
              {activeKajianModal.tanggal} • Penulis: {activeKajianModal.penulis}
            </div>

            <h2 className="font-serif font-bold text-2xl text-[#0F4C3A] leading-tight mt-1 mb-6">
              {activeKajianModal.judul}
            </h2>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
              {activeKajianModal.isiLengkap.map((paragraf, i) => (
                <p key={i}>{paragraf}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-400">Yayasan Baladz Cerdas Mulia</span>
              <button
                onClick={() => setActiveKajianModal(null)}
                className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
