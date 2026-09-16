/**
 * DATA KONTEN RESMI WEBSITE BALADZ
 * 
 * PANDUAN UPDATE KONTEN:
 * Konten publik dikelola melalui dashboard. Catatan sumber disimpan bersama
 * data penting agar staf dapat memeriksa asal dan status verifikasinya.
 * langsung di file ini tanpa perlu mengubah kode komponen lainnya.
 * 
 * Cukup simpan file ini, maka website akan otomatis terupdate.
 */

export interface KomponenBiayaProgram {
  nama: string;
  nominal: number;
  nominalMaksimal?: number;
  satuan?: string;
}

export interface PaketBiayaProgram {
  nama: string;
  komponen: KomponenBiayaProgram[];
}

export interface JenjangPendidikan {
  id: string;
  nama: string;
  tingkat: string;
  rentangUsia: string;
  deskripsi: string;
  ijazah: string;
  uangPangkal: number;
  sppBulanan: number;
  sppBulananMaksimal?: number;
  biayaBoarding?: number;
  keunggulan: string[];
  gambar: string;
  isBoardingTersedia: boolean;
  kategori?: "jenjang" | "kelas";
  jadwal?: string[];
  opsiBiaya?: { label: string; nominal: number }[];
  paketBiaya?: PaketBiayaProgram[];
  hargaTerverifikasi?: boolean;
  sumber?: string;
}

export interface BeritaKabar {
  id: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string[];
  tanggal: string;
  kategori: string;
  gambar: string;
  penulis: string;
}

export interface AlurPsbStep {
  nomor: number;
  judul: string;
  keterangan: string;
}

export interface GelombangPsb {
  nama: string;
  pendaftaranBerkas: string;
  seleksi: string;
  pengumuman: string;
  pelunasan: string;
}

export interface PopupSettings {
  aktif: boolean;
  modeTampilan?: "gambar_saja" | "gambar_teks";
  gambarPoster: string;
  judul?: string;
  subjudul?: string;
  teksCta?: string;
  nomorWaCta?: string;
  pesanWaCta?: string;
  linkCta?: string;
  teksTutup?: string;
}

export function resolvePopupCtaUrl(popup?: PopupSettings, defaultWa: string = "081234598187"): string {
  if (!popup) return `https://wa.me/62${defaultWa.replace(/^0/, "")}`;
  const rawWa = defaultWa;
  const cleanWa = rawWa.replace(/[^0-9]/g, "");
  const formattedWa = cleanWa.startsWith("0") ? "62" + cleanWa.slice(1) : cleanWa;
  const pesan = popup.pesanWaCta || "Assalamu'alaikum Panitia PSB Baladz, saya ingin menanyakan informasi pendaftaran santri baru.";
  return `https://wa.me/${formattedWa}?text=${encodeURIComponent(pesan)}`;
}

export interface BaladzSiteContent {
  contentVersion: number;
  sourceNotes: Record<string, string>;
  // 1. Info Profil Lembaga & Pengumuman Utama
  lembaga: {
    nama: string;
    tagline: string;
    yayasan: string;
    deskripsi: string;
    poinKeunggulan: string[];
    lokasiKbm: {
      nama: string;
      alamat: string;
      status: string;
      foto?: string;
      dapatDikunjungi: boolean;
      sumber: string;
    }[];
  };

  // 2. Info Pendaftaran Santri Baru (PSB)
  psb: {
    tahunAjaran: string;
    statusPendaftaran: "Buka" | "Tutup";
    tanggalBuka: string;
    tanggalTutup: string;
    kuotaSantri: number;
    biayaPendaftaran: number;
    batasDaftarUlang: string;
    jadwalTerverifikasi: boolean;
    catatanKonfirmasi: string;
    cakupanJenjang: string;
    gelombang: GelombangPsb[];
    pertemuanOrangTua: string;
    alurPendaftaran: AlurPsbStep[];
    syaratBerkas: string[];
    materiSeleksi: string[];
    rekeningPembayaran: {
      bank: string;
      nomorRekening: string;
      atasNama: string;
      catatanTransfer: string;
    };
  };

  // 3. Produk / Jenjang Pendidikan
  jenjang: JenjangPendidikan[];

  // 4. Kabar Baladz (Warta & Update Lembaga)
  kabar: BeritaKabar[];

