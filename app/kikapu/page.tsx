"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { useCart } from "@/lib/CartContext";
import { optimizeImage } from "@/lib/media";
import type { PaymentSettings } from "@/types/content";

interface Placed {
  id: string;
  total: number;
}

export default function KikapuPage() {
  const { lang, t } = useLanguage();
  const cart = useCart();
  const [form, setForm] = useState({ name: "", phone: "", region: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [payment, setPayment] = useState<PaymentSettings | null>(null);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("key", "payment")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setPayment(data.content as PaymentSettings);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cart.items.length === 0) return;
    setPlacing(true);
    setError(null);

    const { data, error: rpcError } = await supabase.rpc("place_order", {
      p_name: form.name,
      p_phone: form.phone,
      p_region: form.region,
      p_items: cart.items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
    });

    setPlacing(false);

    if (rpcError || !data) {
      const msg = rpcError?.message ?? "";
      if (msg.includes("out_of_stock")) setError(t.cart.errorStock);
      else if (msg.includes("product_unavailable")) setError(t.cart.errorUnavailable);
      else setError(t.cart.errorGeneric);
      return;
    }

    setPlaced({ id: String((data as { id: string }).id), total: Number((data as { total: number }).total) });
    cart.clear();
  }

  // ----- Oda imetumwa
  if (placed) {
    const ref = placed.id.slice(0, 8).toUpperCase();
    const methods = payment?.methods ?? [];
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark">
          {t.cart.successTitle}
        </h1>

        <div className="mt-8 space-y-3 rounded-2xl border border-forest-dark/10 bg-white p-6">
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">{t.cart.reference}</span>
            <span className="font-mono font-semibold text-forest-dark">{ref}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">{t.cart.amountToPay}</span>
            <span className="font-semibold text-forest-dark">{placed.total.toLocaleString()} TZS</span>
          </div>
        </div>

        <h2 className="mt-8 font-[family-name:var(--font-display)] text-xl font-semibold text-forest-dark">
          {t.cart.payHow}
        </h2>
        {payment?.note && <p className="mt-2 text-sm text-ink/70">{pick(lang, payment.note)}</p>}

        {methods.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {methods.map((m, i) => (
              <li key={i} className="rounded-xl border border-forest-dark/10 bg-white p-4 text-sm">
                <p className="font-semibold text-forest-dark">{m.name}</p>
                <p className="mt-1 font-mono text-lg text-ink">{m.number}</p>
                {m.account_name && (
                  <p className="text-ink/60">
                    {t.cart.accountName}: {m.account_name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink/70">{t.cart.noMethods}</p>
        )}
        <p className="mt-4 text-sm text-ink/70">{t.cart.payNote}</p>

        <Link
          href="/duka"
          className="mt-8 inline-block rounded-full border border-forest px-6 py-2.5 text-sm font-medium text-forest transition hover:bg-forest hover:text-cream"
        >
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  // ----- Kikapu tupu
  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark">
          {t.cart.title}
        </h1>
        <p className="mt-4 text-ink/60">{t.cart.empty}</p>
        <Link
          href="/duka"
          className="mt-8 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
        >
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.cart.title}
      </h1>

      <ul className="mt-8 divide-y divide-forest-dark/10 rounded-2xl border border-forest-dark/10 bg-white">
        {cart.items.map((item) => (
          <li key={item.product_id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cream">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizeImage(item.image_url, 160)} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-forest-dark">{pick(lang, item.name)}</p>
              <p className="text-sm text-ink/60">
                {item.price.toLocaleString()} TZS / {item.unit}
              </p>
            </div>
            <div className="flex items-center rounded-full border border-forest-dark/20 text-sm">
              <button
                aria-label="-"
                onClick={() => cart.setQty(item.product_id, item.qty - 1)}
                className="px-3 py-1"
              >
                −
              </button>
              <span className="min-w-6 text-center">{item.qty}</span>
              <button
                aria-label="+"
                onClick={() => cart.setQty(item.product_id, item.qty + 1)}
                className="px-3 py-1"
              >
                +
              </button>
            </div>
            <p className="w-28 text-right font-medium text-forest-dark">
              {(item.price * item.qty).toLocaleString()} TZS
            </p>
            <button
              onClick={() => cart.remove(item.product_id)}
              className="text-xs text-red-600 hover:underline"
            >
              {t.cart.remove}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between px-2 text-lg">
        <span className="text-ink/70">{t.cart.total}</span>
        <span className="font-semibold text-forest-dark">{cart.total.toLocaleString()} TZS</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-forest-dark">
          {t.cart.checkoutTitle}
        </h2>
        <label className="block text-sm font-medium text-ink/80">
          {t.cart.name}
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="block text-sm font-medium text-ink/80">
          {t.cart.phone}
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
          />
        </label>
        <label className="block text-sm font-medium text-ink/80">
          {t.cart.region}
          <input
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className={inputCls}
          />
        </label>

        {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="rounded-full bg-harvest px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {placing ? t.cart.placing : t.cart.placeOrder}
        </button>
      </form>
    </div>
  );
}
