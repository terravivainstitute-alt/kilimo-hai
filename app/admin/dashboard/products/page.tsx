"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/content";

const EMPTY_FORM = {
  slug: "",
  name_sw: "",
  name_en: "",
  description_sw: "",
  description_en: "",
  category: "fertilizer" as Product["category"],
  price: "",
  unit: "kg",
  stock: "",
  image_url: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    await supabase.from("products").insert({
      slug: form.slug,
      name: { sw: form.name_sw, en: form.name_en },
      description: { sw: form.description_sw, en: form.description_en },
      category: form.category,
      price: Number(form.price) || 0,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      image_url: form.image_url || null,
    });

    setForm(EMPTY_FORM);
    await load();
    setSaving(false);
  }

  async function toggleActive(p: Product) {
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    );
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
  }

  async function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("products").delete().eq("id", id);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Bidhaa
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-3 rounded-2xl border border-forest-dark/10 bg-white p-6 sm:grid-cols-2"
      >
        <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
          className="mt-1 rounded-md border border-forest-dark/20 px-3 py-2 text-sm"
        >
          <option value="fertilizer">Mbolea (fertilizer)</option>
          <option value="pesticide">Dawa ya wadudu (pesticide)</option>
          <option value="other">Nyingine</option>
        </select>
        <Input label="Jina (Kiswahili)" value={form.name_sw} onChange={(v) => setForm({ ...form, name_sw: v })} required />
        <Input label="Name (English)" value={form.name_en} onChange={(v) => setForm({ ...form, name_en: v })} required />
        <Input label="Maelezo (Kiswahili)" value={form.description_sw} onChange={(v) => setForm({ ...form, description_sw: v })} />
        <Input label="Description (English)" value={form.description_en} onChange={(v) => setForm({ ...form, description_en: v })} />
        <Input label="Bei (TZS)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
        <Input label="Kipimo (kg/lita)" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
        <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
        <Input label="Picha (URL)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />

        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 mt-2 w-fit rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Inaongeza..." : "+ Ongeza bidhaa"}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-dark/10 bg-white px-5 py-3"
          >
            <div>
              <p className="font-medium text-forest-dark">{p.name.sw}</p>
              <p className="text-xs text-ink/50">
                {p.category} · {p.price.toLocaleString()} TZS/{p.unit} · stock: {p.stock}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(p)}
                className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs"
              >
                {p.is_active ? "Zima" : "Washa"}
              </button>
              <button
                onClick={() => removeProduct(p.id)}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600"
              >
                Futa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </label>
  );
}
