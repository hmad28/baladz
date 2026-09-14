"use client";

import { useState } from "react";
import { FloatingPoster } from "./FloatingPoster";
import { HomeView } from "./HomeView";
import { NewsView } from "./NewsView";
import { RegistrationView } from "./RegistrationView";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import type { BaladzTab } from "./types";

export function BaladzSite() {
  const [activeTab, setActiveTab] = useState<BaladzTab>("beranda");
  const [posterVisible, setPosterVisible] = useState(true);

  return (
    <div className="baladz-page flex min-h-screen flex-col">
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div
          key={activeTab}
          className="animate-in fade-in duration-300"
          aria-live="polite"
        >
          {activeTab === "beranda" && <RegistrationView />}
          {activeTab === "kabar" && <HomeView />}
          {activeTab === "kajian" && <NewsView />}
        </div>
      </main>
      {posterVisible && (
        <FloatingPoster onDismiss={() => setPosterVisible(false)} />
      )}
      <SiteFooter />
    </div>
  );
}

