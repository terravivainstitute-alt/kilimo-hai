"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { dictionaries, flatten, type Overrides } from "@/lib/LanguageContext";
import type { Lang } from "@/types/content";
import { Notice } from "@/app/components/admin/ui";

const SECTION_LABELS: Record<string, string> = {
  common: "Jumla (jina la biashara, n.k.)",
  nav: "Menyu ya juu",
  home: "Ukurasa wa kwanza",
  services: "Huduma",
  booking: "Fomu ya booking",
  shop: "Duka",
  about: "Kuhusu",
  blog: "Blogu",
  events: "Matukio",
  contact: "Wasiliana",
  footer: "Chini ya ukurasa (footer)",
};

export default function AdminWordsPage() {
  const [lang, setLang] = useState<Lang>("sw");
  const [overrides, setOverrides] = useState<Record<Lang, Overrides>>({ sw: {}, en: {} });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", "ui_strings")
        .maybeSingle();
      if (data?.content) {
        setOverrides({
          sw: (data.content.sw as Overrides) ?? {},
          en: (data.content.en as Overrides) ?? {},
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const defaults = useMemo(() => flatten(dictionaries[lang]), [lang]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: Record<string, string[]> = {};
    for (const key of Object.keys(defaults)) {
      const current = overrides[lang][key] ?? defaults[key];
      if (q && !key.toLowerCase().includes(q) && !current.toLowerCase().includes(q)) continue;
      const section = key.split(".")[0];
      (out[section] ||= []).push(key);
    }
    return out;
  }, [defaults, overrides, lang, query]);

  function setValue(key: string, value: string) {
    setOverrides((prev) => {
      const next = { ...prev[lang] };
      if (value === defaults[key]) delete next[key];
      else next[key] = value;
      return { ...prev, [lang]: next };
    });
    setMessage(null);
  }

  function reset(key: string) {
    setOverrides((prev) => {
      const next = { ...prev[lang] };
      delete next[key];
      return { ...prev, [lang]: next };
    });
    setMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("site_content").upsert({
      key: "ui_strings",
      content: overrides,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setMessage(
      error
        ? { kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` }
        : { kind: "ok", text: "Maneno yamehifadhiwa. Yataonekana kwenye tovuti mara moja." }
    );
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Maneno ya Tovuti
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        Hapa unaweza kubadilisha au kufuta neno lolote linaloonekana kwenye tovuti (menyu, vitufe,
        vichwa vya habari, ujumbe). Futa maandishi yote ili kuficha neno hilo. Bonyeza
        &quot;Rudisha&quot; kurudisha neno la awali.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-forest-dark/20 p-0.5 text-xs font-medium">
          {(["sw", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 transition ${
                lang === l ? "bg-forest-dark text-cream" : "text-ink/60"
              }`}
            >
              {l === "sw" ? "Kiswahili" : "English"}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tafuta neno..."
          className="w-full max-w-xs rounded-md border border-forest-dark/20 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-8 space-y-10">
        {Object.entries(groups).map(([section, keys]) => (
          <section key={section}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-forest">
              {SECTION_LABELS[section] ?? section}
            </h2>
            <div className="mt-3 space-y-3">
              {keys.map((key) => {
                const value = overrides[lang][key] ?? defaults[key];
                const changed = key in overrides[lang];
                const long = defaults[key].length > 70 || value.length > 70;
                return (
                  <div key={key} className="rounded-xl border border-forest-dark/10 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-ink/40">{key}</p>
                      {changed && (
                        <button
                          onClick={() => reset(key)}
                          className="text-xs text-forest hover:underline"
                        >
                          Rudisha
                        </button>
                      )}
                    </div>
                    {long ? (
                      <textarea
                        rows={3}
                        value={value}
                        onChange={(e) => setValue(key, e.target.value)}
                        className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(e) => setValue(key, e.target.value)}
                        className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        {Object.keys(groups).length === 0 && (
          <p className="text-sm text-ink/50">Hakuna neno linalolingana na utafutaji wako.</p>
        )}
      </div>

      <div className="sticky bottom-4 mt-10 flex flex-wrap items-center gap-4 rounded-full border border-forest-dark/10 bg-white/95 px-5 py-3 backdrop-blur">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-forest px-6 py-2 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Inahifadhi..." : "Hifadhi maneno"}
        </button>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </div>
    </div>
  );
}
