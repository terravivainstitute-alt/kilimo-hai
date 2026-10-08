"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-dark/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <LeafMark />
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
            <LangToggle lang={lang} setLang={setLang} />
          </nav>
        </div>
      )}
    </header>
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

function LeafMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#2f6b3f" strokeWidth="1.5" opacity="0.3" />
      <path
        d="M14 20c-4-2-6-6-4-10 3 1 6 3 7 6 1-3 4-5 7-6 2 4 0 8-4 10-2 1-4 1-6 0Z"
        fill="#2f6b3f"
      />
    </svg>
  );
}
