"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

export function PsbInfo() {
  const { content } = useSiteContent();

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="border-b border-forest/10">
        <div className="site-container flex h-[76px] items-center justify-between">
          <Link className="font-serif text-3xl font-semibold text-forest" href="/">Baladz</Link>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-forest" href="/"><ArrowLeft size={17} /> Kembali ke beranda</Link>
        </div>
      </header>
      <section className="border-b border-forest/10 bg-sage/50 py-20 sm:py-28">
        <div className="site-container">
          <p className="eyebrow">Penerimaan santri baru</p>
          <h1 className="mt-7 max-w-[13ch] font-serif text-[clamp(3.5rem,8vw,7rem)] leading-[.9] tracking-[-.06em] text-forest">Informasi PSB <span className="text-terracotta">{content.psb.academicYear}</span></h1>
          <p className="mt-7 max-w-[44rem] text-lg leading-8 text-ink/64">{content.psb.description}</p>
          <Link className="button-primary mt-9" href={content.psb.registrationUrl} target="_blank">Daftar melalui WhatsApp <ArrowRight size={18} /></Link>
        </div>
      </section>
      <section className="site-section">
        <div className="site-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Ringkas dan jelas</p>
            <h2 className="mt-6 font-serif text-5xl leading-none text-forest">Yang perlu disiapkan.</h2>
            <p className="mt-5 max-w-[32rem] leading-7 text-ink/60">Informasi detail dapat diperbarui admin dari satu halaman, sehingga orang tua selalu melihat data terbaru.</p>
          </div>
          <dl className="divide-y divide-forest/15 border-y border-forest/15">
            {[
              [CalendarDays, "Periode pendaftaran", content.psb.wave],
              [CheckCircle2, "Jadwal seleksi", content.psb.schedule],
              [FileText, "Persyaratan", content.psb.requirements],
              [MessageCircle, "Biaya pendidikan", content.psb.feeNote],
            ].map(([Icon, title, detail]) => {
              const ItemIcon = Icon as typeof CalendarDays;
              return <div className="grid gap-4 py-7 sm:grid-cols-[3rem_12rem_1fr] sm:items-start" key={String(title)}><ItemIcon className="text-terracotta" size={25} strokeWidth={1.6} /><dt className="font-semibold text-forest">{String(title)}</dt><dd className="leading-7 text-ink/62">{String(detail)}</dd></div>;
            })}
          </dl>
        </div>
      </section>
      <section className="bg-forest py-16 text-white">
        <div className="site-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-serif text-4xl">Masih ada yang ingin ditanyakan?</p><p className="mt-2 text-white/60">Tim Baladz siap membantu memilih program yang sesuai.</p></div>
          <Link className="button-primary" href={`https://wa.me/${content.settings.whatsapp}`} target="_blank">Konsultasi sekarang <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}
