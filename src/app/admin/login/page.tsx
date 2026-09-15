"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Mohon isi username dan password Anda.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Username atau password salah.");
        setIsLoading(false);
        return;
      }

      // Berhasil login, arahkan ke dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Gagal menghubungi server. Periksa koneksi internet Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50/40 flex flex-col justify-center items-center px-4 py-12">
      {/* Tombol kembali ke website */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#0F4C3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Website Baladz
        </Link>
      </div>

      {/* Card Login */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-200/80 overflow-hidden">
        {/* Header Card */}
        <div className="bg-[#0F4C3A] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-white/20 backdrop-blur-sm shadow-inner mb-4 flex items-center justify-center">
              <Image
                src="/images/baladz/logo.png"
                alt="Logo Baladz"
                width={48}
                height={48}
                className="w-auto h-12 object-contain"
                priority
              />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-300">
              Panel Pengelola
            </span>
            <h1 className="text-2xl font-serif font-bold text-white mt-1">
              Ma&apos;had Baladz Al-Qur&apos;an
            </h1>
            <p className="text-xs text-stone-200/80 mt-1 max-w-xs">
              Silakan masuk untuk mengelola konten website, publikasi kabar, dan data pendaftar santri baru.
            </p>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Input Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                disabled={isLoading}
                required
                className="w-full bg-stone-50 border border-stone-300 focus:border-[#0F4C3A] focus:bg-white rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                disabled={isLoading}
                required
                className="w-full bg-stone-50 border border-stone-300 focus:border-[#0F4C3A] focus:bg-white rounded-xl px-4 py-3 pr-11 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F4C3A] hover:bg-[#0c3f30] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>

          {/* Informasi Default Akun */}
          <div className="pt-3 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Default login: <span className="font-mono font-bold text-stone-700">admin</span> /{" "}
              <span className="font-mono font-bold text-stone-700">adminbaladz2025</span>
              <br />
              <span className="text-stone-400 text-[10px]">
                (Password dapat diganti di dalam dashboard setelah masuk)
              </span>
            </p>
          </div>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Yayasan Baladz Al-Qur&apos;an Indonesia. Dilindungi Hak Cipta.
      </div>
    </div>
  );
}
