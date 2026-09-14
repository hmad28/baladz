import type { ReactNode } from "react";

interface ListProps {
  items: readonly ReactNode[];
}

function BulletList({ items }: ListProps) {
  return (
    <ul className="space-y-0.5">
      {items.map((item, index) => (
        <li className="flex items-start gap-3" key={index}>
          <span
            aria-hidden="true"
            className="mt-[0.42em] size-2 shrink-0 bg-[#303030]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckList({ items }: ListProps) {
  return (
    <ul className="space-y-0.5">
      {items.map((item, index) => (
        <li className="flex items-start gap-3" key={index}>
          <span
            aria-hidden="true"
            className="mt-[0.32em] size-2.5 shrink-0 border border-[#343434] bg-transparent"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[16px] font-extrabold leading-snug text-baladz-text">
      {children}
    </h2>
  );
}

function Important({ children }: { children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-1 text-[16px] font-extrabold leading-none text-red-600">
        PENTING!
      </h2>
      {children}
    </section>
  );
}

export function RegistrationView() {
  return (
    <section className="mx-auto w-full max-w-[920px] px-5 pb-16 pt-6 text-left text-[15px] leading-[1.55] text-baladz-text md:px-4 md:pt-5 md:text-[14px]">
      <h1 className="mb-1.5 text-center text-[20px] font-extrabold leading-tight text-baladz-text">
        Baladil Huffaadz (Baladz) membuka pendaftaran santri/siswa baru TA
        2027/2028
      </h1>

      <p>Baladil Huffaadz (Baladz) hari ini:</p>
      <BulletList
        items={[
          "Kurikulum berbasis AlQuran (tilawah bersanad dan menghafalkannya).",
          "PAUD/TK mendapatkan ijazah Baladz.",
          "SDTahfidz mendapatkan ijazah Baladz dan Ijazah Negara.",
          "Astiadzah Baladz sudah menyelesaikan Tilawah Bersanad 30 Juzz.",
          "Tempat KBM sekarang (1) adalah bangunan 2 Lt di atas lahan 300m2, Jl Jatihandap, Bandung.",
          "Tempat KBM sekarang (2) adalah bangunan 2 Lt di atas lahan 200m2, Jl Pasirlayung Barat, Bandung.",
          "Tempat untuk KBM (permanen) dalam proses pembangunan di Cipaheut, Cimenyan, Bandung.",
        ]}
      />

      <section className="mt-4">
        <SectionTitle>Jenjang Pendidikan</SectionTitle>
        <CheckList
          items={[
            "PAUD Listening AlQuran (LQ)",
            "Pendidikan Anak Usia Dini (nonasrama) untuk anak usia 4-5 tahun.",
            "Taman Kanak-kanak (TK-nonasrama) AlQuran, untuk Anak usia 5-6 tahun.",
            "Sekolah Dasar, SDTahfidz (Sekolah Sulaiman, Homeschooling) untuk usia Anak minimal 6 tahun.",
          ]}
        />
      </section>

      <section className="mt-5">
        <SectionTitle>Waktu Pendaftaran dan Seleksi</SectionTitle>
        <p className="font-bold italic">Pendaftaran Online</p>
        <p>Dimulai 1 Februari 2027.</p>
        <p>Ditutup 15 Juni 2027 23:59, atau</p>
        <p>Sampai Target Siswa TA 2027/2028 terpenuhi.</p>
        <p>
          Siswa/Santri Baru yang diterima (setelah seleksi) adalah 13
          Santri/Siswa.
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Jadwal Tes (Seleksi/Wawancara)</SectionTitle>
        <p className="font-bold">PAUDLQ/TKQ Baladz</p>
        <p className="font-bold italic">Offline</p>
        <p>
          Disesuaikan dengan perjanjian antara Orangtua/Wali dengan Panitia PSB.
          Lokasi: Baladz1, Jalan Jatihandap Raya No. 7, RT.7/RW.5, Jatihandap,
          Bandung
        </p>
        <p className="font-bold">SDTahfidz Sekolah Sulaiman Homeschooling</p>
        <p className="font-bold italic">Offline</p>
        <p>
          Disesuaikan dengan perjanjian antara Orangtua/Wali dengan Panitia PSB.
        </p>
        <p>
          Lokasi: Baladz1, Jalan Jatihandap Raya No. 7, RT.7/RW.5, Jatihandap
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Materi Seleksi:</SectionTitle>
        <CheckList
          items={[
            "Tes membaca AlQuran bagi Calon Santri",
            "Test hafalan bagi Calon Santri",
            "Wawancara Orangtua/Wali",
          ]}
        />
      </section>

      <div className="mt-6">
        <Important>
          <p>
            Calon Santri SDTahfidz Sekolah Sulaiman Homeschooling yang diterima
            (LULUS TEST) untuk mulai aktivitas belajar:
          </p>
          <CheckList
            items={[
              "Usia minimal 6 tahun per tanggal 14 Juli 2027. Jika diproyeksikan untuk boarding (berasrama): Tidak memiliki riwayat penyakit berat/menular yang berbahaya, seperti: epilepsi, jantung, gagal ginjal, hepatitis B, asma berat dan TBC.",
              "Lulus seleksi",
              "Memenuhi persyaratan administratif",
            ]}
          />
        </Important>
      </div>

      <section className="mt-5">
        <SectionTitle>File (Berkas) Persyaratan Pendaftaran</SectionTitle>
        <p className="font-bold italic">(File berformat JPG, maks 5MB)</p>
        <p className="ml-6">File foto setengah badan calon Santri, 4x6cm.</p>
        <CheckList
          items={[
            <span key="photos">
              <strong>Putra:</strong> Background foto warna merah (standard foto
              studio), baju putih berkerah, tanpa atribut, tanpa penutup kepala,
              tanpa kacamata.
              <br />
              <strong>Putri:</strong> Background foto warna merah (standard foto
              studio), berpakaian putih, berjilbab warna putih, tanpa kacamata
            </span>,
            "File Scan Akta Kelahiran",
            "File Scan Kartu Keluarga",
            "File Scan bukti/sertifikat/piagam hafalan (jika memiliki).",
            "File-file tersebut diupload menyusul setelah pendaftaran online, untuk kemudian Calon Santri akan mendapatkan jadwal/perjanjian tes seleksi.",
          ]}
        />
      </section>

      <section className="mt-5">
        <SectionTitle>
          Mengisi Dengan Lengkap Formulir Pendaftaran Online Melalui
          Psb.Baladz.Net
        </SectionTitle>
        <CheckList
          items={[
            "Surat informasi Lanjut Pendaftaran.",
            "Bukti Pendaftaran, dan",
            "Surat Pernyataan Orang Tua/Wali Calon Santri Baru.",
          ]}
        />
      </section>

      <section className="mt-5">
        <SectionTitle>Membayar Biaya Pendaftaran</SectionTitle>
        <p>
          Mengirim/transfer biaya pendaftaran sebesar Rp 150.000,- ke Rekening:
          7112564138 a.n A Aminah (Ketua Yayasan).
        </p>
        <p>
          Bukti Transfer segera dikirimkan via WA ke Nomor: 088222822233 dengan
          keterangan: <strong>Pendaftaran (nama calon santri).</strong>
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Lengkapi Berkas Persyaratan</SectionTitle>
        <p>
          <em>Upload</em> persyaratan pendaftaran psb.baladz.net pada menu
          &quot;Login&quot;.
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Jadwal Ujian Seleksi</SectionTitle>
        <p>
          Setelah semua berkas pendaftaran diverifikasi, Baladz akan mengirimkan
          jadwal tes, InsyaAllooh akan muncul 1-5 hari pada akun masing-masing
          setelah dinyatakan lolos berkas/administrasi dan lunas biaya
          pendaftaran. Setelah itu, Orangtua/Wali dapat merespon jadwal
          tes/wawancara untuk mendapatkan persetujuan waktu tes/wawancara.
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Calon Santri Mengikuti Tes</SectionTitle>
        <CheckList
          items={[
            <span key="offline">
              Calon santri wajib mengikuti tes secara{" "}
              <strong className="italic">offline</strong> di lokasi ujian.
            </span>,
            <span key="barcode">
              Kedatangan ke lokasi Tes dengan membawa{" "}
              <strong className="italic">printout barcode</strong> sebagai
              identitas peserta
            </span>,
          ]}
        />
      </section>

      <section className="mt-5">
        <SectionTitle>Pengumuman Hasil Tes</SectionTitle>
        <p>Pengumuman hasil Tes dipublikasikan di psb.baladz.net</p>
      </section>

      <section className="mt-5">
        <SectionTitle>Biaya Daftar Ulang</SectionTitle>
        <CheckList
          items={[
            <span key="payment-window">
              Biaya daftar ulang Calon Santri yang dinyatakan LULUS TES
              dilakukan dalam rentang waktu yang sudah ditentukan dan dapat
              dilihat di <strong>Kabar dari Baladz</strong>. Biaya Daftar Ulang
              ditransfer ke Rekening: 7112564138 a.n A Aminah (Ketua Yayasan)
              sebelum tanggal 10 Juli 2027.
            </span>,
            <span key="proof">
              Bukti Transfer segera dikirimkan via WA ke Nomor: 088 222 8222 33
              dengan keterangan:{" "}
              <strong>Biaya Daftar Ulang (nama calon santri).</strong>
            </span>,
          ]}
        />
      </section>

      <div className="mt-6">
        <Important>
          <p>
            Jika pada tanggal 10 Juli 2027 Biaya Daftar Ulang belum
            diterima/masuk pada rekening termaksud, maka seluruh proses
            administrasi pendaftaran dianggap batal dan Calon Santri dianggap
            mengundurkan diri. Untuk memulihkan proses pendaftaran, Calon Santri
            diberi kesempatan untuk melakukan registrasi secara offline dengan
            syarat ketentuan yang berbeda dengan Pendaftaran Online.
          </p>
        </Important>
      </div>

      <section className="mt-5">
        <SectionTitle>Biaya Daftar Ulang (IDR)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] table-fixed border-0 text-left text-[13px] leading-[1.7]">
            <thead>
              <tr className="font-bold">
                <th className="w-[26%] px-1 py-0 font-bold">Jenjang Level</th>
                <th className="w-[26%] px-1 py-0 font-bold">Uang Pangkal</th>
                <th className="w-[24%] px-1 py-0 font-bold">SPP/Syahriyah</th>
                <th className="w-[24%] px-1 py-0 font-bold">Boarding</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-1 py-0">PAUDLQ</td>
                <td className="px-1 py-0">7.500.000</td>
                <td className="px-1 py-0">250.000</td>
                <td className="px-1 py-0">-</td>
              </tr>
              <tr>
                <td className="px-1 py-0">TK AlQuran</td>
                <td className="px-1 py-0">7.500.000</td>
                <td className="px-1 py-0">380.000</td>
                <td className="px-1 py-0">-</td>
              </tr>
              <tr>
                <td className="px-1 py-0">SDTahfidz</td>
                <td className="px-1 py-0">16.800.000</td>
                <td className="px-1 py-0">980.000</td>
                <td className="px-1 py-0">400.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        <Important>
          <p>
            Pertanyaan atas ketidaklengkapan informasi PSB Baladz, silahkan
            menghubungi WA 088222822233.
          </p>
        </Important>
      </div>
    </section>
  );
}
