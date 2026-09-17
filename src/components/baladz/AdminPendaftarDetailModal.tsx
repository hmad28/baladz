"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Check,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Lock,
  ShieldCheck,
  Unlock,
  Upload,
  User,
  X,
} from "lucide-react";
import type { SiteContent } from "@/content/site-content";

export interface PendaftarRow {
  id: number;
  no_pendaftaran?: string;
  plain_password?: string;
  nama_santri: string;
  tgl_lahir_usia: string;
  jenjang: string;
  nama_wali: string;
  no_wa: string;
  alamat: string;
  status: string;
  jadwal_seleksi?: string;
  created_at: string;
  foto_santri?: string | null;
  jenis_kelamin?: string | null;
  cita_cita?: string | null;
  status_asrama?: string | null;
  asal_sekolah?: string | null;
  nama_ibu?: string | null;
  status_berkas?: string;
  status_pembayaran?: string;
  bukti_pembayaran_url?: string | null;
  nominal_bayar?: number | null;
  tanggal_bayar?: string | null;
  nomor_kuitansi?: string | null;
  metode_bayar?: string | null;
  catatan_pembayaran?: string | null;
  catatan_panitia?: string | null;
  lokasi_seleksi?: string | null;
  instruksi_seleksi?: string | null;
  undangan_terbit?: boolean | null;
  hasil_seleksi?: string | null;
  pengumuman_terbit?: boolean | null;
  catatan_pengumuman?: string | null;
  status_daftar_ulang?: string | null;
  bukti_daftar_ulang_url?: string | null;
  is_locked?: boolean | null;
  total_berkas?: number;
  berkas_disetujui?: number;
}

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

interface AdminPendaftarDetailModalProps {
  pendaftar: PendaftarRow;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePendaftar: (id: number, updates: Partial<PendaftarRow>) => Promise<void>;
  onRefresh: () => void;
  showToast: (msg: string) => void;
  content: SiteContent;
}

