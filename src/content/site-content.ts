/**
 * DATA KONTEN RESMI WEBSITE BALADZ
 * 
 * PANDUAN UPDATE KONTEN:
 * Anda dapat mengedit teks, harga, nomor kontak, jadwal PSB, berita, atau artikel kajian
 * langsung di file ini tanpa perlu mengubah kode komponen lainnya.
 * 
 * Cukup simpan file ini, maka website akan otomatis terupdate.
 */

export interface JenjangPendidikan {
  id: string;
  nama: string;
  tingkat: string;
  rentangUsia: string;
  deskripsi: string;
  ijazah: string;
  uangPangkal: number;
  sppBulanan: number;
  biayaBoarding?: number;
  keunggulan: string[];
  gambar: string;
  isBoardingTersedia: boolean;
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

export interface KajianArtikel {
  id: string;
  judul: string;
  ringkasan: string;
  isiLengkap: string[];
  tanggal: string;
  kategori: string;
  penulis: string;
}

export interface AlurPsbStep {
  nomor: number;
  judul: string;
  keterangan: string;
}

export interface PopupSettings {
  aktif: boolean;
  modeTampilan?: "gambar_saja" | "gambar_teks";
  gambarPoster: string;
  judul?: string;
  subjudul?: string;
  teksCta?: string;
  linkCta?: string;
  teksTutup?: string;
}

export interface BaladzSiteContent {
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

  // 5. Kajian (Edukasi Islami & Parenting)
  kajian: KajianArtikel[];

  // 6. Kontak & Media Sosial Resmi
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

