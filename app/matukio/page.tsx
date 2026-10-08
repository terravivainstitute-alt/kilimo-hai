"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { buildMedia, type MediaItem } from "@/lib/media";
import MediaLightbox, { MediaTile } from "@/app/components/MediaLightbox";
import type { EventItem } from "@/types/content";

export default function MatukioPage() {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewer, setViewer] = useState<{ items: MediaItem[]; index: number | null }>({
    items: [],
    index: null,
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: false, nullsFirst: false });
      if (data) setEvents(data as EventItem[]);
      setLoaded(true);
    }
    load();
  }, []);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.events.title}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t.events.intro}</p>

      {loaded && events.length === 0 && (
        <p className="mt-12 text-sm text-ink/50">{t.events.empty}</p>
      )}

      <div className="mt-12 space-y-16">
        {events.map((ev) => {
          const media = buildMedia(ev.photos, ev.videos);
          return (
            <article key={ev.id}>
              <div className="max-w-2xl">
                {ev.event_date && (
                  <p className="text-sm text-forest">{formatDate(ev.event_date)}</p>
                )}
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
                  {pick(lang, ev.title)}
                </h2>
                {ev.description && (
                  <p className="mt-3 whitespace-pre-line text-ink/75">
                    {pick(lang, ev.description)}
                  </p>
                )}
              </div>

              {media.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {media.map((item, i) => (
                    <button
                      key={`${item.url}-${i}`}
                      onClick={() => setViewer({ items: media, index: i })}
                      className={`overflow-hidden rounded-xl ${
                        i === 0 && media.length > 2 ? "col-span-2 row-span-2" : ""
                      }`}
                    >
                      <MediaTile
                        item={item}
                        alt={pick(lang, ev.title)}
                        className="aspect-square h-full w-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <MediaLightbox
        items={viewer.items}
        index={viewer.index}
        onClose={() => setViewer((v) => ({ ...v, index: null }))}
        onChange={(i) => setViewer((v) => ({ ...v, index: i }))}
      />
    </div>
  );
}
