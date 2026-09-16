"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSiteContent,
  type BaladzSiteContent,
} from "@/content/site-content";

const storageKey = "baladz-site-content-v7";

interface SiteContentContextValue {
  content: BaladzSiteContent;
  draft: BaladzSiteContent;
  setDraft: (content: BaladzSiteContent) => void;
  save: () => Promise<boolean>;
  reset: () => void;
  savedAt: string | null;
  isSaving: boolean;
  isDbConnected: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function mergeSiteContent(saved: Partial<BaladzSiteContent> | null | undefined): BaladzSiteContent {
  if (!saved) return defaultSiteContent;
  const merged: BaladzSiteContent = {
    ...defaultSiteContent,
    ...saved,
    popup: {
      ...defaultSiteContent.popup,
      ...(saved.popup || {}),
    },
    lembaga: {
      ...defaultSiteContent.lembaga,
      ...(saved.lembaga || {}),
    },
    psb: {
      ...defaultSiteContent.psb,
      ...(saved.psb || {}),
      rekeningPembayaran: {
        ...defaultSiteContent.psb.rekeningPembayaran,
        ...(saved.psb?.rekeningPembayaran || {}),
      },
    },
    kontak: {
      ...defaultSiteContent.kontak,
      ...(saved.kontak || {}),
    },
    cta: {
      ...defaultSiteContent.cta,
      ...(saved.cta || {}),
    },
  };

  // Migrasi satu kali: cegah cache/database lama menghidupkan kembali data PSB
  // yang secara eksplisit telah diganti oleh tim Baladz.
  if (!saved.contentVersion || saved.contentVersion < defaultSiteContent.contentVersion) {
    return {
      ...merged,
      contentVersion: defaultSiteContent.contentVersion,
      sourceNotes: defaultSiteContent.sourceNotes,
      jenjang: defaultSiteContent.jenjang,
      psb: defaultSiteContent.psb,
      lembaga: {
        ...merged.lembaga,
        lokasiKbm: defaultSiteContent.lembaga.lokasiKbm,
      },
      kontak: {
        ...merged.kontak,
        whatsappUtama: defaultSiteContent.kontak.whatsappUtama,
        whatsappKedua: defaultSiteContent.kontak.whatsappKedua,
        telepon: defaultSiteContent.kontak.telepon,
      },
      popup: {
        ...defaultSiteContent.popup,
        aktif: merged.popup.aktif,
        modeTampilan: merged.popup.modeTampilan,
        nomorWaCta: defaultSiteContent.kontak.whatsappUtama,
        linkCta: "",
      },
    };
  }

  return merged;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<BaladzSiteContent>(defaultSiteContent);
  const [draft, setDraft] = useState<BaladzSiteContent>(defaultSiteContent);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Load content on mount: coba dari Neon API, lalu fallback ke localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      // 1. Cek dari localStorage dulu untuk load cepat
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<BaladzSiteContent>;
          if (isMounted) {
            const merged = mergeSiteContent(parsed);
            setContent(merged);
            setDraft(merged);
          }
        }
      } catch {
        // Abaikan
      }

      // 2. Cek data terbaru dari Neon PostgreSQL
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setIsDbConnected(true);
            if (json.data) {
              const merged = mergeSiteContent(json.data);
              setContent(merged);
              setDraft(merged);
              window.localStorage.setItem(storageKey, JSON.stringify(merged));
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Gagal terhubung ke database Neon, menggunakan cache lokal:", err);
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      draft,
      setDraft,
      save: async () => {
        setIsSaving(true);
        // Simpan ke localStorage
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
        setContent(draft);

        let success = true;
        // Simpan ke Neon PostgreSQL
        try {
          const res = await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
          });

          if (res.ok) {
            setIsDbConnected(true);
          } else {
            success = false;
          }
        } catch {
          success = false;
        }

        const nowStr = new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date());

        setSavedAt(nowStr);
        setIsSaving(false);
        return success;
      },
      reset: () => {
        window.localStorage.removeItem(storageKey);
        setContent(defaultSiteContent);
        setDraft(defaultSiteContent);
        setSavedAt(null);
        // Reset juga di DB
        fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultSiteContent),
        }).catch(() => {});
      },
      savedAt,
      isSaving,
      isDbConnected,
    }),
    [content, draft, savedAt, isSaving, isDbConnected],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return context;
}
