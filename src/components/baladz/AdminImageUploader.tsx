"use client";

import { useRef, useState } from "react";
import {
  Upload,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Link2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export interface AdminImageUploaderProps {
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "4/3" | "16/9" | "3/4" | "1/1" | "auto";
  objectFit?: "cover" | "contain";
  badgeText?: string;
}

export function AdminImageUploader({
  label,
  description,
  value,
  onChange,
  aspectRatio = "4/3",
  objectFit = "cover",
  badgeText,
}: AdminImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // UploadThing helper
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: (fileName) => {
      setUploadStatus("uploading");
      setSelectedFileName(fileName);
      setErrorMessage(null);
      setUploadProgress(10);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      const url = file?.ufsUrl || file?.url;
      if (url) {
        onChange(url);
        setManualUrl(url);
        setUploadStatus("success");
        setUploadProgress(100);
        setTimeout(() => {
          setUploadStatus("idle");
        }, 4000);
      } else {
        setUploadStatus("error");
        setErrorMessage("Upload selesai tetapi URL file tidak diterima dari server.");
      }
    },
    onUploadError: (err) => {
      setUploadStatus("error");
      setErrorMessage(err.message || "Gagal mengunggah foto. Pastikan ukuran file di bawah 4MB.");
    },
  });

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadStatus("error");
      setErrorMessage("File harus berupa gambar (format JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMessage("Ukuran foto melebihi batas maksimal 4MB. Mohon kompres atau pilih foto lain.");
      return;
    }

    setSelectedFileName(file.name);
    setUploadStatus("uploading");
    setErrorMessage(null);
    setUploadProgress(15);

    try {
      await startUpload([file]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadStatus("error");
      setErrorMessage(msg || "Terjadi kesalahan saat mengunggah foto.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset file input value agar user bisa memilih file yang sama jika upload ulang
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleApplyManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualUrl.trim();
    if (trimmed) {
      onChange(trimmed);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 2500);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    setManualUrl("");
    setSelectedFileName(null);
    setUploadStatus("idle");
    setErrorMessage(null);
  };

  // Helper aspect ratio classes
  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-16/9"
      : aspectRatio === "3/4"
      ? "aspect-3/4"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : aspectRatio === "auto"
      ? "max-h-72 w-auto"
      : "aspect-4/3";

  return (
    <div className="space-y-3">
      {/* Hidden native input file untuk desktop dan mobile gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Label & Deskripsi */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#0F4C3A]" />
            <span>{label}</span>
          </label>
          {description && <p className="text-[11px] text-stone-500 mt-0.5">{description}</p>}
        </div>
        {badgeText && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
            {badgeText}
          </span>
        )}
      </div>

      {/* STATUS BANNER */}
      {uploadStatus === "uploading" && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>Sedang mengunggah: <strong className="font-mono">{selectedFileName || "foto"}</strong></span>
            </div>
            <span className="font-mono text-emerald-800">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F4C3A] transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(uploadProgress, 8)}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-700">Mohon tunggu, foto sedang diproses ke server cloud...</p>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Foto berhasil diunggah! Jangan lupa klik <strong>&quot;Simpan Perubahan&quot;</strong> di atas.</span>
          </div>
        </div>
      )}

      {uploadStatus === "error" && errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Gagal mengunggah foto</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadStatus("idle")}
            className="text-xs text-rose-600 font-bold hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KONDISI 1: SUDAH ADA GAMBAR / PREVIEW TERSEDIA */}
      {value ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs space-y-3">
          {/* Gambar Preview */}
          <div className="relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className={`w-full ${aspectClass} ${objectFit === "contain" ? "object-contain max-h-72 mx-auto" : "object-cover"}`}
            />
          </div>

          {/* Info URL / Path */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 truncate gap-2">
            <div className="flex items-center gap-1.5 truncate font-mono text-[10px] text-stone-600">
              <span className="shrink-0 font-sans font-semibold text-stone-400">File:</span>
              <span className="truncate" title={value}>{value}</span>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 font-semibold shrink-0 inline-flex items-center gap-1 hover:underline"
            >
              <span>Buka</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Action Bar (Ganti Foto & Hapus Foto) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-w-[140px] bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ganti Foto / Upload Ulang</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleRemoveImage}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Hapus foto ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      ) : (
        /* KONDISI 2: BELUM ADA GAMBAR (DROPZONE BESAR DENGAN TOMBOL JELAS) */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
            isDragOver
              ? "border-emerald-600 bg-emerald-50/60 scale-[1.005]"
              : "border-stone-300 bg-stone-50/70 hover:border-emerald-600 hover:bg-emerald-50/20"
          }`}
        >
          <div className="max-w-sm mx-auto flex flex-col items-center space-y-3">
            {/* Ikon Upload Besar */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 text-emerald-800 shadow-2xs flex items-center justify-center">
              <Upload className="w-7 h-7 text-[#0F4C3A]" />
            </div>

            {/* Judul & Keterangan */}
            <div>
              <p className="font-bold text-stone-800 text-sm">Unggah Foto / Gambar</p>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Pilih file foto dari galeri HP atau komputer, atau seret file ke area ini.
              </p>
            </div>

            {/* TOMBOL UTAMA UPLOAD */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto min-w-[220px] bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Pilih Foto / Upload File</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-stone-400">
              Mendukung JPG, PNG, WEBP (Maksimal 4 MB)
            </p>
          </div>
        </div>
      )}

      {/* OPSI SEKUNDER: INPUT URL MANUAL (ACCORDION COLLAPSIBLE) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Atau masukkan link URL gambar manual (opsional)</span>
          {showUrlInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showUrlInput && (
          <form onSubmit={handleApplyManualUrl} className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Contoh: https://... atau /images/baladz/..."
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-mono outline-none focus:border-[#0F4C3A]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-bold text-[#0F4C3A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Terapkan URL
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
