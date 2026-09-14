"use client";

import { X } from "lucide-react";

interface FloatingPosterProps {
  onDismiss: () => void;
}

export function FloatingPoster({ onDismiss }: FloatingPosterProps) {
  return (
    <aside className="relative z-20 ml-auto w-[260px] rounded-xl bg-[#cbc9e9] p-[18px] min-[901px]:fixed min-[901px]:right-[18px] min-[901px]:top-[300px] min-[1101px]:w-[370px]">
      <button
        aria-label="Tutup poster pendaftaran"
        className="absolute right-0 top-0 z-10 flex size-6 items-center justify-center rounded-bl-sm rounded-tr-xl bg-[#8f8e9c] text-white transition-colors hover:bg-[#777683] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5e616b]"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden="true" className="size-3" strokeWidth={2} />
      </button>

      <div
        aria-label="Poster pendaftaran santri dan siswa Baladz tahun ajaran 2027/2028"
        className="source-art art-poster aspect-[4/5] w-full"
        role="img"
      />
    </aside>
  );
}
