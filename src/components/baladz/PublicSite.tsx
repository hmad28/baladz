"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChevronRight,
  HeartHandshake,
  Leaf,
  Menu,
  MessageCircle,
  Play,
  Scale,
  UsersRound,
  X,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

const navItems = [
  ["Beranda", "#beranda"],
  ["Tentang", "#tentang"],
  ["Program", "#program"],
  ["PSB", "#psb"],
  ["Produk", "#produk"],
  ["Kabar & Kajian", "#kabar"],
  ["Kontak", "#kontak"],
] as const;

const advantages = [
  {
    title: "Kurikulum berbasis Al-Qur’an",
    description: "Tilawah, hafalan, dan nilai Qur’ani menjadi fondasi proses belajar.",
    icon: BookOpen,
  },
  {
    title: "Tilawah dan hafalan",
    description: "Pembiasaan bertahap dengan pendampingan yang terukur.",
    icon: HeartHandshake,
  },
  {
    title: "Pengajar yang mendampingi",
    description: "Guru hadir sebagai pengajar sekaligus teladan bagi santri.",
    icon: UsersRound,
  },
  {
    title: "Akademik dan diniyah seimbang",
    description: "Ilmu umum dan agama berjalan dalam satu pengalaman belajar.",
    icon: Scale,
  },
  {
    title: "Lingkungan yang bertumbuh",
    description: "Suasana aman dan suportif untuk karakter serta kemandirian.",
    icon: Leaf,
  },
] as const;

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link className="group flex items-center gap-3" href="#beranda" aria-label="Baladz — kembali ke beranda">
      <span className={`grid size-10 place-items-center border ${light ? "border-white/35" : "border-forest/20"} rounded-[10px]`}>
        <BookOpen className={light ? "text-cream" : "text-forest"} size={22} strokeWidth={1.7} />
      </span>
      <span>
        <span className={`block font-serif text-[1.65rem] font-semibold leading-none tracking-[-0.04em] ${light ? "text-cream" : "text-forest"}`}>
          Baladz
        </span>
        <span className={`mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.19em] ${light ? "text-white/60" : "text-ink/50"}`}>
          Bersama Al-Qur’an
        </span>
      </span>
    </Link>
  );
}

function ArrowLink({ children, href, light = false }: { children: string; href: string; light?: boolean }) {
  return (
    <Link
      className={`group inline-flex min-h-11 items-center gap-3 border-b pb-1 text-sm font-semibold transition-colors ${light ? "border-white/40 text-white hover:border-white" : "border-forest/35 text-forest hover:border-terracotta hover:text-terracotta"}`}
      href={href}
    >
      {children}
      <ArrowRight className="transition-transform group-hover:translate-x-1" size={17} />
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.6fr)] lg:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-5 max-w-[18ch] font-serif text-[clamp(2.35rem,5vw,5.35rem)] font-medium leading-[0.98] tracking-[-0.055em] text-forest text-balance">
          {title}
        </h2>
      </div>
      {description && <p className="max-w-[52ch] text-base leading-7 text-ink/66 lg:pb-2">{description}</p>}
    </div>
  );
}

