"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import type { NewsItem } from "./types";

const leadItems: NewsItem[] = [
  {
    title:
      "Pelajaran Penting dari Sa’id bin Zaid رضي الله عنه, Sahabat yang Dijamin Masuk Surga",
    date: "September 10, 2026",
    excerpt:
      "Sa’id bin Zaid رضي الله عنه adalah salah satu sahabat Rasulullah ﷺ yang memiliki kedudukan sangat mulia. Namanya termasuk dalam daftar al-‘Asyarah al-Mubasysyarah bil Jannah, yaitu sepuluh sahabat yang mendapat kabar gembira surga. Poster ini mengingatkan kita melalui sebuah pesan sederhana: ‘Dekatkan mereka kepada Al-Qur’an, karena Al-Qur’an akan menjadi sahabat mereka yang paling setia, […]’",
  },
  {
    title: "Jalan Bebas Hambatan untuk Berburu Rizqi yang Penuh Keberkahan",
    date: "September 6, 2026",
    excerpt:
      "Ada jalan-jalan kebaikan yang Allah mudahkan bagi hamba-Nya. Menjaga shalat malam, memperbanyak istighfar di waktu sahur, bersedekah, dan berdzikir pada pagi serta petang menjadi bekal untuk menjemput rizqi yang lapang dan penuh keberkahan.",
  },
  {
    title: "Amalan Terbaik di Sepuluh Hari Pertama Bulan Dzulhijjah",
    date: "August 30, 2026",
    excerpt:
      "Tidak ada hari ketika amal saleh lebih dicintai Allah daripada hari-hari mulia ini. Mari menghidupkannya dengan dzikir, takbir, tahlil, tahmid, puasa, tilawah, sedekah, dan ibadah terbaik yang mampu kita tunaikan.",
  },
];

const posterClasses = [
  "art-news-1",
  "art-news-2",
  "art-news-3",
  "art-news-4",
  "art-news-5",
] as const;

export function NewsView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = leadItems[activeIndex];

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? leadItems.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % leadItems.length);
  }

  return (
    <section
      aria-label="Kabar dan kajian terbaru"
      className="mx-auto grid w-full max-w-[1240px] grid-cols-[minmax(0,1.5fr)_minmax(280px,0.75fr)] gap-[72px] px-5 pb-10 pt-7 max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[540px]:px-4"
    >
      <div className="min-w-0">
        <div className="mb-3 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Tampilkan artikel sebelumnya"
            onClick={showPrevious}
            className="grid size-8 place-items-center border border-[#c7cbd0] bg-white text-[#a8afb6] transition-colors hover:border-[#f15a24] hover:text-[#f15a24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24]"
          >
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Tampilkan artikel berikutnya"
            onClick={showNext}
            className="grid size-8 place-items-center border border-[#c7cbd0] bg-white text-[#a8afb6] transition-colors hover:border-[#f15a24] hover:text-[#f15a24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24]"
          >
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <article key={activeIndex} className="animate-in fade-in duration-300">
          <div className="grid aspect-[3/2] w-full place-items-center bg-[#e8edf1] text-[#bdc5cc]">
            <ImageIcon
              aria-hidden="true"
              className="size-[29%] max-h-48 max-w-48"
              strokeWidth={1.65}
            />
          </div>

          <div className="pt-4 text-[#666a71]">
            <h2 className="text-[16px] font-normal leading-[1.45] text-[#44484e]">
              {activeItem.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-[#969a9e]">
              <span className="inline-flex items-center gap-1">
                <UserRound aria-hidden="true" className="size-3" />
                Asti
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3" />
                {activeItem.date}
              </span>
            </p>
            <p className="mt-3 text-[13px] leading-[1.75] text-[#777b81]">
              {activeItem.excerpt}
            </p>
            <button
              type="button"
              className="mt-4 inline-flex h-8 items-center border border-[#9da1a5] px-3 text-[10px] font-semibold tracking-[0.02em] text-[#5f6368] transition-colors hover:border-[#f15a24] hover:bg-[#f15a24] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24]"
            >
              READ MORE
            </button>
          </div>
        </article>

        <div className="mt-[clamp(80px,19vw,300px)] flex justify-center gap-[7px]" aria-label="Article pages">
          {Array.from({ length: 18 }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to article page ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index % leadItems.length)}
              className={`size-2.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15a24] ${
                index === activeIndex ? "bg-[#ef583d]" : "bg-[#d2d4d5] hover:bg-[#afb2b4]"
              }`}
            />
          ))}
        </div>
      </div>

      <aside
        aria-label="Poster kajian"
        className="grid content-start grid-cols-1 gap-3 max-[900px]:grid-cols-2 max-[540px]:grid-cols-1"
      >
        {posterClasses.map((posterClass, index) => (
          <div
            key={posterClass}
            role="img"
            aria-label={`Poster kajian Baladz ${index + 1}`}
            className={`source-art aspect-square w-full ${posterClass}`}
          />
        ))}
      </aside>
    </section>
  );
}
