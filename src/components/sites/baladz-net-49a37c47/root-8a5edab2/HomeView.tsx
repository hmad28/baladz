import { ImageIcon } from "lucide-react";

const visualRows = [
  ["art-progress", "art-construction"],
  ["art-zakat", null],
  [null, null],
  [null, null],
  [null, null],
  [null, null],
] as const;

interface VisualPanelProps {
  artClass: "art-progress" | "art-construction" | "art-zakat" | null;
}

function VisualPanel({ artClass }: VisualPanelProps) {
  if (artClass) {
    return (
      <div
        aria-label="Dokumentasi kegiatan Baladz"
        className={`source-art ${artClass} aspect-[8/5] w-full`}
        role="img"
      />
    );
  }

  return (
    <div className="flex aspect-[8/5] w-full flex-col items-center justify-center gap-3 bg-[#e6eaee] text-[#7f8790]">
      <ImageIcon
        aria-hidden="true"
        className="size-16 text-[#cdd2d7]"
        strokeWidth={1.5}
      />
      <p className="text-xl font-normal tracking-[-0.02em]">
        Choose Your <span className="font-extrabold">Image</span>
      </p>
    </div>
  );
}

export function HomeView() {
  return (
    <main className="mx-auto w-full max-w-[1160px] px-4 pb-8 pt-10 sm:px-6 lg:px-0">
      <section className="grid grid-cols-1 items-start gap-5 min-[761px]:grid-cols-2 min-[761px]:gap-[18px]">
        <div className="flex min-h-full flex-col justify-center text-center text-[#5e616b]">
          <h1 className="mx-auto max-w-[540px] text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#555862]">
            Baladz Menerima Wakaf Lahan 600m² dan Siap untuk Dibangun
          </h1>

          <div className="mt-6 space-y-5 text-[14px] leading-[1.7]">
            <p>
              Alhamdulillaah, Baladz menerima wakaf lahan dengan luas 600m² di
              Cipaheut, Cimenyan, Bandung, kurang lebih 3km dari Baladz1. Lahan
              sudah dibersihkan dan sudah dibuat bedeng untuk pekerja.
            </p>
            <p>
              Aghniya, hartawan dan dermawan, di kiri-kanan lahan tersebut, siap
              dibebaskan lebih dari 7000m². InsyaAllooh, di masa yang akan
              datang, syiar Islam akan menerangi wilayah tersebut dan akan
              mengundang kemaslahatan bagi siapapun yang berkontribusi di
              dalamnya. Di lokasi itulah direncanakan untuk berdiri Pesantren
              BaladilHuffaadz, bayt AlQuran dengan fasilitas modern dan
              bermanhaj ahlussunah wal jamaah.
            </p>
            <p>Hubungi WA Baladz untuk rencana kunjungan ke lokasi</p>
          </div>
        </div>

        <div
          aria-label="Informasi wakaf dan donasi pembangunan Pesantren Baladz"
          className="source-art art-donation aspect-[4/3] w-full"
          role="img"
        />
      </section>

      <div className="mt-8">
        {visualRows.map((row, rowIndex) => (
          <section
            className="grid grid-cols-1 gap-[18px] border-t-2 border-[#c5de00] py-[18px] min-[761px]:grid-cols-2"
            key={`visual-row-${rowIndex + 1}`}
          >
            {row.map((artClass, panelIndex) => (
              <VisualPanel
                artClass={artClass}
                key={`visual-panel-${rowIndex + 1}-${panelIndex + 1}`}
              />
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
