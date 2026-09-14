"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  FileText,
  GalleryHorizontal,
  GraduationCap,
  Home,
  LayoutDashboard,
  Newspaper,
  Package,
  RotateCcw,
  Save,
  Settings,
} from "lucide-react";
import type {
  GalleryItem,
  ProductItem,
  ProgramItem,
  PublicationItem,
  SiteContent,
} from "@/content/site-content";
import { useSiteContent } from "./SiteContentProvider";

type AdminSection =
  | "dashboard"
  | "homepage"
  | "profile"
  | "programs"
  | "psb"
  | "news"
  | "studies"
  | "gallery"
  | "products"
  | "settings";

const groups: Array<{ label: string; items: Array<{ id: AdminSection; label: string; icon: typeof Home }> }> = [
  { label: "", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Konten", items: [{ id: "homepage", label: "Homepage", icon: Home }, { id: "profile", label: "Profil", icon: FileText }] },
  { label: "Pendidikan", items: [{ id: "programs", label: "Program", icon: GraduationCap }, { id: "psb", label: "PSB", icon: Boxes }] },
  { label: "Publikasi", items: [{ id: "news", label: "Kabar", icon: Newspaper }, { id: "studies", label: "Kajian", icon: BookOpen }, { id: "gallery", label: "Galeri", icon: GalleryHorizontal }] },
  { label: "", items: [{ id: "products", label: "Produk", icon: Package }, { id: "settings", label: "Pengaturan website", icon: Settings }] },
];

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {textarea ? (
        <textarea className="admin-textarea" onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className="admin-input" onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-forest/45">Editor konten</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-.035em] text-forest sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-[48rem] text-sm leading-6 text-ink/58">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function ItemCard({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <article className="rounded-[1rem] border border-forest/10 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-forest/10 pb-4">
        <span className="font-mono text-xs text-terracotta">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="font-semibold text-forest">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </article>
  );
}

export function AdminDashboard() {
  const { draft, setDraft, save, reset, savedAt } = useSiteContent();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [showSaved, setShowSaved] = useState(false);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft({ ...draft, [key]: value });
  }

  function handleSave() {
    save();
    setShowSaved(true);
    window.setTimeout(() => setShowSaved(false), 2200);
  }

  function updateProgram(index: number, value: ProgramItem) {
    const items = [...draft.programs];
    items[index] = value;
    update("programs", items);
  }

  function updateProduct(index: number, value: ProductItem) {
    const items = [...draft.products];
    items[index] = value;
    update("products", items);
  }

  function updatePublication(key: "news" | "studies", index: number, value: PublicationItem) {
    const items = [...draft[key]];
    items[index] = value;
    update(key, items);
  }

  function updateGallery(index: number, value: GalleryItem) {
    const items = [...draft.gallery];
    items[index] = value;
    update("gallery", items);
  }

  return (
    <div className="admin-shell lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-forest/10 bg-forest text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <Link className="font-serif text-2xl font-semibold" href="/">Baladz</Link>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[.65rem] font-bold uppercase tracking-[.14em] text-white/65">Admin</span>
        </div>
        <nav aria-label="Navigasi admin" className="flex gap-2 overflow-x-auto px-3 py-4 lg:block lg:h-[calc(100vh-72px)] lg:overflow-y-auto">
          {groups.map((group, groupIndex) => (
            <div className="shrink-0 lg:mb-6" key={`${group.label}-${groupIndex}`}>
              {group.label && <p className="mb-2 hidden px-3 text-[.62rem] font-bold uppercase tracking-[.18em] text-white/35 lg:block">{group.label}</p>}
              <div className="flex gap-1 lg:grid">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = section === item.id;
                  return (
                    <button className={`flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-left text-sm transition-colors ${active ? "bg-white text-forest" : "text-white/62 hover:bg-white/8 hover:text-white"}`} key={item.id} onClick={() => setSection(item.id)} type="button">
                      <Icon size={17} strokeWidth={1.7} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-4 border-b border-forest/10 bg-[#f0f1ed]/90 px-4 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-sm font-semibold text-forest">Baladz Content Studio</p>
            <p className="text-xs text-ink/40">Perubahan tersimpan di browser untuk demo ini.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link className="hidden min-h-10 items-center gap-2 rounded-lg border border-forest/15 px-3 text-xs font-semibold text-forest hover:bg-white sm:inline-flex" href="/">Lihat website <ChevronRight size={15} /></Link>
            <button className="grid size-10 place-items-center rounded-lg border border-forest/15 text-forest hover:bg-white" onClick={reset} title="Kembalikan konten awal" type="button"><RotateCcw size={17} /></button>
            <button className="button-primary min-h-10 py-2" onClick={handleSave} type="button">{showSaved ? <Check size={16} /> : <Save size={16} />} {showSaved ? "Tersimpan" : "Simpan"}</button>
          </div>
        </header>

        <div className="mx-auto max-w-[74rem] px-4 py-8 sm:px-8 sm:py-12">
          {section === "dashboard" && (
            <section>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-forest/45">Ringkasan</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-.04em] text-forest">Selamat datang.</h1>
              <p className="mt-3 text-sm text-ink/55">Semua bagian penting website ada di satu tempat.</p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Program aktif", draft.programs.length, GraduationCap],
                  ["Produk", draft.products.length, Package],
                  ["Kabar & kajian", draft.news.length + draft.studies.length, Newspaper],
                  ["Foto galeri", draft.gallery.length, GalleryHorizontal],
                ].map(([label, value, Icon]) => {
                  const DashboardIcon = Icon as typeof Home;
                  return (
                    <article className="rounded-[1rem] bg-white p-5 shadow-[0_12px_34px_rgb(22_60_50_/_6%)]" key={String(label)}>
                      <DashboardIcon className="text-terracotta" size={22} strokeWidth={1.6} />
                      <p className="mt-8 font-serif text-4xl font-semibold text-forest">{String(value)}</p>
                      <p className="mt-1 text-sm text-ink/48">{String(label)}</p>
                    </article>
                  );
                })}
              </div>
              <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
                <article className="rounded-[1rem] bg-white p-6">
                  <h2 className="font-semibold text-forest">Jalur edit cepat</h2>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {["homepage", "programs", "psb", "products"].map((id) => {
                      const item = groups.flatMap((group) => group.items).find((entry) => entry.id === id);
                      if (!item) return null;
                      return <button className="flex items-center justify-between rounded-lg bg-sage/55 px-4 py-3 text-left text-sm font-semibold text-forest hover:bg-sage" key={id} onClick={() => setSection(id as AdminSection)} type="button">{item.label}<ChevronRight size={16} /></button>;
                    })}
                  </div>
                </article>
                <article className="rounded-[1rem] bg-forest p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-white/45">Status konten</p>
                  <p className="mt-6 font-serif text-3xl">Siap dipublikasikan</p>
                  <p className="mt-3 text-sm leading-6 text-white/58">{savedAt ? `Terakhir disimpan pukul ${savedAt}.` : "Belum ada perubahan pada sesi ini."}</p>
                </article>
              </div>
            </section>
          )}

          {section === "homepage" && (
            <Panel title="Homepage" description="Atur pesan pertama yang dilihat orang tua dan arahkan mereka ke program atau pendaftaran.">
              <div className="grid gap-5 rounded-[1rem] bg-white p-5 sm:grid-cols-2 sm:p-7">
                <Field label="Label di atas judul" value={draft.hero.eyebrow} onChange={(value) => update("hero", { ...draft.hero, eyebrow: value })} />
                <Field label="Judul hero" value={draft.hero.title} onChange={(value) => update("hero", { ...draft.hero, title: value })} />
                <div className="sm:col-span-2"><Field label="Penjelasan singkat" textarea value={draft.hero.description} onChange={(value) => update("hero", { ...draft.hero, description: value })} /></div>
                <Field label="CTA utama" value={draft.hero.primaryCta} onChange={(value) => update("hero", { ...draft.hero, primaryCta: value })} />
                <Field label="CTA sekunder" value={draft.hero.secondaryCta} onChange={(value) => update("hero", { ...draft.hero, secondaryCta: value })} />
              </div>
            </Panel>
          )}

          {section === "profile" && (
            <Panel title="Profil Baladz" description="Konten ringkas yang membangun kepercayaan sebelum pengunjung melihat program.">
              <div className="grid gap-5 rounded-[1rem] bg-white p-5 sm:p-7">
                <Field label="Penanda tahun" value={draft.profile.since} onChange={(value) => update("profile", { ...draft.profile, since: value })} />
                <Field label="Judul profil" value={draft.profile.title} onChange={(value) => update("profile", { ...draft.profile, title: value })} />
                <Field label="Deskripsi" textarea value={draft.profile.description} onChange={(value) => update("profile", { ...draft.profile, description: value })} />
              </div>
            </Panel>
          )}

          {section === "programs" && (
            <Panel title="Program pendidikan" description="Edit nama, tahap usia, deskripsi, dan foto setiap program.">
              <div className="grid gap-4">
                {draft.programs.map((program, index) => (
                  <ItemCard index={index} key={`${program.shortName}-${index}`} title={program.shortName}>
                    <Field label="Nama pendek" value={program.shortName} onChange={(value) => updateProgram(index, { ...program, shortName: value })} />
                    <Field label="Nama program" value={program.name} onChange={(value) => updateProgram(index, { ...program, name: value })} />
                    <Field label="Tahap / usia" value={program.stage} onChange={(value) => updateProgram(index, { ...program, stage: value })} />
                    <Field label="Path gambar" value={program.image} onChange={(value) => updateProgram(index, { ...program, image: value })} />
                    <div className="sm:col-span-2"><Field label="Deskripsi" textarea value={program.description} onChange={(value) => updateProgram(index, { ...program, description: value })} /></div>
                  </ItemCard>
                ))}
              </div>
            </Panel>
          )}

          {section === "psb" && (
            <Panel title="Pendaftaran santri baru" description="Satu sumber informasi untuk tahun ajaran, jadwal, syarat, biaya, dan tautan daftar.">
              <div className="grid gap-5 rounded-[1rem] bg-white p-5 sm:grid-cols-2 sm:p-7">
                <Field label="Tahun ajaran" value={draft.psb.academicYear} onChange={(value) => update("psb", { ...draft.psb, academicYear: value })} />
                <Field label="Judul" value={draft.psb.title} onChange={(value) => update("psb", { ...draft.psb, title: value })} />
                <div className="sm:col-span-2"><Field label="Deskripsi" textarea value={draft.psb.description} onChange={(value) => update("psb", { ...draft.psb, description: value })} /></div>
                <Field label="Gelombang / jadwal" value={draft.psb.wave} onChange={(value) => update("psb", { ...draft.psb, wave: value })} />
                <Field label="Jadwal seleksi" value={draft.psb.schedule} onChange={(value) => update("psb", { ...draft.psb, schedule: value })} />
                <Field label="Persyaratan" value={draft.psb.requirements} onChange={(value) => update("psb", { ...draft.psb, requirements: value })} />
                <Field label="Catatan biaya" value={draft.psb.feeNote} onChange={(value) => update("psb", { ...draft.psb, feeNote: value })} />
                <div className="sm:col-span-2"><Field label="Link pendaftaran" value={draft.psb.registrationUrl} onChange={(value) => update("psb", { ...draft.psb, registrationUrl: value })} /></div>
              </div>
            </Panel>
          )}

          {(section === "news" || section === "studies") && (
            <Panel title={section === "news" ? "Kabar" : "Kajian"} description="Perbarui judul, tanggal, ringkasan, dan gambar publikasi.">
              <div className="grid gap-4">
                {draft[section].map((item, index) => (
                  <ItemCard index={index} key={`${item.title}-${index}`} title={item.title}>
                    <Field label="Judul" value={item.title} onChange={(value) => updatePublication(section, index, { ...item, title: value })} />
                    <Field label="Tanggal" value={item.date} onChange={(value) => updatePublication(section, index, { ...item, date: value })} />
                    <Field label="Path gambar" value={item.image} onChange={(value) => updatePublication(section, index, { ...item, image: value })} />
                    <div className="sm:col-span-2"><Field label="Ringkasan" textarea value={item.excerpt} onChange={(value) => updatePublication(section, index, { ...item, excerpt: value })} /></div>
                  </ItemCard>
                ))}
              </div>
            </Panel>
          )}

          {section === "gallery" && (
            <Panel title="Galeri" description="Atur foto kegiatan dan caption singkatnya.">
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.gallery.map((item, index) => (
                  <ItemCard index={index} key={`${item.caption}-${index}`} title={item.caption}>
                    <div className="sm:col-span-2"><Field label="Caption" value={item.caption} onChange={(value) => updateGallery(index, { ...item, caption: value })} /></div>
                    <div className="sm:col-span-2"><Field label="Path gambar" value={item.image} onChange={(value) => updateGallery(index, { ...item, image: value })} /></div>
                  </ItemCard>
                ))}
              </div>
            </Panel>
          )}

          {section === "products" && (
            <Panel title="Produk" description="Kelola katalog sederhana untuk checkout langsung melalui WhatsApp.">
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.products.map((product, index) => (
                  <ItemCard index={index} key={`${product.name}-${index}`} title={product.name}>
                    <Field label="Nama produk" value={product.name} onChange={(value) => updateProduct(index, { ...product, name: value })} />
                    <Field label="Jenis" value={product.kind} onChange={(value) => updateProduct(index, { ...product, kind: value })} />
                    <Field label="Harga" value={product.price} onChange={(value) => updateProduct(index, { ...product, price: value })} />
                    <div className="sm:col-span-2"><Field label="Deskripsi" textarea value={product.description} onChange={(value) => updateProduct(index, { ...product, description: value })} /></div>
                  </ItemCard>
                ))}
              </div>
            </Panel>
          )}

          {section === "settings" && (
            <Panel title="Pengaturan website" description="Kontak dan SEO bersifat global: ubah sekali, seluruh website ikut berubah.">
              <div className="grid gap-5 rounded-[1rem] bg-white p-5 sm:grid-cols-2 sm:p-7">
                <Field label="Nomor WhatsApp" value={draft.settings.whatsapp} onChange={(value) => update("settings", { ...draft.settings, whatsapp: value })} />
                <Field label="Email" value={draft.settings.email} onChange={(value) => update("settings", { ...draft.settings, email: value })} />
                <div className="sm:col-span-2"><Field label="Alamat" value={draft.settings.address} onChange={(value) => update("settings", { ...draft.settings, address: value })} /></div>
                <Field label="Instagram" value={draft.settings.instagram} onChange={(value) => update("settings", { ...draft.settings, instagram: value })} />
                <Field label="YouTube" value={draft.settings.youtube} onChange={(value) => update("settings", { ...draft.settings, youtube: value })} />
                <div className="sm:col-span-2"><Field label="SEO title" value={draft.settings.seoTitle} onChange={(value) => update("settings", { ...draft.settings, seoTitle: value })} /></div>
                <div className="sm:col-span-2"><Field label="SEO description" textarea value={draft.settings.seoDescription} onChange={(value) => update("settings", { ...draft.settings, seoDescription: value })} /></div>
              </div>
            </Panel>
          )}
        </div>
      </main>
    </div>
  );
}
