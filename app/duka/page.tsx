"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { Product } from "@/types/content";

export default function DukaPage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setProducts(data as Product[]);
    }
    load();
  }, []);

  const fertilizer = products.filter((p) => p.category === "fertilizer");
  const pesticide = products.filter((p) => p.category === "pesticide");
  const other = products.filter((p) => p.category === "other");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.shop.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t.shop.intro}</p>

      {products.length === 0 && (
        <p className="mt-12 text-sm text-ink/50">
          {lang === "sw" ? "Bidhaa zinakuja hivi karibuni." : "Products coming soon."}
        </p>
      )}

      {fertilizer.length > 0 && (
        <ProductGroup title={t.shop.fertilizer} products={fertilizer} lang={lang} outOfStock={t.shop.outOfStock} addToCart={t.shop.addToCart} />
      )}
      {pesticide.length > 0 && (
        <ProductGroup title={t.shop.pesticide} products={pesticide} lang={lang} outOfStock={t.shop.outOfStock} addToCart={t.shop.addToCart} />
      )}
      {other.length > 0 && (
        <ProductGroup title={lang === "sw" ? "Nyingine" : "Other"} products={other} lang={lang} outOfStock={t.shop.outOfStock} addToCart={t.shop.addToCart} />
      )}
    </div>
  );
}

function ProductGroup({
  title,
  products,
  lang,
  outOfStock,
  addToCart,
}: {
  title: string;
  products: Product[];
  lang: "sw" | "en";
  outOfStock: string;
  addToCart: string;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        {title}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-forest-dark/10 bg-white"
          >
            <div className="aspect-[4/3] bg-cream">
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt={pick(lang, p.name)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="p-5">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest-dark">
                {pick(lang, p.name)}
              </p>
              {p.description && (
                <p className="mt-1 text-sm text-ink/60">{pick(lang, p.description)}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium text-forest-dark">
                  {p.price.toLocaleString()} TZS
                  <span className="text-xs text-ink/50"> / {p.unit}</span>
                </span>
                {p.stock > 0 ? (
                  <button className="rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-cream transition hover:bg-forest-dark">
                    {addToCart}
                  </button>
                ) : (
                  <span className="text-xs text-ink/40">{outOfStock}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