  // 5. Kontak & Media Sosial Resmi
  kontak: {
    telepon: string;
    whatsappUtama: string;
    whatsappKedua: string;
    email: string;
    alamatLengkap: string;
    googleMapsUrl: string;
    sosialMedia: {
      instagram: string;
      tiktok: string;
      youtube: string;
      twitter: string;
    };
  };

  cta: {
    teksDaftar: string;
    teksWhatsapp: string;
    pesanWhatsapp: string;
    teksKunjungan: string;
    pesanKunjungan: string;
  };

  // 7. Pengaturan Popup Pengumuman (Muncul di 3 Halaman)
  popup: PopupSettings;
}

export const defaultSiteContent: BaladzSiteContent = {
  contentVersion: 8,
  sourceNotes: {
    profil: "Rujukan: baladz.net, diperiksa 15 September 2026.",
    lokasi: "Rujukan: baladz.net. Alamat rinci dan foto kunjungan menunggu verifikasi tim Baladz.",
    program: "PAUD/TK/SD/SMP: flyer terbaru dan konfirmasi tim Baladz 16 September 2026.",
    psb: "Timeline dan penerapan untuk semua jenjang dikonfirmasi langsung oleh tim Baladz pada 16 September 2026. Kuota dan rincian berkas tetap mengikuti informasi lanjutan.",
    kontak: "Nomor dan rekening terbaru diberikan langsung oleh tim Baladz.",
  },
  lembaga: {
    nama: "Baladil Huffaadz (Baladz)",
    tagline: "Pendidikan Al-Qur’an Bersanad untuk Generasi Qur'ani",
    yayasan: "Yayasan Baladz Cerdas Mulia",
    deskripsi:
      "Baladil Huffaadz (Baladz) adalah lembaga pendidikan Islam berfokus pada kurikulum Al-Qur'an (tilawah bersanad 30 Juz dan hafalan), adab islami, serta akademik berkualitas yang bermanhaj ahlussunnah wal jama'ah di Bandung.",
    poinKeunggulan: [
      "Kurikulum berbasis Al-Qur’an dengan tilawah bersanad 30 Juz dan mutqin menghafalkannya.",
      "Lulusan PAUD & TK mendapatkan Ijazah Resmi Baladz.",
      "Lulusan SD Tahfidz mendapatkan Ijazah Resmi Baladz sekaligus Ijazah Resmi Negara.",
      "Seluruh Asatidzah pembimbing telah menyelesaikan Tilawah Bersanad 30 Juz.",
      "Pembinaan adab, karakter mulia, dan kemandirian santri sejak usia dini.",
    ],
    lokasiKbm: [
      {
        nama: "Ma’had Baladz Jatihandap",
        alamat: "Jatihandap, Bandung",
        status: "Gedung 2 lantai di atas lahan 300m²",
        foto: "/images/baladz/gallery-class.jpg",
        dapatDikunjungi: true,
        sumber: "baladz.net; alamat rinci perlu konfirmasi tim Baladz",
      },
      {
        nama: "Ma’had Baladz Pasirlayung Barat",
        alamat: "Pasirlayung Barat, Bandung",
        status: "Gedung 2 lantai di atas lahan 200m²",
        foto: "/images/baladz/about.jpg",
        dapatDikunjungi: true,
        sumber: "baladz.net; alamat rinci perlu konfirmasi tim Baladz",
      },
      {
        nama: "Ma’had Baladz Permanen (Cipaheut)",
        alamat: "Cipaheut, Cimenyan, Bandung",
        status: "Masih dalam proses pembangunan",
        dapatDikunjungi: false,
        sumber: "baladz.net; detail pembangunan dan kunjungan perlu konfirmasi tim Baladz",
      },
    ],
  },

  psb: {
    tahunAjaran: "2026/2027",
    statusPendaftaran: "Tutup",
    tanggalBuka: "10 September 2026",
    tanggalTutup: "31 Maret 2027",
    kuotaSantri: 0,
    biayaPendaftaran: 0,
    batasDaftarUlang: "10 Mei 2027",
    jadwalTerverifikasi: true,
    catatanKonfirmasi: "Tahun timeline dan penerapan untuk semua jenjang dikonfirmasi tim Baladz pada 16 September 2026.",
    cakupanJenjang: "Semua jenjang",
    gelombang: [
      { nama: "Gelombang 1", pendaftaranBerkas: "10 September–30 November 2026", seleksi: "7 Desember 2026 · seleksi via video call", pengumuman: "14 Desember 2026", pelunasan: "20 Januari 2027" },
      { nama: "Gelombang 2", pendaftaranBerkas: "21 Januari–31 Maret 2027", seleksi: "3 April 2027 · seleksi via video call", pengumuman: "10 April 2027", pelunasan: "10 Mei 2027" },
    ],
    pertemuanOrangTua: "20 Juni 2027 · pertemuan orang tua dan pemberkasan",
    alurPendaftaran: [
      {
        nomor: 1,
        judul: "Isi Formulir Pendaftaran Online",
        keterangan: "Lengkapi data calon santri dan orang tua secara online melalui website ini atau WhatsApp panitia PSB.",
      },
      {
        nomor: 2,
        judul: "Kirim Berkas dan Bukti Transfer",
        keterangan: "Kirim berkas dan bukti transfer ke WhatsApp resmi. Tim Baladz akan memeriksanya secara manual.",
      },
      {
        nomor: 3,
        judul: "Melengkapi Berkas Persyaratan",
        keterangan: "Kirim pas foto background merah, scan Akta Kelahiran, Kartu Keluarga, dan piagam hafalan (bila ada).",
      },
      {
        nomor: 4,
        judul: "Seleksi via Video Call",
        keterangan: "Ikuti seleksi via video call sesuai jadwal gelombang. Jadwal berlaku untuk semua jenjang.",
      },
      {
        nomor: 5,
        judul: "Pengumuman & Daftar Ulang",
        keterangan: "Santri yang dinyatakan lulus menyelesaikan biaya daftar ulang sebelum batas waktu yang ditentukan.",
      },
    ],
    syaratBerkas: [
      "Daftar berkas per jenjang menunggu konfirmasi final tim Baladz.",
    ],
    materiSeleksi: [
      "Seleksi dilakukan melalui video call sesuai jadwal gelombang.",
      "Materi seleksi masih menunggu konfirmasi final tim Baladz.",
    ],
    rekeningPembayaran: {
      bank: "Rekening Resmi Yayasan",
      nomorRekening: "3888822339",
      atasNama: "Baladz Cerdas Mulia",
      catatanTransfer: "Kirim bukti transfer ke WhatsApp 081234598187 untuk verifikasi manual tim Baladz.",
    },
  },

  jenjang: [
    {
      id: "paud-lq",
      nama: "PAUD Listening Al-Qur'an (LQ)",
      tingkat: "Pendidikan Anak Usia Dini",
      rentangUsia: "Usia 4–5 Tahun",
      deskripsi:
        "Program non-asrama ramah anak yang menitikberatkan pada pembiasaan mendengarkan lantunan Al-Qur'an, adab islami harian, dan motorik anak sejak dini.",
      ijazah: "Ijazah Resmi Baladz",
      uangPangkal: 7500000,
      sppBulanan: 250000,
      sppBulananMaksimal: 380000,
      keunggulan: [
        "Metode Listening Al-Qur'an terpadu",
        "Pembiasaan adab dan doa sehari-hari",
        "Kelas interaktif non-asrama yang nyaman",
        "Pendampingan Asatidzah penuh kasih sayang",
      ],
      gambar: "/images/baladz/raw-PAUDQ-1.jpg",
      isBoardingTersedia: false,
      kategori: "jenjang",
      paketBiaya: [
        {
          nama: "Program PAUD",
          komponen: [
            { nama: "Pendaftaran", nominal: 150000 },
            { nama: "Infak Uang Pangkal", nominal: 7500000 },
            { nama: "SPP PAUD", nominal: 250000, nominalMaksimal: 380000, satuan: "per bulan" },
          ],
        },
      ],
      hargaTerverifikasi: true,
      sumber: "Biaya dikonfirmasi langsung oleh tim Baladz pada 16 September 2026. SPP PAUD ditampilkan sebagai rentang Rp250.000–Rp380.000 per bulan.",
    },
    {
      id: "tk-alquran",
      nama: "Taman Kanak-Kanak (TK) Al-Qur'an",
      tingkat: "Taman Kanak-Kanak Islam",
      rentangUsia: "Usia 5–6 Tahun",
      deskripsi:
        "Program non-asrama kelanjutan untuk melatih kemampuan membaca Al-Qur'an bertahap, tahfidz Juz 30, serta kesiapan mental dan adab menuju sekolah dasar.",
      ijazah: "Ijazah Resmi Baladz",
      uangPangkal: 7500000,
      sppBulanan: 380000,
      keunggulan: [
        "Pengenalan tilawah makhraj yang benar",
        "Hafalan surat-surat pendek Juz 30",
        "Pondasi adab islami dan kemandirian",
        "Transisi optimal menuju jenjang SD Tahfidz",
      ],
      gambar: "/images/baladz/raw-LQ_1.jpg",
      isBoardingTersedia: false,
      kategori: "jenjang",
      paketBiaya: [
        {
          nama: "Program TK",
          komponen: [
            { nama: "Pendaftaran", nominal: 150000 },
            { nama: "Infak Uang Pangkal", nominal: 7500000 },
            { nama: "Syahriyah/SPP Bulanan", nominal: 380000, satuan: "per bulan" },
          ],
        },
      ],
      hargaTerverifikasi: true,
      sumber: "Flyer TK TA 2026/2027, kolom Juni 2026. Angka diminta tetap digunakan oleh tim Baladz pada 16 September 2026; jangan diberi label biaya TA 2027/2028.",
    },
    {
      id: "sd-tahfidz",
      nama: "SDTahfidz (Sekolah Sulaiman Homeschooling)",
      tingkat: "Sekolah Dasar Qur'ani",
      rentangUsia: "Usia Minimal 6 Tahun",
      deskripsi:
        "Program pendidikan dasar unggulan yang memadukan tahfidz intensif bersanad dengan kurikulum akademik nasional. Tersedia fasilitas asrama (boarding).",
      ijazah: "Ijazah Baladz & Ijazah Negara Resmi",
      uangPangkal: 19000000,
      sppBulanan: 980000,
      biayaBoarding: 1380000,
      keunggulan: [
        "Mendapatkan 2 Ijazah (Baladz & Ijazah Negara)",
        "Tilawah bersanad 30 Juz dibimbing asatidzah berkompeten",
        "Fasilitas asrama (boarding) aman dan terkontrol",
        "Kurikulum akademik kurikulum nasional terintegrasi",
      ],
      gambar: "/images/baladz/gallery-class.jpg",
      isBoardingTersedia: true,
      kategori: "jenjang",
      paketBiaya: [
        {
          nama: "Fullday",
          komponen: [
            { nama: "Pendaftaran", nominal: 350000 },
            { nama: "Infak Program", nominal: 19000000 },
            { nama: "SPP", nominal: 980000, satuan: "per bulan" },
            { nama: "Ekskul/Outing", nominal: 2900000 },
          ],
        },
        {
          nama: "Boarding",
          komponen: [
            { nama: "Pendaftaran", nominal: 350000 },
            { nama: "Infak Program", nominal: 19800000 },
            { nama: "SPP", nominal: 1380000, satuan: "per bulan" },
            { nama: "Ekskul/Outing", nominal: 3700000 },
          ],
        },
      ],
      hargaTerverifikasi: true,
      sumber: "Flyer SDTahfidz TA 2026/2027 dan instruksi tim Baladz 16 September 2026. Tampilkan tanpa klaim bahwa angka ini khusus TA 2027/2028.",
    },
    {
      id: "smp-alquran",
      nama: "SMP Al-Qur’an",
      tingkat: "Sekolah Menengah Qur’ani",
      rentangUsia: "Lulusan SD / sederajat",
      deskripsi: "Program lanjutan yang memadukan target hafalan, bahasa, hadis, dan pembinaan akhlak dalam lingkungan Ma’had Baladz.",
      ijazah: "Menunggu konfirmasi tim Baladz",
      uangPangkal: 17000000,
      sppBulanan: 977000,
      biayaBoarding: 1770000,
      keunggulan: [
        "Target hafalan 30 juz mutqin",
        "Hadis Arba’in dan 100 hadis umum",
        "Bahasa Arab dan Inggris intensif",
        "Pembinaan akhlakul karimah",
      ],
      gambar: "/images/baladz/gallery-quran.jpg",
      isBoardingTersedia: true,
      kategori: "jenjang",
      paketBiaya: [
        {
          nama: "Reguler",
          komponen: [
            { nama: "Pendaftaran", nominal: 300000 },
            { nama: "Infak Uang Pangkal", nominal: 17000000 },
            { nama: "SPP", nominal: 977000, satuan: "per bulan" },
            { nama: "Ekskul/Outing", nominal: 1900000, satuan: "per semester" },
          ],
        },
        {
          nama: "Boarding",
          komponen: [
            { nama: "Pendaftaran", nominal: 300000 },
            { nama: "Infak Uang Pangkal", nominal: 17000000 },
            { nama: "SPP", nominal: 1770000, satuan: "per bulan" },
            { nama: "Ekskul/Outing", nominal: 1900000, satuan: "per semester" },
          ],
        },
      ],
      hargaTerverifikasi: true,
      sumber: "Flyer SMP dan instruksi final tim Baladz 16 September 2026. Gunakan uang pangkal Rp17.000.000 dan abaikan promo pada flyer.",
    },
    {
      id: "kelas-reguler",
      nama: "Kelas Al-Qur’an Reguler",
      tingkat: "Kelas Al-Qur’an",
      rentangUsia: "Terbuka untuk umum",
      deskripsi: "Belajar Al-Qur’an terjadwal di Ma’had Baladz dengan pilihan waktu siang, sore, atau malam.",
      ijazah: "Program pembelajaran nonjenjang",
      uangPangkal: 0,
      sppBulanan: 250000,
      jadwal: [
        "Senin–Rabu · 13.00–14.30",
        "Senin–Rabu · 16.00–17.30",
        "Senin–Rabu · 18.00–20.00",
        "Rabu–Jumat · 13.00–14.30",
        "Rabu–Jumat · 16.00–17.30",
      ],
      keunggulan: ["Pilihan jadwal fleksibel", "Belajar langsung di Ma’had Baladz"],
      gambar: "/images/baladz/gallery-teacher.jpg",
      isBoardingTersedia: false,
      kategori: "kelas",
      hargaTerverifikasi: true,
      sumber: "Catatan meeting tim Baladz.",
    },
    {
      id: "kelas-privat",
      nama: "Kelas Al-Qur’an Privat",
      tingkat: "Kelas Al-Qur’an",
      rentangUsia: "Terbuka untuk umum",
      deskripsi: "Empat pertemuan setiap bulan, masing-masing 90 menit, dengan pilihan belajar di Baladz atau di rumah.",
      ijazah: "Program pembelajaran nonjenjang",
      uangPangkal: 0,
      sppBulanan: 350000,
      opsiBiaya: [
        { label: "Belajar di Baladz", nominal: 350000 },
        { label: "Pengajar ke rumah", nominal: 450000 },
      ],
      keunggulan: ["4 pertemuan per bulan", "Durasi 90 menit per pertemuan"],
      gambar: "/images/baladz/gallery-class.jpg",
      isBoardingTersedia: false,
      kategori: "kelas",
      hargaTerverifikasi: true,
      sumber: "Catatan meeting tim Baladz.",
    },
  ],

  kabar: [
    {
      id: "wakaf-cipaheut",
      judul: "Baladz Menerima Wakaf Lahan 600m² dan Siap untuk Dibangun Pesantren",
      ringkasan:
        "Alhamdulillaah, Baladz menerima wakaf lahan seluas 600m² di Cipaheut, Cimenyan, Bandung. Lokasi ini diproyeksikan menjadi Pesantren Baladil Huffaadz modern.",
      isiLengkap: [
        "Alhamdulillaah, atas pertolongan Allah Ta'ala, Baladz menerima amanah wakaf lahan dengan luas 600m² di kawasan Cipaheut, Cimenyan, Kabupaten Bandung, berjarak sekitar 3 km dari Ma’had Baladz 1.",
        "Saat ini lahan telah dibersihkan dan bedeng kerja untuk para tukang telah didirikan. Di sekeliling lahan tersebut terdapat potensi pembebasan lebih dari 7.000m² dari para aghniya dan dermawan untuk perluasan kawasan.",
        "Di lokasi perbukitan yang asri inilah direncanakan berdiri kompleks Pesantren Baladil Huffaadz: bayt Al-Qur'an dengan fasilitas modern, suasana belajar tenang, dan berpegang teguh pada manhaj Ahlussunnah wal Jama'ah.",
        "Bagi muhsinin atau orang tua yang ingin silaturahmi dan meninjau lokasi rencana pembangunan, silakan menghubungi WhatsApp resmi Baladz.",
      ],
      tanggal: "14 September 2026",
      kategori: "Pembangunan & Wakaf",
      gambar: "/images/baladz/gallery-outdoor.jpg",
      penulis: "Humas Baladz",
    },
    {
      id: "kegiatan-kbm-tasmi",
      judul: "Monitoring KBM Tilawah Bersanad dan Tasmi' Hafalan Santri Baladz",
      ringkasan:
        "Evaluasi rutin KBM Al-Qur'an bersama asatidzah bersanad untuk menjaga ketelitian makhraj dan mutqin hafalan santri.",
      isiLengkap: [
        "Kegiatan Belajar Mengajar (KBM) di Baladz dilaksanakan dengan pendampingan intensif. Setiap santri menyetorkan bacaan tilawah langsung kepada asatidzah yang telah mengantongi sanad 30 Juz.",
        "Dengan rasio santri dan asatidzah yang proporsional, setiap perkembangan tajwid, makhraj, dan hafalan santri terpantau secara personal.",
        "Program tasmi' berkala juga diadakan agar santri terbiasa melantunkan ayat suci dengan tenang, tartil, dan penuh adab kecintaan kepada Al-Qur'an.",
      ],
      tanggal: "8 September 2026",
      kategori: "Kegiatan Akademik",
      gambar: "/images/baladz/gallery-quran.jpg",
      penulis: "Tim Asatidzah",
    },
    {
      id: "fasilitas-kbm-permanen",
      judul: "Pengembangan Sarana KBM 1 Jatihandap & KBM 2 Pasirlayung",
      ringkasan:
        "Penyempurnaan sarana ruang kelas 2 lantai di dua lokasi representatif Bandung untuk kenyamanan belajar santri.",
      isiLengkap: [
        "Untuk memastikan proses belajar mengajar tetap kondusif, Yayasan terus melakukan pemeliharaan sarana di KBM 1 Jatihandap (300m²) dan KBM 2 Pasirlayung Barat (200m²).",
        "Fasilitas meliputi ruang kelas ber-AC, perpustakaan Al-Qur'an, ruang halaqah tahfidz, serta area bermain ramah anak untuk santri PAUD dan TK.",
      ],
      tanggal: "28 Agustus 2026",
      kategori: "Sarana & Prasarana",
      gambar: "/images/baladz/about.jpg",
      penulis: "Pengurus Yayasan",
    },
  ],

  kontak: {
    telepon: "081234598187",
    whatsappUtama: "081234598187",
    whatsappKedua: "081234598187",
    email: "baladilhuffaadz@gmail.com",
    alamatLengkap: "Yayasan Baladz Cerdas Mulia, Jl. Pasirlayung Barat No. 44, Padasuka, Cimenyan, Kabupaten Bandung 40191, Jawa Barat, Indonesia",
    googleMapsUrl: "https://maps.app.goo.gl/2Q6vdr39fsLCBjxD6",
    sosialMedia: {
      instagram: "https://www.instagram.com/baladilhuffaadz",
      tiktok: "https://www.tiktok.com/@baladilhuffaadz1?is_from_webapp=1&sender_device=pc",
      youtube: "https://www.youtube.com/@baladilhuffaadz",
      twitter: "https://twitter.com/baladz_id",
    },
  },

  cta: {
    teksDaftar: "Daftar Santri Baru",
    teksWhatsapp: "Konsultasi WhatsApp",
    pesanWhatsapp: "Assalamu'alaikum tim Baladz, saya ingin berkonsultasi tentang program dan pendaftaran.",
    teksKunjungan: "Atur Kunjungan via WhatsApp",
    pesanKunjungan: "Assalamu'alaikum tim Baladz, saya ingin bertanya dan mengatur jadwal kunjungan/survei ke Ma’had Baladz.",
  },

  popup: {
    aktif: true,
    modeTampilan: "gambar_teks",
    judul: "Jadwal PSB 2026/2027",
    subjudul: "Gelombang 1 berlangsung September 2026–Januari 2027 dan Gelombang 2 Januari–Mei 2027. Jadwal berlaku untuk semua jenjang.",
    gambarPoster: "/images/baladz/gallery-class.jpg",
    teksCta: "Tanyakan PSB via WhatsApp",
    nomorWaCta: "081234598187",
    pesanWaCta: "Assalamu'alaikum Panitia PSB Baladz, saya ingin menanyakan pendaftaran santri baru.",
    linkCta: "",
    teksTutup: "Lanjutkan ke Website",
  },
};
