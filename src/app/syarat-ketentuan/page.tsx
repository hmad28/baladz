import Link from "next/link";

export default function TermsPage() {
  return <main className="min-h-screen bg-cream py-20 text-ink"><article className="site-container max-w-3xl"><Link className="text-sm font-semibold text-forest" href="/">← Kembali ke beranda</Link><h1 className="mt-10 font-serif text-6xl text-forest">Syarat & ketentuan</h1><p className="mt-8 leading-8 text-ink/65">Informasi program, jadwal, biaya, dan kuota dapat berubah sesuai kebijakan Baladz. Konfirmasi akhir dilakukan melalui kontak resmi Baladz sebelum pendaftaran atau pembayaran.</p><p className="mt-5 leading-8 text-ink/65">Dokumen ini merupakan draf awal dan perlu ditinjau kembali sebelum website dipublikasikan secara resmi.</p></article></main>;
}
