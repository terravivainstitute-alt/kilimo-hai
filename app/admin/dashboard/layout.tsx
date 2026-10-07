"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/admin/dashboard", label: "Muhtasari" },
  { href: "/admin/dashboard/bookings", label: "Bookings" },
  { href: "/admin/dashboard/products", label: "Bidhaa" },
  { href: "/admin/dashboard/content", label: "Maudhui" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace("/admin/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.replace("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (session === undefined) {
    return <p className="px-6 py-16 text-sm text-ink/50">Inapakia...</p>;
  }
  if (!session) return null;

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
      <aside className="w-48 shrink-0">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                pathname === item.href
                  ? "bg-forest text-cream"
                  : "text-ink/70 hover:bg-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 block w-full rounded-md px-3 py-2 text-left text-sm text-ink/50 hover:bg-cream"
        >
          Toka (Logout)
        </button>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
