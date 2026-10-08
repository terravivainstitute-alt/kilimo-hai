"use client";

import { useLanguage, pick } from "@/lib/LanguageContext";
import { useContact } from "@/lib/useContact";

export default function WasilianaPage() {
  const { lang, t } = useLanguage();
  const contact = useContact();
  const waNumber = contact.whatsapp.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.contact.title}
      </h1>

      <div className="mt-10 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-8">
        <ContactRow label={t.contact.phone} value={contact.phone} />
        <ContactRow label={t.contact.email} value={contact.email} />
        <ContactRow label={t.contact.location} value={pick(lang, contact.location)} />
      </div>

      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
        >
          {t.contact.whatsapp}
        </a>
      )}
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-forest-dark/5 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-ink/50">{label}</span>
      <span className="text-right text-sm font-medium text-ink/80">{value}</span>
    </div>
  );
}
