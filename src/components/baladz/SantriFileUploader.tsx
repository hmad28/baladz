"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  FileText,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Link2,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export interface SantriFileUploaderProps {
  label?: string;
  description?: string;
  endpoint?: "documentUploader" | "imageUploader";
  acceptTypes?: "image" | "document" | "all";
  value: string;
  onChange: (url: string) => void;
  onFileNameChange?: (fileName: string) => void;
  disabled?: boolean;
  compact?: boolean;
  placeholder?: string;
}

export function SantriFileUploader({
  label,
  description,
  endpoint = "documentUploader",
  acceptTypes = "all",
  value,
  onChange,
  onFileNameChange,
  disabled = false,
  compact = false,
  placeholder = "Pilih file dari perangkat Anda",
}: SantriFileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  const isImageFile = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".png") ||
      lower.includes(".webp") ||
      lower.includes("image")
    );
  };

  const isPdfFile = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes(".pdf") || lower.includes("pdf");
  };

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadBegin: (fileName) => {
      setUploadStatus("uploading");
      setCurrentFileName(fileName);
      if (onFileNameChange) onFileNameChange(fileName);
      setErrorMessage(null);
      setUploadProgress(15);
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
        }, 3000);
      } else {
        setUploadStatus("error");
        setErrorMessage("Upload berhasil tetapi URL berkas tidak diterima.");
      }
    },
    onUploadError: (err) => {
      setUploadStatus("error");
      setErrorMessage(err.message || "Gagal mengunggah berkas. Pastikan ukuran file sesuai dan format didukung.");
    },
  });

  const handleFileSelect = async (file: File) => {
    if (!file || disabled) return;

    // Validasi tipe file
    if (acceptTypes === "image" && !file.type.startsWith("image/")) {
      setUploadStatus("error");
      setErrorMessage("File harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }

    if (acceptTypes === "document" && !file.type.startsWith("image/") && file.type !== "application/pdf") {
      setUploadStatus("error");
      setErrorMessage("File harus berupa dokumen PDF atau foto JPG/PNG.");
      return;
    }

    // Validasi ukuran maksimal (8MB untuk dokumen, 4MB untuk gambar)
    const maxBytes = (endpoint === "imageUploader" ? 4 : 8) * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadStatus("error");
      setErrorMessage(`Ukuran file melebihi batas maksimal ${endpoint === "imageUploader" ? "4MB" : "8MB"}.`);
      return;
    }

    setCurrentFileName(file.name);
    if (onFileNameChange) onFileNameChange(file.name);
    setUploadStatus("uploading");
    setErrorMessage(null);
    setUploadProgress(15);

    try {
      await startUpload([file]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadStatus("error");
      setErrorMessage(msg || "Terjadi kendala saat proses upload.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleApplyManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setShowUrlInput(false);
  };

  const handleClearFile = () => {
    onChange("");
    setManualUrl("");
    setCurrentFileName(null);
    setUploadStatus("idle");
    setErrorMessage(null);
  };

  const acceptAttribute =
    acceptTypes === "image"
      ? "image/jpeg,image/png,image/webp,image/jpg"
      : acceptTypes === "document"
      ? "application/pdf,image/jpeg,image/png,image/jpg"
      : "image/jpeg,image/png,image/webp,image/jpg,application/pdf";

  return (
    <div className="space-y-2 w-full">
      {/* Label & Deskripsi */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800">
            {label}
          </label>
          {description && (
            <span className="text-[11px] text-stone-400 font-normal">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttribute}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label={label || "Unggah berkas"}
      />

      {/* KONDISI 1: SUDAH ADA FILE TERUNGGAH */}
      {value ? (
        <div className="p-3 sm:p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail / Icon */}
              {isImageFile(value) ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-200 bg-white shrink-0">
                  <Image
                    src={value}
                    alt="Pratinjau berkas"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : isPdfFile(value) ? (
                <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <FileText className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-[#0F4C3A] flex items-center justify-center shrink-0 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              )}

              {/* Status & Nama File */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Berkas Siap Digunakan</span>
                </div>
                <p className="text-[11px] text-stone-600 truncate max-w-[200px] sm:max-w-[280px]">
                  {currentFileName || value}
                </p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                title="Buka / Lihat Berkas"
              >
                <Eye className="w-4 h-4" />
              </a>

              {!disabled && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
                    title="Ganti Berkas dengan File Baru"
                  >
                    <RefreshCw className={`w-4 h-4 ${isUploading ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                    title="Hapus Berkas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* KONDISI 2: BELUM ADA FILE (DROPZONE / TOMBOL UPLOAD LANGSUNG) */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative rounded-xl border-2 border-dashed p-4 sm:p-5 text-center transition-all cursor-pointer select-none ${
            isDragOver
              ? "border-[#0F4C3A] bg-emerald-50 scale-[1.01]"
              : uploadStatus === "error"
              ? "border-rose-300 bg-rose-50/50 hover:bg-rose-50"
              : disabled
              ? "border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed"
              : "border-stone-300 hover:border-[#0F4C3A] bg-white hover:bg-stone-50/80"
          }`}
        >
          {isUploading ? (
            /* Indikator Proses Upload */
            <div className="py-3 flex flex-col items-center justify-center space-y-2.5">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-[#0F4C3A] animate-spin" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs font-bold text-stone-900 block">
                  Mengunggah Berkas... {uploadProgress}%
                </span>
                {currentFileName && (
                  <p className="text-[11px] text-stone-500 truncate max-w-xs mx-auto">
                    {currentFileName}
                  </p>
                )}
              </div>
              {/* Progress Bar */}
              <div className="w-48 sm:w-64 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F4C3A] transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Tampilan Siap Pilih File */
            <div className={`flex ${compact ? "flex-row items-center justify-center gap-3 py-1" : "flex-col items-center justify-center py-2"} space-y-1.5`}>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0 border border-emerald-100">
                {acceptTypes === "image" ? (
                  <ImageIcon className="w-5 h-5 text-emerald-800" />
                ) : (
                  <Upload className="w-5 h-5 text-emerald-800" />
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#0F4C3A] block">
                  {placeholder}
                </span>
                <p className="text-[11px] text-stone-500">
                  {acceptTypes === "image"
                    ? "Ketuk untuk memilih foto dari galeri / kamera (Maks 4MB)"
                    : "Klik / ketuk untuk pilih foto atau file PDF (Maks 8MB)"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Accordion / Toggle: Masukkan Link Manual */}
      {!disabled && !value && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-stone-500 hover:text-[#0F4C3A] inline-flex items-center gap-1 transition"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{showUrlInput ? "Tutup input link" : "Atau masukkan link file (Google Drive / Cloud)"}</span>
          </button>

          {showUrlInput && (
            <form
              onSubmit={handleApplyManualUrl}
              className="mt-2 flex items-center gap-2 animate-in fade-in duration-150"
            >
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://drive.google.com/... atau tautan file"
                className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-700 bg-white"
              />
              <button
                type="submit"
                disabled={!manualUrl.trim()}
                className="px-3 py-1.5 bg-[#0F4C3A] text-white text-xs font-bold rounded-lg hover:bg-[#0c3f30] disabled:opacity-50 transition cursor-pointer"
              >
                Gunakan
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
