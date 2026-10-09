"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { optimizeImage, type MediaItem } from "@/lib/media";
import MediaLightbox from "@/app/components/MediaLightbox";
import type { AboutContent, AboutProfile } from "@/types/content";

const DEFAULT_ABOUT: Record<"sw" | "en", AboutContent> = {
  sw: {
    intro:
      "Mimi ni Agronomist mwenye uzoefu wa kusaidia wakulima kuboresha mazao kwa njia za kilimo hai.",
    philosophy:
      "Tunaamini kilimo hai ndicho kinachohakikisha udongo wenye afya na mazao salama kwa muda mrefu.",
  },
  en: {
    intro:
      "I am an Agronomist experienced in helping farmers improve yields through organic farming methods.",
    philosophy:
      "We believe organic farming is what secures healthy soil and safe crops for the long run.",
  },
};

const EMPTY_PROFILE: AboutProfile = {
  photo_url: "",
  name: "",
  role: { sw: "", en: "" },
  credentials: [],
  stats: [],
};

type Viewer = { items: MediaItem[]; index: number | null };

export default function KuhusuPage() {
  const { lang, t } = useLanguage();
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [profile, setProfile] = useState<AboutProfile>(EMPTY_PROFILE);
  const [viewer, setViewer] = useState<Viewer>({ items: [], index: null });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_content")
        .select("key, content")
        .in("key", ["about", "about_profile"]);
      data?.forEach((row) => {
        if (row.key === "about") setAbout(row.content as Record<"sw" | "en", AboutContent>);
        if (row.key === "about_profile") setProfile({ ...EMPTY_PROFILE, ...(row.content as AboutProfile) });
      });
    }
    load();
  }, []);

  const a = about[lang];
  const hasPhoto = Boolean(profile.photo_url);
  const role = pick(lang, profile.role);

  const certificates: MediaItem[] = profile.credentials
    .filter((c) => c.image_url)
    .map((c) => ({ type: "image", url: c.image_url }));

  function openCertificate(url: string) {
    const index = certificates.findIndex((c) => c.url === url);
    setViewer({ items: certificates, index: Math.max(index, 0) });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Utangulizi + picha */}
      <section
        className={`grid gap-12 ${hasPhoto ? "lg:grid-cols-[1.15fr_0.85fr] lg:items-center" : "max-w-3xl"}`}
      >
        <div>
          <p className="text-sm font-medium text-forest">{t.about.title}</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-forest-dark sm:text-5xl">
            {profile.name || t.about.title}
          </h1>
          {role && <p className="mt-3 text-lg text-forest">{role}</p>}
          <p className="mt-6 max-w-xl whitespace-pre-line text-lg text-ink/80">{a.intro}</p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark"
          >
            {t.home.ctaPrimary}
          </Link>
        </div>

        {hasPhoto && (
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-leaf-light/50" />
            <button
              onClick={() => setViewer({ items: [{ type: "image", url: profile.photo_url }], index: 0 })}
              className="relative block w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={optimizeImage(profile.photo_url, 900)}
                alt={profile.name}
                className="aspect-[4/5] w-full rounded-[2rem] object-cover"
              />
            </button>
          </div>
        )}
      </section>

      {/* Takwimu */}
      {profile.stats.length > 0 && (
        <section className="mt-16 grid grid-cols-2 gap-6 border-y border-forest-dark/10 py-10 sm:grid-cols-3 lg:grid-cols-4">
          {profile.stats.map((s, i) => (
            <div key={i}>
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink/65">{pick(lang, s.label)}</p>
            </div>
          ))}
        </section>
      )}

      {/* Falsafa */}
      <section className="mt-16 rounded-3xl bg-forest-dark px-8 py-12 text-cream sm:px-14">
        <p className="max-w-3xl whitespace-pre-line text-lg text-cream/90">{a.philosophy}</p>
      </section>

      {/* Elimu na vyeti */}
      {profile.credentials.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark">
            {t.about.credentials}
          </h2>
          <ol className="mt-8 divide-y divide-forest-dark/10 rounded-2xl border border-forest-dark/10 bg-white">
            {profile.credentials.map((c, i) => (
              <li
                key={i}
                className="grid items-center gap-4 p-5 sm:grid-cols-[6rem_1fr_auto]"
              >
                <span className="text-sm font-semibold text-forest">{c.year}</span>
                <div>
                  <p className="font-medium text-forest-dark">{pick(lang, c.title)}</p>
                  {pick(lang, c.org) && (
                    <p className="text-sm text-ink/60">{pick(lang, c.org)}</p>
                  )}
                </div>
                {c.image_url && (
                  <button
                    onClick={() => openCertificate(c.image_url)}
                    className="flex items-center gap-3 rounded-lg border border-forest-dark/15 p-1.5 pr-3 text-left text-xs font-medium text-forest transition hover:bg-cream"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={optimizeImage(c.image_url, 200)} alt="" className="h-12 w-16 rounded object-cover" />
                    {t.about.viewCertificate}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <MediaLightbox
        items={viewer.items}
        index={viewer.index}
        onClose={() => setViewer((v) => ({ ...v, index: null }))}
        onChange={(i) => setViewer((v) => ({ ...v, index: i }))}
      />
    </div>
  );
}
