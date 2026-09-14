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
  type SiteContent,
} from "@/content/site-content";

const storageKey = "baladz-site-content-v1";

interface SiteContentContextValue {
  content: SiteContent;
  draft: SiteContent;
  setDraft: (content: SiteContent) => void;
  save: () => void;
  reset: () => void;
  savedAt: string | null;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [draft, setDraft] = useState<SiteContent>(defaultSiteContent);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as SiteContent;
      window.queueMicrotask(() => {
        setContent(parsed);
        setDraft(parsed);
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      draft,
      setDraft,
      save: () => {
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
        setContent(draft);
        setSavedAt(
          new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        );
      },
      reset: () => {
        window.localStorage.removeItem(storageKey);
        setContent(defaultSiteContent);
        setDraft(defaultSiteContent);
        setSavedAt(null);
      },
      savedAt,
    }),
    [content, draft, savedAt],
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
