"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { HomeHeroContent, Service } from "@/types/content";

const DEFAULT_HERO: Record<"sw" | "en", HomeHeroContent> = {
  sw: {
    headline: "Kilimo Hai — Ushauri na bidhaa za kilimo hai kwa mkulima yeyote",
    subheadline:
      "Tunatoa ushauri wa kitaalamu, mbolea za asili, na madawa ya asili ya wadudu kwa wakulima wa mashamba makubwa na madogo.",
  },
  en: {
    headline: "Kilimo Hai — Organic farming advice and products for every farmer",
    subheadline:
      "We provide expert consultancy, organic fertilizer, and natural pest control for farms of every size.",
  },
};

export default function HomeView({
  initialHero,
  initialServices,
}: {
  initialHero: Record<"sw" | "en", HomeHeroContent> | null;
  initialServices: Service[];
}) {
  const { lang, t } = useLanguage();
  const [hero, setHero] = useState<Record<"sw" | "en", HomeHeroContent>>(
    initialHero ?? DEFAULT_HERO
  );
  const [services, setServices] = useState<Service[]>(initialServices);

  useEffect(() => {
    async function load() {
      const { data: contentRow } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", "home_hero")
        .maybeSingle();
      if (contentRow?.content) {
        setHero(contentRow.content as Record<"sw" | "en", HomeHeroContent>);
      }

      const { data: svc } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (svc) setServices(svc as Service[]);
    }
    load();
  }, []);

  const h = hero[lang];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-forest-dark/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-leaf-light/30 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-forest-dark sm:text-5xl">
              {h.headline}
            </h1>
            <p className="mt-6 max-w-lg text-ink/75">{h.subheadline}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
              >
                {t.home.ctaPrimary}
              </Link>
              <Link
                href="/duka"
                className="rounded-full border border-forest px-7 py-3 text-sm font-medium text-forest transition hover:bg-forest hover:text-cream"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {/* Services summary */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark">
          {t.home.servicesTitle}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.id}
              href="/huduma"
              className="group rounded-2xl border border-forest-dark/10 bg-white p-6 transition hover:border-forest/40"
            >
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest-dark">
                {pick(lang, s.name)}
              </p>
              <p className="mt-2 text-sm text-ink/65">{pick(lang, s.description)}</p>
              <span className="mt-4 inline-block text-sm font-medium text-forest group-hover:text-forest-dark">
                {t.services.requestThis}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="border-y border-forest-dark/10 bg-forest-dark text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            {t.home.whyTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-cream/80">{t.home.whyBody}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark">
          {t.home.finalCta}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">{t.home.finalCtaBody}</p>
        <Link
          href="/booking"
          className="mt-8 inline-block rounded-full bg-harvest px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t.home.ctaPrimary}
        </Link>
      </section>
    </div>
  );
}

function HeroArt() {
  return (
    <svg viewBox="0 0 420 380" className="mx-auto w-full max-w-sm">
      <ellipse cx="210" cy="330" rx="170" ry="26" fill="#6b4226" opacity="0.15" />
      <path d="M90 300 Q210 250 330 300 L330 330 Q210 290 90 330 Z" fill="#8a5a3b" />
      <rect x="200" y="150" width="20" height="150" rx="10" fill="#2f6b3f" />
      <path
        d="M210 190c-70-20-110-90-80-150 60 15 110 65 120 120 10-55 60-105 120-120 30 60-10 130-80 150-30 10-50 10-80 0Z"
        fill="#74a34f"
      />
      <path
        d="M210 190c-70-20-110-90-80-150 60 15 110 65 120 120"
        fill="none"
        stroke="#1b3a1e"
        strokeWidth="2"
        opacity="0.25"
      />
      <ellipse cx="210" cy="140" rx="22" ry="34" fill="#c7dba3" />
    </svg>
  );
}
