"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { buildMedia, type MediaItem } from "@/lib/media";
import MediaLightbox, { MediaTile } from "@/app/components/MediaLightbox";
import type { Product } from "@/types/content";

type Viewer = { items: MediaItem[]; index: number | null };

export default function DukaPage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [viewer, setViewer] = useState<Viewer>({ items: [], index: null });

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

  const groupProps = {
    lang,
    outOfStock: t.shop.outOfStock,
    addToCart: t.shop.addToCart,
    onOpen: (items: MediaItem[], index: number) => setViewer({ items, index }),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.shop.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t.shop.intro}</p>

      {products.length === 0 && (
        <p className="mt-12 text-sm text-ink/50">{t.shop.empty}</p>
      )}

      {fertilizer.length > 0 && (
        <ProductGroup title={t.shop.fertilizer} products={fertilizer} {...groupProps} />
      )}
      {pesticide.length > 0 && (
        <ProductGroup title={t.shop.pesticide} products={pesticide} {...groupProps} />
      )}
      {other.length > 0 && (
        <ProductGroup title={t.common.other} products={other} {...groupProps} />
      )}

      <MediaLightbox
        items={viewer.items}
        index={viewer.index}
        onClose={() => setViewer((v) => ({ ...v, index: null }))}
        onChange={(i) => setViewer((v) => ({ ...v, index: i }))}
      />
    </div>
  );
}

function ProductGroup({
  title,
  products,
  lang,
  outOfStock,
  addToCart,
  onOpen,
}: {
  title: string;
  products: Product[];
  lang: "sw" | "en";
  outOfStock: string;
  addToCart: string;
  onOpen: (items: MediaItem[], index: number) => void;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        {title}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const media = buildMedia(p.image_url ? [p.image_url] : [], p.videos);
          return (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl border border-forest-dark/10 bg-white"
            >
              <div className="aspect-[4/3] bg-cream">
                {media.length > 0 && (
                  <button
                    onClick={() => onOpen(media, 0)}
                    className="relative block h-full w-full"
                  >
                    <MediaTile item={media[0]} alt={pick(lang, p.name)} className="h-full w-full" />
                    {media.length > 1 && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white">
                        +{media.length - 1}
                      </span>
                    )}
                  </button>
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
          );
        })}
      </div>
    </section>
  );
}
