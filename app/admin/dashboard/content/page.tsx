"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AboutContent, HomeHeroContent } from "@/types/content";

const DEFAULT_HERO: Record<"sw" | "en", HomeHeroContent> = {
  sw: {
    headline: "Kilimo Hai — Ushauri na bidhaa za kilimo hai kwa mkulima yeyote",
    subheadline:
      "Tunatoa ushauri wa kitaalamu, mbolea za asili, na madawa ya asili ya wadudu kwa wakulima wa mashamba makubwa na madogo.",
  },
  en: {
    headline: "Kilimo Hai — Organic farming advice and products for every farmer",
    subheadline:
      "We provide expert consultancy, organic fertilizer, and natural pest control for farms of every size.",
  },
};

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

export default function AdminContentPage() {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("key, content")
        .in("key", ["home_hero", "about"]);

      data?.forEach((row) => {
        if (row.key === "home_hero") setHero(row.content as Record<"sw" | "en", HomeHeroContent>);
        if (row.key === "about") setAbout(row.content as Record<"sw" | "en", AboutContent>);
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      supabase
        .from("site_content")
        .upsert({ key: "home_hero", content: hero, updated_at: new Date().toISOString() }),
      supabase
        .from("site_content")
        .upsert({ key: "about", content: about, updated_at: new Date().toISOString() }),
    ]);
    setSaving(false);
    setSaved(true);
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Maudhui ya Tovuti
      </h1>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-forest">
        Home — Hero
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <LangBlock
          label="Kiswahili"
          headline={hero.sw.headline}
          subheadline={hero.sw.subheadline}
          onHeadline={(v) => setHero({ ...hero, sw: { ...hero.sw, headline: v } })}
          onSubheadline={(v) => setHero({ ...hero, sw: { ...hero.sw, subheadline: v } })}
        />
        <LangBlock
          label="English"
          headline={hero.en.headline}
          subheadline={hero.en.subheadline}
          onHeadline={(v) => setHero({ ...hero, en: { ...hero.en, headline: v } })}
          onSubheadline={(v) => setHero({ ...hero, en: { ...hero.en, subheadline: v } })}
        />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-forest">
        About
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <AboutBlock
          label="Kiswahili"
          intro={about.sw.intro}
          philosophy={about.sw.philosophy}
          onIntro={(v) => setAbout({ ...about, sw: { ...about.sw, intro: v } })}
          onPhilosophy={(v) => setAbout({ ...about, sw: { ...about.sw, philosophy: v } })}
        />
        <AboutBlock
          label="English"
          intro={about.en.intro}
          philosophy={about.en.philosophy}
          onIntro={(v) => setAbout({ ...about, en: { ...about.en, intro: v } })}
          onPhilosophy={(v) => setAbout({ ...about, en: { ...about.en, philosophy: v } })}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
      >
        {saving ? "Inahifadhi..." : "Hifadhi mabadiliko"}
      </button>
      {saved && <p className="mt-3 text-sm text-forest-dark">Imehifadhiwa.</p>}
    </div>
  );
}

function LangBlock({
  label,
  headline,
  subheadline,
  onHeadline,
  onSubheadline,
}: {
  label: string;
  headline: string;
  subheadline: string;
  onHeadline: (v: string) => void;
  onSubheadline: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-forest-dark/10 bg-white p-4">
      <p className="text-xs font-semibold text-ink/50">{label}</p>
      <label className="mt-2 block text-xs text-ink/60">
        Headline
        <textarea
          value={headline}
          onChange={(e) => onHeadline(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-forest-dark/20 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="mt-2 block text-xs text-ink/60">
        Subheadline
        <textarea
          value={subheadline}
          onChange={(e) => onSubheadline(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-forest-dark/20 px-2 py-1.5 text-sm"
        />
      </label>
    </div>
  );
}

function AboutBlock({
  label,
  intro,
  philosophy,
  onIntro,
  onPhilosophy,
}: {
  label: string;
  intro: string;
  philosophy: string;
  onIntro: (v: string) => void;
  onPhilosophy: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-forest-dark/10 bg-white p-4">
      <p className="text-xs font-semibold text-ink/50">{label}</p>
      <label className="mt-2 block text-xs text-ink/60">
        Intro
        <textarea
          value={intro}
          onChange={(e) => onIntro(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-forest-dark/20 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="mt-2 block text-xs text-ink/60">
        Philosophy
        <textarea
          value={philosophy}
          onChange={(e) => onPhilosophy(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-forest-dark/20 px-2 py-1.5 text-sm"
        />
      </label>
    </div>
  );
}
