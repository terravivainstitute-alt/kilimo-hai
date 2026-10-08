"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CONTACT } from "@/lib/useContact";
import type { AboutContent, ContactContent, HomeHeroContent } from "@/types/content";
import { BilingualField, Notice, TextField } from "@/app/components/admin/ui";

type Pair<T> = Record<"sw" | "en", T>;

const DEFAULT_HERO: Pair<HomeHeroContent> = {
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

const DEFAULT_ABOUT: Pair<AboutContent> = {
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
  const [contact, setContact] = useState<ContactContent>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("key, content")
        .in("key", ["home_hero", "about", "contact"]);

      data?.forEach((row) => {
        if (row.key === "home_hero") setHero(row.content as Pair<HomeHeroContent>);
        if (row.key === "about") setAbout(row.content as Pair<AboutContent>);
        if (row.key === "contact") setContact({ ...DEFAULT_CONTACT, ...(row.content as ContactContent) });
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const now = new Date().toISOString();
    const results = await Promise.all([
      supabase.from("site_content").upsert({ key: "home_hero", content: hero, updated_at: now }),
      supabase.from("site_content").upsert({ key: "about", content: about, updated_at: now }),
      supabase.from("site_content").upsert({ key: "contact", content: contact, updated_at: now }),
    ]);
    const failed = results.find((r) => r.error);
    setSaving(false);
    setMessage(
      failed?.error
        ? { kind: "error", text: `Imeshindikana kuhifadhi: ${failed.error.message}` }
        : { kind: "ok", text: "Mabadiliko yamehifadhiwa." }
    );
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Maudhui na Mawasiliano
      </h1>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-forest">
        Ukurasa wa kwanza (Hero)
      </h2>
      <div className="mt-3 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-5">
        <BilingualField
          label="Kichwa kikuu (headline)"
          sw={hero.sw.headline}
          en={hero.en.headline}
          onSw={(v) => setHero({ ...hero, sw: { ...hero.sw, headline: v } })}
          onEn={(v) => setHero({ ...hero, en: { ...hero.en, headline: v } })}
          multiline
          rows={2}
        />
        <BilingualField
          label="Maelezo chini ya kichwa"
          sw={hero.sw.subheadline}
          en={hero.en.subheadline}
          onSw={(v) => setHero({ ...hero, sw: { ...hero.sw, subheadline: v } })}
          onEn={(v) => setHero({ ...hero, en: { ...hero.en, subheadline: v } })}
          multiline
        />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-forest">
        Kuhusu sisi
      </h2>
      <div className="mt-3 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-5">
        <BilingualField
          label="Utangulizi"
          sw={about.sw.intro}
          en={about.en.intro}
          onSw={(v) => setAbout({ ...about, sw: { ...about.sw, intro: v } })}
          onEn={(v) => setAbout({ ...about, en: { ...about.en, intro: v } })}
          multiline
          rows={4}
        />
        <BilingualField
          label="Falsafa / msimamo"
          sw={about.sw.philosophy}
          en={about.en.philosophy}
          onSw={(v) => setAbout({ ...about, sw: { ...about.sw, philosophy: v } })}
          onEn={(v) => setAbout({ ...about, en: { ...about.en, philosophy: v } })}
          multiline
          rows={4}
        />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-forest">
        Mawasiliano (footer na ukurasa wa Wasiliana)
      </h2>
      <div className="mt-3 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Namba ya simu" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
          <TextField
            label="Namba ya WhatsApp (mfano 255712345678, bila +)"
            value={contact.whatsapp}
            onChange={(v) => setContact({ ...contact, whatsapp: v })}
          />
        </div>
        <TextField label="Email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <BilingualField
          label="Mahali"
          sw={contact.location.sw}
          en={contact.location.en}
          onSw={(v) => setContact({ ...contact, location: { ...contact.location, sw: v } })}
          onEn={(v) => setContact({ ...contact, location: { ...contact.location, en: v } })}
        />
      </div>

      <p className="mt-8 text-xs text-ink/50">
        Maneno mengine (menyu, vitufe, vichwa vya sehemu) yanabadilishwa kwenye &quot;Maneno ya Tovuti&quot;.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Inahifadhi..." : "Hifadhi mabadiliko"}
        </button>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </div>
    </div>
  );
}
