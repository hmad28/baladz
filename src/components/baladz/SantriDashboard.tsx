"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit3,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Printer,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

export interface PendaftarBerkasItem {
  id: number;
  kode_berkas: string;
  nama_berkas: string;
  file_url: string;
  status: "menunggu_verifikasi" | "disetujui" | "perlu_perbaikan";
  catatan_admin?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SantriProfile {
  id: number;
  no_pendaftaran: string;
  nama_santri: string;
  tgl_lahir_usia: string;
  jenjang: string;
  nama_wali: string;
  no_wa: string;
  alamat: string;
  foto_santri?: string | null;
  jenis_kelamin?: string | null;
  cita_cita?: string | null;
  status_asrama?: string | null;
  asal_sekolah?: string | null;
  nama_ibu?: string | null;
  status: string;
  status_berkas: string;
  status_pembayaran: string;
  bukti_pembayaran_url?: string | null;
  nominal_bayar?: number | null;
  tanggal_bayar?: string | null;
  nomor_kuitansi?: string | null;
  metode_bayar?: string | null;
  catatan_pembayaran?: string | null;
  catatan_panitia?: string | null;
  jadwal_seleksi?: string | null;
  lokasi_seleksi?: string | null;
  instruksi_seleksi?: string | null;
  undangan_terbit?: boolean | null;
  hasil_seleksi?: string | null;
  pengumuman_terbit?: boolean | null;
  catatan_pengumuman?: string | null;
  status_daftar_ulang?: string | null;
  bukti_daftar_ulang_url?: string | null;
  is_locked?: boolean | null;
  created_at?: string;
  berkasList: PendaftarBerkasItem[];
}

export const MASTER_BERKAS_LIST = [
  {
    kode: "foto_santri",
    nama: "Foto Calon Santri",
    deskripsi: "Pas foto formal / rapi 3x4 atau setengah badan dengan latar belakang polos.",
    wajib: true,
  },
  {
    kode: "surat_kesanggupan",
    nama: "Surat Kesanggupan Orang Tua / Wali",
    deskripsi: "Surat pernyataan yang telah diunduh, diisi, dan ditandatangani orang tua/wali.",
    wajib: true,
  },
  {
    kode: "akta_kelahiran",
    nama: "Akta Kelahiran Calon Santri",
    deskripsi: "Scan atau foto akta kelahiran asli/legalisir yang terbaca jelas.",
    wajib: true,
  },
  {
    kode: "kartu_keluarga",
    nama: "Kartu Keluarga (KK)",
    deskripsi: "Scan atau foto Kartu Keluarga terbaru yang memuat nama calon santri.",
    wajib: true,
  },
  {
    kode: "rapor_4_genap",
    nama: "Rapor Semester Genap Kelas 4",
    deskripsi: "Rapor jenjang sebelumnya yang mencantumkan nilai dan tanda tangan / stempel sekolah.",
    wajib: false,
  },
  {
    kode: "rapor_5_ganjil",
    nama: "Rapor Semester Gasal Kelas 5",
    deskripsi: "Halaman identitas dan halaman nilai rapor semester ganjil.",
    wajib: false,
  },
  {
    kode: "rapor_5_genap",
    nama: "Rapor Semester Genap Kelas 5",
    deskripsi: "Halaman nilai dan kenaikan kelas yang telah dicap sekolah.",
    wajib: false,
  },
  {
    kode: "tazkiah",
    nama: "Surat Tazkiah / Rekomendasi",
    deskripsi: "Surat rekomendasi dari guru ngaji / ustadz / kepala sekolah asal.",
    wajib: false,
  },
  {
    kode: "sertifikat_hafalan",
    nama: "Sertifikat Bukti Hafalan Al-Qur'an",
    deskripsi: "Syahadah atau sertifikat tasmi'/tahfidz bila ada (opsional menambah poin seleksi).",
    wajib: false,
  },
];

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function SantriDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { content } = useSiteContent();

  const getInitialTab = (): "overview" | "biodata" | "berkas" | "pembayaran" | "seleksi" | "pengumuman" | "daftar-ulang" => {
    if (pathname?.includes("/biodata")) return "biodata";
    if (pathname?.includes("/berkas")) return "berkas";
    if (pathname?.includes("/pembayaran")) return "pembayaran";
    if (pathname?.includes("/seleksi")) return "seleksi";
    if (pathname?.includes("/pengumuman")) return "pengumuman";
    if (pathname?.includes("/daftar-ulang")) return "daftar-ulang";
    return "overview";
  };

  const [profile, setProfile] = useState<SantriProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active subtab
  const [activeTab, setActiveTab] = useState<
    "overview" | "biodata" | "berkas" | "pembayaran" | "seleksi" | "pengumuman" | "daftar-ulang"
  >(getInitialTab());

