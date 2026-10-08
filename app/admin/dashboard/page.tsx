"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Counts {
  pendingBookings: number;
  unpaidOrders: number;
  services: number;
  products: number;
  events: number;
  posts: number;
}

export default function DashboardOverview() {
  const [counts, setCounts] = useState<Counts>({
    pendingBookings: 0,
    unpaidOrders: 0,
    services: 0,
    products: 0,
    events: 0,
    posts: 0,
  });

  useEffect(() => {
    async function count(table: string, status?: string, column = "status") {
      let q = supabase.from(table).select("*", { count: "exact", head: true });
      if (status) q = q.eq(column, status);
      const { count } = await q;
      return count ?? 0;
    }
    async function load() {
      const [pendingBookings, unpaidOrders, services, products, events, posts] = await Promise.all([
        count("bookings", "pending"),
        count("orders", "unpaid", "payment_status"),
        count("services"),
        count("products"),
        count("events"),
        count("blog_posts"),
      ]);
      setCounts({ pendingBookings, unpaidOrders, services, products, events, posts });
    }
    load();
  }, []);

  const cards = [
    { label: "Bookings zinazosubiri", value: counts.pendingBookings, href: "/admin/dashboard/bookings" },
    { label: "Oda zisizolipwa", value: counts.unpaidOrders, href: "/admin/dashboard/orders" },
    { label: "Huduma", value: counts.services, href: "/admin/dashboard/services" },
    { label: "Bidhaa", value: counts.products, href: "/admin/dashboard/products" },
    { label: "Matukio", value: counts.events, href: "/admin/dashboard/events" },
    { label: "Makala za blogu", value: counts.posts, href: "/admin/dashboard/blog" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Muhtasari
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-forest-dark/10 bg-white p-6 transition hover:border-forest/40"
          >
            <p className="text-3xl font-semibold text-forest-dark">{c.value}</p>
            <p className="mt-1 text-sm text-ink/60">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
