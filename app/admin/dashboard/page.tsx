"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [counts, setCounts] = useState({
    pendingBookings: 0,
    pendingOrders: 0,
    products: 0,
  });

  useEffect(() => {
    async function load() {
      const [{ count: pendingBookings }, { count: pendingOrders }, { count: products }] =
        await Promise.all([
          supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase.from("products").select("*", { count: "exact", head: true }),
        ]);

      setCounts({
        pendingBookings: pendingBookings ?? 0,
        pendingOrders: pendingOrders ?? 0,
        products: products ?? 0,
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Muhtasari
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Bookings zinazosubiri" value={counts.pendingBookings} />
        <StatCard label="Oda zinazosubiri" value={counts.pendingOrders} />
        <StatCard label="Bidhaa zilizopo" value={counts.products} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-forest-dark/10 bg-white p-6">
      <p className="text-3xl font-semibold text-forest-dark">{value}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </div>
  );
}
