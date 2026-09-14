"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  DollarSign,
  GraduationCap,
  Home,
  Newspaper,
  Phone,
  RotateCcw,
  Save,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

export function AdminDashboard() {
  const { draft, setDraft, save, reset, savedAt } = useSiteContent();
  const [activeTab, setActiveTab] = useState<"lembaga" | "psb" | "jenjang" | "kabar" | "kajian" | "kontak">("psb");
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2ED] text-stone-800 font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
              title="Kembali ke Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif font-bold text-lg text-emerald-950">Panel Editor Konten Baladz</h1>
              <p className="text-[11px] text-stone-500">Edit isi website, biaya, dan kontak tanpa ribet</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-xs text-emerald-700 font-medium hidden sm:inline">
                Tersimpan pukul {savedAt}
              </span>
            )}
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-stone-300 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              title="Salin data JSON"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{copied ? "Tersalin!" : "Salin JSON"}</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Reset kembali semua isi ke pengaturan default awal?")) {
                  reset();
                }
              }}
              className="p-2 text-xs font-semibold rounded-md text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Reset ke Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={save}
              className="bg-[#0F4C3A] hover:bg-[#0c3f30] text-white px-4 py-2 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <aside className="md:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs h-fit">
            <button
              onClick={() => setActiveTab("psb")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "psb" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>PSB & Biaya Pendaftaran</span>
            </button>
            <button
              onClick={() => setActiveTab("jenjang")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "jenjang" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>3 Jenjang Pendidikan</span>
            </button>
            <button
              onClick={() => setActiveTab("lembaga")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "lembaga" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Profil Lembaga & Kampus</span>
            </button>
            <button
              onClick={() => setActiveTab("kabar")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "kabar" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Kabar dari Baladz ({draft.kabar.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("kajian")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "kajian" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kajian Islami ({draft.kajian.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("kontak")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                activeTab === "kontak" ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Kontak & Media Sosial</span>
            </button>
          </aside>

          {/* Form Content Area */}
          <main className="md:col-span-9 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
            {/* 1. TAB PSB & BIAYA */}
            {activeTab === "psb" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Pengaturan PSB & Biaya Pendaftaran</h2>
                  <p className="text-xs text-stone-500 mt-1">Ubah tahun ajaran, kuota santri, dan rekening transfer resmi</p>
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
                    <label className="block font-semibold mb-1 text-stone-700">Batas Akhir Daftar Ulang</label>
                    <input
                      type="text"
                      value={draft.psb.batasDaftarUlang}
                      onChange={(e) => setDraft({ ...draft, psb: { ...draft.psb, batasDaftarUlang: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="font-bold text-stone-800 text-sm mb-3">Rekening Pembayaran Yayasan</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-semibold mb-1 text-stone-700">Nama Bank / Keterangan</label>
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

            {/* 2. TAB 3 JENJANG PENDIDIKAN */}
            {activeTab === "jenjang" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Biaya & Informasi 3 Jenjang Pendidikan</h2>
                  <p className="text-xs text-stone-500 mt-1">Ubah uang pangkal, SPP syahriyah, dan biaya asrama masing-masing jenjang</p>
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
                            className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
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
                            className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white"
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
                            className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-mono"
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
                            className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-mono"
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
                              className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white font-mono"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TAB PROFIL LEMBAGA */}
            {activeTab === "lembaga" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Profil Lembaga & Fasilitas KBM</h2>
                  <p className="text-xs text-stone-500 mt-1">Ubah deskripsi profil, yayasan, dan lokasi kampus KBM</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Nama Lembaga</label>
                    <input
                      type="text"
                      value={draft.lembaga.nama}
                      onChange={(e) => setDraft({ ...draft, lembaga: { ...draft.lembaga, nama: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Tagline</label>
                    <input
                      type="text"
                      value={draft.lembaga.tagline}
                      onChange={(e) => setDraft({ ...draft, lembaga: { ...draft.lembaga, tagline: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Nama Yayasan</label>
                    <input
                      type="text"
                      value={draft.lembaga.yayasan}
                      onChange={(e) => setDraft({ ...draft, lembaga: { ...draft.lembaga, yayasan: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">Deskripsi Singkat Lembaga</label>
                    <textarea
                      rows={3}
                      value={draft.lembaga.deskripsi}
                      onChange={(e) => setDraft({ ...draft, lembaga: { ...draft.lembaga, deskripsi: e.target.value } })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. TAB KABAR BALADZ */}
            {activeTab === "kabar" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Daftar Kabar dari Baladz</h2>
                  <p className="text-xs text-stone-500 mt-1">Edit judul dan ringkasan warta/kegiatan terbaru</p>
                </div>

                <div className="space-y-4">
                  {draft.kabar.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-stone-200 rounded-xl space-y-3 bg-stone-50/50">
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Judul Kabar</label>
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
                          <label className="block font-semibold text-stone-600 mb-1">Kategori / Tanggal</label>
                          <input
                            type="text"
                            value={`${item.kategori} • ${item.tanggal}`}
                            disabled
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-stone-100 text-stone-500"
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

            {/* 5. TAB KAJIAN */}
            {activeTab === "kajian" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Daftar Kajian Islami & Parenting</h2>
                  <p className="text-xs text-stone-500 mt-1">Kelola konten artikel islami untuk orang tua</p>
                </div>

                <div className="space-y-4">
                  {draft.kajian.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-stone-200 rounded-xl space-y-3 bg-stone-50/50">
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-stone-600 mb-1">Judul Kajian</label>
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
                          <label className="block font-semibold text-stone-600 mb-1">Kategori / Penulis</label>
                          <input
                            type="text"
                            value={`${item.kategori} • ${item.penulis}`}
                            disabled
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-stone-100 text-stone-500"
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

            {/* 6. TAB KONTAK & MEDSOS */}
            {activeTab === "kontak" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-xl text-emerald-950">Kontak & Media Sosial Resmi</h2>
                  <p className="text-xs text-stone-500 mt-1">Ubah nomor WhatsApp, telepon, email, dan alamat lembaga</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1 text-stone-700">WhatsApp Utama (Untuk PSB)</label>
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
                    <label className="block font-semibold mb-1 text-stone-700">Nomor Telepon</label>
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
                    <label className="block font-semibold mb-1 text-stone-700">Alamat Lengkap</label>
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
