"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/types/content";
import { supabase } from "@/lib/supabase";
import sw from "@/lib/i18n/sw.json";
import en from "@/lib/i18n/en.json";

export const dictionaries = { sw, en };

export type Dictionary = typeof sw;
/** Maneno yaliyobadilishwa na admin, kwa njia ya "section.key" -> maandishi */
export type Overrides = Record<string, string>;

/** { nav: { home: "x" } }  ->  { "nav.home": "x" } */
export function flatten(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

export function applyOverrides(base: Dictionary, overrides?: Overrides): Dictionary {
  if (!overrides || Object.keys(overrides).length === 0) return base;
  const copy = JSON.parse(JSON.stringify(base)) as Dictionary;

  for (const [path, value] of Object.entries(overrides)) {
    const parts = path.split(".");
    let node: Record<string, unknown> | undefined = copy as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1 && node; i++) {
      const next: unknown = node[parts[i]];
      node = next && typeof next === "object" ? (next as Record<string, unknown>) : undefined;
    }
    const last = parts[parts.length - 1];
    if (node && typeof node[last] === "string") {
      node[last] = value;
    }
  }
  return copy;
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "kilimo-hai-lang";

export function LanguageProvider({
  children,
  initialOverrides,
}: {
  children: ReactNode;
  initialOverrides?: Record<Lang, Overrides>;
}) {
  const [lang, setLangState] = useState<Lang>("sw");
  const [overrides, setOverrides] = useState<Record<Lang, Overrides>>(
    initialOverrides ?? { sw: {}, en: {} }
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "sw" || stored === "en") {
      setLangState(stored);
    }

    supabase
      .from("site_content")
      .select("content")
      .eq("key", "ui_strings")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) {
          setOverrides({
            sw: (data.content.sw as Overrides) ?? {},
            en: (data.content.en as Overrides) ?? {},
          });
        }
      });
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const t = useMemo(
    () => applyOverrides(dictionaries[lang], overrides[lang]),
    [lang, overrides]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Helper to pick the right string out of a {sw, en} bilingual field. */
export function pick(lang: Lang, bilingual: { sw: string; en: string } | null | undefined) {
  if (!bilingual) return "";
  return bilingual[lang];
}
