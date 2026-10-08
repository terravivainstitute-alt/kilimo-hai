"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PaymentMethod, PaymentSettings } from "@/types/content";
import { BilingualField, Notice, inputCls } from "@/app/components/admin/ui";

const DEFAULT: PaymentSettings = {
  methods: [],
  note: {
    sw: "Lipa kwa mobile money kisha tutathibitisha oda yako na kuwasiliana nawe.",
    en: "Pay by mobile money and we will confirm your order and contact you.",
  },
};

const SUGGESTED = ["M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa"];

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", "payment")
        .maybeSingle();
      if (data?.content) setSettings({ ...DEFAULT, ...(data.content as PaymentSettings) });
      setLoading(false);
    }
    load();
  }, []);

  function updateMethod(i: number, patch: Partial<PaymentMethod>) {
    setSettings((s) => ({
      ...s,
      methods: s.methods.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("site_content").upsert({
      key: "payment",
      content: settings,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setMessage(
      error
        ? { kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` }
        : { kind: "ok", text: "Mipangilio ya malipo imehifadhiwa." }
    );
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Mipangilio ya Malipo
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Mteja akiweka oda, ataona namba hizi za kulipia pamoja na namba ya oda yake. Ukiona malipo
        yako, nenda kwenye <em>Oda za duka</em> uweke hali ya malipo kuwa &quot;Imelipwa&quot;.
      </p>

      <div className="mt-6 space-y-3">
        {settings.methods.map((m, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-forest-dark/10 bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              list="payment-names"
              placeholder="Mtandao (mf. M-Pesa)"
              value={m.name}
              onChange={(e) => updateMethod(i, { name: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Namba ya kulipia"
              value={m.number}
              onChange={(e) => updateMethod(i, { number: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder="Jina la akaunti"
              value={m.account_name}
              onChange={(e) => updateMethod(i, { account_name: e.target.value })}
              className={inputCls}
            />
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, methods: s.methods.filter((_, idx) => idx !== i) }))
              }
              className="mt-1 rounded-md border border-red-200 px-3 text-sm text-red-600"
            >
              Futa
            </button>
          </div>
        ))}
        <datalist id="payment-names">
          {SUGGESTED.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <button
          onClick={() =>
            setSettings((s) => ({
              ...s,
              methods: [...s.methods, { name: "", number: "", account_name: "" }],
            }))
          }
          className="text-sm font-medium text-forest hover:underline"
        >
          + Ongeza njia ya malipo
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-forest-dark/10 bg-white p-5">
        <BilingualField
          label="Maelezo ya ziada kwa mteja"
          sw={settings.note.sw}
          en={settings.note.en}
          onSw={(v) => setSettings({ ...settings, note: { ...settings.note, sw: v } })}
          onEn={(v) => setSettings({ ...settings, note: { ...settings.note, en: v } })}
          multiline
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Inahifadhi..." : "Hifadhi"}
        </button>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </div>
    </div>
  );
}
