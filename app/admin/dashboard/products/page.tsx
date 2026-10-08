"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types/content";
import { BilingualField, Notice, TextField, inputCls } from "@/app/components/admin/ui";
import { SingleImageUpload } from "@/app/components/admin/ImageUpload";
import { VideoUpload } from "@/app/components/admin/VideoUpload";

interface ProductForm {
  id: string | null;
  slug: string;
  name_sw: string;
  name_en: string;
  desc_sw: string;
  desc_en: string;
  category: Product["category"];
  price: string;
  unit: string;
  stock: string;
  image_url: string;
  videos: string[];
  is_active: boolean;
}

const EMPTY: ProductForm = {
  id: null,
  slug: "",
  name_sw: "",
  name_en: "",
  desc_sw: "",
  desc_en: "",
  category: "fertilizer",
  price: "",
  unit: "kg",
  stock: "0",
  image_url: "",
  videos: [],
  is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  }

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      slug: p.slug,
      name_sw: p.name.sw,
      name_en: p.name.en,
      desc_sw: p.description?.sw ?? "",
      desc_en: p.description?.en ?? "",
      category: p.category,
      price: String(p.price),
      unit: p.unit,
      stock: String(p.stock),
      image_url: p.image_url ?? "",
      videos: p.videos ?? [],
      is_active: p.is_active,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: form.slug || slugify(form.name_en || form.name_sw),
      name: { sw: form.name_sw, en: form.name_en },
      description: { sw: form.desc_sw, en: form.desc_en },
      category: form.category,
      price: Number(form.price) || 0,
      unit: form.unit || "kg",
      stock: Number(form.stock) || 0,
      image_url: form.image_url || null,
      videos: form.videos,
      is_active: form.is_active,
    };

    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` });
    } else {
      setMessage({ kind: "ok", text: form.id ? "Mabadiliko yamehifadhiwa." : "Bidhaa imeongezwa." });
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  }

  async function toggleActive(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
  }

  async function remove(p: Product) {
    if (!window.confirm(`Futa bidhaa "${p.name.sw}"? Hatua hii haiwezi kurudishwa.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kufuta: ${error.message}` });
      return;
    }
    if (form.id === p.id) setForm(EMPTY);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Bidhaa
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-6"
      >
        <p className="text-sm font-semibold text-forest">
          {form.id ? "Hariri bidhaa" : "Ongeza bidhaa mpya"}
        </p>

        <BilingualField
          label="Jina la bidhaa"
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
        />

        <SingleImageUpload
          label="Picha ya bidhaa"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          folder="products"
        />

        <VideoUpload
          label="Video za bidhaa (hiari)"
          values={form.videos}
          onChange={(urls) => setForm({ ...form, videos: urls })}
          folder="products-video"
        />

        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block text-sm font-medium text-ink/80">
            Aina
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
              className={inputCls}
            >
              <option value="fertilizer">Mbolea</option>
              <option value="pesticide">Dawa ya wadudu</option>
              <option value="other">Nyingine</option>
            </select>
          </label>
          <TextField label="Bei (TZS)" type="number" required value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <TextField label="Kipimo (kg, lita...)" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
          <TextField label="Idadi iliyopo (stock)" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Ionekane kwenye duka
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? "Inahifadhi..." : form.id ? "Hifadhi mabadiliko" : "Ongeza bidhaa"}
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
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-dark/10 bg-white px-5 py-3"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-md bg-cream">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-forest-dark">
                  {p.name.sw} <span className="text-ink/40">/ {p.name.en}</span>
                </p>
                <p className="text-xs text-ink/50">
                  {p.price.toLocaleString()} TZS/{p.unit} · stock: {p.stock} ·{" "}
                  {p.is_active ? "Inaonekana" : "Imefichwa"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                Hariri
              </button>
              <button onClick={() => toggleActive(p)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                {p.is_active ? "Ficha" : "Onyesha"}
              </button>
              <button onClick={() => remove(p)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600">
                Futa
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-sm text-ink/50">Hakuna bidhaa bado.</p>}
      </div>
    </div>
  );
}
