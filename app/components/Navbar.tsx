"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useCart } from "@/lib/CartContext";

const links = [
  { href: "/", key: "home" as const },
  { href: "/huduma", key: "services" as const },
  { href: "/duka", key: "shop" as const },
  { href: "/matukio", key: "events" as const },
  { href: "/kuhusu", key: "about" as const },
  { href: "/blogu", key: "blog" as const },
  { href: "/wasiliana", key: "contact" as const },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-dark/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" width={34} height={34} className="h-8 w-auto" />
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-forest-dark">
            {t.common.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink/80 transition hover:text-forest"
            >
              {t.nav[l.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <CartLink count={count} label={t.nav.cart} />
          <LangToggle lang={lang} setLang={setLang} />
          <Link
            href="/booking"
            className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream transition hover:bg-forest-dark"
          >
            {t.nav.bookNow}
          </Link>
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="h-0.5 w-6 bg-forest-dark" />
          <span className="h-0.5 w-6 bg-forest-dark" />
          <span className="h-0.5 w-6 bg-forest-dark" />
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-dark/10 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-ink/80"
              >
                {t.nav[l.key]}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="w-fit rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream"
            >
              {t.nav.bookNow}
            </Link>
            <Link
              href="/kikapu"
              onClick={() => setOpen(false)}
              className="text-sm text-ink/80"
            >
              {t.nav.cart}
              {count > 0 ? ` (${count})` : ""}
            </Link>
            <LangToggle lang={lang} setLang={setLang} />
          </nav>
        </div>
      )}
    </header>
  );
}

function CartLink({ count, label }: { count: number; label: string }) {
  return (
    <Link
      href="/kikapu"
      aria-label={label}
      className="relative flex items-center text-forest-dark transition hover:text-forest"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2 3h3l2.6 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-harvest px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "sw" | "en";
  setLang: (l: "sw" | "en") => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-forest-dark/20 p-0.5 text-xs font-medium">
      <button
        onClick={() => setLang("sw")}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "sw" ? "bg-forest-dark text-cream" : "text-ink/60"
        }`}
      >
        SW
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "en" ? "bg-forest-dark text-cream" : "text-ink/60"
        }`}
      >
        EN
      </button>
    </div>
  );
}
