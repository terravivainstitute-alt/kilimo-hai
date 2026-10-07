"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";
import type { AboutContent } from "@/types/content";

const DEFAULT_ABOUT: Record<"sw" | "en", AboutContent> = {
  sw: {
    intro:
      "Mimi ni Agronomist mwenye uzoefu wa kusaidia wakulima kuboresha mazao kwa njia za kilimo hai.",
    philosophy:
      "Tunaamini kilimo hai ndicho kinachohakikisha udongo wenye afya na mazao salama kwa muda mrefu.",
  },
  en: {
    intro:
      "I am an Agronomist experienced in helping farmers improve yields through organic farming methods.",
    philosophy:
      "We believe organic farming is what secures healthy soil and safe crops for the long run.",
  },
};

export default function KuhusuPage() {
  const { lang, t } = useLanguage();
  const [about, setAbout] = useState<Record<"sw" | "en", AboutContent>>(DEFAULT_ABOUT);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", "about")
        .maybeSingle();
      if (data?.content) {
        setAbout(data.content as Record<"sw" | "en", AboutContent>);
      }
    }
    load();
  }, []);

  const a = about[lang];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.about.title}
      </h1>
      <p className="mt-6 text-lg text-ink/80">{a.intro}</p>
      <div className="mt-10 rounded-2xl bg-forest-dark px-8 py-10 text-cream">
        <p className="text-cream/90">{a.philosophy}</p>
      </div>
    </div>
  );
}
