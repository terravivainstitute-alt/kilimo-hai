"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import type { Service } from "@/types/content";
import { BilingualField, Notice, TextField } from "@/app/components/admin/ui";

interface PackageForm {
  name_sw: string;
  name_en: string;
  price: string;
}

interface ServiceForm {
  id: string | null;
  slug: string;
  name_sw: string;
  name_en: string;
  desc_sw: string;
  desc_en: string;
  sort_order: string;
  is_active: boolean;
  packages: PackageForm[];
}

const EMPTY: ServiceForm = {
  id: null,
  slug: "",
  name_sw: "",
  name_en: "",
  desc_sw: "",
  desc_en: "",
  sort_order: "0",
  is_active: true,
  packages: [],
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setItems(data as Service[]);
  }

  function startEdit(s: Service) {
    setForm({
      id: s.id,
      slug: s.slug,
      name_sw: s.name.sw,
      name_en: s.name.en,
      desc_sw: s.description.sw,
      desc_en: s.description.en,
      sort_order: String(s.sort_order),
      is_active: s.is_active,
      packages: (s.packages ?? []).map((p) => ({
        name_sw: p.name.sw,
        name_en: p.name.en,
        price: String(p.price),
      })),
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updatePackage(i: number, patch: Partial<PackageForm>) {
    setForm((f) => ({
      ...f,
      packages: f.packages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: form.slug || slugify(form.name_en || form.name_sw),
      name: { sw: form.name_sw, en: form.name_en },
      description: { sw: form.desc_sw, en: form.desc_en },
      packages: form.packages.map((p) => ({
        name: { sw: p.name_sw, en: p.name_en },
        price: Number(p.price) || 0,
      })),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const { error } = form.id
      ? await supabase.from("services").update(payload).eq("id", form.id)
      : await supabase.from("services").insert(payload);

    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` });
    } else {
      setMessage({ kind: "ok", text: form.id ? "Mabadiliko yamehifadhiwa." : "Huduma imeongezwa." });
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  }

  async function toggleActive(s: Service) {
    setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
    await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
  }

  async function remove(s: Service) {
    if (!window.confirm(`Futa huduma "${s.name.sw}"? Hatua hii haiwezi kurudishwa.`)) return;
    const { error } = await supabase.from("services").delete().eq("id", s.id);
    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kufuta: ${error.message}` });
      return;
    }
    if (form.id === s.id) setForm(EMPTY);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Huduma
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-6"
      >
        <p className="text-sm font-semibold text-forest">
          {form.id ? "Hariri huduma" : "Ongeza huduma mpya"}
        </p>

        <BilingualField
          label="Jina la huduma"
          sw={form.name_sw}
          en={form.name_en}
          onSw={(v) => setForm({ ...form, name_sw: v })}
          onEn={(v) => setForm({ ...form, name_en: v })}
          required
        />
        <BilingualField
          label="Maelezo"
          sw={form.desc_sw}
          en={form.desc_en}
          onSw={(v) => setForm({ ...form, desc_sw: v })}
          onEn={(v) => setForm({ ...form, desc_en: v })}
          multiline
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Mpangilio (namba ndogo hutangulia)"
            type="number"
            value={form.sort_order}
            onChange={(v) => setForm({ ...form, sort_order: v })}
          />
          <label className="flex items-end gap-2 pb-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Ionekane kwenye tovuti
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-ink/80">Vifurushi</p>
          <div className="mt-2 space-y-3">
            {form.packages.map((p, i) => (
              <div key={i} className="grid gap-2 rounded-md border border-forest-dark/10 p-3 sm:grid-cols-[1fr_1fr_8rem_auto]">
                <input
                  placeholder="Jina (Kiswahili)"
                  value={p.name_sw}
                  onChange={(e) => updatePackage(i, { name_sw: e.target.value })}
                  className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Name (English)"
                  value={p.name_en}
                  onChange={(e) => updatePackage(i, { name_en: e.target.value })}
                  className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Bei (TZS)"
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePackage(i, { price: e.target.value })}
                  className="rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, packages: form.packages.filter((_, idx) => idx !== i) })}
                  className="rounded-md border border-red-200 px-3 text-sm text-red-600"
                >
                  Futa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, packages: [...form.packages, { name_sw: "", name_en: "", price: "0" }] })
              }
              className="text-sm font-medium text-forest hover:underline"
            >
              + Ongeza kifurushi
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? "Inahifadhi..." : form.id ? "Hifadhi mabadiliko" : "Ongeza huduma"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="rounded-full border border-forest-dark/20 px-6 py-2.5 text-sm text-ink/70"
            >
              Acha kuhariri
            </button>
          )}
        </div>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </form>

      <div className="mt-8 space-y-3">
        {items.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-dark/10 bg-white px-5 py-3"
          >
            <div>
              <p className="font-medium text-forest-dark">
                {s.name.sw} <span className="text-ink/40">/ {s.name.en}</span>
              </p>
              <p className="text-xs text-ink/50">
                Vifurushi: {s.packages?.length ?? 0} · {s.is_active ? "Inaonekana" : "Imefichwa"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                Hariri
              </button>
              <button onClick={() => toggleActive(s)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                {s.is_active ? "Ficha" : "Onyesha"}
              </button>
              <button onClick={() => remove(s)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600">
                Futa
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">Hakuna huduma bado.</p>}
      </div>
    </div>
  );
}
