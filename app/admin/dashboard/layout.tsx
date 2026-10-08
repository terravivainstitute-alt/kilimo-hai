"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/admin/dashboard", label: "Muhtasari" },
  { href: "/admin/dashboard/bookings", label: "Bookings" },
  { href: "/admin/dashboard/orders", label: "Oda za duka" },
  { href: "/admin/dashboard/services", label: "Huduma" },
  { href: "/admin/dashboard/products", label: "Bidhaa" },
  { href: "/admin/dashboard/events", label: "Matukio na Picha" },
  { href: "/admin/dashboard/blog", label: "Blogu" },
  { href: "/admin/dashboard/content", label: "Maudhui na Mawasiliano" },
  { href: "/admin/dashboard/malipo", label: "Mipangilio ya Malipo" },
  { href: "/admin/dashboard/words", label: "Maneno ya Tovuti" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);

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

  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setAllowed(undefined);
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => setAllowed(data === true));
  }, [userId]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (session === undefined || (session && allowed === undefined)) {
    return <p className="px-6 py-16 text-sm text-ink/50">Inapakia...</p>;
  }
  if (!session) return null;

  if (!allowed) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-ink/75">Akaunti hii haina ruhusa ya admin.</p>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream"
        >
          Toka (Logout)
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:gap-10">
      <aside className="shrink-0 md:w-56">
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                pathname === item.href
                  ? "bg-forest text-cream"
                  : "text-ink/70 hover:bg-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 block rounded-md px-3 py-2 text-left text-sm text-ink/50 hover:bg-white md:w-full"
        >
          Toka (Logout)
        </button>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
