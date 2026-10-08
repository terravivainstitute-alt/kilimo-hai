"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/content";
import { inputCls } from "@/app/components/admin/ui";

const ORDER_STATUSES: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: Order["payment_status"][] = ["unpaid", "paid", "failed"];
const PROVIDERS = ["", "M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa", "Pesa taslimu", "Benki"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Inasubiri",
  confirmed: "Imethibitishwa",
  shipped: "Imetumwa",
  delivered: "Imefika",
  cancelled: "Imefutwa",
  unpaid: "Haijalipwa",
  paid: "Imelipwa",
  failed: "Malipo yameshindwa",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }

  async function update(id: string, patch: Partial<Order>) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    await supabase.from("orders").update(patch).eq("id", id);
  }

  async function remove(o: Order) {
    if (!window.confirm("Futa oda hii? Hatua hii haiwezi kurudishwa.")) return;
    const { error } = await supabase.from("orders").delete().eq("id", o.id);
    if (!error) setOrders((prev) => prev.filter((x) => x.id !== o.id));
  }

  const shown = orders.filter((o) => filter === "all" || o.payment_status === filter);

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Oda za duka
      </h1>

      <div className="mt-5 flex gap-2 text-xs">
        {(["all", "unpaid", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 ${
              filter === f ? "bg-forest-dark text-cream" : "border border-forest-dark/20 text-ink/70"
            }`}
          >
            {f === "all" ? "Zote" : f === "unpaid" ? "Hazijalipwa" : "Zilizolipwa"}
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className="mt-6 text-sm text-ink/50">Hakuna oda.</p>}

      <div className="mt-6 space-y-4">
        {shown.map((o) => (
          <div key={o.id} className="rounded-2xl border border-forest-dark/10 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-forest-dark">
                  #{o.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="mt-1 font-medium text-ink">{o.customer_name}</p>
                <p className="text-sm text-ink/60">
                  {o.phone}
                  {o.region ? ` · ${o.region}` : ""}
                </p>
                <p className="mt-1 text-xs text-ink/40">
                  {new Date(o.created_at).toLocaleString("sw-TZ")}
                </p>
              </div>
              <p className="text-lg font-semibold text-forest-dark">
                {Number(o.total_amount).toLocaleString()} TZS
              </p>
            </div>

            <ul className="mt-4 space-y-1 rounded-md bg-cream px-4 py-3 text-sm text-ink/75">
              {o.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>{(it.price * it.qty).toLocaleString()} TZS</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block text-xs text-ink/50">
                Hali ya oda
                <select
                  value={o.status}
                  onChange={(e) => update(o.id, { status: e.target.value as Order["status"] })}
                  className={inputCls}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-ink/50">
                Malipo
                <select
                  value={o.payment_status}
                  onChange={(e) =>
                    update(o.id, { payment_status: e.target.value as Order["payment_status"] })
                  }
                  className={`${inputCls} ${o.payment_status === "paid" ? "border-forest" : ""}`}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-ink/50">
                Njia ya malipo
                <select
                  value={o.payment_provider ?? ""}
                  onChange={(e) => update(o.id, { payment_provider: e.target.value || null })}
                  className={inputCls}
                >
                  {PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p || "—"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-ink/50">
                Kumbukumbu ya muamala
                <input
                  defaultValue={o.payment_reference ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim() || null;
                    if (v !== (o.payment_reference ?? null)) update(o.id, { payment_reference: v });
                  }}
                  placeholder="mf. namba ya SMS"
                  className={inputCls}
                />
              </label>
            </div>

            <button
              onClick={() => remove(o)}
              className="mt-4 rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600"
            >
              Futa oda
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
