"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Home,
  ImageIcon,
  KeyRound,
  Layout,
  LogOut,
  MapPin,
  MessageCircle,
  Newspaper,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { AdminImageUploader } from "./AdminImageUploader";
import {
  type BeritaKabar,
  type JenjangPendidikan,
} from "@/content/site-content";

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

const pendaftarStatuses = [
  "Pendaftar masuk — belum ditindaklanjuti",
  "Sudah dihubungi",
  "Berkas diterima",
  "Bukti transfer diperiksa manual",
  "Seleksi dijadwalkan",
  "Diterima",
  "Tidak dilanjutkan",
] as const;

export function getValidWaNumber(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 9) return null;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

export function buildDiterimaWaUrl(pendaftar: PendaftarRow): string | null {
  const cleanNumber = getValidWaNumber(pendaftar.no_wa);
  if (!cleanNumber) return null;

  const namaWali = pendaftar.nama_wali?.trim() || "Orang Tua / Wali Santri";
  const namaSantri = pendaftar.nama_santri?.trim() || "-";
  const jenjang = pendaftar.jenjang?.trim() || "Ma'had Baladz Al-Qur'an";

  const pesan =
`Assalamu'alaikum Warahmatullahi Wabarakatuh,

Yth. Bapak/Ibu *${namaWali}*,

Alhamdulillah, segala puji bagi Allah Subhanahu wa Ta'ala. Kami dari Panitia Penerimaan Santri Baru (PSB) Ma'had Baladz Al-Qur'an ingin menyampaikan hasil seleksi pendaftaran santri baru:

• *Nama Calon Santri:* ${namaSantri}
• *Pilihan Program:* ${jenjang}
• *Status Hasil Seleksi:* *DITERIMA*

Selamat atas diterimanya ananda di lingkungan pendidikan Ma'had Baladz Al-Qur'an. Semoga menjadi awal kebaikan dan keberkahan dalam menuntut ilmu Al-Qur'an.

*Informasi Daftar Ulang & Administrasi:*
Untuk proses konfirmasi daftar ulang, penyerahan berkas fisik, dan jadwal administrasi selanjutnya, silakan langsung membalas pesan WhatsApp ini atau menghubungi narahubung Panitia PSB Baladz.

Jazakumullahu khairan wa barakallahu fikum.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
_Panitia PSB Ma'had Baladz Al-Qur'an_`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(pesan)}`;
}

function createEmptyProgram(): JenjangPendidikan {
  return {
    id: "",
    nama: "",
    tingkat: "",
    rentangUsia: "",
    deskripsi: "",
    ijazah: "",
    uangPangkal: 0,
    sppBulanan: 0,
    biayaBoarding: 0,
    keunggulan: [],
    gambar: "/images/baladz/gallery-class.jpg",
    isBoardingTersedia: false,
    kategori: "jenjang",
    jadwal: [],
    opsiBiaya: [],
    paketBiaya: [],
    hargaTerverifikasi: false,
    sumber: "Catatan internal: program baru, menunggu verifikasi tim Baladz.",
  };
}

function getProgramPriceLabel(program: JenjangPendidikan): string {
  if (program.hargaTerverifikasi !== true) return "Harga belum ditayangkan";
  if (program.sppBulananMaksimal && program.sppBulananMaksimal > program.sppBulanan) {
    return `Rp ${program.sppBulanan.toLocaleString("id-ID")}–Rp ${program.sppBulananMaksimal.toLocaleString("id-ID")}/bulan`;
  }
  if (program.sppBulanan > 0) {
    return `Rp ${program.sppBulanan.toLocaleString("id-ID")}/bulan`;
  }
  if (program.uangPangkal > 0) {
    return `Mulai Rp ${program.uangPangkal.toLocaleString("id-ID")}`;
  }
  return "Harga sudah diverifikasi";
}

interface ProgramEditorFieldsProps {
  value: JenjangPendidikan;
  onChange: (value: JenjangPendidikan) => void;
  onUploadComplete: () => void;
}

function ProgramEditorFields({ value, onChange, onUploadComplete }: ProgramEditorFieldsProps) {
  const update = (patch: Partial<JenjangPendidikan>) => onChange({ ...value, ...patch });
  const fieldClass = "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10";

  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Informasi utama</p>
          <p className="mt-1 text-sm text-stone-500">Informasi yang paling dahulu dilihat orang tua di halaman program.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Nama program *</span>
            <input required value={value.nama} onChange={(event) => update({ nama: event.target.value })} className={fieldClass} placeholder="Contoh: SMP Al-Qur’an" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Jenis / tingkat *</span>
            <input required value={value.tingkat} onChange={(event) => update({ tingkat: event.target.value })} className={fieldClass} placeholder="Contoh: Sekolah Menengah Qur’ani" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Kelompok program</span>
            <select value={value.kategori || "jenjang"} onChange={(event) => update({ kategori: event.target.value as "jenjang" | "kelas" })} className={fieldClass}>
              <option value="jenjang">Jenjang sekolah</option>
              <option value="kelas">Kelas Al-Qur’an</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Usia / peserta</span>
            <input value={value.rentangUsia} onChange={(event) => update({ rentangUsia: event.target.value })} className={fieldClass} placeholder="Contoh: Lulusan SD / sederajat" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Ijazah / sertifikat</span>
            <input value={value.ijazah} onChange={(event) => update({ ijazah: event.target.value })} className={fieldClass} placeholder="Kosongkan bila tidak ada" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Deskripsi *</span>
            <textarea required rows={4} value={value.deskripsi} onChange={(event) => update({ deskripsi: event.target.value })} className={fieldClass} placeholder="Jelaskan fokus program dengan singkat dan spesifik." />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Keunggulan <span className="font-normal text-stone-400">— satu baris per poin</span></span>
            <textarea rows={5} value={value.keunggulan.join("\n")} onChange={(event) => update({ keunggulan: event.target.value.split("\n").filter(Boolean) })} className={fieldClass} placeholder="Target hafalan 30 juz mutqin" />
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-stone-200 pt-6">
        <AdminImageUploader
          label="Foto Dokumentasi Program"
          description="Gunakan foto kegiatan belajar/santri asli. Disarankan rasio landscape 4:3."
          value={value.gambar}
          onChange={(url) => {
            update({ gambar: url });
            onUploadComplete();
          }}
          aspectRatio="4/3"
        />
      </section>

      <section className="space-y-4 border-t border-stone-200 pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Biaya & jadwal</p>
          <p className="mt-1 text-sm text-stone-500">Harga tidak muncul di website sampai status verifikasi diaktifkan.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Uang pangkal</span>
            <input type="number" min="0" value={value.uangPangkal} onChange={(event) => update({ uangPangkal: Number(event.target.value) })} className={`${fieldClass} font-mono tabular-nums`} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">SPP / biaya bulanan</span>
            <input type="number" min="0" value={value.sppBulanan} onChange={(event) => update({ sppBulanan: Number(event.target.value) })} className={`${fieldClass} font-mono tabular-nums`} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">SPP maksimal <span className="font-normal text-stone-400">— opsional untuk rentang</span></span>
            <input
              type="number"
              min="0"
              value={value.sppBulananMaksimal ?? ""}
              onChange={(event) => update({ sppBulananMaksimal: event.target.value ? Number(event.target.value) : undefined })}
              className={`${fieldClass} font-mono tabular-nums`}
              placeholder="Kosongkan jika bukan rentang"
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 sm:col-span-2">
            <input type="checkbox" checked={value.isBoardingTersedia} onChange={(event) => update({ isBoardingTersedia: event.target.checked })} className="size-4 accent-emerald-800" />
            Tersedia asrama / boarding
          </label>
          {value.isBoardingTersedia && (
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">SPP boarding / bulan <span className="font-normal text-stone-400">— bukan biaya tambahan</span></span>
              <input type="number" min="0" value={value.biayaBoarding || 0} onChange={(event) => update({ biayaBoarding: Number(event.target.value) })} className={`${fieldClass} font-mono tabular-nums`} />
            </label>
          )}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-stone-700">Pilihan jadwal <span className="font-normal text-stone-400">— satu baris per jadwal</span></span>
            <textarea rows={5} value={(value.jadwal || []).join("\n")} onChange={(event) => update({ jadwal: event.target.value.split("\n").filter(Boolean) })} className={fieldClass} placeholder="Senin–Rabu · 13.00–14.30" />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-stone-700">Pilihan biaya tambahan</p>
            <button type="button" onClick={() => update({ opsiBiaya: [...(value.opsiBiaya || []), { label: "Pilihan baru", nominal: 0 }] })} className="text-xs font-bold text-emerald-800 hover:text-emerald-950">+ Tambah pilihan</button>
          </div>
          {(value.opsiBiaya || []).map((option, optionIndex) => (
            <div key={`${option.label}-${optionIndex}`} className="grid gap-2 rounded-xl bg-stone-50 p-3 sm:grid-cols-[1fr_12rem_auto]">
              <input value={option.label} onChange={(event) => { const options = [...(value.opsiBiaya || [])]; options[optionIndex] = { ...option, label: event.target.value }; update({ opsiBiaya: options }); }} className={fieldClass} aria-label={`Nama pilihan biaya ${optionIndex + 1}`} />
              <input type="number" min="0" value={option.nominal} onChange={(event) => { const options = [...(value.opsiBiaya || [])]; options[optionIndex] = { ...option, nominal: Number(event.target.value) }; update({ opsiBiaya: options }); }} className={`${fieldClass} font-mono tabular-nums`} aria-label={`Nominal pilihan biaya ${optionIndex + 1}`} />
              <button type="button" onClick={() => update({ opsiBiaya: (value.opsiBiaya || []).filter((_, index) => index !== optionIndex) })} className="rounded-lg px-3 text-xs font-bold text-red-600 hover:bg-red-50" aria-label={`Hapus pilihan biaya ${optionIndex + 1}`}>Hapus</button>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-2xl border border-stone-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-stone-900">Rincian biaya per paket</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">Pisahkan setiap komponen. Jangan gabungkan biaya awal, bulanan, atau semester.</p>
            </div>
            <button
              type="button"
              onClick={() => update({ paketBiaya: [...(value.paketBiaya || []), { nama: "Paket baru", komponen: [] }] })}
              className="shrink-0 text-xs font-bold text-emerald-800 hover:text-emerald-950"
            >
              + Tambah paket
            </button>
          </div>

          {(value.paketBiaya || []).map((paket, paketIndex) => (
            <div key={`${paket.nama}-${paketIndex}`} className="space-y-3 rounded-xl bg-stone-50 p-4">
              <div className="flex items-center gap-2">
                <input
                  value={paket.nama}
                  onChange={(event) => {
                    const packages = [...(value.paketBiaya || [])];
                    packages[paketIndex] = { ...paket, nama: event.target.value };
                    update({ paketBiaya: packages });
                  }}
                  className={`${fieldClass} font-bold`}
                  aria-label={`Nama paket biaya ${paketIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => update({ paketBiaya: (value.paketBiaya || []).filter((_, index) => index !== paketIndex) })}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label={`Hapus paket biaya ${paketIndex + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="space-y-2">
                {paket.komponen.map((komponen, komponenIndex) => (
                  <div key={`${komponen.nama}-${komponenIndex}`} className="grid gap-2 sm:grid-cols-[1fr_10rem_10rem_8rem_auto]">
                    <input
                      value={komponen.nama}
                      onChange={(event) => {
                        const packages = [...(value.paketBiaya || [])];
                        const components = [...paket.komponen];
                        components[komponenIndex] = { ...komponen, nama: event.target.value };
                        packages[paketIndex] = { ...paket, komponen: components };
                        update({ paketBiaya: packages });
                      }}
                      className={fieldClass}
                      placeholder="Nama komponen"
                      aria-label={`Nama komponen biaya ${komponenIndex + 1}`}
                    />
                    <input
                      type="number"
                      min="0"
                      value={komponen.nominal}
                      onChange={(event) => {
                        const packages = [...(value.paketBiaya || [])];
                        const components = [...paket.komponen];
                        components[komponenIndex] = { ...komponen, nominal: Number(event.target.value) };
                        packages[paketIndex] = { ...paket, komponen: components };
                        update({ paketBiaya: packages });
                      }}
                      className={`${fieldClass} font-mono tabular-nums`}
                      aria-label={`Nominal komponen biaya ${komponenIndex + 1}`}
                    />
                    <input
                      type="number"
                      min="0"
                      value={komponen.nominalMaksimal ?? ""}
                      onChange={(event) => {
                        const packages = [...(value.paketBiaya || [])];
                        const components = [...paket.komponen];
                        components[komponenIndex] = {
                          ...komponen,
                          nominalMaksimal: event.target.value ? Number(event.target.value) : undefined,
                        };
                        packages[paketIndex] = { ...paket, komponen: components };
                        update({ paketBiaya: packages });
                      }}
                      className={`${fieldClass} font-mono tabular-nums`}
                      placeholder="Maksimal"
                      aria-label={`Nominal maksimal komponen biaya ${komponenIndex + 1}`}
                    />
                    <input
                      value={komponen.satuan || ""}
                      onChange={(event) => {
                        const packages = [...(value.paketBiaya || [])];
                        const components = [...paket.komponen];
                        components[komponenIndex] = { ...komponen, satuan: event.target.value };
                        packages[paketIndex] = { ...paket, komponen: components };
                        update({ paketBiaya: packages });
                      }}
                      className={fieldClass}
                      placeholder="per bulan"
                      aria-label={`Satuan komponen biaya ${komponenIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const packages = [...(value.paketBiaya || [])];
                        packages[paketIndex] = {
                          ...paket,
                          komponen: paket.komponen.filter((_, index) => index !== komponenIndex),
                        };
                        update({ paketBiaya: packages });
                      }}
                      className="rounded-lg px-3 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const packages = [...(value.paketBiaya || [])];
                  packages[paketIndex] = {
                    ...paket,
                    komponen: [...paket.komponen, { nama: "Komponen baru", nominal: 0, satuan: "" }],
                  };
                  update({ paketBiaya: packages });
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                + Tambah komponen biaya
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
          <input type="checkbox" checked={value.hargaTerverifikasi === true} onChange={(event) => update({ hargaTerverifikasi: event.target.checked })} className="mt-0.5 size-4 accent-emerald-800" />
          <span><span className="block">Harga sudah dikonfirmasi</span><span className="mt-0.5 block text-xs font-normal text-amber-800">Aktifkan hanya setelah angka disetujui tim Baladz.</span></span>
        </label>
      </section>

    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const { draft, setDraft, save, reset, savedAt, isSaving } = useSiteContent();

  const [activeMenu, setActiveMenu] = useState<"overview" | "popup" | "pendaftar" | "psb" | "jenjang" | "kabar" | "kontak">("overview");

  // State pendaftar dari Neon DB
  const [pendaftarList, setPendaftarList] = useState<PendaftarRow[]>([]);
  const [isLoadingPendaftar, setIsLoadingPendaftar] = useState(false);
  const [pendaftarSearch, setPendaftarSearch] = useState("");
  const [pendaftarFilterStatus, setPendaftarFilterStatus] = useState<string>("all");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Ganti Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout error:", err);
      }
      router.push("/admin/login");
      router.refresh();
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordError("Semua field wajib diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordError(data.error || "Gagal mengubah password");
      } else {
        setPasswordSuccess("Password berhasil diubah!");
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess(null);
          showToast("Password admin berhasil diperbarui!");
        }, 1200);
      }
    } catch {
      setPasswordError("Terjadi kesalahan koneksi");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // View mode untuk Kabar: null (tampilan list), "new" (halaman tambah baru), number (halaman edit detail)
  const [kabarView, setKabarView] = useState<number | "new" | null>(null);

  // Program memakai alur list -> create/detail agar dashboard tidak menjadi form panjang.
  const [programView, setProgramView] = useState<number | "new" | null>(null);
  const [newProgram, setNewProgram] = useState<JenjangPendidikan>(createEmptyProgram);

  // State tambah kabar baru
  const [newKabarJudul, setNewKabarJudul] = useState("");
  const [newKabarKategori, setNewKabarKategori] = useState("Kegiatan Santri");
  const [newKabarRingkasan, setNewKabarRingkasan] = useState("");
  const [newKabarIsi, setNewKabarIsi] = useState("");
  const [newKabarGambar, setNewKabarGambar] = useState("/images/baladz/gallery-outdoor.jpg");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openProgramList = () => {
    setProgramView(null);
    setActiveMenu("jenjang");
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
    if (activeMenu === "overview" || activeMenu === "pendaftar") {
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
        if (status === "Diterima") {
          showToast("Status diubah ke Diterima. Tombol 'Kirim WhatsApp' kini siap digunakan.");
        } else {
          showToast("Status pendaftar berhasil diperbarui!");
        }
      } else {
        showToast("Gagal memperbarui status di server.");
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

  // Filter list pendaftar berdasarkan pencarian dan status
  const filteredPendaftarList = pendaftarList.filter((item) => {
    const matchesStatus =
      pendaftarFilterStatus === "all"
        ? true
        : pendaftarFilterStatus === "tindak-lanjut"
        ? item.status === "Baru" || item.status.startsWith("Pendaftar masuk")
        : pendaftarFilterStatus === "seleksi"
        ? !["Baru", "Diterima", "Tidak dilanjutkan"].includes(item.status) && !item.status.startsWith("Pendaftar masuk")
        : pendaftarFilterStatus === "diterima"
        ? item.status === "Diterima"
        : item.status === pendaftarFilterStatus;

    if (!matchesStatus) return false;

    if (!pendaftarSearch.trim()) return true;
    const q = pendaftarSearch.toLowerCase().trim();
    return (
      (item.nama_santri && item.nama_santri.toLowerCase().includes(q)) ||
      (item.nama_wali && item.nama_wali.toLowerCase().includes(q)) ||
      (item.no_wa && item.no_wa.toLowerCase().includes(q)) ||
      (item.jenjang && item.jenjang.toLowerCase().includes(q)) ||
      (item.alamat && item.alamat.toLowerCase().includes(q))
    );
  });

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
    setKabarView(null);
    setNewKabarJudul("");
    setNewKabarRingkasan("");
    setNewKabarIsi("");
    showToast("Berita baru berhasil ditambahkan!");
  };

  const handleCreateProgram = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newProgram.nama.trim() || !newProgram.tingkat.trim() || !newProgram.deskripsi.trim()) {
      showToast("Lengkapi nama, jenis, dan deskripsi program.");
      return;
    }

    const baseId = newProgram.nama
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "program";
    const id = draft.jenjang.some((item) => item.id === baseId)
      ? `${baseId}-${Date.now()}`
      : baseId;

    setDraft({
      ...draft,
      jenjang: [...draft.jenjang, { ...newProgram, id }],
    });
    setNewProgram(createEmptyProgram());
    setProgramView(null);
    showToast("Program ditambahkan. Klik Simpan Perubahan untuk menerbitkannya.");
  };

  const handleDeleteProgram = (index: number) => {
    const program = draft.jenjang[index];
    if (!program || !confirm(`Hapus program "${program.nama}"?`)) return;

    setDraft({
      ...draft,
      jenjang: draft.jenjang.filter((_, itemIndex) => itemIndex !== index),
    });
    setProgramView(null);
    showToast("Program dihapus dari draft. Klik Simpan Perubahan untuk menerapkan.");
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
              <div>
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#0F4C3A]">
                  Dashboard Baladz
                </h1>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Update konten website tanpa proses teknis
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
            <div className="h-6 w-px bg-stone-200 mx-1 hidden sm:block" />
            <button
              onClick={() => {
                setPasswordError(null);
                setPasswordSuccess(null);
                setIsPasswordModalOpen(true);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 flex items-center gap-1.5 text-stone-700 transition-colors cursor-pointer"
              title="Ganti Password Admin"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden lg:inline">Ganti Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 xl:col-span-2 overflow-x-auto lg:overflow-visible">
            <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs flex gap-2 lg:block lg:space-y-1">
              <div className="hidden lg:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Menu Utama
              </div>

              <button
                onClick={() => setActiveMenu("overview")}
                className={`shrink-0 lg:w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
                  activeMenu === "overview"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Ringkasan</span>
              </button>

              {/* TAB 1: POPUP PENGUMUMAN */}
              <button
                onClick={() => setActiveMenu("popup")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
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
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
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
                className={`shrink-0 lg:w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
                  activeMenu === "psb"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>PSB & Biaya</span>
              </button>

              {/* TAB 4: JENJANG PENDIDIKAN */}
              <button
                onClick={openProgramList}
                className={`shrink-0 lg:w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
                  activeMenu === "jenjang"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Program Pendidikan</span>
              </button>

              <div className="hidden lg:block px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Konten Lembaga
              </div>

              {/* TAB 5: KABAR BALADZ */}
              <button
                onClick={() => setActiveMenu("kabar")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
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

              {/* TAB 7: KONTAK & MEDSOS */}
              <button
                onClick={() => setActiveMenu("kontak")}
                className={`shrink-0 lg:w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-left whitespace-nowrap transition-all cursor-pointer ${
                  activeMenu === "kontak"
                    ? "bg-[#0F4C3A] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Kontak Website</span>
              </button>
            </div>
          </aside>

          {/* CONTENT PANEL */}
          <main className="lg:col-span-9 xl:col-span-10 space-y-6">
            {activeMenu === "overview" && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#0F4C3A] p-6 sm:p-8 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Ringkasan Website</p>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-serif font-bold">Apa yang ingin diperbarui?</h2>
                      <p className="mt-2 max-w-xl text-sm text-emerald-100">Pilih bagian, ubah isinya, lalu klik Simpan Perubahan. Konten langsung berlaku di seluruh website.</p>
                    </div>
                    <Link href="/" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#0F4C3A]">
                      <ExternalLink className="w-4 h-4" /> Lihat website
                    </Link>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <button onClick={() => setActiveMenu("pendaftar")} className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-blue-300 hover:shadow-sm cursor-pointer">
                    <Users className="w-5 h-5 text-blue-600" /><p className="mt-4 text-2xl font-bold text-stone-900">{pendaftarList.length}</p><p className="text-xs text-stone-500">Pendaftar masuk</p>
                  </button>
                  <button onClick={openProgramList} className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-purple-300 hover:shadow-sm cursor-pointer">
                    <GraduationCap className="w-5 h-5 text-purple-600" /><p className="mt-4 text-2xl font-bold text-stone-900">{draft.jenjang.length}</p><p className="text-xs text-stone-500">Program pendidikan</p>
                  </button>
                  <button onClick={() => setActiveMenu("kabar")} className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-orange-300 hover:shadow-sm cursor-pointer">
                    <Newspaper className="w-5 h-5 text-orange-600" /><p className="mt-4 text-2xl font-bold text-stone-900">{draft.kabar.length}</p><p className="text-xs text-stone-500">Kabar terbit</p>
                  </button>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Aksi Cepat</p><h3 className="mt-1 text-lg font-serif font-bold text-[#0F4C3A]">Konten yang paling sering diubah</h3></div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${draft.popup.aktif ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>Popup {draft.popup.aktif ? "aktif" : "nonaktif"}</span>
                  </div>
                  <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: "Ubah info PSB", menu: "psb" as const, detail: draft.psb.tahunAjaran },
                      { label: "Atur popup", menu: "popup" as const, detail: "Tampil sekali per sesi" },
                      { label: "Ubah kontak", menu: "kontak" as const, detail: draft.kontak.whatsappUtama },
                    ].map((item) => (
                      <button key={item.menu} onClick={() => setActiveMenu(item.menu)} className="rounded-xl border border-stone-200 p-4 text-left hover:bg-stone-50 cursor-pointer">
                        <p className="text-sm font-bold text-stone-800">{item.label}</p><p className="mt-1 text-xs text-stone-500">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-4">
                  <AdminImageUploader
                    label="Foto Hero Beranda (Tentang Baladz)"
                    description="Foto suasana santri atau gedung Ma'had yang tampil di bagian profil beranda website. Disarankan format landscape 4:3 atau 16:9."
                    value={draft.lembaga.fotoHero || "/images/baladz/about.jpg"}
                    onChange={(url) => {
                      setDraft({ ...draft, lembaga: { ...draft.lembaga, fotoHero: url } });
                      showToast("Foto hero berhasil diperbarui! Jangan lupa simpan perubahan.");
                    }}
                    aspectRatio="4/3"
                  />
                </section>
              </div>
            )}

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
                      Popup Pengumuman
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      Tampil satu kali per sesi kunjungan agar informatif tanpa mengganggu navigasi.
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
                      <AdminImageUploader
                        label="Gambar Poster / Flyer Promosi"
                        description={
                          draft.popup.modeTampilan === "gambar_saja"
                            ? "Mode Hanya Gambar: Disarankan foto pamflet/flyer vertikal/potret agar teks terbaca jelas tanpa terpotong."
                            : "Mode Gambar + Teks: Banner foto di atas disertai judul, narasi pesan, dan tombol WhatsApp di bawahnya."
                        }
                        value={draft.popup.gambarPoster || ""}
                        onChange={(url) => {
                          setDraft({
                            ...draft,
                            popup: { ...draft.popup, gambarPoster: url },
                          });
                          showToast("Poster berhasil diperbarui! Jangan lupa simpan perubahan.");
                        }}
                        aspectRatio="auto"
                        objectFit="contain"
                        badgeText={draft.popup.modeTampilan === "gambar_saja" ? "Format Bebas / Potret" : "Landscape / Potret"}
                      />
                    </div>

                    {/* Setup WhatsApp Aksi CTA (Mudah Dipahami Tanpa Link Rumit) */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-800" />
                        <span className="font-bold text-stone-800 text-xs sm:text-sm">
                          Tujuan Aksi Pengunjung (WhatsApp Panitia)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        Nomor mengikuti Pengaturan Kontak agar semua CTA selalu konsisten. WhatsApp terbuka dengan pesan siap kirim, tetapi pengunjung tetap harus menekan tombol Kirim.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1 text-stone-700">
                            Nomor WhatsApp Panitia / Admin
                          </label>
                          <div className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 font-mono text-xs text-stone-700">{draft.kontak.whatsappUtama}</div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold mb-1 text-stone-700">
                            Pesan Awal WhatsApp (Otomatis Terisi Saat Diklik)
                          </label>
                          <textarea
                            rows={2}
                            value={
                              draft.popup.pesanWaCta !== undefined
                                ? draft.popup.pesanWaCta
                                : "Assalamu'alaikum Panitia PSB Baladz, saya ingin menanyakan pendaftaran santri baru."
                            }
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                popup: { ...draft.popup, pesanWaCta: e.target.value },
                              })
                            }
                            placeholder="Contoh: Assalamu'alaikum Panitia PSB Baladz, saya ingin mendaftar..."
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 text-xs bg-white"
                          />
                        </div>
                      </div>

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
                          placeholder="Contoh: Informasi PSB Sedang Diperbarui"
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
                                className="w-auto max-w-full h-auto max-h-[320px] object-contain mx-auto block"
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

                          <div className="mt-2 text-center text-[10px] text-emerald-400 font-medium">
                            ✓ Klik poster/tombol membuka chat WhatsApp langsung
                          </div>
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
                            <div className="w-full bg-stone-100 flex items-center justify-center overflow-hidden max-h-40 border-b border-stone-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={draft.popup.gambarPoster}
                                alt="Poster Preview"
                                className="w-auto max-w-full h-auto max-h-36 object-contain mx-auto"
                              />
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

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-900">
                  Formulir yang tersimpan berarti data sudah masuk ke dashboard. WhatsApp hanya dibuka dengan pesan siap kirim; staf tetap perlu mengecek dan mencatat tindak lanjut melalui kolom status.
                </div>

                {/* Counter Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setPendaftarFilterStatus("all")}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      pendaftarFilterStatus === "all"
                        ? "bg-emerald-100/70 border-emerald-500 shadow-xs ring-2 ring-emerald-600/30"
                        : "bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50"
                    }`}
                  >
                    <div className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
                      <span>Total Pendaftar</span>
                      {pendaftarFilterStatus === "all" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <div className="text-2xl font-bold text-emerald-950 mt-1">{pendaftarList.length}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendaftarFilterStatus("tindak-lanjut")}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      pendaftarFilterStatus === "tindak-lanjut"
                        ? "bg-amber-100/80 border-amber-500 shadow-xs ring-2 ring-amber-500/30"
                        : "bg-amber-50/70 border-amber-200 hover:bg-amber-100/50"
                    }`}
                  >
                    <div className="text-xs text-amber-800 font-semibold flex items-center justify-between">
                      <span>Perlu Tindak Lanjut</span>
                      {pendaftarFilterStatus === "tindak-lanjut" && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                    </div>
                    <div className="text-2xl font-bold text-amber-950 mt-1">
                      {pendaftarList.filter((p) => p.status === "Baru" || p.status.startsWith("Pendaftar masuk")).length}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendaftarFilterStatus("seleksi")}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      pendaftarFilterStatus === "seleksi"
                        ? "bg-blue-100/80 border-blue-500 shadow-xs ring-2 ring-blue-500/30"
                        : "bg-blue-50/70 border-blue-200 hover:bg-blue-100/50"
                    }`}
                  >
                    <div className="text-xs text-blue-800 font-semibold flex items-center justify-between">
                      <span>Dalam Seleksi</span>
                      {pendaftarFilterStatus === "seleksi" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                    </div>
                    <div className="text-2xl font-bold text-blue-950 mt-1">
                      {pendaftarList.filter((p) => !["Baru", "Diterima", "Tidak dilanjutkan"].includes(p.status) && !p.status.startsWith("Pendaftar masuk")).length}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPendaftarFilterStatus("diterima")}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      pendaftarFilterStatus === "diterima"
                        ? "bg-teal-100/80 border-teal-500 shadow-xs ring-2 ring-teal-600/30"
                        : "bg-teal-50/70 border-teal-200 hover:bg-teal-100/50"
                    }`}
                  >
                    <div className="text-xs text-teal-800 font-semibold flex items-center justify-between">
                      <span>Santri Diterima</span>
                      {pendaftarFilterStatus === "diterima" && <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />}
                    </div>
                    <div className="text-2xl font-bold text-teal-950 mt-1">
                      {pendaftarList.filter((p) => p.status === "Diterima").length}
                    </div>
                  </button>
                </div>

                {/* Search & Filter Bar */}
                {pendaftarList.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={pendaftarSearch}
                        onChange={(e) => setPendaftarSearch(e.target.value)}
                        placeholder="Cari nama santri, wali, jenjang, atau nomor WA..."
                        className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-stone-400"
                      />
                      {pendaftarSearch && (
                        <button
                          onClick={() => setPendaftarSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative shrink-0">
                        <select
                          value={pendaftarFilterStatus}
                          onChange={(e) => setPendaftarFilterStatus(e.target.value)}
                          aria-label="Filter status pendaftar"
                          className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 outline-none focus:border-emerald-600 cursor-pointer pr-7"
                        >
                          <option value="all">Semua Status</option>
                          <option value="tindak-lanjut">Perlu Tindak Lanjut</option>
                          <option value="seleksi">Dalam Seleksi</option>
                          <option value="diterima">Diterima</option>
                          <option disabled>──────────</option>
                          {pendaftarStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(pendaftarSearch || pendaftarFilterStatus !== "all") && (
                        <button
                          onClick={() => {
                            setPendaftarSearch("");
                            setPendaftarFilterStatus("all");
                          }}
                          className="px-2.5 py-2 text-xs font-semibold text-stone-600 hover:text-red-600 bg-white hover:bg-red-50 border border-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          title="Reset filter dan pencarian"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Showing results status */}
                {pendaftarList.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>
                      Menampilkan <strong className="font-semibold text-stone-800">{filteredPendaftarList.length}</strong> dari{" "}
                      <strong className="font-semibold text-stone-800">{pendaftarList.length}</strong> pendaftar
                    </span>
                    {filteredPendaftarList.length !== pendaftarList.length && (
                      <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Filter aktif
                      </span>
                    )}
                  </div>
                )}

                {/* List Pendaftar */}
                {pendaftarList.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-xl">
                    <Users className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <h3 className="font-bold text-stone-700 text-sm">Belum ada data pendaftar</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Setiap orang tua yang mengisi formulir online di website akan otomatis muncul di sini.
                    </p>
                  </div>
                ) : filteredPendaftarList.length === 0 ? (
                  <div className="p-10 text-center border border-stone-200 rounded-xl bg-stone-50/50">
                    <Search className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <h3 className="font-bold text-stone-700 text-sm">Tidak ada pendaftar yang cocok</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Coba ganti kata kunci pencarian atau reset filter status.
                    </p>
                    <button
                      onClick={() => {
                        setPendaftarSearch("");
                        setPendaftarFilterStatus("all");
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-white border border-stone-300 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Pencarian</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* DESKTOP & TABLET TABLE (hidden md:block) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-stone-200 shadow-2xs bg-white">
                      <table className="w-full text-xs text-left border-collapse min-w-[880px]">
                        <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[11px] border-b border-stone-200 tracking-wider">
                          <tr>
                            <th className="py-3.5 px-4 min-w-[210px]">Calon Santri</th>
                            <th className="py-3.5 px-4 min-w-[170px]">Program / Jenjang</th>
                            <th className="py-3.5 px-4 min-w-[190px]">Orang Tua / Wali</th>
                            <th className="py-3.5 px-4 min-w-[190px]">Status Pendaftaran</th>
                            <th className="py-3.5 px-4 min-w-[210px] text-center sticky right-0 z-20 bg-stone-100 border-l border-stone-200 shadow-[-4px_0_8px_-3px_rgba(0,0,0,0.06)]">
                              Aksi & Notifikasi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredPendaftarList.map((item) => {
                            const cleanWa = getValidWaNumber(item.no_wa);
                            const diterimaWaUrl = item.status === "Diterima" ? buildDiterimaWaUrl(item) : null;
                            const generalWaUrl = cleanWa
                              ? `https://wa.me/${cleanWa}?text=Assalamu%27alaikum%20Bapak%2FIbu%20${encodeURIComponent(item.nama_wali)}%2C%20kami%20dari%20Panitia%20PSB%20Baladz.`
                              : null;

                            return (
                              <tr
                                key={item.id}
                                className={`group hover:bg-stone-50 transition-colors ${
                                  item.status === "Diterima" ? "bg-emerald-50/25" : ""
                                }`}
                              >
                                {/* 1. Calon Santri */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="font-bold text-stone-900 text-sm leading-snug">{item.nama_santri}</div>
                                  <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                                    <span>{item.tgl_lahir_usia || "Usia belum diisi"}</span>
                                  </div>
                                  {item.alamat && (
                                    <div
                                      className="text-[11px] text-stone-400 flex items-start gap-1 mt-1 max-w-[240px] truncate"
                                      title={item.alamat}
                                    >
                                      <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                                      <span className="truncate">{item.alamat}</span>
                                    </div>
                                  )}
                                </td>

                                {/* 2. Program / Jenjang (Anti wrap) */}
                                <td className="py-3.5 px-4 align-top">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80 whitespace-nowrap shadow-2xs">
                                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    <span>{item.jenjang}</span>
                                  </span>
                                </td>

                                {/* 3. Wali & Kontak */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="font-semibold text-stone-800 leading-snug">{item.nama_wali}</div>
                                  <div className="mt-1">
                                    {generalWaUrl ? (
                                      <a
                                        href={generalWaUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors whitespace-nowrap shadow-2xs"
                                        title="Hubungi wali santri via WhatsApp"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>{item.no_wa}</span>
                                      </a>
                                    ) : (
                                      <span className="text-[11px] text-stone-400 italic">
                                        {item.no_wa || "Nomor WA tidak ada"}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 4. Status Pendaftaran */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="space-y-1.5">
                                    <select
                                      value={item.status}
                                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                      className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold outline-none transition-colors cursor-pointer ${
                                        item.status === "Diterima"
                                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                          : item.status === "Tidak dilanjutkan"
                                          ? "border-stone-300 bg-stone-100 text-stone-600"
                                          : item.status.startsWith("Pendaftar masuk") || item.status === "Baru"
                                          ? "border-amber-400 bg-amber-50 text-amber-900"
                                          : "border-blue-300 bg-blue-50 text-blue-900"
                                      }`}
                                    >
                                      {!pendaftarStatuses.includes(item.status as (typeof pendaftarStatuses)[number]) && (
                                        <option value={item.status}>{item.status} (status lama)</option>
                                      )}
                                      {pendaftarStatuses.map((status) => (
                                        <option key={status} value={status}>
                                          {status}
                                        </option>
                                      ))}
                                    </select>

                                    {item.status === "Diterima" && (
                                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md border border-emerald-200/80">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>Terverifikasi Diterima</span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* 5. Aksi & Notifikasi (Sticky Right) */}
                                <td
                                  className={`py-3.5 px-4 align-middle sticky right-0 z-10 border-l border-stone-200 shadow-[-4px_0_8px_-3px_rgba(0,0,0,0.06)] transition-colors ${
                                    item.status === "Diterima"
                                      ? "bg-[#f4faf7] group-hover:bg-[#ebf6f1]"
                                      : "bg-white group-hover:bg-stone-50"
                                  }`}
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    {/* Jika Status Diterima: Tombol WhatsApp Notifikasi */}
                                    {item.status === "Diterima" && (
                                      cleanWa && diterimaWaUrl ? (
                                        <a
                                          href={diterimaWaUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0c3f30] shadow-xs transition-all hover:scale-[1.02] shrink-0 cursor-pointer whitespace-nowrap"
                                          title="Kirim pemberitahuan DITERIMA ke WhatsApp wali santri"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                                          <span>Kirim WhatsApp</span>
                                        </a>
                                      ) : (
                                        <span
                                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 bg-stone-100 border border-stone-200 cursor-not-allowed shrink-0 whitespace-nowrap"
                                          title="Nomor WhatsApp tidak tersedia atau format tidak valid"
                                        >
                                          <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                          <span>WA Tidak Valid</span>
                                        </span>
                                      )
                                    )}

                                    {/* Hapus button */}
                                    <button
                                      onClick={() => handleDeletePendaftar(item.id)}
                                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer shrink-0"
                                      title="Hapus Data Pendaftar"
                                      aria-label="Hapus Data Pendaftar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARD VIEW (block md:hidden) */}
                    <div className="block md:hidden space-y-3">
                      {filteredPendaftarList.map((item) => {
                        const cleanWa = getValidWaNumber(item.no_wa);
                        const diterimaWaUrl = item.status === "Diterima" ? buildDiterimaWaUrl(item) : null;
                        const generalWaUrl = cleanWa
                          ? `https://wa.me/${cleanWa}?text=Assalamu%27alaikum%20Bapak%2FIbu%20${encodeURIComponent(item.nama_wali)}%2C%20kami%20dari%20Panitia%20PSB%20Baladz.`
                          : null;

                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-all ${
                              item.status === "Diterima"
                                ? "border-emerald-300 bg-emerald-50/20"
                                : "border-stone-200 bg-white"
                            } shadow-xs space-y-3`}
                          >
                            {/* Card Header: Nama & Jenjang Badge */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-bold text-stone-900 text-sm leading-tight truncate">
                                  {item.nama_santri}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                                  <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                                  <span>{item.tgl_lahir_usia || "Usia belum diisi"}</span>
                                </div>
                              </div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 whitespace-nowrap">
                                <GraduationCap className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>{item.jenjang}</span>
                              </span>
                            </div>

                            {/* Info Wali & Kontak & Alamat */}
                            <div className="text-xs space-y-1.5 pt-2 border-t border-stone-100">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-stone-500">Orang Tua / Wali:</span>
                                <span className="font-semibold text-stone-800">{item.nama_wali || "-"}</span>
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <span className="text-stone-500">No. WhatsApp:</span>
                                {generalWaUrl ? (
                                  <a
                                    href={generalWaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 text-xs transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{item.no_wa}</span>
                                  </a>
                                ) : (
                                  <span className="text-stone-400 italic text-xs">
                                    {item.no_wa || "Tidak tersedia"}
                                  </span>
                                )}
                              </div>

                              {item.alamat && (
                                <div className="flex items-start gap-1 text-[11px] text-stone-500 pt-0.5">
                                  <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{item.alamat}</span>
                                </div>
                              )}
                            </div>

                            {/* Status Dropdown */}
                            <div className="pt-2 border-t border-stone-100">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                Status Pendaftaran
                              </label>
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold outline-none transition-colors ${
                                  item.status === "Diterima"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                    : item.status === "Tidak dilanjutkan"
                                    ? "border-stone-300 bg-stone-50 text-stone-600"
                                    : item.status.startsWith("Pendaftar masuk") || item.status === "Baru"
                                    ? "border-amber-400 bg-amber-50 text-amber-900"
                                    : "border-blue-300 bg-blue-50 text-blue-900"
                                }`}
                              >
                                {!pendaftarStatuses.includes(item.status as (typeof pendaftarStatuses)[number]) && (
                                  <option value={item.status}>{item.status} (status lama)</option>
                                )}
                                {pendaftarStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                              {item.status === "Diterima" ? (
                                cleanWa && diterimaWaUrl ? (
                                  <a
                                    href={diterimaWaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0c3f30] shadow-xs transition-all active:scale-[0.98]"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Kirim WhatsApp</span>
                                  </a>
                                ) : (
                                  <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-400 bg-stone-100 border border-stone-200">
                                    <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
                                    <span>WA Tidak Valid</span>
                                  </span>
                                )
                              ) : generalWaUrl ? (
                                <a
                                  href={generalWaUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Chat WhatsApp</span>
                                </a>
                              ) : (
                                <div className="flex-1 text-xs text-stone-400 italic py-1">Kontak tidak tersedia</div>
                              )}

                              <button
                                onClick={() => handleDeletePendaftar(item.id)}
                                className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-colors cursor-pointer shrink-0"
                                title="Hapus Data"
                                aria-label="Hapus Data"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
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
                    <label className="block font-semibold mb-1 text-stone-700">Cakupan Jenjang</label>
                    <input
                      type="text"
                      value={draft.psb.cakupanJenjang}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, cakupanJenjang: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      placeholder="Contoh: Semua jenjang"
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

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
                  <label className="flex items-center gap-2 font-bold">
                    <input
                      type="checkbox"
                      checked={draft.psb.jadwalTerverifikasi}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, jadwalTerverifikasi: e.target.checked } })}
                    />
                    Jadwal dan tahun sudah dikonfirmasi untuk tayang final
                  </label>
                  <textarea
                    rows={2}
                    value={draft.psb.catatanKonfirmasi}
                    onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, catatanKonfirmasi: e.target.value } })}
                    className="mt-3 w-full rounded-lg border border-amber-300 bg-white px-3 py-2"
                    aria-label="Catatan konfirmasi PSB"
                  />
                </div>

                <div className="border-t border-stone-200 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-stone-800">Timeline dua gelombang</h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {draft.psb.gelombang.map((gelombang, index) => (
                      <div key={gelombang.nama} className="space-y-3 rounded-xl bg-stone-50 p-4 text-xs">
                        {(["nama", "pendaftaranBerkas", "seleksi", "pengumuman", "pelunasan"] as const).map((field) => (
                          <label key={field} className="block">
                            <span className="mb-1 block font-medium capitalize text-stone-600">{field === "pendaftaranBerkas" ? "Pendaftaran & berkas" : field}</span>
                            <input
                              value={gelombang[field]}
                              onChange={(e) => {
                                const gelombangBaru = [...draft.psb.gelombang];
                                gelombangBaru[index] = { ...gelombangBaru[index], [field]: e.target.value };
                                setDraft({ ...draft, psb: { ...draft.psb, gelombang: gelombangBaru } });
                              }}
                              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2"
                            />
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                  <label className="mt-4 block text-xs">
                    <span className="mb-1 block font-medium text-stone-600">Pertemuan orang tua & pemberkasan</span>
                    <input value={draft.psb.pertemuanOrangTua} onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, pertemuanOrangTua: e.target.value } })} className="w-full rounded-lg border border-stone-300 px-3 py-2" />
                  </label>
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
            {/* 4. PROGRAM PENDIDIKAN: LIST, CREATE, DETAIL             */}
            {/* ======================================================= */}
            {activeMenu === "jenjang" && (
              <div className="rounded-2xl border border-stone-200 bg-white shadow-2xs">
                {programView === null && (
                  <div className="animate-in fade-in duration-200">
                    <div className="flex flex-col gap-5 border-b border-stone-200 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Produk pendidikan</span>
                        <h2 className="mt-1 text-2xl font-serif font-bold tracking-tight text-[#0F4C3A]">
                          Program Pendidikan & Kelas Al-Qur’an
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">
                          Pilih program untuk melihat detailnya. Perubahan baru tayang setelah tombol Simpan Perubahan ditekan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewProgram(createEmptyProgram());
                          setProgramView("new");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3d2e] active:translate-y-px focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        <Plus className="size-4" />
                        Tambah program
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 border-b border-stone-100 bg-stone-50/70 px-6 py-4 sm:px-8">
                      <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-2xs">
                        {draft.jenjang.length} program
                      </span>
                      <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-2xs">
                        {draft.jenjang.filter((item) => item.kategori === "kelas").length} kelas Al-Qur’an
                      </span>
                      <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                        {draft.jenjang.filter((item) => item.hargaTerverifikasi !== true).length} harga perlu konfirmasi
                      </span>
                    </div>

                    <div className="p-4 sm:p-6">
                      {draft.jenjang.length === 0 ? (
                        <div className="rounded-2xl bg-stone-50 px-6 py-16 text-center">
                          <GraduationCap className="mx-auto size-10 text-stone-300" />
                          <h3 className="mt-4 font-serif text-xl font-bold text-emerald-950">Belum ada program</h3>
                          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
                            Tambahkan program pertama agar orang tua dapat melihat pilihan pendidikan Baladz.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setNewProgram(createEmptyProgram());
                              setProgramView("new");
                            }}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-bold text-white"
                          >
                            <Plus className="size-4" />
                            Buat program
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-stone-200">
                          {draft.jenjang.map((item, index) => (
                            <article
                              key={item.id}
                              className="group grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.gambar}
                                alt={item.nama}
                                className="aspect-[4/3] w-full rounded-xl bg-stone-100 object-cover sm:w-28"
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                    {item.kategori === "kelas" ? "Kelas Al-Qur’an" : "Jenjang sekolah"}
                                  </span>
                                  <span
                                    className={
                                      item.hargaTerverifikasi === true
                                        ? "text-xs font-semibold text-emerald-700"
                                        : "text-xs font-semibold text-amber-700"
                                    }
                                  >
                                    {getProgramPriceLabel(item)}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setProgramView(index)}
                                  className="mt-2 block max-w-full text-left font-serif text-lg font-bold text-emerald-950 transition group-hover:text-emerald-700 focus:outline-none focus:underline"
                                >
                                  {item.nama}
                                </button>
                                <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-stone-500">
                                  {item.deskripsi}
                                </p>
                                <p className="mt-2 text-xs font-medium text-stone-400">
                                  {item.tingkat} · {item.rentangUsia || "Peserta belum ditentukan"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 sm:justify-end">
                                <button
                                  type="button"
                                  onClick={() => setProgramView(index)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-2 text-xs font-bold text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                                >
                                  <Pencil className="size-3.5" />
                                  Detail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProgram(index)}
                                  className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  aria-label="Hapus program"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {programView === "new" && (
                  <form onSubmit={handleCreateProgram} className="animate-in fade-in duration-200">
                    <div className="border-b border-stone-200 p-6 sm:p-8">
                      <button
                        type="button"
                        onClick={() => setProgramView(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 transition hover:text-stone-900 focus:outline-none focus:underline"
                      >
                        <ArrowLeft className="size-4" />
                        Kembali ke daftar program
                      </button>
                      <h2 className="mt-4 font-serif text-2xl font-bold text-[#0F4C3A]">Tambah program baru</h2>
                      <p className="mt-1 text-sm text-stone-500">Isi informasi program. Harga akan disembunyikan sampai diverifikasi.</p>
                    </div>
                    <div className="p-6 sm:p-8">
                      <ProgramEditorFields
                        value={newProgram}
                        onChange={setNewProgram}
                        onUploadComplete={() => showToast("Foto program berhasil diunggah.")}
                      />
                    </div>
                    <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-stone-200 bg-white/95 p-4 backdrop-blur sm:flex-row sm:justify-end sm:px-8">
                      <button type="button" onClick={() => setProgramView(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100">
                        Batal
                      </button>
                      <button type="submit" className="rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b3d2e] active:translate-y-px focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
                        Tambah ke daftar
                      </button>
                    </div>
                  </form>
                )}

                {typeof programView === "number" && draft.jenjang[programView] && (
                  <div className="animate-in fade-in duration-200">
                    <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                      <div>
                        <button
                          type="button"
                          onClick={() => setProgramView(null)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 transition hover:text-stone-900 focus:outline-none focus:underline"
                        >
                          <ArrowLeft className="size-4" />
                          Kembali ke daftar program
                        </button>
                        <h2 className="mt-4 text-wrap-balance font-serif text-2xl font-bold text-[#0F4C3A]">
                          {draft.jenjang[programView].nama}
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">Edit detail program dan periksa status harga sebelum menyimpan.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProgram(programView)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="size-4" />
                        Hapus program
                      </button>
                    </div>
                    <div className="p-6 sm:p-8">
                      <ProgramEditorFields
                        value={draft.jenjang[programView]}
                        onChange={(program) => {
                          const programs = [...draft.jenjang];
                          programs[programView] = program;
                          setDraft({ ...draft, jenjang: programs });
                        }}
                        onUploadComplete={() => showToast("Foto program berhasil diunggah.")}
                      />
                    </div>
                    <div className="sticky bottom-0 flex justify-end border-t border-stone-200 bg-white/95 p-4 backdrop-blur sm:px-8">
                      <button
                        type="button"
                        onClick={() => {
                          setProgramView(null);
                          showToast("Perubahan program tersimpan di draft.");
                        }}
                        className="rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b3d2e] active:translate-y-px focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                      >
                        Selesai mengedit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================= */}
            {/* 5. KABAR BALADZ (LIST VIEW + DEDICATED CREATE/EDIT VIEW)*/}
            {/* ======================================================= */}
            {activeMenu === "kabar" && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
                {/* 5A. VIEW: TAMBAH KABAR BARU (HALAMAN TERSENDIRI) */}
                {kabarView === "new" && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <button
                        type="button"
                        onClick={() => setKabarView(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer mb-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Kabar</span>
                      </button>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A]">
                        Tulis Kabar / Berita Baru
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Publikasikan dokumentasi kegiatan, warta, atau prestasi santri Baladz
                      </p>
                    </div>

                    <form onSubmit={handleCreateKabar} className="space-y-4 text-xs sm:text-sm">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">Judul Berita *</label>
                          <input
                            type="text"
                            required
                            value={newKabarJudul}
                            onChange={(e) => setNewKabarJudul(e.target.value)}
                            placeholder="Contoh: Santri Baladz Selesaikan Tasmi' 30 Juz Bil Ghoib"
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">Kategori Berita</label>
                          <input
                            type="text"
                            value={newKabarKategori}
                            onChange={(e) => setNewKabarKategori(e.target.value)}
                            placeholder="Contoh: Prestasi / Kegiatan / Tahfidz"
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <AdminImageUploader
                            label="Foto Dokumentasi Berita"
                            description="Foto suasana kegiatan atau liputan berita. Disarankan format landscape 16:9 atau 4:3."
                            value={newKabarGambar}
                            onChange={(url) => {
                              setNewKabarGambar(url);
                              showToast("Foto berita berhasil dipilih!");
                            }}
                            aspectRatio="16/9"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">Ringkasan Singkat (Muncul di Halaman Depan) *</label>
                          <textarea
                            rows={2}
                            required
                            value={newKabarRingkasan}
                            onChange={(e) => setNewKabarRingkasan(e.target.value)}
                            placeholder="Ringkasan 1-2 kalimat..."
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">
                            Isi Lengkap Artikel <span className="text-stone-400 font-normal text-xs">(Gunakan 2x Enter untuk pemisah paragraf)</span>
                          </label>
                          <textarea
                            rows={6}
                            value={newKabarIsi}
                            onChange={(e) => setNewKabarIsi(e.target.value)}
                            placeholder="Tuliskan isi berita lengkap di sini..."
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-white leading-relaxed"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setKabarView(null)}
                          className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                        >
                          Simpan Berita Baru
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 5B. VIEW: EDIT DETAIL KABAR (HALAMAN TERSENDIRI) */}
                {typeof kabarView === "number" && draft.kabar[kabarView] && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                      <button
                        type="button"
                        onClick={() => setKabarView(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer mb-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Kabar</span>
                      </button>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A]">
                        Edit Berita: {draft.kabar[kabarView].judul}
                      </h2>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">Judul Berita</label>
                          <input
                            type="text"
                            value={draft.kabar[kabarView].judul}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[kabarView] = { ...updated[kabarView], judul: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">Kategori</label>
                          <input
                            type="text"
                            value={draft.kabar[kabarView].kategori}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[kabarView] = { ...updated[kabarView], kategori: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <AdminImageUploader
                            label="Foto Dokumentasi Berita"
                            description="Foto suasana kegiatan atau liputan berita. Disarankan format landscape 16:9 atau 4:3."
                            value={draft.kabar[kabarView].gambar}
                            onChange={(url) => {
                              const updated = [...draft.kabar];
                              updated[kabarView] = { ...updated[kabarView], gambar: url };
                              setDraft({ ...draft, kabar: updated });
                              showToast("Foto berita diperbarui!");
                            }}
                            aspectRatio="16/9"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">Ringkasan</label>
                          <textarea
                            rows={2}
                            value={draft.kabar[kabarView].ringkasan}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[kabarView] = { ...updated[kabarView], ringkasan: e.target.value };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-stone-700 mb-1">Isi Lengkap (Paragraf)</label>
                          <textarea
                            rows={8}
                            value={draft.kabar[kabarView].isiLengkap.join("\n\n")}
                            onChange={(e) => {
                              const updated = [...draft.kabar];
                              updated[kabarView] = {
                                ...updated[kabarView],
                                isiLengkap: e.target.value.split("\n\n").filter(Boolean),
                              };
                              setDraft({ ...draft, kabar: updated });
                            }}
                            className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl bg-white leading-relaxed font-sans"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Hapus berita ini secara permanen?")) {
                              setDraft({ ...draft, kabar: draft.kabar.filter((_, i) => i !== kabarView) });
                              setKabarView(null);
                              showToast("Berita telah dihapus.");
                            }
                          }}
                          className="px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hapus Berita Ini</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setKabarView(null);
                            showToast("Perubahan berita tersimpan!");
                          }}
                          className="px-5 py-2 bg-[#0F4C3A] hover:bg-[#0c3f30] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                        >
                          Selesai & Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5C. VIEW: LIST TABEL/CARD KABAR (DEFAULT VIEW) */}
                {kabarView === null && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Warta Lembaga</span>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F4C3A] mt-0.5">
                          Kabar dari Baladz ({draft.kabar.length})
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Daftar dokumentasi kegiatan, warta, dan artikel berita resmi Baladz
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKabarView("new")}
                        className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tulis Kabar Baru</span>
                      </button>
                    </div>

                    {draft.kabar.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl">
                        <Newspaper className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                        <h3 className="font-bold text-stone-700 text-sm">Belum ada kabar berita</h3>
                        <p className="text-xs text-stone-400 mt-1">
                          Klik tombol &quot;Tulis Kabar Baru&quot; untuk mempublikasikan warta pertama.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                        {draft.kabar.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/80 transition-colors"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              {/* Thumbnail */}
                              <div className="w-20 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                                {item.gambar ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <Newspaper className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                    {item.kategori}
                                  </span>
                                  <span className="text-[11px] text-stone-400">{item.tanggal}</span>
                                </div>
                                <h4
                                  onClick={() => setKabarView(idx)}
                                  className="font-bold text-stone-900 text-sm hover:text-emerald-800 cursor-pointer line-clamp-1"
                                >
                                  {item.judul}
                                </h4>
                                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                                  {item.ringkasan}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => setKabarView(idx)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit Detail</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Hapus kabar "${item.judul}"?`)) {
                                    setDraft({ ...draft, kabar: draft.kabar.filter((_, i) => i !== idx) });
                                    showToast("Berita telah dihapus.");
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Berita"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                    <label className="block font-semibold mb-1 text-stone-700">WhatsApp Resmi (semua CTA)</label>
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

      {/* MODAL GANTI PASSWORD */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F4C3A] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base">Ganti Password Admin</h3>
                <p className="text-xs text-stone-500">Perbarui kata sandi akun admin Baladz</p>
              </div>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  required
                  className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password Baru (minimal 6 karakter)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                  minLength={6}
                  className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                  minLength={6}
                  className="w-full text-sm border border-stone-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F4C3A]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-1/2 py-2.5 text-xs font-bold rounded-xl bg-[#0F4C3A] hover:bg-[#0c3f30] text-white transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isChangingPassword ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
