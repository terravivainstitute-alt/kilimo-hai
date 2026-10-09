"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { Service } from "@/types/content";

export default function HudumaView({ initialServices }: { initialServices: Service[] }) {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState<Service[]>(initialServices);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setServices(data as Service[]);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.services.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t.services.intro}</p>

      <div className="mt-12 space-y-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-forest-dark/10 bg-white p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
                  {pick(lang, s.name)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-ink/70">
                  {pick(lang, s.description)}
                </p>
              </div>
              <Link
                href={`/booking?service=${s.slug}`}
                className="shrink-0 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark"
              >
                {t.services.requestThis}
              </Link>
            </div>

            {s.packages?.length > 0 && (
              <div className="mt-6 border-t border-forest-dark/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {t.services.packages}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.packages.map((p, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-cream px-4 py-1.5 text-sm text-ink/75"
                    >
                      {pick(lang, p.name)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
