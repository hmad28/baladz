"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, LogIn, MessageCircle, User } from "lucide-react";

export function SantriLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/santri/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk ke dashboard");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat masuk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block relative h-14 w-44">
            <Image src="/images/baladz/logo.png" alt="Baladz" fill className="object-contain" priority />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#0F4C3A]">
            Portal Calon Santri Baru
          </h1>
          <p className="text-xs text-stone-500">
            Masuk untuk memantau pendaftaran, verifikasi berkas, pembayaran, dan pengumuman seleksi
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-sm border border-stone-200 sm:rounded-2xl sm:px-10 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nomor Pendaftaran / Nomor WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: BLZ-260001 atau 08123456789"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#0F4C3A] text-stone-900 bg-white"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Gunakan nomor pendaftaran atau nomor WhatsApp yang didaftarkan.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Kata Sandi / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi atau 6 digit PIN"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#0F4C3A] text-stone-900 bg-white"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Secara default adalah 6 digit terakhir nomor WhatsApp saat mendaftar.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? "Sedang Memeriksa..." : "Masuk ke Dashboard Santri"}</span>
              </button>
            </div>
          </form>

          {/* Quick Guidance Box */}
          <div className="pt-4 border-t border-stone-100 space-y-3 text-xs text-stone-600">
            <div className="flex items-start gap-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-[11px] leading-relaxed text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Belum mendaftar? Silakan isi formulir pendaftaran santri baru terlebih dahulu di halaman web resmi.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>

              <a
                href="https://wa.me/62895401047586?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20butuh%20bantuan%20login%20dashboard%20santri."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#D97706] hover:text-[#b56405] text-xs font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Bantuan / Lupa Akses?</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
