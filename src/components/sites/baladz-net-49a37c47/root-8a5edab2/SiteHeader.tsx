"use client";

import { Mail, MapPin, MessageCircle, Music2, PhoneCall } from "lucide-react";

import type { BaladzTab } from "./types";

interface SiteHeaderProps {
  activeTab: BaladzTab;
  onTabChange: (tab: BaladzTab) => void;
}

const tabs: ReadonlyArray<{ id: BaladzTab; label: string }> = [
  { id: "beranda", label: "Beranda" },
  { id: "kabar", label: "Kabar Baladz" },
  { id: "kajian", label: "Kajian" },
];

function SocialLinks() {
  return (
    <nav
      aria-label="Media sosial Baladz"
      className="flex items-center gap-3 sm:gap-5 lg:gap-8"
    >
      <a
        aria-label="X Baladz"
        className="grid size-6 place-items-center rounded-full bg-black text-[12px] font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:size-7"
        href="https://x.com"
      >
        X
      </a>
      <a
        aria-label="TikTok Baladz"
        className="grid size-6 place-items-center rounded-full bg-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:size-7"
        href="https://tiktok.com"
      >
        <Music2 className="size-3.5" strokeWidth={3} />
      </a>
      <a
        aria-label="Instagram Baladz"
        className="grid size-6 place-items-center rounded-[7px] bg-gradient-to-br from-[#6f35bd] via-[#e83275] to-[#ffc441] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.45)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:size-7"
        href="https://instagram.com"
      >
        <span className="relative block size-4 rounded-[5px] border-[1.5px] border-white before:absolute before:left-1/2 before:top-1/2 before:size-1.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border-[1.5px] before:border-white after:absolute after:right-[2px] after:top-[2px] after:size-0.5 after:rounded-full after:bg-white" />
      </a>
      <a
        aria-label="YouTube Baladz"
        className="grid h-5 w-7 place-items-center rounded-[5px] bg-[#f01818] text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:h-6 sm:w-8"
        href="https://youtube.com"
      >
        <span className="ml-0.5 size-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-white" />
      </a>
    </nav>
  );
}

function BaladzLogo() {
  return (
    <div
      className="select-none text-center text-baladz-logo"
      aria-label="Pesantren Baladz, Baladil Huffaadz"
    >
      <p
        className="font-semibold leading-none tracking-wide text-[11px] sm:text-xs"
        lang="ar"
        dir="rtl"
      >
        معهد بلد الحفاظ الإسلامي
      </p>
      <p className="mt-0.5 text-[8px] font-extrabold leading-none sm:text-[10px]">
        Pesantren Baladz
      </p>
      <p className="font-display mt-0.5 text-[21px] font-black uppercase leading-[0.9] tracking-[0.035em] sm:text-[29px] lg:text-[32px]">
        BaladilHuffaadz
      </p>
    </div>
  );
}

function ContactLinks() {
  const sharedClass =
    "grid size-7 place-items-center transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:size-8";

  return (
    <nav
      aria-label="Kontak Baladz"
      className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-8"
    >
      <a
        aria-label="Lokasi Baladz"
        className={`${sharedClass} text-[#f12622]`}
        href="#lokasi"
      >
        <MapPin
          className="size-5 fill-current sm:size-[22px]"
          strokeWidth={2.6}
        />
      </a>
      <a
        aria-label="Email Baladz"
        className={`${sharedClass} text-black`}
        href="mailto:info@baladz.net"
      >
        <Mail className="size-5 sm:size-6" strokeWidth={2} />
      </a>
      <a
        aria-label="Telepon Baladz"
        className={`${sharedClass} text-black`}
        href="tel:+6288222822233"
      >
        <PhoneCall
          className="size-5 fill-current sm:size-[22px]"
          strokeWidth={2.2}
        />
      </a>
      <a
        aria-label="WhatsApp Baladz"
        className={`${sharedClass} rounded-md bg-[#1dcf68] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.45)]`}
        href="https://wa.me/6288222822233"
      >
        <MessageCircle
          className="size-[18px] fill-white/15 sm:size-5"
          strokeWidth={2.6}
        />
      </a>
    </nav>
  );
}

export function SiteHeader({ activeTab, onTabChange }: SiteHeaderProps) {
  return (
    <header className="relative z-40 mb-7 h-[122px] bg-baladz-lime md:mb-[30px] md:h-[92px]">
      <div className="mx-auto grid h-full max-w-[1840px] grid-cols-2 grid-rows-[58px_38px] items-center gap-x-5 px-4 pb-7 sm:px-7 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1 md:gap-x-10 md:px-10 md:pb-0 xl:px-14">
        <div className="order-2 justify-self-start md:order-1">
          <SocialLinks />
        </div>
        <div className="order-1 col-span-2 self-end justify-self-center pb-1 md:order-2 md:col-span-1 md:self-center md:pb-0">
          <BaladzLogo />
        </div>
        <div className="order-3 justify-self-end md:min-w-0">
          <ContactLinks />
        </div>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="absolute -bottom-6 left-0 right-0 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 md:-bottom-[26px]"
      >
        <div className="mx-auto flex h-12 w-max min-w-fit items-stretch gap-2 md:h-[52px] md:w-full md:max-w-[1840px] md:justify-start md:gap-3 md:px-0 xl:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[112px] rounded-b-xl px-5 text-[12px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:min-w-[128px] sm:px-7 sm:text-[13px] md:min-w-[132px] ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-white/75"
                }`}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