  // State ubah biodata
  const [isEditingBiodata, setIsEditingBiodata] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama_santri: "",
    tgl_lahir_usia: "",
    jenis_kelamin: "Laki-laki",
    cita_cita: "",
    status_asrama: "Ya, asrama",
    asal_sekolah: "",
    nama_wali: "",
    nama_ibu: "",
    no_wa: "",
    alamat: "",
  });
  const [isSavingBiodata, setIsSavingBiodata] = useState(false);

  // State upload berkas
  const [selectedUploadKode, setSelectedUploadKode] = useState<string>(MASTER_BERKAS_LIST[0].kode);
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [isUploadingBerkas, setIsUploadingBerkas] = useState(false);

  // State bukti pembayaran formulir
  const [bayarFormNominal, setBayarFormNominal] = useState<number>(content.psb.biayaPendaftaran || 150000);
  const [bayarFormBuktiUrl, setBayarFormBuktiUrl] = useState("");
  const [bayarFormCatatan, setBayarFormCatatan] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // State bukti daftar ulang
  const [daftarUlangBuktiUrl, setDaftarUlangBuktiUrl] = useState("");
  const [isSubmittingDaftarUlang, setIsSubmittingDaftarUlang] = useState(false);

  // Modal cetak bukti pendaftaran
  const [isPrintBuktiOpen, setIsPrintBuktiOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/santri/auth/me");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/dashboard/login");
          return;
        }
        throw new Error("Gagal memuat data calon santri");
      }
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
        setEditFormData({
          nama_santri: data.data.nama_santri || "",
          tgl_lahir_usia: data.data.tgl_lahir_usia || "",
          jenis_kelamin: data.data.jenis_kelamin || "Laki-laki",
          cita_cita: data.data.cita_cita || "",
          status_asrama: data.data.status_asrama || "Ya, asrama",
          asal_sekolah: data.data.asal_sekolah || "",
          nama_wali: data.data.nama_wali || "",
          nama_ibu: data.data.nama_ibu || "",
          no_wa: data.data.no_wa || "",
          alamat: data.data.alamat || "",
        });
        if (data.data.nominal_bayar) {
          setBayarFormNominal(data.data.nominal_bayar);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/santri/auth/logout", { method: "POST" });
      router.push("/dashboard/login");
      router.refresh();
    } catch {
      router.push("/dashboard/login");
    }
  };

  const handleSaveBiodata = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBiodata(true);
    try {
      const res = await fetch("/api/santri/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan biodata");
      }
      showToast("Biodata pendaftaran berhasil diperbarui!");
      setIsEditingBiodata(false);
      await fetchProfile();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan perubahan");
    } finally {
      setIsSavingBiodata(false);
    }
  };

  const handleUploadBerkas = async (kode: string, nama: string, url: string) => {
    if (!url.trim()) {
      alert("Harap masukkan atau unggah URL file dokumen");
      return;
    }
    setIsUploadingBerkas(true);
    try {
      const res = await fetch("/api/santri/berkas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kode_berkas: kode,
          nama_berkas: nama,
          file_url: url.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah berkas");
      }
      showToast(`Berkas ${nama} berhasil disimpan!`);
      setUploadFileUrl("");
      await fetchProfile();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan berkas");
    } finally {
      setIsUploadingBerkas(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bayarFormBuktiUrl.trim()) {
      alert("Harap sertakan link / bukti transfer pembayaran");
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const res = await fetch("/api/santri/pembayaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bukti_pembayaran_url: bayarFormBuktiUrl.trim(),
          nominal_bayar: bayarFormNominal,
          metode_bayar: "Transfer Bank Rekening Resmi",
          catatan_pembayaran: bayarFormCatatan.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim bukti pembayaran");
      }
      showToast("Bukti pembayaran berhasil dikirim untuk diverifikasi panitia!");
      setBayarFormBuktiUrl("");
      setBayarFormCatatan("");
      await fetchProfile();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleSubmitDaftarUlang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daftarUlangBuktiUrl.trim()) {
      alert("Harap sertakan link / bukti pembayaran daftar ulang");
      return;
    }
    setIsSubmittingDaftarUlang(true);
    try {
      const res = await fetch("/api/santri/daftar-ulang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bukti_daftar_ulang_url: daftarUlangBuktiUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim bukti daftar ulang");
      }
      showToast("Bukti daftar ulang berhasil dikirim! Menunggu konfirmasi panitia.");
      setDaftarUlangBuktiUrl("");
      await fetchProfile();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengirim bukti");
    } finally {
      setIsSubmittingDaftarUlang(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-stone-600">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F4C3A] mb-3" />
        <p className="font-semibold text-sm">Memuat Dashboard Calon Santri...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm max-w-md w-full space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="font-bold text-stone-800 text-lg">Gagal Memuat Data</h2>
          <p className="text-xs text-stone-500">{error || "Data pendaftaran tidak ditemukan"}</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={fetchProfile}
              className="flex-1 py-2.5 bg-[#0F4C3A] text-white font-bold text-xs rounded-xl"
            >
              Coba Lagi
            </button>
            <Link
              href="/dashboard/login"
              className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl text-center"
            >
              Login Ulang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Hitung progres 8 langkah
  const step1Formulir = true; // Mengisi formulir online (selesai)
  const step2Bayar = profile.status_pembayaran === "Lunas";
  const approvedDocsCount = profile.berkasList.filter((b) => b.status === "disetujui").length;
  const step3Upload = profile.berkasList.length >= 3;
  const step4VerifikasiBerkas = profile.status_berkas === "Terverifikasi" || approvedDocsCount >= 4;
  const step5Undangan = Boolean(profile.undangan_terbit && profile.jadwal_seleksi);
  const step6Seleksi = Boolean(profile.undangan_terbit && profile.jadwal_seleksi);
  const step7Pengumuman = Boolean(profile.pengumuman_terbit && profile.hasil_seleksi && profile.hasil_seleksi !== "Belum Tersedia");
  const step8DaftarUlang = profile.status_daftar_ulang === "Selesai";

  const totalSteps = 8;
  const completedStepsCount = [
    step1Formulir,
    step2Bayar,
    step3Upload,
    step4VerifikasiBerkas,
    step5Undangan,
    step6Seleksi,
    step7Pengumuman,
    step8DaftarUlang,
  ].filter(Boolean).length;
  const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100);

  // Menentukan Next Action
  type TabType = "overview" | "biodata" | "berkas" | "pembayaran" | "seleksi" | "pengumuman" | "daftar-ulang";
  let nextAction: {
    title: string;
    desc: string;
    btnText: string;
    targetTab: TabType;
  } = {
    title: "Lengkapi Berkas Persyaratan",
    desc: "Unggah dokumen persyaratan (Foto, Akta Kelahiran, KK, Surat Kesanggupan) agar panitia dapat memverifikasi berkas ananda.",
    btnText: "Buka Tab Berkas",
    targetTab: "berkas",
  };

  if (profile.status_pembayaran !== "Lunas" && profile.status_pembayaran !== "Menunggu Verifikasi") {
    nextAction = {
      title: "Lakukan Pembayaran Biaya Pendaftaran",
      desc: "Silakan transfer biaya formulir ke rekening resmi yayasan dan kirimkan bukti transfer.",
      btnText: "Bayar & Konfirmasi",
      targetTab: "pembayaran",
    };
  } else if (profile.status_berkas === "Perlu Perbaikan") {
    nextAction = {
      title: "Perbaiki Berkas yang Ditolak",
      desc: "Terdapat catatan revisi dari panitia pada berkas yang diunggah. Silakan upload ulang berkas yang diperbaiki.",
      btnText: "Perbaiki Berkas",
      targetTab: "berkas",
    };
  } else if (profile.undangan_terbit && profile.jadwal_seleksi && !profile.pengumuman_terbit) {
    nextAction = {
      title: "Lihat Undangan & Petunjuk Ujian Seleksi",
      desc: `Jadwal seleksi telah diterbitkan (${profile.jadwal_seleksi}). Periksa petunjuk teknis dan konfirmasi kehadiran ananda.`,
      btnText: "Buka Undangan Seleksi",
      targetTab: "seleksi",
    };
  } else if (profile.pengumuman_terbit && profile.hasil_seleksi === "Diterima") {
    nextAction = {
      title: "Selesaikan Proses Daftar Ulang",
      desc: "Alhamdulillah ananda telah dinyatakan DITERIMA! Silakan lakukan pelunasan dan konfirmasi daftar ulang.",
      btnText: "Lanjut Daftar Ulang",
      targetTab: "daftar-ulang",
    };
  } else if (profile.pengumuman_terbit) {
    nextAction = {
      title: "Lihat Hasil Pengumuman Seleksi",
      desc: "Hasil kelulusan seleksi telah dipublikasikan oleh panitia.",
      btnText: "Buka Pengumuman",
      targetTab: "pengumuman",
    };
  }

  const tabsConfig = [
    { id: "overview", label: "Progres & Ringkasan", icon: FileCheck2 },
    { id: "biodata", label: "Biodata Calon Santri", icon: User },
    { id: "berkas", label: "Berkas Persyaratan", icon: Upload, badge: `${profile.berkasList.length}/${MASTER_BERKAS_LIST.length}` },
    { id: "pembayaran", label: "Biaya & Pembayaran", icon: CreditCard, status: profile.status_pembayaran },
    { id: "seleksi", label: "Undangan Seleksi", icon: Calendar, badge: profile.undangan_terbit ? "Tersedia" : undefined },
    { id: "pengumuman", label: "Pengumuman Hasil", icon: GraduationCap, badge: profile.pengumuman_terbit ? profile.hasil_seleksi : undefined },
    { id: "daftar-ulang", label: "Daftar Ulang", icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F4C3A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. TOPBAR DASHBOARD SANTRI */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/" className="relative h-10 w-28 sm:w-36 shrink-0">
              <Image src="/images/baladz/logo.png" alt="Baladz" fill className="object-contain" priority />
            </Link>
            <div className="hidden sm:block border-l border-stone-200 pl-3">
              <div className="text-xs font-serif font-bold text-[#0F4C3A]">Dashboard Calon Santri</div>
              <div className="text-[10px] text-stone-500 font-mono">PSB TA {content.psb.tahunAjaran}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-stone-800 truncate max-w-[200px]">{profile.nama_santri}</span>
              <span className="text-[10px] font-mono text-emerald-800 font-semibold">{profile.no_pendaftaran}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPrintBuktiOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition"
              title="Cetak Bukti Pendaftaran"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Bukti Daftar</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION BAR (MOBILE-FRIENDLY SCROLLABLE TABS) */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`shrink-0 flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0F4C3A] text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-stone-500"}`} />
                  <span>{tab.label}</span>
                  {"badge" in tab && tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase ${
                        isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {"status" in tab && tab.status && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        tab.status === "Lunas"
                          ? "bg-emerald-100 text-emerald-800"
                          : tab.status === "Menunggu Verifikasi"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {tab.status}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & PROGRESS PENDATARAN                     */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Card dengan Progress Bar */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0F4C3A] to-[#0c382b] p-6 sm:p-8 text-white shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                    <span>Portal Santri Baru</span>
                    <span>•</span>
                    <span className="font-mono">{profile.no_pendaftaran}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white pt-1">
                    Assalamu’alaikum, {profile.nama_santri}!
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                    Program Pilihan: <strong className="text-white">{profile.jenjang}</strong> • Wali Santri:{" "}
                    <strong className="text-white">{profile.nama_wali}</strong>
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/15 min-w-[240px] text-right">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                    Progres Kelulusan PSB
                  </div>
                  <div className="flex items-baseline justify-end gap-1 mt-1">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-amber-300">
                      {progressPercentage}%
                    </span>
                    <span className="text-xs text-emerald-200 font-medium">selesai</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-emerald-200/80 mt-1.5">
                    {completedStepsCount} dari {totalSteps} tahapan selesai
                  </div>
                </div>
              </div>
            </div>

            {/* Next Action Banner */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Langkah Berikutnya
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">{nextAction.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">{nextAction.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab(nextAction.targetTab)}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white text-xs font-bold transition shadow-xs cursor-pointer text-center"
              >
                {nextAction.btnText} →
              </button>
            </div>

            {/* Visual 8-Step Tracker */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                    Alur Lengkap PSB
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                    Tahapan Pendaftaran & Seleksi
                  </h2>
                </div>
                <span className="text-xs text-stone-500">
                  Status diperbarui secara real-time dari database
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "Mengisi formulir pendaftaran online",
                    desc: `Formulir pendaftaran terkirim pada ${profile.created_at ? new Date(profile.created_at).toLocaleDateString("id-ID") : "hari pendaftaran"}.`,
                    status: step1Formulir ? "Selesai" : "Belum",
                    done: step1Formulir,
                    actionTab: "biodata" as const,
                  },
                  {
                    step: 2,
                    title: "Membayar biaya pendaftaran",
                    desc:
                      profile.status_pembayaran === "Lunas"
                        ? `Biaya pendaftaran lunas (No. Kuitansi: ${profile.nomor_kuitansi || "Resmi"}).`
                        : profile.status_pembayaran === "Menunggu Verifikasi"
                        ? "Bukti transfer telah dikirim dan sedang dalam antrean verifikasi panitia."
                        : `Nominal Rp ${formatRupiah(content.psb.biayaPendaftaran || 150000)} ke rekening resmi yayasan.`,
                    status: profile.status_pembayaran,
                    done: step2Bayar,
                    actionTab: "pembayaran" as const,
                  },
                  {
                    step: 3,
                    title: "Mengunggah berkas persyaratan",
                    desc: `Telah mengunggah ${profile.berkasList.length} dari ${MASTER_BERKAS_LIST.length} jenis berkas.`,
                    status: step3Upload ? "Selesai" : "Menunggu tindakan",
                    done: step3Upload,
                    actionTab: "berkas" as const,
                  },
                  {
                    step: 4,
                    title: "Verifikasi dokumen oleh panitia",
                    desc:
                      profile.status_berkas === "Terverifikasi"
                        ? "Seluruh berkas persyaratan telah dinyatakan sah dan disetujui."
                        : profile.status_berkas === "Perlu Perbaikan"
                        ? "Ada berkas yang memerlukan revisi. Silakan periksa catatan panitia."
                        : "Panitia sedang memeriksa kelengkapan dan keabsahan berkas.",
                    status: profile.status_berkas,
                    done: step4VerifikasiBerkas,
                    actionTab: "berkas" as const,
                  },
                  {
                    step: 5,
                    title: "Menerima undangan ujian seleksi",
                    desc:
                      profile.undangan_terbit && profile.jadwal_seleksi
                        ? `Undangan telah diterbitkan untuk jadwal: ${profile.jadwal_seleksi}.`
                        : "Undangan diterbitkan setelah biaya pendaftaran & berkas diverifikasi.",
                    status: profile.undangan_terbit ? "Tersedia" : "Belum tersedia",
                    done: step5Undangan,
                    actionTab: "seleksi" as const,
                  },
                  {
                    step: 6,
                    title: "Mengikuti ujian seleksi",
                    desc:
                      profile.undangan_terbit
                        ? `Sesuai media/lokasi: ${profile.lokasi_seleksi || "Video Call WhatsApp / Tatap Muka"}.`
                        : "Pelaksanaan tes baca Al-Qur'an dan wawancara calon santri.",
                    status: profile.undangan_terbit ? "Terjadwal" : "Belum terjadwal",
                    done: step6Seleksi,
                    actionTab: "seleksi" as const,
                  },
                  {
                    step: 7,
                    title: "Menerima hasil pengumuman kelulusan",
                    desc:
                      profile.pengumuman_terbit && profile.hasil_seleksi
                        ? `Hasil resmi: ${profile.hasil_seleksi}.`
                        : "Pengumuman akan dipublikasikan sesuai jadwal resmi panitia.",
                    status: profile.pengumuman_terbit ? profile.hasil_seleksi || "Tersedia" : "Belum tersedia",
                    done: step7Pengumuman,
                    actionTab: "pengumuman" as const,
                  },
                  {
                    step: 8,
                    title: "Menyelesaikan daftar ulang santri baru",
                    desc:
                      profile.status_daftar_ulang === "Selesai"
                        ? "Selamat, seluruh proses pendaftaran dan daftar ulang ananda telah tuntas!"
                        : "Khusus calon santri yang dinyatakan diterima pada hasil seleksi.",
                    status: profile.status_daftar_ulang || "Belum dimulai",
                    done: step8DaftarUlang,
                    actionTab: "daftar-ulang" as const,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.done
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.done
                            ? "bg-emerald-700 text-white"
                            : "bg-stone-100 text-stone-600 border border-stone-300"
                        }`}
                      >
                        {item.done ? <Check className="w-4 h-4" /> : item.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">{item.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              item.done
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Menunggu Verifikasi" || item.status === "Menunggu tindakan"
                                ? "bg-amber-100 text-amber-800"
                                : item.status === "Perlu Perbaikan"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab(item.actionTab)}
                      className="self-end sm:self-center text-xs font-bold text-[#0F4C3A] hover:underline cursor-pointer"
                    >
                      Buka Tahapan →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BIODATA CALON SANTRI & WALI                       */}
        {/* ======================================================== */}
        {activeTab === "biodata" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                    Identitas Pendaftaran
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                    Biodata Calon Santri & Wali
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Data yang diisi pada formulir pendaftaran santri baru
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditingBiodata && (
                    <button
                      type="button"
                      onClick={() => {
                        if (profile.is_locked) {
                          alert(
                            "Data pendaftaran telah dikunci oleh panitia untuk keperluan verifikasi berkas. Silakan hubungi Panitia PSB via WhatsApp bila terdapat data penting yang perlu direvisi."
                          );
                          return;
                        }
                        setIsEditingBiodata(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white text-xs font-bold shadow-xs cursor-pointer transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Data Pendaftaran</span>
                    </button>
                  )}
                </div>
              </div>

              {profile.is_locked && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Data Terkunci:</strong> Data pendaftaran ini telah diverifikasi oleh staf PSB dan terkunci untuk menjaga keabsahan berkas resmi.
                  </span>
                </div>
              )}

              {/* TAMPILAN VIEW BIODATA */}
              {!isEditingBiodata ? (
                <div className="space-y-6">
                  {/* Foto Profil & Header Singkat */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200/80">
                    <div className="relative w-24 h-32 rounded-xl bg-stone-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                      {profile.foto_santri ? (
                        <Image src={profile.foto_santri} alt={profile.nama_santri} fill className="object-cover" />
                      ) : (
                        <div className="text-center p-2 text-stone-400">
                          <User className="w-10 h-10 mx-auto" />
                          <span className="text-[10px] block mt-1">Belum ada foto</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        {profile.jenjang}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">{profile.nama_santri}</h3>
                      <div className="text-xs font-mono text-stone-500">
                        Nomor Pendaftaran: <strong className="text-emerald-900">{profile.no_pendaftaran}</strong>
                      </div>
                      <div className="pt-2 flex flex-wrap gap-2 text-xs">
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600">
                          Usia: <strong>{profile.tgl_lahir_usia || "-"}</strong>
                        </span>
                        <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600">
                          Status Asrama: <strong>{profile.status_asrama || "Ya, asrama"}</strong>
                        </span>
                        {profile.cita_cita && (
                          <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600">
                            Cita-cita: <strong>{profile.cita_cita}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid Data Rinci */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Nama Lengkap Santri</span>
                      <p className="font-bold text-stone-900 text-sm">{profile.nama_santri}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Jenis Kelamin</span>
                      <p className="font-bold text-stone-900 text-sm">{profile.jenis_kelamin || "Laki-laki"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Tanggal Lahir / Usia</span>
                      <p className="font-bold text-stone-900 text-sm">{profile.tgl_lahir_usia || "-"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Program / Jenjang</span>
                      <p className="font-bold text-emerald-950 text-sm">{profile.jenjang}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Asal Sekolah Sebelumnya</span>
                      <p className="font-semibold text-stone-800 text-sm">{profile.asal_sekolah || "-"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Cita-Cita Calon Santri</span>
                      <p className="font-semibold text-stone-800 text-sm">{profile.cita_cita || "-"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Nama Orang Tua / Ayah / Wali</span>
                      <p className="font-bold text-stone-900 text-sm">{profile.nama_wali}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Nama Ibu Kandung</span>
                      <p className="font-semibold text-stone-800 text-sm">{profile.nama_ibu || "-"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Nomor WhatsApp Aktif</span>
                      <p className="font-mono font-bold text-emerald-900 text-sm">{profile.no_wa}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Status Pendaftaran Saat Ini</span>
                      <p className="font-semibold text-stone-800 text-sm">{profile.status}</p>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] font-bold uppercase">Alamat Lengkap Domisili</span>
                      <p className="font-medium text-stone-800 text-sm leading-relaxed">{profile.alamat || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* FORM EDIT BIODATA */
                <form onSubmit={handleSaveBiodata} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nama Lengkap Santri *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.nama_santri}
                        onChange={(e) => setEditFormData({ ...editFormData, nama_santri: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Jenis Kelamin *</label>
                      <select
                        value={editFormData.jenis_kelamin}
                        onChange={(e) => setEditFormData({ ...editFormData, jenis_kelamin: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Tanggal Lahir / Usia *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.tgl_lahir_usia}
                        onChange={(e) => setEditFormData({ ...editFormData, tgl_lahir_usia: e.target.value })}
                        placeholder="Contoh: 15 Mei 2021 (5 Th)"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Pilihan Asrama</label>
                      <select
                        value={editFormData.status_asrama}
                        onChange={(e) => setEditFormData({ ...editFormData, status_asrama: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                      >
                        <option value="Ya, asrama">Ya, asrama / Boarding</option>
                        <option value="Non-asrama (Full Day)">Non-asrama (Full Day)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Asal Sekolah Sebelumnya</label>
                      <input
                        type="text"
                        value={editFormData.asal_sekolah}
                        onChange={(e) => setEditFormData({ ...editFormData, asal_sekolah: e.target.value })}
                        placeholder="Contoh: SDIT Al-Kautsar"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Cita-Cita Calon Santri</label>
                      <input
                        type="text"
                        value={editFormData.cita_cita}
                        onChange={(e) => setEditFormData({ ...editFormData, cita_cita: e.target.value })}
                        placeholder="Contoh: Penghafal Al-Qur'an / Dokter"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nama Ayah / Wali *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.nama_wali}
                        onChange={(e) => setEditFormData({ ...editFormData, nama_wali: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nama Ibu Kandung</label>
                      <input
                        type="text"
                        value={editFormData.nama_ibu}
                        onChange={(e) => setEditFormData({ ...editFormData, nama_ibu: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nomor WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        required
                        value={editFormData.no_wa}
                        onChange={(e) => setEditFormData({ ...editFormData, no_wa: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Alamat Domisili Lengkap *</label>
                      <textarea
                        rows={2}
                        required
                        value={editFormData.alamat}
                        onChange={(e) => setEditFormData({ ...editFormData, alamat: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditingBiodata(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingBiodata}
                      className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isSavingBiodata ? "Menyimpan..." : "Simpan Perubahan Biodata"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DOWNLOAD & UPLOAD BERKAS                          */}
        {/* ======================================================== */}
        {activeTab === "berkas" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Bagian 1: Unduh Berkas Resmi Panitia */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Dokumen Resmi Baladz
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Unduh Dokumen & Template Berkas
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Unduh berkas-berkas berikut untuk diisi dan di-upload bersamaan dengan berkas persyaratan lainnya:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* 1. Bukti Pendaftaran */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3 text-center">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Bukti Pendaftaran</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Tanda bukti resmi memuat No. Pendaftaran {profile.no_pendaftaran}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrintBuktiOpen(true)}
                    className="w-full py-2 px-3 rounded-lg bg-[#0F4C3A] hover:bg-[#0c3f30] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh / Cetak Bukti</span>
                  </button>
                </div>

                {/* 2. Surat Informasi PSB */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3 text-center">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Surat Informasi PSB</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Petunjuk teknis seleksi, rincian biaya, dan tata tertib santri baru
                    </p>
                  </div>
                  <Link
                    href="/psb"
                    target="_blank"
                    className="w-full py-2 px-3 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Panduan PSB</span>
                  </Link>
                </div>

                {/* 3. Surat Pernyataan Kesanggupan */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between gap-3 text-center">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">Surat Kesanggupan</h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Format surat pernyataan kesanggupan orang tua/wali santri
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent(
                      `Assalamu'alaikum Panitia PSB Baladz, saya ingin meminta file template Surat Kesanggupan untuk pendaftar ${profile.no_pendaftaran} a.n. ${profile.nama_santri}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Minta Template via WA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bagian 2: Upload Berkas Persyaratan */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Checklist Dokumen
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Upload Berkas Persyaratan
                </h2>
                <div className="mt-2 text-xs text-stone-600 space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                  <div className="font-bold text-stone-800">Petunjuk Upload:</div>
                  <p>• Berkas dapat berupa scan foto (JPG/PNG) atau dokumen PDF dengan ukuran maksimal 8 MB.</p>
                  <p>• Pastikan tulisan, stempel sekolah, dan tanda tangan terlihat jelas agar verifikasi tidak ditolak.</p>
                  <p>• Upload berkas satu per satu melalui formulir cepat di bawah ini atau ganti berkas langsung pada tabel.</p>
                </div>
              </div>

              {/* Form Upload Cepat */}
              <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="font-bold text-xs sm:text-sm text-[#0F4C3A]">Form Unggah Dokumen Baru</div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-5">
                    <label className="block font-semibold text-stone-700 mb-1">Pilih Jenis Berkas</label>
                    <select
                      value={selectedUploadKode}
                      onChange={(e) => setSelectedUploadKode(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700"
                    >
                      {MASTER_BERKAS_LIST.map((b) => (
                        <option key={b.kode} value={b.kode}>
                          {b.nama} {b.wajib ? "(Wajib)" : "(Opsional)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Link URL / File Berkas
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan URL foto/PDF (Google Drive / Cloud / Upload)"
                      value={uploadFileUrl}
                      onChange={(e) => setUploadFileUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="button"
                      disabled={isUploadingBerkas || !uploadFileUrl.trim()}
                      onClick={() => {
                        const targetItem = MASTER_BERKAS_LIST.find((m) => m.kode === selectedUploadKode);
                        if (targetItem) {
                          handleUploadBerkas(targetItem.kode, targetItem.nama, uploadFileUrl);
                        }
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#0F4C3A] hover:bg-[#0c3f30] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingBerkas ? "Menyimpan..." : "Simpan Berkas"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabel Status Kelengkapan Berkas */}
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Nama Berkas</th>
                      <th className="py-3 px-4">Kewajiban</th>
                      <th className="py-3 px-4">Status Upload</th>
                      <th className="py-3 px-4">Status Verifikasi</th>
                      <th className="py-3 px-4">Catatan Panitia</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {MASTER_BERKAS_LIST.map((master) => {
                      const uploaded = profile.berkasList.find((b) => b.kode_berkas === master.kode);
                      return (
                        <tr key={master.kode} className="hover:bg-stone-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{master.nama}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{master.deskripsi}</div>
                          </td>
                          <td className="py-3 px-4">
                            {master.wajib ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                                Wajib
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                                Opsional
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {uploaded ? (
                              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Sudah Diunggah</span>
                              </span>
                            ) : (
                              <span className="text-stone-400 font-medium italic">Belum Diunggah</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {uploaded ? (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  uploaded.status === "disetujui"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : uploaded.status === "perlu_perbaikan"
                                    ? "bg-rose-100 text-rose-800 font-bold"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {uploaded.status === "disetujui"
                                  ? "Disetujui"
                                  : uploaded.status === "perlu_perbaikan"
                                  ? "Perlu Perbaikan"
                                  : "Menunggu Verifikasi"}
                              </span>
                            ) : (
                              <span className="text-stone-300">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-[200px]">
                            {uploaded?.catatan_admin ? (
                              <div className="text-rose-700 bg-rose-50 p-1.5 rounded text-[11px] font-medium leading-relaxed">
                                {uploaded.catatan_admin}
                              </div>
                            ) : (
                              <span className="text-stone-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {uploaded ? (
                              <div className="inline-flex items-center gap-2">
                                <a
                                  href={uploaded.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Lihat File</span>
                                </a>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUploadKode(master.kode);
                                  window.scrollTo({ top: 300, behavior: "smooth" });
                                }}
                                className="text-xs font-bold text-[#0F4C3A] hover:underline"
                              >
                                Upload Sekarang
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BIAYA & PEMBAYARAN FORMULIR / PENDAFTARAN         */}
        {/* ======================================================== */}
        {activeTab === "pembayaran" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Administrasi Keuangan
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Pembayaran Biaya Formulir & Pendaftaran
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Transfer biaya pendaftaran hanya dilakukan ke rekening resmi yayasan
                </p>
              </div>

              {/* Status Box */}
              {profile.status_pembayaran === "Lunas" ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-emerald-950">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Alhamdulillah, Pembayaran Telah Lunas & Terverifikasi Panitia</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-emerald-700 block">Nomor Kuitansi Resmi:</span>
                      <span className="font-mono font-bold text-sm text-emerald-950">
                        {profile.nomor_kuitansi || `KWT-BLZ-${profile.no_pendaftaran}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Nominal Terverifikasi:</span>
                      <span className="font-bold text-sm text-emerald-950">
                        {formatRupiah(profile.nominal_bayar || content.psb.biayaPendaftaran || 150000)}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Tanggal Verifikasi:</span>
                      <span className="font-semibold text-emerald-950">
                        {profile.tanggal_bayar ? new Date(profile.tanggal_bayar).toLocaleDateString("id-ID") : "Terverifikasi"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : profile.status_pembayaran === "Menunggu Verifikasi" ? (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 text-blue-950">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Bukti Pembayaran Sedang Menunggu Verifikasi Panitia</span>
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Bukti transfer Anda telah masuk ke sistem antrean staf PSB. Verifikasi berkas dan pembayaran biasanya memerlukan waktu 1x24 jam kerja.
                  </p>
                  {profile.bukti_pembayaran_url && (
                    <div className="pt-1">
                      <a
                        href={profile.bukti_pembayaran_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-800 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Transfer yang Telah Dikirim</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-amber-950">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                    <span>Harap Segera Melakukan Pembayaran Biaya Pendaftaran</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Setelah transfer berhasil, unggah foto/screenshot bukti transfer pada formulir konfirmasi di bawah ini agar panitia dapat segera menerbitkan jadwal seleksi ananda.
                  </p>
                </div>
              )}

              {/* Rincian Rekening Resmi Yayasan */}
              <div className="rounded-2xl bg-[#0F4C3A] text-white p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Rekening Resmi Penerimaan
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                      {content.psb.rekeningPembayaran.bank || "Bank Syariah Indonesia"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-200 block">Nominal Tagihan Formulir:</span>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300">
                      {formatRupiah(content.psb.biayaPendaftaran || 150000)}
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-emerald-200 text-[10px] uppercase font-bold block">Nomor Rekening Resmi</span>
                    <span className="font-mono text-xl font-bold text-white tracking-wider">
                      {content.psb.rekeningPembayaran.nomorRekening}
                    </span>
                    <p className="text-emerald-100 text-xs">
                      a.n. <strong className="text-white">{content.psb.rekeningPembayaran.atasNama}</strong>
                    </p>
                  </div>

                  <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-emerald-200 text-[10px] uppercase font-bold block">Catatan Transfer</span>
                    <p className="text-emerald-100 text-xs leading-relaxed italic">
                      {content.psb.rekeningPembayaran.catatanTransfer ||
                        `Tuliskan berita transfer: PSB ${profile.no_pendaftaran} ${profile.nama_santri}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Konfirmasi Upload Bukti Transfer */}
              {profile.status_pembayaran !== "Lunas" && (
                <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs sm:text-sm pt-2">
                  <div className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
                    Form Konfirmasi Bukti Transfer
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Link / URL Foto Bukti Transfer *
                      </label>
                      <input
                        type="text"
                        required
                        value={bayarFormBuktiUrl}
                        onChange={(e) => setBayarFormBuktiUrl(e.target.value)}
                        placeholder="Contoh: link foto transfer / URL Google Drive"
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 text-stone-900 bg-white"
                      />
                      <p className="text-[11px] text-stone-400 mt-1">
                        Masukkan tautan foto/screenshot bukti transfer yang jelas.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nominal yang Ditransfer (Rp) *</label>
                      <input
                        type="number"
                        required
                        value={bayarFormNominal}
                        onChange={(e) => setBayarFormNominal(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 text-stone-900 bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Catatan Tambahan (opsional)</label>
                      <input
                        type="text"
                        value={bayarFormCatatan}
                        onChange={(e) => setBayarFormCatatan(e.target.value)}
                        placeholder="Contoh: Transfer dari rekening BSI an. Ayah Ahmad"
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingPayment}
                      className="px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmittingPayment ? "Mengirim Konfirmasi..." : "Kirim Bukti Pembayaran"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: UNDANGAN UJIAN SELEKSI                            */}
        {/* ======================================================== */}
        {activeTab === "seleksi" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Tahap Ujian Seleksi
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Undangan & Petunjuk Ujian Seleksi
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Informasi jadwal tes baca Al-Qur&apos;an dan wawancara calon santri
                </p>
              </div>

              {!profile.undangan_terbit || !profile.jadwal_seleksi ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2.5 text-base font-bold text-amber-900">
                    <Clock className="w-5 h-5 text-amber-700" />
                    <span>Undangan Seleksi Belum Dapat Dilihat</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed max-w-2xl">
                    Undangan ujian seleksi baru dapat diterbitkan oleh panitia setelah berkas pendaftaran lengkap dan transfer biaya pendaftaran diverifikasi oleh sistem. Jika berkas dan pembayaran sudah lengkap, jadwal seleksi akan otomatis muncul pada bagian ini.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("berkas")}
                      className="px-4 py-2 rounded-lg bg-[#0F4C3A] text-white text-xs font-bold"
                    >
                      Periksa Kelengkapan Berkas →
                    </button>
                  </div>
                </div>
              ) : (
                /* KARTU UNDANGAN RESMI TERBIT */
                <div className="space-y-6">
                  <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                          Undangan Seleksi Resmi
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-2">
                          Jadwal Ujian Seleksi Masuk
                        </h3>
                        <p className="text-xs text-emerald-900 mt-0.5">
                          Calon Santri: <strong>{profile.nama_santri}</strong> • Program:{" "}
                          <strong>{profile.jenjang}</strong>
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs">
                      <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1">
                        <span className="text-emerald-700 text-[10px] font-bold uppercase block">
                          Hari, Tanggal & Waktu
                        </span>
                        <p className="font-bold text-stone-900 text-sm sm:text-base">{profile.jadwal_seleksi}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1">
                        <span className="text-emerald-700 text-[10px] font-bold uppercase block">
                          Media / Tempat Seleksi
                        </span>
                        <p className="font-bold text-stone-900 text-sm sm:text-base">
                          {profile.lokasi_seleksi || "Video Call WhatsApp / Tatap Muka di Ma'had Baladz"}
                        </p>
                      </div>
                    </div>

                    {profile.instruksi_seleksi && (
                      <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                        <span className="text-emerald-800 text-xs font-bold block">
                          Instruksi & Materi Ujian Seleksi:
                        </span>
                        <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                          {profile.instruksi_seleksi}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <a
                        href={`https://wa.me/62${content.kontak.whatsappUtama.replace(/^0/, "")}?text=${encodeURIComponent(
                          `Assalamu'alaikum Panitia PSB Baladz, saya mengonfirmasi kesiapan jadwal ujian seleksi ananda ${profile.nama_santri} (${profile.no_pendaftaran}) pada ${profile.jadwal_seleksi}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Konfirmasi Kehadiran via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PENGUMUMAN HASIL KELULUSAN                        */}
        {/* ======================================================== */}
        {activeTab === "pengumuman" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Keputusan Panitia PSB
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Pengumuman Hasil Ujian Seleksi
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Keputusan resmi penerimaan santri baru Ma&apos;had Baladz Al-Qur&apos;an
                </p>
              </div>

              {!profile.pengumuman_terbit || !profile.hasil_seleksi || profile.hasil_seleksi === "Belum Tersedia" ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 text-base font-bold text-amber-900">
                    <Clock className="w-5 h-5 text-amber-700" />
                    <span>Pengumuman Belum Dapat Dilihat</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed max-w-2xl">
                    Hasil seleksi saat ini sedang dalam proses rekapitulasi nilai oleh dewan asatidzah. Pengumuman Insya Allah muncul pada bagian ini sesuai jadwal resmi pengumuman.
                  </p>
                </div>
              ) : profile.hasil_seleksi === "Diterima" ? (
                /* HASIL DITERIMA */
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-4 text-emerald-950">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                    Alhamdulillah — Diterima
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F4C3A]">
                    Selamat, Ananda Dinyatakan Lulus & Diterima!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    Berdasarkan hasil tes baca Al-Qur&apos;an dan wawancara, calon santri atas nama{" "}
                    <strong>{profile.nama_santri}</strong> (No. Pendaftaran: <strong>{profile.no_pendaftaran}</strong>)
                    dinyatakan resmi diterima di program <strong>{profile.jenjang}</strong> Ma&apos;had Baladz
                    Al-Qur&apos;an TA {content.psb.tahunAjaran}.
                  </p>

                  {profile.catatan_pengumuman && (
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                      <strong className="block text-emerald-900 mb-1">Catatan Panitia:</strong>
                      {profile.catatan_pengumuman}
                    </div>
                  )}

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("daftar-ulang")}
                      className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#b56405] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                    >
                      Lanjut ke Proses Daftar Ulang →
                    </button>
                  </div>
                </div>
              ) : profile.hasil_seleksi === "Cadangan" ? (
                /* HASIL CADANGAN */
                <div className="p-6 sm:p-8 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 text-amber-950">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Status Cadangan
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                    Calon Santri Cadangan
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Ananda <strong>{profile.nama_santri}</strong> dinyatakan sebagai santri cadangan. Panitia akan segera menghubungi orang tua/wali santri apabila terdapat kuota yang tersedia dari calon santri yang mengundurkan diri.
                  </p>
                </div>
              ) : (
                /* HASIL TIDAK DITERIMA */
                <div className="p-6 sm:p-8 rounded-2xl bg-stone-100 border border-stone-300 space-y-3 text-stone-800">
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    Jazakumullahu Khairan atas Partisipasinya
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Kami sampaikan apresiasi sebesar-besarnya atas minat ananda <strong>{profile.nama_santri}</strong>. Berdasarkan kuota penerimaan dan hasil evaluasi seleksi, ananda belum dapat diterima pada periode ini. Semoga Allah senantiasa melimpahkan berkah dan kemudahan dalam menuntut ilmu Al-Qur&apos;an di masa depan.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: DAFTAR ULANG SANTRI BARU                          */}
        {/* ======================================================== */}
        {activeTab === "daftar-ulang" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                  Tahap Akhir PSB
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                  Penyelesaian Daftar Ulang
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Pelunasan uang pangkal, perlengkapan santri, dan konfirmasi kehadiran
                </p>
              </div>

              {profile.status_daftar_ulang === "Selesai" ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-emerald-950">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Daftar Ulang Telah Tuntas & Terverifikasi!</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Selamat bergabung di keluarga besar Ma&apos;had Baladz Al-Qur&apos;an. Informasi seragam, jadwal masuk asrama / hari pertama KBM akan diumumkan oleh bagian kesantrian.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Panduan Rincian Biaya */}
                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <h3 className="font-bold text-xs sm:text-sm text-stone-800">
                      Petunjuk Pelunasan Daftar Ulang:
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Silakan melakukan pelunasan daftar ulang ke rekening resmi yayasan:
                    </p>
                    <div className="p-3.5 rounded-lg bg-white border border-stone-200 text-xs space-y-1">
                      <div className="font-bold text-stone-800">{content.psb.rekeningPembayaran.bank}</div>
                      <div className="font-mono text-base font-bold text-emerald-900">
                        {content.psb.rekeningPembayaran.nomorRekening}
                      </div>
                      <div className="text-stone-500">a.n. {content.psb.rekeningPembayaran.atasNama}</div>
                    </div>
                    {content.psb.batasDaftarUlang && (
                      <div className="text-xs font-bold text-amber-800">
                        Batas Akhir Pelunasan: {content.psb.batasDaftarUlang}
                      </div>
                    )}
                  </div>

                  {/* Form Upload Bukti Daftar Ulang */}
                  <form onSubmit={handleSubmitDaftarUlang} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Link / URL Foto Bukti Transfer Daftar Ulang *
                      </label>
                      <input
                        type="text"
                        required
                        value={daftarUlangBuktiUrl}
                        onChange={(e) => setDaftarUlangBuktiUrl(e.target.value)}
                        placeholder="Contoh: link file bukti transfer daftar ulang"
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 text-stone-900 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingDaftarUlang}
                      className="px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmittingDaftarUlang ? "Mengirim..." : "Kirim Konfirmasi Daftar Ulang"}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL CETAK BUKTI PENDAFTARAN RESMI                      */}
      {/* ======================================================== */}
      {isPrintBuktiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsPrintBuktiOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 print:hidden"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="border-b-2 border-[#0F4C3A] pb-4 flex items-center justify-between gap-4">
              <div className="relative h-12 w-40">
                <Image src="/images/baladz/logo.png" alt="Baladz" fill className="object-contain" />
              </div>
              <div className="text-right">
                <div className="font-serif font-bold text-sm text-[#0F4C3A] uppercase">
                  Tanda Bukti Pendaftaran Online
                </div>
                <div className="text-[11px] text-stone-500">Penerimaan Santri Baru TA {content.psb.tahunAjaran}</div>
              </div>
            </div>

            {/* Kartu Bukti Pendaftaran */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Nomor Pendaftaran</span>
                  <span className="font-mono text-base font-bold text-[#0F4C3A]">{profile.no_pendaftaran}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Tanggal Daftar</span>
                  <span className="font-bold text-stone-800">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString("id-ID") : "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Nama Calon Santri:</span>
                  <span className="font-bold text-stone-900 text-sm">{profile.nama_santri}</span>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Jenjang / Program:</span>
                  <span className="font-bold text-emerald-900 text-sm">{profile.jenjang}</span>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Tanggal Lahir / Usia:</span>
                  <span className="font-semibold text-stone-800">{profile.tgl_lahir_usia || "-"}</span>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Status Asrama:</span>
                  <span className="font-semibold text-stone-800">{profile.status_asrama || "Ya, asrama"}</span>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Nama Orang Tua / Wali:</span>
                  <span className="font-semibold text-stone-800">{profile.nama_wali}</span>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="text-stone-400 text-[10px] uppercase block">Nomor WhatsApp:</span>
                  <span className="font-mono font-semibold text-stone-800">{profile.no_wa}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 space-y-1">
                <div className="font-bold">Informasi Keabsahan Dokumen:</div>
                <p>
                  Bukti pendaftaran ini sah dan diterbitkan secara digital oleh sistem PSB Ma&apos;had Baladz Al-Qur&apos;an. Harap simpan nomor pendaftaran ini untuk keperluan tes seleksi dan daftar ulang.
                </p>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-stone-100 justify-end print:hidden">
              <button
                type="button"
                onClick={() => setIsPrintBuktiOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0F4C3A] text-white hover:bg-[#0c3f30] flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Cetak PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
