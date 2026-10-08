"use client";

import Link from "next/link";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { useContact } from "@/lib/useContact";

export default function Footer() {
  const { lang, t } = useLanguage();
  const contact = useContact();

  return (
    <footer className="border-t border-forest-dark/10 bg-forest-dark text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-cream">
            {t.common.brand}
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">{t.home.whyBody}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-light/90">
            {t.nav.services}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link href="/huduma">{t.nav.services}</Link></li>
            <li><Link href="/duka">{t.nav.shop}</Link></li>
            <li><Link href="/matukio">{t.nav.events}</Link></li>
            <li><Link href="/blogu">{t.nav.blog}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-light/90">
            {t.nav.contact}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li>{contact.phone}</li>
            <li>{contact.email}</li>
            <li>{pick(lang, contact.location)}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {t.common.brand}. {t.footer.rights}
      </div>
    </footer>
  );
}