  // 7. Pengaturan Popup Pengumuman (Muncul di 3 Halaman)
  popup: PopupSettings;
}

export const defaultSiteContent: BaladzSiteContent = {
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
        nama: "Kampus KBM 1 (Jatihandap)",
        alamat: "Jalan Jatihandap Raya No. 7, RT.7/RW.5, Jatihandap, Bandung",
        status: "Gedung 2 lantai di atas lahan 300m²",
      },
      {
        nama: "Kampus KBM 2 (Pasirlayung)",
        alamat: "Jalan Pasirlayung Barat No. 44, Padasuka, Cimenyan, Kab. Bandung 40191",
        status: "Gedung 2 lantai di atas lahan 200m²",
      },
      {
        nama: "Kampus Permanen Pesantren Baladz (Cipaheut)",
        alamat: "Cipaheut, Cimenyan, Bandung (sekitar 3km dari Baladz 1)",
        status: "Lahan wakaf 600m² siap bangun, proyeksi perluasan kawasan > 7.000m²",
      },
    ],
  },

  psb: {
    tahunAjaran: "TA 2027/2028",
    statusPendaftaran: "Buka",
    tanggalBuka: "1 Februari 2027",
    tanggalTutup: "15 Juni 2027 (Pukul 23:59)",
    kuotaSantri: 13,
    biayaPendaftaran: 150000,
    batasDaftarUlang: "10 Juli 2027",
    alurPendaftaran: [
      {
        nomor: 1,
        judul: "Isi Formulir Pendaftaran Online",
        keterangan: "Lengkapi data calon santri dan orang tua secara online melalui website ini atau WhatsApp panitia PSB.",
      },
      {
        nomor: 2,
        judul: "Membayar Biaya Pendaftaran",
        keterangan: "Transfer biaya pendaftaran sebesar Rp 150.000,- ke rekening resmi Yayasan, lalu kirim bukti via WA.",
      },
      {
        nomor: 3,
        judul: "Melengkapi Berkas Persyaratan",
        keterangan: "Kirim pas foto background merah, scan Akta Kelahiran, Kartu Keluarga, dan piagam hafalan (bila ada).",
      },
      {
        nomor: 4,
        judul: "Jadwal & Ujian Seleksi Offline",
        keterangan: "Tes seleksi Al-Qur'an & wawancara orang tua diadakan di Baladz 1 Jatihandap sesuai jadwal perjanjian.",
      },
      {
        nomor: 5,
        judul: "Pengumuman & Daftar Ulang",
        keterangan: "Santri yang dinyatakan lulus menyelesaikan biaya daftar ulang sebelum batas waktu yang ditentukan.",
      },
    ],
    syaratBerkas: [
      "File foto 4x6 setengah badan background merah (Putra: kemeja putih berkerah; Putri: pakaian putih berjilbab putih).",
      "Scan Kartu Keluarga (KK) yang masih berlaku.",
      "Scan Akta Kelahiran calon santri.",
      "Scan sertifikat/piagam hafalan Al-Qur'an (jika memiliki).",
      "Calon santri SDTahfidz usia minimal 6 tahun per 14 Juli 2027.",
      "Bagi calon santri boarding: Tidak memiliki riwayat penyakit berat berbahaya (asma berat, TBC, jantung, hepatitis B, epilepsi).",
    ],
    materiSeleksi: [
      "Tes membaca Al-Qur’an (kelancaran makharijul huruf & tajwid dasar)",
      "Tes daya ingat hafalan bagi calon santri",
      "Wawancara kesiapan orang tua / wali santri",
    ],
    rekeningPembayaran: {
      bank: "Rekening Resmi Yayasan",
      nomorRekening: "7112564138",
      atasNama: "A Aminah (Ketua Yayasan)",
      catatanTransfer: "Kirim bukti transfer ke WhatsApp 088222822233 dengan format: Pendaftaran [Nama Calon Santri]",
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
      keunggulan: [
        "Metode Listening Al-Qur'an terpadu",
        "Pembiasaan adab dan doa sehari-hari",
        "Kelas interaktif non-asrama yang nyaman",
        "Pendampingan Asatidzah penuh kasih sayang",
      ],
      gambar: "/images/baladz/raw-PAUDQ-1.jpg",
      isBoardingTersedia: false,
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
    },
    {
      id: "sd-tahfidz",
      nama: "SDTahfidz (Sekolah Sulaiman Homeschooling)",
      tingkat: "Sekolah Dasar Qur'ani",
      rentangUsia: "Usia Minimal 6 Tahun",
      deskripsi:
        "Program pendidikan dasar unggulan yang memadukan tahfidz intensif bersanad dengan kurikulum akademik nasional. Tersedia fasilitas asrama (boarding).",
      ijazah: "Ijazah Baladz & Ijazah Negara Resmi",
      uangPangkal: 16800000,
      sppBulanan: 980000,
      biayaBoarding: 400000,
      keunggulan: [
        "Mendapatkan 2 Ijazah (Baladz & Ijazah Negara)",
        "Tilawah bersanad 30 Juz dibimbing asatidzah berkompeten",
        "Fasilitas asrama (boarding) aman dan terkontrol",
        "Kurikulum akademik kurikulum nasional terintegrasi",
      ],
      gambar: "/images/baladz/gallery-class.jpg",
      isBoardingTersedia: true,
    },
  ],

  kabar: [
    {
      id: "wakaf-cipaheut",
      judul: "Baladz Menerima Wakaf Lahan 600m² dan Siap untuk Dibangun Pesantren",
      ringkasan:
        "Alhamdulillaah, Baladz menerima wakaf lahan seluas 600m² di Cipaheut, Cimenyan, Bandung. Lokasi ini diproyeksikan menjadi Pesantren Baladil Huffaadz modern.",
      isiLengkap: [
        "Alhamdulillaah, atas pertolongan Allah Ta'ala, Baladz menerima amanah wakaf lahan dengan luas 600m² di kawasan Cipaheut, Cimenyan, Kabupaten Bandung, berjarak sekitar 3 km dari kampus Baladz 1.",
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

  kajian: [
    {
      id: "kisah-zubair-bin-awwam",
      judul: "Kisah Keberanian Zubair bin Awwam رضي الله عنه, Sahabat yang Dijamin Masuk Surga",
      ringkasan:
        "Meneladani keberanian dan ketulusan Hawariyy (pembela setia) Rasulullah ﷺ yang sejak belia teguh memperjuangkan tauhid.",
      isiLengkap: [
        "Zubair bin Awwam رضي الله عنه merupakan salah satu sahabat mulia Rasulullah ﷺ yang dikenal luas karena keberanian dan keteguhannya. Beliau termasuk dalam sepuluh sahabat yang mendapat kabar gembira masuk surga (Al-'Asyarah Al-Mubasysyarun bil Jannah).",
        "Nama lengkap beliau adalah Az-Zubair bin Al-Awwam bin Khuwailid bin Asad bin Abdul 'Uzza bin Qushai رضي الله عنه. Garis nasabnya bertemu dengan nasab Rasulullah ﷺ pada kakek buyut Qushai. Ibunda beliau adalah Shafiyyah binti Abdul Muththalib, bibi dari Rasulullah ﷺ.",
        "Rasulullah ﷺ bersabda: 'Setiap nabi memiliki hawariyy (pembela setia), dan pembelaku adalah Zubair.' (HR. Bukhari dan Muslim).",
        "Kisah Zubair menjadi teladan agung bagi orang tua dalam mendidik anak agar memiliki keberanian berlandaskan iman, ketangguhan fisik, dan cinta mendalam kepada Allah dan Rasul-Nya.",
      ],
      tanggal: "14 September 2026",
      kategori: "Sirah Sahabat",
      penulis: "Ustadzah Asti",
    },
    {
      id: "tolong-menolong-kebaikan",
      judul: "Tolong-Menolong dalam Kebaikan dan Takwa, Bukan dalam Dosa",
      ringkasan:
        "Tafsir hikmah QS Al-Ma'idah ayat 2 tentang pondasi muamalah dan persaudaraan sesama kaum mukminin.",
      isiLengkap: [
        "Islam mengajarkan kita untuk senantiasa saling tolong-menolong dalam kebaikan. Namun, bantuan yang kita berikan harus dilandasi ketakwaan, bukan untuk mendukung keburukan atau pelanggaran syariat.",
        "Allah Ta'ala berfirman dalam QS Al-Ma'idah ayat 2: 'Dan tolong-menolonglah kamu dalam mengerjakan kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.'",
        "Dalam mendidik anak-anak kita di rumah dan sekolah, nilai tolong-menolong ini harus dipupuk melalui keteladanan: saling berbagi, menghargai sesama teman, serta bersama-sama saling mengingatkan dalam kebaikan ibadah.",
      ],
      tanggal: "11 September 2026",
      kategori: "Tafsir & Akhlak",
      penulis: "Ustadzah Asti",
    },
    {
      id: "pelajaran-said-bin-zaid",
      judul: "Pelajaran Penting dari Sa’id bin Zaid رضي الله عنه",
      ringkasan:
        "Mengenal sosok sahabat agung yang istiqomah di awal dakwah Islam dan keutamaan doanya yang mustajab.",
      isiLengkap: [
        "Sa'id bin Zaid رضي الله عنه adalah salah satu sahabat yang memeluk Islam di masa-masa awal (As-Sabiqunal Awwalun). Ayahnya, Zaid bin 'Amr bin Nufail, adalah seorang hanif yang menolak penyembahan berhala bahkan sebelum diutusnya kenabian.",
        "Sa'id bin Zaid mewarisi keteguhan prinsip tersebut. Beliau rela menanggung ujian berat dari kaum musyrikin Mekkah demi mempertahankan keimanan.",
        "Keteladanan beliau mengajarkan kita pentingnya menanamkan akidah yang kokoh sejak anak masih kecil, agar kelak memiliki jati diri muslim yang tangguh di tengah berbagai pengaruh zaman.",
      ],
      tanggal: "10 September 2026",
      kategori: "Sirah Sahabat",
      penulis: "Ustadzah Asti",
    },
    {
      id: "mendidik-anak-cinta-quran",
      judul: "Kiat Praktis Menanamkan Kecintaan Al-Qur'an pada Anak Usia Emas",
      ringkasan:
        "Metode pembiasaan mendengar (listening), teladan orang tua, dan menciptakan suasana rumah yang sejuk dengan Al-Qur'an.",
      isiLengkap: [
        "Usia emas (0–6 tahun) adalah periode paling responsif dalam menyerap bunyi dan kebiasaan. Anak yang terbiasa mendengarkan murottal Al-Qur'an setiap hari akan memiliki kepekaan makhraj yang jauh lebih lentur.",
        "Kunci utama keberhasilan pendidikan Al-Qur'an bukan pada paksaan, melainkan pada suasana yang hangat, apresiasi tulus orang tua, dan kehadiran sosok guru yang mengajar dengan kelembutan.",
        "Di Baladz, metode ini menjadi pilar utama pada jenjang PAUD Listening Al-Qur'an (LQ) dan TKQ, sehingga hafalan tumbuh dari rasa cinta, bukan beban.",
      ],
      tanggal: "5 September 2026",
      kategori: "Parenting Qur'ani",
      penulis: "Tim Pendidikan Baladz",
    },
  ],

  kontak: {
    telepon: "081234598187",
    whatsappUtama: "088222822233",
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

  popup: {
    aktif: true,
    modeTampilan: "gambar_teks",
    judul: "Penerimaan Santri Baru TA 2027/2028 Telah Dibuka!",
    subjudul: "Membina generasi berkarakter Qur'ani dengan bimbingan Asatidzah bersanad 30 Juz. Kuota sangat terbatas hanya 13 santri.",
    gambarPoster: "/images/baladz/raw-PAUDQ-1.jpg",
    teksCta: "Daftar Sekarang via WhatsApp",
    linkCta: "https://wa.me/6288222822233?text=Assalamu%27alaikum%20Panitia%20PSB%20Baladz%2C%20saya%20ingin%20mendaftar%20santri%20baru.",
    teksTutup: "Lanjutkan ke Website",
  },
};
