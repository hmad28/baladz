export interface ProgramItem {
  name: string;
  shortName: string;
  stage: string;
  description: string;
  image: string;
}

export interface ProductItem {
  name: string;
  price: string;
  description: string;
  kind: string;
}

export interface PublicationItem {
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface GalleryItem {
  caption: string;
  image: string;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  profile: {
    since: string;
    title: string;
    description: string;
  };
  psb: {
    academicYear: string;
    title: string;
    description: string;
    wave: string;
    schedule: string;
    requirements: string;
    feeNote: string;
    registrationUrl: string;
  };
  programs: ProgramItem[];
  products: ProductItem[];
  news: PublicationItem[];
  studies: PublicationItem[];
  gallery: GalleryItem[];
  settings: {
    whatsapp: string;
    email: string;
    address: string;
    instagram: string;
    youtube: string;
    seoTitle: string;
    seoDescription: string;
  };
}

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Pendidikan Al-Qur’an untuk kehidupan",
    title: "Tumbuh bersama Al-Qur’an.",
    description:
      "Pendidikan yang menumbuhkan iman, ilmu, dan kemandirian sejak usia dini.",
    primaryCta: "Lihat program pendidikan",
    secondaryCta: "Pendaftaran santri baru",
  },
  profile: {
    since: "Sejak 2018",
    title: "Pendidikan yang dekat dengan Al-Qur’an dan kehidupan.",
    description:
      "Baladz membangun fondasi generasi melalui pendidikan Al-Qur’an, akademik yang berkualitas, karakter yang luhur, dan kemandirian yang nyata.",
  },
  psb: {
    academicYear: "2027/2028",
    title: "Pendaftaran santri baru telah dibuka.",
    description:
      "Temukan jenjang yang sesuai dan konsultasikan kebutuhan pendidikan putra-putri Anda bersama tim Baladz.",
    wave: "Gelombang 1 · 1 Februari–15 Juni 2027",
    schedule: "Seleksi dan wawancara sesuai perjanjian",
    requirements: "Dokumen dasar dan kesiapan mengikuti program",
    feeNote: "Rincian biaya tersedia di halaman informasi PSB",
    registrationUrl: "https://wa.me/6281234598187",
  },
  programs: [
    {
      name: "Sekolah Sulaiman",
      shortName: "SD Tahfidz",
      stage: "Usia minimal 6 tahun",
      description:
        "Pendidikan dasar yang mengintegrasikan tahfidz, akademik, karakter, dan kemandirian.",
      image: "/images/baladz/gallery-class.jpg",
    },
    {
      name: "Listening Al-Qur’an",
      shortName: "PAUD LQ",
      stage: "Usia 3–4 tahun",
      description:
        "Mengenalkan Al-Qur’an sejak dini melalui pembiasaan mendengar yang menyenangkan.",
      image: "/images/baladz/gallery-outdoor.jpg",
    },
    {
      name: "Tumbuh dengan Qur’an",
      shortName: "TK Al-Qur’an",
      stage: "Usia 5–6 tahun",
      description:
        "Fondasi cinta Al-Qur’an melalui pembelajaran aktif, kreatif, dan berkarakter.",
      image: "/images/baladz/raw-LQ_1.jpg",
    },
    {
      name: "Tempat aman untuk tumbuh",
      shortName: "Daycare",
      stage: "Usia 4 bulan ke atas",
      description:
        "Pendampingan harian dengan lingkungan yang islami, aman, dan penuh kasih sayang.",
      image: "/images/baladz/gallery-class.jpg",
    },
    {
      name: "Pendalaman untuk kesungguhan",
      shortName: "Takhossus",
      stage: "Program khusus",
      description:
        "Program intensif untuk peserta didik yang ingin memperdalam tilawah dan hafalan.",
      image: "/images/baladz/gallery-quran.jpg",
    },
  ],
  products: [
    {
      name: "Buku Adab Harian",
      price: "Rp 89.000",
      description: "Panduan praktis membangun kebiasaan baik dalam keseharian.",
      kind: "Buku",
    },
    {
      name: "Modul Listening Al-Qur’an",
      price: "Rp 125.000",
      description: "Materi mendengar terarah untuk mendekatkan anak pada Al-Qur’an.",
      kind: "Modul",
    },
    {
      name: "Kartu Hafalan Juz 30",
      price: "Rp 69.000",
      description: "Kartu praktis untuk membantu hafalan surah pilihan.",
      kind: "Kartu belajar",
    },
    {
      name: "Kelas Parenting Qur’ani",
      price: "Rp 149.000",
      description: "Kelas untuk orang tua yang ingin tumbuh bersama anak.",
      kind: "Kelas",
    },
  ],
  news: [
    {
      title: "Belajar berbagi lewat kegiatan Jumat Berkah",
      excerpt:
        "Kegiatan sosial menjadi ruang bagi santri untuk menumbuhkan kepedulian dan menghadirkan ilmu bersama manfaat.",
      date: "12 Januari 2025",
      image: "/images/baladz/gallery-outdoor.jpg",
    },
    {
      title: "Munaqosah sanad dan tahfidz Baladz",
      excerpt: "Langkah penting dalam menjaga kualitas tilawah dan hafalan.",
      date: "6 Januari 2025",
      image: "/images/baladz/gallery-quran.jpg",
    },
    {
      title: "Ruang belajar baru untuk santri",
      excerpt: "Menyiapkan lingkungan yang lebih nyaman untuk proses belajar.",
      date: "28 Desember 2024",
      image: "/images/baladz/gallery-class.jpg",
    },
  ],
  studies: [
    {
      title: "Mendampingi anak mencintai Al-Qur’an",
      excerpt: "Cinta tumbuh dari teladan, kebiasaan kecil, dan lingkungan.",
      date: "8 Januari 2025",
      image: "/images/baladz/gallery-teacher.jpg",
    },
    {
      title: "Adab sebelum ilmu",
      excerpt: "Ilmu yang berkah berawal dari hati yang tertata.",
      date: "3 Januari 2025",
      image: "/images/baladz/about.jpg",
    },
    {
      title: "Rumah sebagai madrasah pertama",
      excerpt: "Peran orang tua dalam membentuk karakter dan kecintaan anak.",
      date: "28 Desember 2024",
      image: "/images/baladz/gallery-event.jpg",
    },
  ],
  gallery: [
    { caption: "Belajar Al-Qur’an bersama", image: "/images/baladz/gallery-quran.jpg" },
    { caption: "Bertumbuh dengan sehat dan gembira", image: "/images/baladz/gallery-outdoor.jpg" },
    { caption: "Didampingi dengan hati", image: "/images/baladz/gallery-teacher.jpg" },
    { caption: "Kreativitas dalam proses belajar", image: "/images/baladz/raw-PAUDQ-1.jpg" },
    { caption: "Orang tua bagian dari perjalanan", image: "/images/baladz/gallery-event.jpg" },
  ],
  settings: {
    whatsapp: "6281234598187",
    email: "baladilhuffaadz@gmail.com",
    address: "Jl. Jatihandap Raya No. 7, Jatihandap, Bandung",
    instagram: "https://www.instagram.com/baladilhuffaadz",
    youtube: "https://www.youtube.com/@baladilhuffaadz",
    seoTitle: "Baladz — Pendidikan Al-Qur’an untuk Kehidupan",
    seoDescription:
      "Informasi program pendidikan, pendaftaran santri baru, produk, kabar, dan kajian Baladz.",
  },
};
