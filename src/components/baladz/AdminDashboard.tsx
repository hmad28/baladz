"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GraduationCap,
  ImageIcon,
  Layout,
  MessageCircle,
  Newspaper,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { UploadButton } from "@/lib/uploadthing";
import type { BeritaKabar, KajianArtikel } from "@/content/site-content";

interface PendaftarRow {
  id: number;
  nama_santri: string;
  tgl_lahir_usia: string;
  jenjang: string;
  nama_wali: string;
  no_wa: string;
  alamat: string;
  status: string;
  created_at: string;
}

export function AdminDashboard() {
  const { draft, setDraft, save, reset, savedAt, isSaving, isDbConnected } = useSiteContent();

  const [activeMenu, setActiveMenu] = useState<"popup" | "pendaftar" | "psb" | "jenjang" | "kabar" | "kajian" | "kontak">("popup");

  // State pendaftar dari Neon DB
  const [pendaftarList, setPendaftarList] = useState<PendaftarRow[]>([]);
  const [isLoadingPendaftar, setIsLoadingPendaftar] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State tambah kabar baru
  const [showAddKabar, setShowAddKabar] = useState(false);
  const [newKabarJudul, setNewKabarJudul] = useState("");
  const [newKabarKategori, setNewKabarKategori] = useState("Kegiatan Santri");
  const [newKabarRingkasan, setNewKabarRingkasan] = useState("");
  const [newKabarIsi, setNewKabarIsi] = useState("");
  const [newKabarGambar, setNewKabarGambar] = useState("/images/baladz/gallery-outdoor.jpg");

  // State tambah kajian baru
  const [showAddKajian, setShowAddKajian] = useState(false);
  const [newKajianJudul, setNewKajianJudul] = useState("");
  const [newKajianKategori, setNewKajianKategori] = useState("Parenting Qur'ani");
  const [newKajianPenulis, setNewKajianPenulis] = useState("Asatidzah Baladz");
  const [newKajianRingkasan, setNewKajianRingkasan] = useState("");
  const [newKajianIsi, setNewKajianIsi] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch daftar pendaftar dari Neon DB
  const fetchPendaftar = async () => {
    setIsLoadingPendaftar(true);
    try {
      const res = await fetch("/api/pendaftar");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPendaftarList(json.data);
        }
      }
    } catch (err) {
      console.error("Gagal load pendaftar:", err);
    } finally {
      setIsLoadingPendaftar(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "pendaftar") {
      fetchPendaftar();
    }
  }, [activeMenu]);

  // Update status pendaftar
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/pendaftar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setPendaftarList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        showToast("Status pendaftar berhasil diperbarui!");
      }
    } catch {
      showToast("Gagal memperbarui status.");
    }
  };

  // Hapus pendaftar
  const handleDeletePendaftar = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data pendaftar ini?")) return;
    try {
      const res = await fetch(`/api/pendaftar?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPendaftarList((prev) => prev.filter((item) => item.id !== id));
        showToast("Data pendaftar berhasil dihapus.");
      }
    } catch {
      showToast("Gagal menghapus data.");
    }
  };

  // Simpan perubahan form
  const handleSaveAll = async () => {
    const ok = await save();
    if (ok) {
      showToast("Semua perubahan berhasil disimpan ke database!");
    } else {
      showToast("Tersimpan secara lokal di browser.");
    }
  };

  // Tambah Kabar
  const handleCreateKabar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKabarJudul) return;
    const item: BeritaKabar = {
      id: "kabar-" + Date.now(),
      judul: newKabarJudul,
      kategori: newKabarKategori,
      ringkasan: newKabarRingkasan,
      isiLengkap: newKabarIsi.split("\n\n").filter(Boolean),
      gambar: newKabarGambar,
      tanggal: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
      penulis: "Humas Baladz",
    };
    setDraft({ ...draft, kabar: [item, ...draft.kabar] });
    setShowAddKabar(false);
    setNewKabarJudul("");
    setNewKabarRingkasan("");
    setNewKabarIsi("");
    showToast("Berita baru berhasil ditambahkan!");
  };

  // Tambah Kajian
  const handleCreateKajian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKajianJudul) return;
    const item: KajianArtikel = {
      id: "kajian-" + Date.now(),
      judul: newKajianJudul,
      kategori: newKajianKategori,
      ringkasan: newKajianRingkasan,
      isiLengkap: newKajianIsi.split("\n\n").filter(Boolean),
      penulis: newKajianPenulis,
      tanggal: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    };
    setDraft({ ...draft, kajian: [item, ...draft.kajian] });
    setShowAddKajian(false);
    setNewKajianJudul("");
    setNewKajianRingkasan("");
    setNewKajianIsi("");
    showToast("Kajian baru berhasil ditambahkan!");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F2] text-stone-800 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative h-10 w-32 hidden sm:block">
              <Image src="/images/baladz/logo.png" alt="Baladz" fill className="object-contain" />
            </Link>
            <div className="border-l border-stone-200 pl-4">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#0F4C3A]">
                  Dashboard Pengelola Baladz
                </h1>
                {isDbConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Neon DB Terhubung
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Mode Lokal / Siap Sinkron
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Kelola popup promosi, data pendaftar, biaya PSB, kabar, dan kajian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-xs text-stone-500 font-medium hidden md:inline">
                Tersimpan: {savedAt}
              </span>
            )}
            <button
              onClick={() => {
                if (confirm("Reset seluruh data ke pengaturan awal?")) {
                  reset();
                  showToast("Data berhasil dikembalikan ke pengaturan default.");
                }
              }}
              className="p-2 text-xs font-semibold rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Reset ke Pengaturan Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 flex items-center gap-1.5 text-stone-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web</span>
            </Link>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 space-y-1.5">
            <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Fitur Utama
              </div>

              {/* TAB 1: POPUP PENGUMUMAN */}
              <button
                onClick={() => setActiveMenu("popup")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "popup"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Popup Pengumuman</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    draft.popup.aktif
                      ? activeMenu === "popup"
                        ? "bg-amber-400 text-emerald-950"
                        : "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {draft.popup.aktif ? "AKTIF" : "OFF"}
                </span>
              </button>

              {/* TAB 2: DATA PENDAFTAR MASUK */}
              <button
                onClick={() => setActiveMenu("pendaftar")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "pendaftar"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Pendaftar Masuk</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {pendaftarList.length}
                </span>
              </button>

              {/* TAB 3: PSB & BIAYA */}
              <button
                onClick={() => setActiveMenu("psb")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "psb"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>PSB & Biaya Pendaftaran</span>
              </button>

              {/* TAB 4: JENJANG PENDIDIKAN */}
              <button
                onClick={() => setActiveMenu("jenjang")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "jenjang"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>3 Jenjang Pendidikan</span>
              </button>

              <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Konten Lembaga
              </div>

              {/* TAB 5: KABAR BALADZ */}
              <button
                onClick={() => setActiveMenu("kabar")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "kabar"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 text-orange-400" />
                  <span>Kabar Baladz</span>
                </div>
                <span className="text-[10px] text-stone-400">{draft.kabar.length}</span>
              </button>

              {/* TAB 6: KAJIAN */}
              <button
                onClick={() => setActiveMenu("kajian")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "kajian"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Kajian Islami</span>
                </div>
                <span className="text-[10px] text-stone-400">{draft.kajian.length}</span>
              </button>

              {/* TAB 7: KONTAK & MEDSOS */}
              <button
                onClick={() => setActiveMenu("kontak")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                  activeMenu === "kontak"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Kontak & Yayasan</span>
              </button>
            </div>
          </aside>

          {/* CONTENT PANEL */}
          <main className="lg:col-span-9 space-y-6">
            {/* ======================================================= */}
            {/* 1. SETUP POPUP PENGUMUMAN (DENGAN LIVE PREVIEW)         */}
            {/* ======================================================= */}
            {activeMenu === "popup" && (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Fitur Popup Promosi</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                      Pengaturan Popup Pengumuman 3 Halaman
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      Popup ini akan otomatis muncul setiap kali pengunjung membuka halaman atau berpindah tab (Beranda, Kabar, Kajian) dan dapat di-close.
                    </p>
                  </div>

                  {/* Toggle On/Off */}
                  <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <span className="text-xs font-bold text-stone-700">
                      {draft.popup.aktif ? "Status: AKTIF" : "Status: NONAKTIF"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          popup: { ...draft.popup, aktif: !draft.popup.aktif },
                        })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        draft.popup.aktif ? "bg-emerald-600" : "bg-stone-300"
                      }`}
                      aria-label="Toggle status popup"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          draft.popup.aktif ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Form Setup + Live Preview */}
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Form Kiri */}
                  <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5 text-xs sm:text-sm">
                    {/* Mode Tampilan Selector */}
                    <div>
                      <label className="block font-semibold mb-2 text-stone-700">
                        Format Tampilan Popup
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Pilihan 1: Full Gambar */}
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              popup: { ...draft.popup, modeTampilan: "gambar_saja" },
                            })
                          }
                          className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            draft.popup.modeTampilan === "gambar_saja"
                              ? "border-[#0F4C3A] bg-emerald-50/70 ring-2 ring-[#0F4C3A]/20"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              draft.popup.modeTampilan === "gambar_saja"
                                ? "bg-[#0F4C3A] text-white"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                              <span>Hanya Gambar / Flyer</span>
                              {draft.popup.modeTampilan === "gambar_saja" && (
                                <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                              Flyer brosur tampil utuh tanpa terpotong. Teks judul & deskripsi opsional.
                            </p>
                          </div>
                        </button>

                        {/* Pilihan 2: Gambar + Teks */}
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              popup: { ...draft.popup, modeTampilan: "gambar_teks" },
                            })
                          }
                          className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            draft.popup.modeTampilan !== "gambar_saja"
                              ? "border-[#0F4C3A] bg-emerald-50/70 ring-2 ring-[#0F4C3A]/20"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              draft.popup.modeTampilan !== "gambar_saja"
                                ? "bg-[#0F4C3A] text-white"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            <Layout className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                              <span>Gambar + Teks</span>
                              {draft.popup.modeTampilan !== "gambar_saja" && (
                                <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                              Banner gambar di atas disertai judul, narasi pesan, dan tombol aksi.
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Upload Poster */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-stone-700">
                          Gambar Poster / Flyer <span className="text-emerald-700">*</span>
                        </label>
                        {draft.popup.modeTampilan === "gambar_saja" && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                            Disarankan foto pamflet/flyer potret
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {/* UploadThing Button */}
                        <div className="p-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-stone-600">
                            <Upload className="w-4 h-4 text-emerald-700" />
                            <span>Upload poster langsung:</span>
                          </div>
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0]?.url) {
                                setDraft({
                                  ...draft,
                                  popup: { ...draft.popup, gambarPoster: res[0].url },
                                });
                                showToast("Poster berhasil di-upload!");
                              }
                            }}
                            onUploadError={(error: Error) => {
                              alert(`Upload error: ${error.message}`);
                            }}
                          />
                        </div>

                        <input
                          type="text"
                          value={draft.popup.gambarPoster}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              popup: { ...draft.popup, gambarPoster: e.target.value },
                            })
                          }
                          placeholder="Atau masukkan URL / path gambar poster"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 font-mono"
                        />
                      </div>
                    </div>

                    {/* Link Tujuan Poster */}
                    <div>
                      <label className="block font-semibold mb-1 text-stone-700">
                        Link Tujuan Poster / CTA <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={draft.popup.linkCta || ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            popup: { ...draft.popup, linkCta: e.target.value },
                          })
                        }
                        placeholder="Contoh: https://wa.me/6288222822233 atau link formulir"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 font-mono text-xs"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        💡 Jika diisi, pengunjung yang mengklik poster/tombol akan langsung diarahkan ke link ini.
                      </p>
                    </div>

                    {/* Form Teks Opsional */}
                    <div className="space-y-4 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                          Teks Pengumuman & Tombol (Opsional)
                        </span>
                        {draft.popup.modeTampilan === "gambar_saja" && (
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            Boleh dikosongkan untuk mode poster
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-stone-700">
                          Judul Pengumuman <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={draft.popup.judul || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              popup: { ...draft.popup, judul: e.target.value },
                            })
                          }
                          placeholder="Contoh: Penerimaan Santri Baru TA 2027/2028 Dibuka!"
                          className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1 text-stone-700">
                          Pesan / Subjudul <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={draft.popup.subjudul || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              popup: { ...draft.popup, subjudul: e.target.value },
                            })
                          }
                          placeholder="Pesan ajakan atau keterangan pengumuman..."
                          className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1 text-stone-700">
                            Teks Tombol Aksi <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
                          </label>
                          <input
                            type="text"
                            value={draft.popup.teksCta || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                popup: { ...draft.popup, teksCta: e.target.value },
                              })
                            }
                            placeholder="Contoh: Hubungi Panitia"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1 text-stone-700">
                            Teks Tombol Tutup <span className="text-stone-400 font-normal text-xs">(Opsional)</span>
                          </label>
                          <input
                            type="text"
                            value={draft.popup.teksTutup || ""}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                popup: { ...draft.popup, teksTutup: e.target.value },
                              })
                            }
                            placeholder="Contoh: Lanjutkan ke Website"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Kanan (Mockup Real-Time) */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                      <span>👁️ Pratinjau Tampilan Pengunjung</span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {draft.popup.modeTampilan === "gambar_saja" || (!draft.popup.judul && !draft.popup.subjudul)
                          ? "Mode Poster Penuh"
                          : "Mode Gambar + Teks"}
                      </span>
                    </div>

                    <div className="bg-stone-900/90 p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center min-h-[460px]">
                      {draft.popup.modeTampilan === "gambar_saja" || (!draft.popup.judul && !draft.popup.subjudul) ? (
                        /* Preview Mode 1: Full Poster */
                        <div className="relative w-full max-w-xs animate-in fade-in duration-200">
                          {/* Close button fake */}
                          <div className="absolute -top-2.5 -right-2.5 z-20 w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shadow-lg border border-white">
                            ✕
                          </div>

                          {draft.popup.gambarPoster ? (
                            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={draft.popup.gambarPoster}
                                alt="Poster Preview"
                                className="w-full max-h-[320px] object-contain mx-auto"
                              />
                              {draft.popup.teksCta && (
                                <div className="p-3 bg-white border-t border-stone-100">
                                  <div className="w-full bg-[#0F4C3A] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{draft.popup.teksCta}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-56 bg-stone-800 text-stone-300 rounded-2xl flex flex-col items-center justify-center p-4 border border-dashed border-stone-600">
                              <ImageIcon className="w-8 h-8 text-stone-500 mb-2" />
                              <span className="text-xs">Belum ada gambar poster</span>
                            </div>
                          )}

                          {draft.popup.linkCta && (
                            <div className="mt-2 text-center text-[10px] text-emerald-400 font-medium">
                              ✓ Poster dapat diklik menuju link tujuan
                            </div>
                          )}
                          {!draft.popup.teksCta && (
                            <div className="mt-2 text-center">
                              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px]">
                                {draft.popup.teksTutup || "Tutup Pengumuman ✕"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Preview Mode 2: Gambar + Teks */
                        <div className="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl relative border border-stone-200 animate-in fade-in duration-200">
                          {/* Close button fake */}
                          <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs">
                            ✕
                          </div>

                          {draft.popup.gambarPoster ? (
                            <div className="relative h-32 w-full bg-stone-200">
                              <Image
                                src={draft.popup.gambarPoster}
                                alt="Poster Preview"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute bottom-2 left-2 text-[9px] bg-[#D97706] text-white px-2 py-0.5 rounded font-bold uppercase">
                                Pengumuman
                              </span>
                            </div>
                          ) : (
                            <div className="h-16 bg-emerald-800 text-white flex items-center justify-center text-xs">
                              Tidak ada gambar poster
                            </div>
                          )}

                          <div className="p-4 text-center space-y-2">
                            {draft.popup.judul && (
                              <h4 className="font-serif font-bold text-sm text-[#0F4C3A] leading-tight line-clamp-2">
                                {draft.popup.judul}
                              </h4>
                            )}
                            {draft.popup.subjudul && (
                              <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed">
                                {draft.popup.subjudul}
                              </p>
                            )}
                            <div className="pt-2 space-y-1.5">
                              {draft.popup.teksCta && (
                                <div className="w-full bg-[#0F4C3A] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{draft.popup.teksCta}</span>
                                </div>
                              )}
                              <div className="text-[10px] text-stone-400">
                                {draft.popup.teksTutup || "Lanjutkan ke Website"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* 2. DATA PENDAFTAR SANTRI BARU (NEON POSTGRES)           */}
            {/* ======================================================= */}
            {activeMenu === "pendaftar" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Database Calon Santri</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                      Daftar Pendaftar Santri Baru
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Data formulir pendaftaran yang masuk secara online dan tersimpan di database Neon
                    </p>
                  </div>

                  <button
                    onClick={fetchPendaftar}
                    disabled={isLoadingPendaftar}
                    className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPendaftar ? "animate-spin" : ""}`} />
                    <span>Segarkan Data</span>
                  </button>
                </div>

                {/* Counter Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs text-emerald-800 font-semibold">Total Pendaftar</div>
                    <div className="text-2xl font-bold text-emerald-950 mt-1">{pendaftarList.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs text-amber-800 font-semibold">Status Baru</div>
                    <div className="text-2xl font-bold text-amber-950 mt-1">
                      {pendaftarList.filter((p) => p.status === "Baru").length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs text-blue-800 font-semibold">Diverifikasi / Lulus</div>
                    <div className="text-2xl font-bold text-blue-950 mt-1">
                      {pendaftarList.filter((p) => p.status !== "Baru").length}
                    </div>
                  </div>
                </div>

                {/* Table Pendaftar */}
                {pendaftarList.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-xl">
                    <Users className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <h3 className="font-bold text-stone-700 text-sm">Belum ada data pendaftar</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Setiap orang tua yang mengisi formulir online di website akan otomatis muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-stone-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[11px] border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-4">Calon Santri</th>
                          <th className="py-3 px-4">Pilihan Jenjang</th>
                          <th className="py-3 px-4">Orang Tua / Wali</th>
                          <th className="py-3 px-4">WhatsApp</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {pendaftarList.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50">
                            <td className="py-3 px-4">
                              <div className="font-bold text-stone-900">{item.nama_santri}</div>
                              <div className="text-[11px] text-stone-500">{item.tgl_lahir_usia || "-"}</div>
                              <div className="text-[10px] text-stone-400 truncate max-w-xs">{item.alamat}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-emerald-900">{item.jenjang}</span>
                            </td>
                            <td className="py-3 px-4 text-stone-700">{item.nama_wali}</td>
                            <td className="py-3 px-4">
                              <a
                                href={`https://wa.me/62${item.no_wa.replace(/[^0-9]/g, "").replace(/^0/, "")}?text=Assalamu%27alaikum%20Bapak%2FIbu%20${encodeURIComponent(item.nama_wali)}%2C%20kami%20dari%20Panitia%20PSB%20Baladz.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{item.no_wa}</span>
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                className="px-2 py-1 border border-stone-300 rounded text-xs bg-white font-medium"
                              >
                                <option value="Baru">Baru</option>
                                <option value="Diverifikasi">Diverifikasi</option>
                                <option value="Lolos Berkas">Lolos Berkas</option>
                                <option value="Lulus Tes">Lulus Tes</option>
                                <option value="Batal">Batal</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeletePendaftar(item.id)}
                                className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                title="Hapus Data"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================= */}
            {/* 3. PSB & BIAYA PENDAFTARAN                              */}
            {/* ======================================================= */}
            {activeMenu === "psb" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Penerimaan Santri Baru</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                    Informasi & Biaya Pendaftaran
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Tahun Ajaran</label>
                    <input
                      type="text"
                      value={draft.psb.tahunAjaran}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, tahunAjaran: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Kuota Santri Diterima</label>
                    <input
                      type="number"
                      value={draft.psb.kuotaSantri}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, kuotaSantri: Number(e.target.value) } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Tanggal Buka Pendaftaran</label>
                    <input
                      type="text"
                      value={draft.psb.tanggalBuka}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, tanggalBuka: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Tanggal Tutup Pendaftaran</label>
                    <input
                      type="text"
                      value={draft.psb.tanggalTutup}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, tanggalTutup: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Biaya Formulir Pendaftaran (IDR)</label>
                    <input
                      type="number"
                      value={draft.psb.biayaPendaftaran}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, biayaPendaftaran: Number(e.target.value) } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Batas Waktu Daftar Ulang</label>
                    <input
                      type="text"
                      value={draft.psb.batasDaftarUlang}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, batasDaftarUlang: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="font-bold text-stone-800 text-sm mb-3">Rekening Pembayaran Resmi Yayasan</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-semibold mb-1 text-stone-700">Keterangan Bank / Rekening</label>
                      <input
                        type="text"
                        value={draft.psb.rekeningPembayaran.bank}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            psb: {
                              ...draft.psb,
                              rekeningPembayaran: { ...draft.psb.rekeningPembayaran, bank: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-stone-700">Nomor Rekening</label>
                      <input
                        type="text"
                        value={draft.psb.rekeningPembayaran.nomorRekening}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            psb: {
                              ...draft.psb,
                              rekeningPembayaran: { ...draft.psb.rekeningPembayaran, nomorRekening: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-stone-700">Atas Nama Pemilik Rekening</label>
                      <input
                        type="text"
                        value={draft.psb.rekeningPembayaran.atasNama}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            psb: {
                              ...draft.psb,
                              rekeningPembayaran: { ...draft.psb.rekeningPembayaran, atasNama: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* 4. 3 JENJANG PENDIDIKAN                                 */}
            {/* ======================================================= */}
            {activeMenu === "jenjang" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Produk Pendidikan</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                    Biaya & Fasilitas 3 Jenjang Baladz
                  </h2>
                </div>

                <div className="space-y-6">
                  {draft.jenjang.map((item, idx) => (
                    <div key={item.id} className="p-5 border border-stone-200 rounded-xl bg-stone-50/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-emerald-900">{item.nama}</span>
                        <span className="text-xs text-stone-500">{item.tingkat}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-medium mb-1 text-stone-600">Rentang Usia</label>
                          <input
                            type="text"
                            value={item.rentangUsia}
                            onChange={(e) => {
                              const updated = [...draft.jenjang];
                              updated[idx] = { ...updated[idx], rentangUsia: e.target.value };
                              setDraft({ ...draft, jenjang: updated });
                            }}
                            className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-stone-600">Ijazah yang Didapat</label>
                          <input
                            type="text"
                            value={item.ijazah}
                            onChange={(e) => {
                              const updated = [...draft.jenjang];
                              updated[idx] = { ...updated[idx], ijazah: e.target.value };
                              setDraft({ ...draft, jenjang: updated });
                            }}
                            className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-stone-600">Uang Pangkal (Rp)</label>
                          <input
                            type="number"
                            value={item.uangPangkal}
                            onChange={(e) => {
                              const updated = [...draft.jenjang];
                              updated[idx] = { ...updated[idx], uangPangkal: Number(e.target.value) };
                              setDraft({ ...draft, jenjang: updated });
                            }}
                            className="w-full px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-stone-600">SPP / Syahriyah Bulanan (Rp)</label>
                          <input
                            type="number"
                            value={item.sppBulanan}
                            onChange={(e) => {
                              const updated = [...draft.jenjang];
                              updated[idx] = { ...updated[idx], sppBulanan: Number(e.target.value) };
                              setDraft({ ...draft, jenjang: updated });
                            }}
                            className="w-full px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                          />
                        </div>
                        {item.isBoardingTersedia && (
                          <div className="sm:col-span-2">
                            <label className="block font-medium mb-1 text-stone-600">Biaya Boarding / Asrama (Rp)</label>
                            <input
                              type="number"
                              value={item.biayaBoarding || 0}
                              onChange={(e) => {
                                const updated = [...draft.jenjang];
                                updated[idx] = { ...updated[idx], biayaBoarding: Number(e.target.value) };
                                setDraft({ ...draft, jenjang: updated });
                              }}
                              className="w-full px-3 py-2 border border-stone-300 rounded bg-white font-mono"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* 5. KABAR BALADZ                                         */}
            {/* ======================================================= */}
            {activeMenu === "kabar" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Warta Lembaga</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                      Kabar dari Baladz ({draft.kabar.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddKabar(!showAddKabar)}
                    className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kabar</span>
                  </button>
                </div>

                {/* Form Tambah Kabar */}
                {showAddKabar && (
                  <form onSubmit={handleCreateKabar} className="p-5 border border-emerald-200 rounded-xl bg-emerald-50/50 space-y-3 text-xs sm:text-sm">
                    <h3 className="font-bold text-emerald-950">Tulis Kabar Baru</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Judul Kabar *</label>
                        <input
                          type="text"
                          required
                          value={newKabarJudul}
                          onChange={(e) => setNewKabarJudul(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Kategori *</label>
                        <input
                          type="text"
                          value={newKabarKategori}
                          onChange={(e) => setNewKabarKategori(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-stone-700 mb-1">Link Gambar / Foto Berita</label>
                        <input
                          type="text"
                          value={newKabarGambar}
                          onChange={(e) => setNewKabarGambar(e.target.value)}
                          placeholder="Contoh: /images/baladz/gallery-outdoor.jpg"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Ringkasan Berita *</label>
                      <textarea
                        rows={2}
                        required
                        value={newKabarRingkasan}
                        onChange={(e) => setNewKabarRingkasan(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Isi Lengkap (Gunakan 2x Enter untuk Paragraf Baru)</label>
                      <textarea
                        rows={4}
                        value={newKabarIsi}
                        onChange={(e) => setNewKabarIsi(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddKabar(false)}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F4C3A] text-white font-bold rounded-lg"
                      >
                        Simpan Kabar
                      </button>
                    </div>
                  </form>
                )}

                {/* List Kabar */}
                <div className="space-y-4">
                  {draft.kabar.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-stone-200 rounded-xl space-y-3 bg-stone-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-900">Kabar #{idx + 1}</span>
                        <button
                          onClick={() => {
                            if (confirm("Hapus kabar ini?")) {
                              setDraft({ ...draft, kabar: draft.kabar.filter((_, i) => i !== idx) });
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Judul</label>
                          <input
                            type="text"
                            value={item.judul}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[idx] = { ...updated[idx], judul: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={item.kategori}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[idx] = { ...updated[idx], kategori: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-600 mb-1">Ringkasan</label>
                          <textarea
                            rows={2}
                            value={item.ringkasan}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[idx] = { ...updated[idx], ringkasan: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* 6. KAJIAN ISLAMI                                        */}
            {/* ======================================================= */}
            {activeMenu === "kajian" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Edukasi Islami</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                      Daftar Artikel Kajian ({draft.kajian.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddKajian(!showAddKajian)}
                    className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kajian</span>
                  </button>
                </div>

                {/* Form Tambah Kajian */}
                {showAddKajian && (
                  <form onSubmit={handleCreateKajian} className="p-5 border border-emerald-200 rounded-xl bg-emerald-50/50 space-y-3 text-xs sm:text-sm">
                    <h3 className="font-bold text-emerald-950">Tulis Artikel Kajian Baru</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Judul Artikel *</label>
                        <input
                          type="text"
                          required
                          value={newKajianJudul}
                          onChange={(e) => setNewKajianJudul(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Kategori *</label>
                        <input
                          type="text"
                          value={newKajianKategori}
                          onChange={(e) => setNewKajianKategori(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-stone-700 mb-1">Nama Penulis *</label>
                        <input
                          type="text"
                          value={newKajianPenulis}
                          onChange={(e) => setNewKajianPenulis(e.target.value)}
                          placeholder="Contoh: Asatidzah Baladz / Ustadzah Asti"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Ringkasan Artikel *</label>
                      <textarea
                        rows={2}
                        required
                        value={newKajianRingkasan}
                        onChange={(e) => setNewKajianRingkasan(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Isi Lengkap Artikel (2x Enter untuk Paragraf Baru)</label>
                      <textarea
                        rows={4}
                        value={newKajianIsi}
                        onChange={(e) => setNewKajianIsi(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddKajian(false)}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#0F4C3A] text-white font-bold rounded-lg"
                      >
                        Simpan Kajian
                      </button>
                    </div>
                  </form>
                )}

                {/* List Kajian */}
                <div className="space-y-4">
                  {draft.kajian.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-stone-200 rounded-xl space-y-3 bg-stone-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-900">Kajian #{idx + 1}</span>
                        <button
                          onClick={() => {
                            if (confirm("Hapus artikel kajian ini?")) {
                              setDraft({ ...draft, kajian: draft.kajian.filter((_, i) => i !== idx) });
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Judul</label>
                          <input
                            type="text"
                            value={item.judul}
                            onChange={(e) => {
                              const updated = [...draft.kajian];
                              updated[idx] = { ...updated[idx], judul: e.target.value };
                              setDraft({ ...draft, kajian: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={item.kategori}
                            onChange={(e) => {
                              const updated = [...draft.kajian];
                              updated[idx] = { ...updated[idx], kategori: e.target.value };
                              setDraft({ ...draft, kajian: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-600 mb-1">Ringkasan</label>
                          <textarea
                            rows={2}
                            value={item.ringkasan}
                            onChange={(e) => {
                              const updated = [...draft.kajian];
                              updated[idx] = { ...updated[idx], ringkasan: e.target.value };
                              setDraft({ ...draft, kajian: updated });
                            }}
                            className="w-full px-2.5 py-1.5 border border-stone-300 rounded bg-white text-stone-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* 7. KONTAK & YAYASAN                                     */}
            {/* ======================================================= */}
            {activeMenu === "kontak" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Kontak & Legalitas</span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                    Kontak & Media Sosial Resmi
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">WhatsApp Utama (PSB)</label>
                    <input
                      type="text"
                      value={draft.kontak.whatsappUtama}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          kontak: { ...draft.kontak, whatsappUtama: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">WhatsApp Kedua</label>
                    <input
                      type="text"
                      value={draft.kontak.whatsappKedua}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          kontak: { ...draft.kontak, whatsappKedua: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Email Resmi</label>
                    <input
                      type="email"
                      value={draft.kontak.email}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          kontak: { ...draft.kontak, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Nomor Telepon Kantor</label>
                    <input
                      type="text"
                      value={draft.kontak.telepon}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          kontak: { ...draft.kontak, telepon: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1 text-stone-700">Alamat Lengkap Yayasan</label>
                    <textarea
                      rows={2}
                      value={draft.kontak.alamatLengkap}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          kontak: { ...draft.kontak, alamatLengkap: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
