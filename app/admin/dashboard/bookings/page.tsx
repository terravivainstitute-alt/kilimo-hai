"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/types/content";

const STATUSES: Booking["status"][] = [
  "pending",
  "confirmed",
  "in_progress",
  "done",
  "cancelled",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Booking["status"]) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await supabase.from("bookings").update({ status }).eq("id", id);
  }

  async function removeBooking(id: string) {
    if (!window.confirm("Futa booking hii? Hatua hii haiwezi kurudishwa.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (!error) setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading) return <p className="text-sm text-ink/50">Inapakia...</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="mt-6 text-sm text-ink/50">Hakuna booking bado.</p>
      )}

      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-forest-dark/10 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-forest-dark">{b.farmer_name}</p>
                <p className="text-sm text-ink/60">{b.phone}</p>
                <p className="mt-1 text-xs text-ink/40">
                  {new Date(b.created_at).toLocaleString("sw-TZ")}
                </p>
              </div>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
              {b.region && <p>Mkoa: {b.region}</p>}
              {b.district && <p>Wilaya: {b.district}</p>}
              {b.farm_size_acres && <p>Ukubwa: {b.farm_size_acres} ekari</p>}
              {b.crop && <p>Zao: {b.crop}</p>}
              {b.package_name && <p>Kifurushi: {b.package_name}</p>}
            </div>
            {b.notes && (
              <p className="mt-3 rounded-md bg-cream px-3 py-2 text-sm text-ink/70">
                {b.notes}
              </p>
            )}
            <button
              onClick={() => removeBooking(b.id)}
              className="mt-4 rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600"
            >
              Futa booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
