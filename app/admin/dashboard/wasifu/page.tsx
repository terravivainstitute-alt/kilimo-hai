"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AboutProfile, AboutStat, Credential } from "@/types/content";
import { BilingualField, Notice, TextField } from "@/app/components/admin/ui";
import { SingleImageUpload } from "@/app/components/admin/ImageUpload";

const EMPTY: AboutProfile = {
  photo_url: "",
  name: "",
  role: { sw: "Agronomist", en: "Agronomist" },
  credentials: [],
  stats: [],
};

const NEW_CREDENTIAL: Credential = {
  title: { sw: "", en: "" },
  org: { sw: "", en: "" },
  year: "",
  image_url: "",
};

const NEW_STAT: AboutStat = { value: "", label: { sw: "", en: "" } };

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AboutProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", "about_profile")
        .maybeSingle();
      if (data?.content) setProfile({ ...EMPTY, ...(data.content as AboutProfile) });
      setLoading(false);
    }
    load();
  }, []);

  function updateCredential(i: number, patch: Partial<Credential>) {
    setProfile((p) => ({
      ...p,
      credentials: p.credentials.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    }));
  }

  function moveCredential(i: number, dir: -1 | 1) {
    setProfile((p) => {
      const j = i + dir;
      if (j < 0 || j >= p.credentials.length) return p;
      const next = [...p.credentials];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...p, credentials: next };
    });
  }

  function updateStat(i: number, patch: Partial<AboutStat>) {
    setProfile((p) => ({
      ...p,
      stats: p.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("site_content").upsert({
      key: "about_profile",
      content: profile,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setMessage(
      error
        ? { kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` }
        : { kind: "ok", text: "Wasifu umehifadhiwa. Angalia ukurasa wa Kuhusu." }
    );
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Wasifu na Vyeti
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Hii ndiyo inayoonekana kwenye ukurasa wa <strong>Kuhusu</strong>. Maneno ya utangulizi na
        falsafa yanahaririwa kwenye <em>Maudhui na Mawasiliano</em>.
      </p>

      {/* Taarifa binafsi */}
      <div className="mt-6 space-y-5 rounded-2xl border border-forest-dark/10 bg-white p-6">
        <p className="text-sm font-semibold text-forest">Wewe</p>
        <SingleImageUpload
          label="Picha yako"
          value={profile.photo_url}
          onChange={(url) => setProfile({ ...profile, photo_url: url })}
          folder="about"
        />
        <TextField
          label="Jina lako kamili"
          value={profile.name}
          onChange={(v) => setProfile({ ...profile, name: v })}
        />
        <BilingualField
          label="Cheo / taaluma"
          sw={profile.role.sw}
          en={profile.role.en}
          onSw={(v) => setProfile({ ...profile, role: { ...profile.role, sw: v } })}
          onEn={(v) => setProfile({ ...profile, role: { ...profile.role, en: v } })}
        />
      </div>

      {/* Takwimu */}
      <div className="mt-6 rounded-2xl border border-forest-dark/10 bg-white p-6">
        <p className="text-sm font-semibold text-forest">Takwimu (mf. miaka ya uzoefu, wakulima uliowasaidia)</p>
        <div className="mt-4 space-y-3">
          {profile.stats.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-md border border-forest-dark/10 p-3 sm:grid-cols-[8rem_1fr_auto]">
              <TextField label="Namba" value={s.value} onChange={(v) => updateStat(i, { value: v })} placeholder="mf. 8+" />
              <BilingualField
                label="Maelezo"
                sw={s.label.sw}
                en={s.label.en}
                onSw={(v) => updateStat(i, { label: { ...s.label, sw: v } })}
                onEn={(v) => updateStat(i, { label: { ...s.label, en: v } })}
              />
              <button
                onClick={() => setProfile({ ...profile, stats: profile.stats.filter((_, idx) => idx !== i) })}
                className="self-end rounded-md border border-red-200 px-3 py-2 text-sm text-red-600"
              >
                Futa
              </button>
            </div>
          ))}
          <button
            onClick={() => setProfile({ ...profile, stats: [...profile.stats, NEW_STAT] })}
            className="text-sm font-medium text-forest hover:underline"
          >
            + Ongeza takwimu
          </button>
        </div>
      </div>

      {/* Vyeti */}
      <div className="mt-6 rounded-2xl border border-forest-dark/10 bg-white p-6">
        <p className="text-sm font-semibold text-forest">Elimu, vyeti na uzoefu</p>
        <div className="mt-4 space-y-4">
          {profile.credentials.map((c, i) => (
            <div key={i} className="space-y-4 rounded-md border border-forest-dark/10 p-4">
              <BilingualField
                label="Jina la cheti / shahada / kazi"
                sw={c.title.sw}
                en={c.title.en}
                onSw={(v) => updateCredential(i, { title: { ...c.title, sw: v } })}
                onEn={(v) => updateCredential(i, { title: { ...c.title, en: v } })}
              />
              <BilingualField
                label="Taasisi / mahali"
                sw={c.org.sw}
                en={c.org.en}
                onSw={(v) => updateCredential(i, { org: { ...c.org, sw: v } })}
                onEn={(v) => updateCredential(i, { org: { ...c.org, en: v } })}
              />
              <div className="max-w-[10rem]">
                <TextField
                  label="Mwaka"
                  value={c.year}
                  onChange={(v) => updateCredential(i, { year: v })}
                  placeholder="mf. 2019"
                />
              </div>
              <SingleImageUpload
                label="Picha ya cheti (hiari)"
                value={c.image_url}
                onChange={(url) => updateCredential(i, { image_url: url })}
                folder="credentials"
              />
              <div className="flex gap-2 text-xs">
                <button onClick={() => moveCredential(i, -1)} className="rounded-md border border-forest-dark/20 px-3 py-1.5">
                  ↑ Juu
                </button>
                <button onClick={() => moveCredential(i, 1)} className="rounded-md border border-forest-dark/20 px-3 py-1.5">
                  ↓ Chini
                </button>
                <button
                  onClick={() =>
                    setProfile({ ...profile, credentials: profile.credentials.filter((_, idx) => idx !== i) })
                  }
                  className="rounded-md border border-red-200 px-3 py-1.5 text-red-600"
                >
                  Futa
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setProfile({ ...profile, credentials: [...profile.credentials, NEW_CREDENTIAL] })}
            className="text-sm font-medium text-forest hover:underline"
          >
            + Ongeza cheti / elimu / uzoefu
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Inahifadhi..." : "Hifadhi wasifu"}
        </button>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </div>
    </div>
  );
}
