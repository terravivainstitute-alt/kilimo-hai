"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function WasilianaPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.contact.title}
      </h1>

      <div className="mt-10 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-8">
        <ContactRow label="Simu" value="+255 000 000 000" />
        <ContactRow label="Email" value="info@kilimohai.co.tz" />
        <ContactRow label="Mahali" value="Mwanza, Tanzania" />
      </div>

      <a
        href="https://wa.me/255000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
      >
        {t.contact.whatsapp}
      </a>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-forest-dark/5 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-ink/50">{label}</span>
      <span className="text-sm font-medium text-ink/80">{value}</span>
    </div>
  );
}