export function PublicSite() {
  const { content } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${content.settings.whatsapp}`;

  return (
    <div className="min-h-screen overflow-hidden bg-cream text-ink">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>

      <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/92 backdrop-blur-xl">
        <div className="site-container flex h-[78px] items-center justify-between gap-6">
          <BrandMark />
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 xl:flex">
            {navItems.map(([label, href]) => (
              <Link className="nav-link" href={href} key={href}>{label}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 sm:flex">
            <Link className="button-primary" href={content.psb.registrationUrl} target="_blank">
              Daftar sekarang <ArrowRight size={17} />
            </Link>
          </div>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="grid size-11 place-items-center rounded-[10px] border border-forest/20 text-forest xl:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <nav aria-label="Navigasi seluler" className="border-t border-forest/10 bg-cream px-5 py-5 xl:hidden">
            <div className="mx-auto grid max-w-[86rem] gap-1">
              {navItems.map(([label, href]) => (
                <Link className="rounded-lg px-3 py-3 text-base font-semibold text-forest hover:bg-sage" href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main-content">
        <section className="relative border-b border-forest/10" id="beranda">
          <div className="islamic-pattern pointer-events-none absolute left-[44%] top-8 hidden size-64 opacity-40 lg:block" />
          <div className="site-container grid min-h-[calc(100dvh-78px)] items-stretch lg:grid-cols-[.88fr_1.12fr]">
            <div className="flex flex-col justify-center py-16 pr-0 sm:py-20 lg:py-24 lg:pr-12 xl:pr-20">
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1 className="mt-7 max-w-[10ch] font-serif text-[clamp(3.5rem,7vw,7.25rem)] font-medium leading-[0.88] tracking-[-0.068em] text-forest text-balance">
                {content.hero.title}
              </h1>
              <p className="mt-8 max-w-[36rem] text-lg leading-8 text-ink/68 sm:text-xl">
                {content.hero.description}
              </p>
              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Link className="button-primary" href="#program">
                  {content.hero.primaryCta} <ArrowRight size={18} />
                </Link>
                <ArrowLink href="#psb">{content.hero.secondaryCta}</ArrowLink>
              </div>
              <div className="mt-14 grid max-w-[32rem] grid-cols-3 gap-5 border-t border-forest/18 pt-6">
                {["Sejak 2018", "5 program", "2 lokasi"].map((item) => (
                  <p className="text-sm font-semibold text-forest" key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="relative min-h-[27rem] overflow-hidden rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-bl-[4.5rem]">
              <Image
                alt="Kegiatan belajar dan kebersamaan santri Baladz"
                className="object-cover object-center"
                fill
                loading="eager"
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                src="/images/baladz/gallery-outdoor.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/65 via-transparent to-transparent" />
              <p className="absolute bottom-7 left-7 max-w-[16rem] font-serif text-2xl leading-tight text-white sm:bottom-10 sm:left-10">
                Langkah kecil hari ini, untuk masa depan yang lebih baik.
              </p>
            </div>
          </div>
        </section>

        <section className="site-section" id="tentang">
          <div className="site-container grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow">Tentang Baladz</p>
              <p className="mt-8 font-serif text-[clamp(4rem,8vw,8rem)] leading-none tracking-[-0.06em] text-terracotta">{content.profile.since}</p>
              <h2 className="mt-8 max-w-[13ch] font-serif text-[clamp(2.5rem,4vw,4.6rem)] leading-[1] tracking-[-0.05em] text-forest text-balance">
                {content.profile.title}
              </h2>
              <p className="mt-7 max-w-[42rem] text-base leading-8 text-ink/68">{content.profile.description}</p>
              <div className="mt-8"><ArrowLink href="#kontak">Baca profil Baladz</ArrowLink></div>
            </div>
            <div className="grid grid-cols-12 items-end gap-4 sm:gap-6">
              <div className="relative col-span-10 aspect-[5/4] overflow-hidden rounded-[2rem] sm:col-span-9">
                <Image alt="Santri Baladz mengikuti kegiatan bersama" className="object-cover" fill sizes="(max-width: 1024px) 85vw, 48vw" src="/images/baladz/gallery-quran.jpg" />
              </div>
              <div className="relative col-span-8 col-start-5 -mt-14 aspect-[4/3] overflow-hidden rounded-[1.4rem] border-[10px] border-cream sm:col-span-7 sm:col-start-6">
                <Image alt="Pendampingan kegiatan pendidikan Baladz" className="object-cover" fill sizes="(max-width: 1024px) 65vw, 34vw" src="/images/baladz/gallery-event.jpg" />
              </div>
            </div>
          </div>
        </section>

        <section className="site-section border-y border-forest/10 bg-sage/65" id="program">
          <div className="site-container">
            <SectionHeading
              eyebrow="Program pendidikan"
              title="Temukan program yang tepat untuk setiap tahap tumbuh."
              description="Setiap tahap adalah kesempatan untuk lebih dekat dengan Al-Qur’an, dengan cara yang sesuai kebutuhan anak dan keluarga."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {content.programs.map((program, index) => (
                <article className={`program-card group ${index === 0 ? "lg:row-span-2" : ""}`} key={program.shortName}>
                  <div className={`relative overflow-hidden ${index === 0 ? "aspect-[5/4] lg:aspect-auto lg:min-h-[47rem]" : "aspect-[7/4]"}`}>
                    <Image alt={`Kegiatan ${program.shortName} Baladz`} className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 25vw"} src={program.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/5 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">0{index + 1} · {program.shortName}</p>
                        <p className="text-xs font-semibold text-white/75">{program.stage}</p>
                      </div>
                      <h3 className="mt-3 font-serif text-3xl leading-none tracking-[-0.04em] sm:text-4xl">{program.name}</h3>
                      <p className="mt-3 max-w-[40rem] text-sm leading-6 text-white/75">{program.description}</p>
                      <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" href="#kontak">Lihat program <ChevronRight size={16} /></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <SectionHeading
              eyebrow="Kenapa Baladz"
              title="Yang kami jaga dalam setiap proses belajar."
              description="Kami merancang pendidikan untuk mendekatkan anak kepada Al-Qur’an, membentuk akhlak, dan menyiapkan mereka menghadapi kehidupan dengan ilmu yang seimbang."
            />
            <div className="mt-14 grid gap-px overflow-hidden border-y border-forest/20 bg-forest/20 md:grid-cols-2 lg:grid-cols-5">
              {advantages.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article className="bg-cream px-6 py-8 lg:min-h-72" key={item.title}>
                    <div className="flex items-center justify-between text-forest/60">
                      <Icon size={28} strokeWidth={1.5} />
                      <span className="font-mono text-xs">0{index + 1}</span>
                    </div>
                    <h3 className="mt-12 font-serif text-2xl leading-tight text-forest">{item.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-ink/62">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="site-section border-y border-forest/10 bg-[#edf1e9]" id="psb">
          <div className="site-container grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Penerimaan santri baru</p>
              <h2 className="mt-6 max-w-[13ch] font-serif text-[clamp(3rem,6vw,6.2rem)] leading-[.96] tracking-[-0.06em] text-forest">
                <span className="text-terracotta">{content.psb.academicYear}</span> {content.psb.title}
              </h2>
              <p className="mt-7 max-w-[42rem] text-lg leading-8 text-ink/65">{content.psb.description}</p>
              <dl className="mt-8 grid gap-4 border-y border-forest/18 py-6 sm:grid-cols-3">
                {[
                  ["Pendaftaran", content.psb.wave],
                  ["Seleksi", content.psb.schedule],
                  ["Konsultasi", "Langsung via WhatsApp"],
                ].map(([term, detail]) => (
                  <div key={term}>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-forest/55">{term}</dt>
                    <dd className="mt-2 text-sm font-semibold leading-5 text-forest">{detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link className="button-primary" href="/psb">Lihat informasi PSB <ArrowRight size={18} /></Link>
                <ArrowLink href={content.psb.registrationUrl}>Daftar sekarang</ArrowLink>
              </div>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem]">
              <Image alt="Santri Baladz dalam proses pembelajaran" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 46vw" src="/images/baladz/gallery-teacher.jpg" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest/75 to-transparent px-7 pb-7 pt-20 text-white">
                <p className="font-serif text-2xl">Konsultasikan program sebelum mendaftar.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section" id="produk">
          <div className="site-container">
            <SectionHeading
              eyebrow="Produk Baladz"
              title="Belajar lebih dekat lewat produk Baladz."
              description="Karya dan pembelajaran yang dirancang untuk mendampingi keluarga muslim, di rumah maupun di mana pun."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
              <article className="product-feature overflow-hidden rounded-[2rem] bg-[#e8ded0] p-7 sm:p-10">
                <div className="grid min-h-[34rem] items-center gap-8 sm:grid-cols-[.9fr_1.1fr]">
                  <div className="book-cover mx-auto flex aspect-[3/4] w-full max-w-[18rem] flex-col justify-between p-8 text-forest">
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em]">Baladz</p><p className="mt-10 font-serif text-5xl leading-[.88]">Adab<br />Harian</p></div>
                    <p className="text-sm leading-5">Kebiasaan kecil untuk akhlak besar.</p>
                  </div>
                  <div>
                    <p className="eyebrow">Produk unggulan</p>
                    <h3 className="mt-6 font-serif text-4xl text-forest">{content.products[0]?.name}</h3>
                    <p className="mt-2 text-2xl font-semibold text-terracotta">{content.products[0]?.price}</p>
                    <p className="mt-5 max-w-[28rem] leading-7 text-ink/65">{content.products[0]?.description}</p>
                    <Link className="button-primary mt-8" href={whatsappUrl} target="_blank"><MessageCircle size={18} /> Beli via WhatsApp</Link>
                  </div>
                </div>
              </article>
              <div className="grid gap-px overflow-hidden rounded-[2rem] border border-forest/12 bg-forest/12">
                {content.products.slice(1).map((product, index) => (
                  <article className="group grid grid-cols-[6rem_1fr] items-center gap-5 bg-cream p-5 sm:grid-cols-[8rem_1fr] sm:p-7" key={product.name}>
                    <div className={`product-art product-art-${index + 1} grid aspect-square place-items-center rounded-[1rem]`}>
                      <BookOpen className="text-forest" size={30} strokeWidth={1.4} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest/45">{product.kind}</p>
                      <h3 className="mt-2 font-serif text-2xl leading-tight text-forest">{product.name}</h3>
                      <p className="mt-1 font-semibold text-terracotta">{product.price}</p>
                      <p className="mt-2 text-sm leading-5 text-ink/60">{product.description}</p>
                      <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-terracotta" href={whatsappUrl} target="_blank">Detail <ArrowRight size={15} /></Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="site-section border-y border-forest/10 bg-[#f1efe8]" id="kabar">
          <div className="site-container">
            <SectionHeading eyebrow="Kabar & kajian" title="Cerita, kabar, dan ilmu yang terus dibagikan." description="Dari ruang kelas hingga tulisan penuh makna, kami membagikan kabar untuk menemani perjalanan belajar Al-Qur’an bersama Anda." />
            <div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
              <article>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem]">
                  <Image alt={content.news[0]?.title ?? "Kabar Baladz"} className="object-cover transition-transform duration-700 hover:scale-[1.025]" fill sizes="(max-width: 1024px) 100vw, 54vw" src={content.news[0]?.image ?? "/images/baladz/gallery-outdoor.jpg"} />
                </div>
                <p className="mt-6 text-sm text-ink/45">{content.news[0]?.date}</p>
                <h3 className="mt-2 max-w-[25ch] font-serif text-4xl leading-[1.08] tracking-[-0.035em] text-forest">{content.news[0]?.title}</h3>
                <p className="mt-4 max-w-[55ch] leading-7 text-ink/62">{content.news[0]?.excerpt}</p>
                <div className="mt-7"><ArrowLink href="#kontak">Lihat semua kabar</ArrowLink></div>
              </article>
              <div className="divide-y divide-forest/15 border-y border-forest/15">
                {content.studies.map((study) => (
                  <article className="group grid grid-cols-[7rem_1fr] gap-5 py-6 sm:grid-cols-[9rem_1fr]" key={study.title}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[.8rem]">
                      <Image alt={study.title} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="144px" src={study.image} />
                    </div>
                    <div>
                      <p className="text-xs text-ink/42">{study.date}</p>
                      <h3 className="mt-2 font-serif text-2xl leading-tight text-forest">{study.title}</h3>
                      <p className="mt-2 hidden text-sm leading-5 text-ink/58 sm:block">{study.excerpt}</p>
                    </div>
                  </article>
                ))}
                <div className="py-6"><ArrowLink href="#kontak">Baca semua kajian</ArrowLink></div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <SectionHeading eyebrow="Galeri" title="Keseharian yang membentuk pengalaman belajar." description="Setiap momen adalah bagian dari proses menuju generasi yang dekat dengan Al-Qur’an dan siap memberi manfaat." />
            <div className="gallery-grid mt-14">
              {content.gallery.map((item, index) => (
                <figure className={`gallery-item gallery-item-${index + 1} group`} key={item.caption}>
                  <Image alt={item.caption} className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" fill sizes="(max-width: 768px) 100vw, 45vw" src={item.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 font-serif text-xl text-white sm:p-7">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-forest py-20 sm:py-28" id="kontak">
          <div className="islamic-pattern-light pointer-events-none absolute -right-16 -top-24 size-[28rem] opacity-20" />
          <div className="site-container relative grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <div>
              <p className="eyebrow-light">Langkah baik dimulai hari ini</p>
              <h2 className="mt-6 max-w-[18ch] font-serif text-[clamp(3rem,6vw,6rem)] leading-[.96] tracking-[-0.055em] text-cream text-balance">Mari temukan program yang paling sesuai untuk buah hati.</h2>
              <p className="mt-6 max-w-[42rem] text-lg leading-8 text-white/66">Konsultasikan kebutuhan pendidikan Al-Qur’an putra-putri Anda. Tim Baladz siap membantu dengan jelas dan hangat.</p>
            </div>
            <div className="flex flex-col items-start gap-5 lg:items-stretch">
              <Link className="button-primary justify-between" href={whatsappUrl} target="_blank">Hubungi kami <ArrowRight size={18} /></Link>
              <Link className="button-light justify-between" href={content.psb.registrationUrl} target="_blank">Daftar santri <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-forest/10 bg-cream py-12">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.1fr_1fr] lg:gap-16">
            <div><BrandMark /><p className="mt-5 max-w-[20rem] text-sm leading-6 text-ink/58">Pendidikan Al-Qur’an untuk generasi berakhlak, berilmu, dan berdaya.</p></div>
            <nav aria-label="Navigasi footer" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-semibold text-forest sm:grid-cols-3">
              {navItems.slice(1, 6).map(([label, href]) => <Link className="hover:text-terracotta" href={href} key={href}>{label}</Link>)}
            </nav>
            <address className="not-italic text-sm leading-6 text-ink/62">
              <p>{content.settings.address}</p>
              <a className="mt-2 block hover:text-terracotta" href={`mailto:${content.settings.email}`}>{content.settings.email}</a>
              <a className="mt-1 block font-semibold text-forest hover:text-terracotta" href={whatsappUrl}>+{content.settings.whatsapp}</a>
              <div className="mt-5 flex gap-3">
                <a aria-label="Instagram Baladz" className="social-link" href={content.settings.instagram} target="_blank"><Camera size={18} /></a>
                <a aria-label="YouTube Baladz" className="social-link" href={content.settings.youtube} target="_blank"><Play size={18} /></a>
              </div>
            </address>
          </div>
          <div className="mt-10 flex flex-col gap-4 border-t border-forest/12 pt-6 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Baladz. Seluruh hak cipta dilindungi.</p>
            <div className="flex gap-5"><Link href="/kebijakan-privasi">Kebijakan privasi</Link><Link href="/syarat-ketentuan">Syarat & ketentuan</Link><Link href="/admin">Admin</Link></div>
          </div>
        </div>
      </footer>

      <a aria-label="Konsultasi melalui WhatsApp" className="floating-whatsapp" href={whatsappUrl} target="_blank">
        <MessageCircle size={22} /> <span className="hidden sm:inline">Tanya Baladz</span>
      </a>
    </div>
  );
}