export function AdminPendaftarDetailModal({
  pendaftar,
  isOpen,
  onClose,
  onUpdatePendaftar,
  onRefresh,
  showToast,
  content,
}: AdminPendaftarDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "biodata" | "berkas" | "pembayaran" | "seleksi" | "pengumuman" | "daftar-ulang"
  >("biodata");

  const [berkasList, setBerkasList] = useState<PendaftarBerkasItem[]>([]);
  const [loadingBerkas, setLoadingBerkas] = useState(false);

  // Form states for Pembayaran
  const [statusBayar, setStatusBayar] = useState(pendaftar.status_pembayaran || "Belum Bayar");
  const [noKuitansi, setNoKuitansi] = useState(
    pendaftar.nomor_kuitansi || `KWT-${pendaftar.no_pendaftaran || pendaftar.id}`
  );
  const [nominalBayar, setNominalBayar] = useState(
    pendaftar.nominal_bayar || content.psb.biayaPendaftaran || 150000
  );
  const [catatanBayar, setCatatanBayar] = useState(pendaftar.catatan_pembayaran || "");

  // Form states for Seleksi & Undangan
  const [jadwalSeleksi, setJadwalSeleksi] = useState(pendaftar.jadwal_seleksi || "");
  const [lokasiSeleksi, setLokasiSeleksi] = useState(
    pendaftar.lokasi_seleksi || "Video Call WhatsApp / Tatap Muka di Ma'had Baladz"
  );
  const [instruksiSeleksi, setInstruksiSeleksi] = useState(
    pendaftar.instruksi_seleksi ||
      "1. Membaca Al-Qur'an surat pilihan.\n2. Wawancara motivasi belajar & komitmen asrama.\n3. Harap hadir / aktif 10 menit sebelum jadwal seleksi."
  );
  const [undanganTerbit, setUndanganTerbit] = useState(Boolean(pendaftar.undangan_terbit));

  // Form states for Pengumuman
  const [hasilSeleksi, setHasilSeleksi] = useState(pendaftar.hasil_seleksi || "Belum Tersedia");
  const [catatanPengumuman, setCatatanPengumuman] = useState(
    pendaftar.catatan_pengumuman ||
      "Bagi calon santri yang dinyatakan diterima, harap segera menyelesaikan pelunasan daftar ulang."
  );
  const [pengumumanTerbit, setPengumumanTerbit] = useState(Boolean(pendaftar.pengumuman_terbit));

  // Form states for Daftar Ulang
  const [statusDaftarUlang, setStatusDaftarUlang] = useState(
    pendaftar.status_daftar_ulang || "Belum Dimulai"
  );

  const [isSaving, setIsSaving] = useState(false);

  // Catatan revisi berkas modal
  const [revisiModalBerkas, setRevisiModalBerkas] = useState<PendaftarBerkasItem | null>(null);
  const [catatanRevisiInput, setCatatanRevisiInput] = useState("");

  const fetchBerkas = async () => {
    setLoadingBerkas(true);
    try {
      const res = await fetch(`/api/pendaftar/berkas?pendaftar_id=${pendaftar.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBerkasList(data.data);
      }
    } catch (err) {
      console.error("Gagal load berkas:", err);
    } finally {
      setLoadingBerkas(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBerkas();
      setStatusBayar(pendaftar.status_pembayaran || "Belum Bayar");
      setNoKuitansi(pendaftar.nomor_kuitansi || `KWT-${pendaftar.no_pendaftaran || pendaftar.id}`);
      setNominalBayar(pendaftar.nominal_bayar || content.psb.biayaPendaftaran || 150000);
      setCatatanBayar(pendaftar.catatan_pembayaran || "");
      setJadwalSeleksi(pendaftar.jadwal_seleksi || "");
      setLokasiSeleksi(
        pendaftar.lokasi_seleksi || "Video Call WhatsApp / Tatap Muka di Ma'had Baladz"
      );
      setInstruksiSeleksi(
        pendaftar.instruksi_seleksi ||
          "1. Membaca Al-Qur'an surat pilihan.\n2. Wawancara motivasi belajar & komitmen asrama.\n3. Harap hadir / aktif 10 menit sebelum jadwal seleksi."
      );
      setUndanganTerbit(Boolean(pendaftar.undangan_terbit));
      setHasilSeleksi(pendaftar.hasil_seleksi || "Belum Tersedia");
      setCatatanPengumuman(pendaftar.catatan_pengumuman || "");
      setPengumumanTerbit(Boolean(pendaftar.pengumuman_terbit));
      setStatusDaftarUlang(pendaftar.status_daftar_ulang || "Belum Dimulai");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendaftar]);

  if (!isOpen) return null;

  const handleToggleLock = async () => {
    const newLock = !pendaftar.is_locked;
    await onUpdatePendaftar(pendaftar.id, { is_locked: newLock });
    showToast(newLock ? "Data pendaftar telah dikunci." : "Kunci data pendaftar telah dibuka.");
  };

  const handleVerifyBerkasItem = async (
    berkasId: number,
    status: "disetujui" | "perlu_perbaikan",
    catatan?: string
  ) => {
    try {
      const res = await fetch("/api/pendaftar/berkas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: berkasId, status, catatan_admin: catatan || null }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Status berkas berhasil diperbarui.");
        await fetchBerkas();
        onRefresh();
      }
    } catch {
      alert("Gagal memperbarui berkas");
    }
  };

  const handleSavePembayaran = async () => {
    setIsSaving(true);
    try {
      await onUpdatePendaftar(pendaftar.id, {
        status_pembayaran: statusBayar,
        nomor_kuitansi: noKuitansi,
        nominal_bayar: Number(nominalBayar),
        catatan_pembayaran: catatanBayar,
      });
      showToast("Data verifikasi pembayaran berhasil disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSeleksi = async () => {
    setIsSaving(true);
    try {
      await onUpdatePendaftar(pendaftar.id, {
        jadwal_seleksi: jadwalSeleksi,
        lokasi_seleksi: lokasiSeleksi,
        instruksi_seleksi: instruksiSeleksi,
        undangan_terbit: undanganTerbit,
        status: undanganTerbit ? "Seleksi dijadwalkan" : pendaftar.status,
      });
      showToast("Jadwal dan undangan seleksi berhasil disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePengumuman = async () => {
    setIsSaving(true);
    try {
      await onUpdatePendaftar(pendaftar.id, {
        hasil_seleksi: hasilSeleksi,
        catatan_pengumuman: catatanPengumuman,
        pengumuman_terbit: pengumumanTerbit,
        status:
          pengumumanTerbit && hasilSeleksi === "Diterima"
            ? "Diterima"
            : pengumumanTerbit && hasilSeleksi === "Tidak Diterima"
            ? "Tidak dilanjutkan"
            : pendaftar.status,
      });
      showToast("Hasil seleksi dan status pengumuman berhasil disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDaftarUlang = async () => {
    setIsSaving(true);
    try {
      await onUpdatePendaftar(pendaftar.id, {
        status_daftar_ulang: statusDaftarUlang,
      });
      showToast("Status daftar ulang berhasil disimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-[#0F4C3A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="relative w-12 h-14 rounded-xl bg-white/20 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
              {pendaftar.foto_santri ? (
                <Image src={pendaftar.foto_santri} alt={pendaftar.nama_santri} fill className="object-cover" />
              ) : (
                <User className="w-6 h-6 text-white/70" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                  {pendaftar.no_pendaftaran || `ID #${pendaftar.id}`}
                </span>
                <span className="text-[11px] text-emerald-200 font-medium">
                  {pendaftar.jenjang}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                {pendaftar.nama_santri}
              </h2>
              <p className="text-xs text-emerald-100">
                Wali: <strong>{pendaftar.nama_wali}</strong> ({pendaftar.no_wa})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Lock / Unlock Data */}
            <button
              type="button"
              onClick={handleToggleLock}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                pendaftar.is_locked
                  ? "bg-amber-500 text-stone-900 hover:bg-amber-400"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              title={pendaftar.is_locked ? "Data Terkunci (Calon santri tidak bisa mengedit)" : "Data Terbuka"}
            >
              {pendaftar.is_locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{pendaftar.is_locked ? "Terkunci" : "Kunci Data"}</span>
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INFO AKUN LOGIN CALON SANTRI BAR */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-950">
            <span className="font-bold">Akses Akun Santri:</span>
            <span>No. Daftar: <strong className="font-mono">{pendaftar.no_pendaftaran}</strong></span>
            <span>•</span>
            <span>Kata Sandi: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200">{pendaftar.plain_password || pendaftar.no_wa.slice(-6)}</strong></span>
          </div>
          <span className="text-[11px] text-emerald-700">
            Bagikan info ini bila wali santri memerlukan bantuan login ke <strong>/dashboard</strong>
          </span>
        </div>

        {/* MODAL TABS */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-stone-200 overflow-x-auto no-scrollbar shrink-0 bg-stone-50/50">
          {[
            { id: "biodata", label: "Biodata", icon: User },
            { id: "berkas", label: "Berkas Dokumen", icon: Upload, badge: `${berkasList.length}` },
            { id: "pembayaran", label: "Pembayaran", icon: CreditCard, badge: statusBayar },
            { id: "seleksi", label: "Ujian Seleksi", icon: Calendar, badge: undanganTerbit ? "Terbit" : undefined },
            { id: "pengumuman", label: "Pengumuman", icon: GraduationCap, badge: pengumumanTerbit ? hasilSeleksi : undefined },
            { id: "daftar-ulang", label: "Daftar Ulang", icon: ShieldCheck, badge: statusDaftarUlang },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold text-xs transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#0F4C3A] text-[#0F4C3A] bg-white rounded-t-lg shadow-2xs"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {/* ======================================================= */}
          {/* TAB 1: BIODATA                                          */}
          {/* ======================================================= */}
          {activeTab === "biodata" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Nama Lengkap Santri</span>
                  <p className="font-bold text-stone-900 text-sm">{pendaftar.nama_santri}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Program / Jenjang</span>
                  <p className="font-bold text-emerald-900 text-sm">{pendaftar.jenjang}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Jenis Kelamin</span>
                  <p className="font-semibold text-stone-800">{pendaftar.jenis_kelamin || "Laki-laki"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Tanggal Lahir / Usia</span>
                  <p className="font-semibold text-stone-800">{pendaftar.tgl_lahir_usia || "-"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Pilihan Asrama</span>
                  <p className="font-semibold text-stone-800">{pendaftar.status_asrama || "Ya, asrama"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Asal Sekolah</span>
                  <p className="font-semibold text-stone-800">{pendaftar.asal_sekolah || "-"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Cita-Cita</span>
                  <p className="font-semibold text-stone-800">{pendaftar.cita_cita || "-"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Nama Orang Tua / Wali</span>
                  <p className="font-bold text-stone-900">{pendaftar.nama_wali}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Nama Ibu Kandung</span>
                  <p className="font-semibold text-stone-800">{pendaftar.nama_ibu || "-"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Nomor WhatsApp</span>
                  <p className="font-mono font-bold text-emerald-800">{pendaftar.no_wa}</p>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Alamat Lengkap</span>
                  <p className="font-medium text-stone-800 leading-relaxed">{pendaftar.alamat || "-"}</p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: VERIFIKASI BERKAS                                */}
          {/* ======================================================= */}
          {activeTab === "berkas" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Dokumen yang Diunggah Calon Santri</h4>
                  <p className="text-xs text-stone-500">Periksa dan berikan validasi keabsahan dokumen persyaratan</p>
                </div>
                <button
                  type="button"
                  onClick={fetchBerkas}
                  disabled={loadingBerkas}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold"
                >
                  {loadingBerkas ? "Memuat..." : "Refresh Berkas"}
                </button>
              </div>

              {berkasList.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-400">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-xs">Calon santri belum mengunggah dokumen persyaratan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {berkasList.map((berkas) => (
                    <div
                      key={berkas.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-stone-900 text-xs sm:text-sm">{berkas.nama_berkas}</h5>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              berkas.status === "disetujui"
                                ? "bg-emerald-100 text-emerald-800"
                                : berkas.status === "perlu_perbaikan"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {berkas.status === "disetujui"
                              ? "Disetujui"
                              : berkas.status === "perlu_perbaikan"
                              ? "Perlu Revisi"
                              : "Menunggu Pemeriksaan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <a
                            href={berkas.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka / Pratinjau File</span>
                          </a>
                        </div>
                        {berkas.catatan_admin && (
                          <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg mt-1 font-medium">
                            Catatan Revisi Panitia: {berkas.catatan_admin}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleVerifyBerkasItem(berkas.id, "disetujui")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRevisiModalBerkas(berkas);
                            setCatatanRevisiInput(berkas.catatan_admin || "");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                        >
                          Minta Revisi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: VERIFIKASI PEMBAYARAN FORMULIR                   */}
          {/* ======================================================= */}
          {activeTab === "pembayaran" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Status Pembayaran</label>
                    <select
                      value={statusBayar}
                      onChange={(e) => setStatusBayar(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                    >
                      <option value="Belum Bayar">Belum Bayar</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Lunas">Lunas (Disetujui)</option>
                      <option value="Ditolak">Ditolak / Bukti Tidak Sesuai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nomor Kuitansi Resmi</label>
                    <input
                      type="text"
                      value={noKuitansi}
                      onChange={(e) => setNoKuitansi(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nominal Terbayar (Rp)</label>
                    <input
                      type="number"
                      value={nominalBayar}
                      onChange={(e) => setNominalBayar(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Keuangan Panitia</label>
                    <input
                      type="text"
                      value={catatanBayar}
                      onChange={(e) => setCatatanBayar(e.target.value)}
                      placeholder="Contoh: Lunas via transfer BSI tanggal 15 Okt"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePembayaran}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Verifikasi Pembayaran"}
                  </button>
                </div>

                {/* Bukti Transfer Box */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="font-bold text-xs text-stone-800">Bukti Transfer yang Dikirimkan:</div>
                  {pendaftar.bukti_pembayaran_url ? (
                    <div className="space-y-2">
                      <div className="relative h-48 w-full rounded-lg bg-stone-200 overflow-hidden border border-stone-300">
                        <Image
                          src={pendaftar.bukti_pembayaran_url}
                          alt="Bukti Transfer"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <a
                        href={pendaftar.bukti_pembayaran_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Gambar Ukuran Asli</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-stone-400 text-xs italic">
                      Calon santri belum mengunggah foto / bukti transfer pembayaran.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: UJIAN SELEKSI & UNDANGAN                         */}
          {/* ======================================================= */}
          {activeTab === "seleksi" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Waktu & Jadwal Seleksi *
                    </label>
                    <input
                      type="text"
                      value={jadwalSeleksi}
                      onChange={(e) => setJadwalSeleksi(e.target.value)}
                      placeholder="Contoh: Sabtu, 28 Oktober 2026 pukul 09.00 WIB"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Lokasi / Media Seleksi *
                    </label>
                    <input
                      type="text"
                      value={lokasiSeleksi}
                      onChange={(e) => setLokasiSeleksi(e.target.value)}
                      placeholder="Contoh: Video Call WhatsApp / Gedung Ma'had Baladz"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Instruksi & Materi Ujian
                    </label>
                    <textarea
                      rows={3}
                      value={instruksiSeleksi}
                      onChange={(e) => setInstruksiSeleksi(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 cursor-pointer text-xs font-bold text-emerald-950">
                    <input
                      type="checkbox"
                      checked={undanganTerbit}
                      onChange={(e) => setUndanganTerbit(e.target.checked)}
                      className="w-4 h-4 accent-[#0F4C3A]"
                    />
                    <span>Terbitkan Undangan Seleksi ke Dashboard Calon Santri</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSaveSeleksi}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Pengaturan Seleksi"}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="font-bold text-xs text-stone-800">Pratinjau Status Undangan:</div>
                  <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs space-y-1.5 leading-relaxed">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Status Tayang:</span>
                      <span className={`font-bold ${undanganTerbit ? "text-emerald-700" : "text-amber-600"}`}>
                        {undanganTerbit ? "Diterbitkan ke Dashboard Santri" : "Belum Diterbitkan"}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Jadwal:</span>
                      <span className="font-semibold text-stone-900">{jadwalSeleksi || "Belum diisi"}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Media:</span>
                      <span className="font-semibold text-stone-900">{lokasiSeleksi}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 5: PENGUMUMAN HASIL KELULUSAN                       */}
          {/* ======================================================= */}
          {activeTab === "pengumuman" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Hasil Kelulusan Seleksi *</label>
                    <select
                      value={hasilSeleksi}
                      onChange={(e) => setHasilSeleksi(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                    >
                      <option value="Belum Tersedia">Belum Tersedia</option>
                      <option value="Diterima">Diterima (Lulus)</option>
                      <option value="Cadangan">Cadangan</option>
                      <option value="Tidak Diterima">Tidak Diterima</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Catatan / Surat Pengumuman</label>
                    <textarea
                      rows={3}
                      value={catatanPengumuman}
                      onChange={(e) => setCatatanPengumuman(e.target.value)}
                      placeholder="Petunjuk lanjutan bagi santri yang lulus atau motivasi bagi yang belum lulus"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 cursor-pointer text-xs font-bold text-emerald-950">
                    <input
                      type="checkbox"
                      checked={pengumumanTerbit}
                      onChange={(e) => setPengumumanTerbit(e.target.checked)}
                      className="w-4 h-4 accent-[#0F4C3A]"
                    />
                    <span>Publikasikan Hasil Pengumuman ke Dashboard Santri</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSavePengumuman}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan & Publikasikan Pengumuman"}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="font-bold text-xs text-stone-800">Pratinjau Pengumuman:</div>
                  <div className="p-3.5 bg-white rounded-lg border border-stone-200 text-xs space-y-2 leading-relaxed">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-stone-400">Keputusan:</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                          hasilSeleksi === "Diterima"
                            ? "bg-emerald-100 text-emerald-800"
                            : hasilSeleksi === "Cadangan"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {hasilSeleksi}
                      </span>
                    </div>
                    <p className="text-stone-600 text-xs">{catatanPengumuman || "Belum ada catatan"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 6: DAFTAR ULANG                                     */}
          {/* ======================================================= */}
          {activeTab === "daftar-ulang" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Status Daftar Ulang</label>
                    <select
                      value={statusDaftarUlang}
                      onChange={(e) => setStatusDaftarUlang(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                    >
                      <option value="Belum Dimulai">Belum Dimulai</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Selesai">Selesai (Tuntas)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveDaftarUlang}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Status Daftar Ulang"}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="font-bold text-xs text-stone-800">Bukti Pembayaran Daftar Ulang:</div>
                  {pendaftar.bukti_daftar_ulang_url ? (
                    <div className="space-y-2">
                      <a
                        href={pendaftar.bukti_daftar_ulang_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Transfer Daftar Ulang</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-stone-400 text-xs italic">
                      Belum ada bukti pembayaran daftar ulang yang diunggah.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            Terakhir diupdate: {pendaftar.created_at ? new Date(pendaftar.created_at).toLocaleString("id-ID") : "-"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* SUB-MODAL CATATAN REVISI BERKAS */}
      {revisiModalBerkas && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h4 className="font-bold text-stone-900 text-base">
              Minta Revisi: {revisiModalBerkas.nama_berkas}
            </h4>
            <p className="text-xs text-stone-500">
              Tuliskan alasan penolakan berkas agar calon santri mengetahui apa yang perlu diperbaiki (contoh: foto kurang jelas, belum ada stempel sekolah, dll).
            </p>
            <textarea
              rows={3}
              value={catatanRevisiInput}
              onChange={(e) => setCatatanRevisiInput(e.target.value)}
              placeholder="Contoh: Foto terpotong atau dokumen belum ditandatangani orang tua."
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-rose-600"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setRevisiModalBerkas(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleVerifyBerkasItem(
                    revisiModalBerkas.id,
                    "perlu_perbaikan",
                    catatanRevisiInput
                  );
                  setRevisiModalBerkas(null);
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-700 hover:bg-rose-800 text-white shadow-xs cursor-pointer"
              >
                Kirim Catatan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
