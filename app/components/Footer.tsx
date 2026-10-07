"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-forest-dark/10 bg-forest-dark text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-cream">
            Kilimo Hai
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">
            {t.home.whyBody}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-light/90">
            {t.nav.services}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link href="/huduma">{t.nav.services}</Link></li>
            <li><Link href="/duka">{t.nav.shop}</Link></li>
            <li><Link href="/blogu">{t.nav.blog}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-light/90">
            {t.nav.contact}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li>+255 000 000 000</li>
            <li>info@kilimohai.co.tz</li>
            <li>Mwanza, Tanzania</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Kilimo Hai. {t.footer.rights}
      </div>
    </footer>
  );
}
