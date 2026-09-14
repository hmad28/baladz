import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-cream px-6 text-center text-ink"><div><p className="eyebrow justify-center">404</p><h1 className="mt-6 font-serif text-6xl text-forest sm:text-8xl">Halaman tidak ditemukan.</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-ink/58">Tautan mungkin sudah berubah. Kembali ke beranda untuk menemukan program, informasi PSB, dan kabar Baladz.</p><Link className="button-primary mt-8" href="/"><ArrowLeft size={17} /> Kembali ke beranda</Link></div></main>;
}
