"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { EventItem } from "@/types/content";
import { BilingualField, Notice, TextField } from "@/app/components/admin/ui";
import { MultiImageUpload } from "@/app/components/admin/ImageUpload";
import { VideoUpload } from "@/app/components/admin/VideoUpload";

interface EventForm {
  id: string | null;
  title_sw: string;
  title_en: string;
  desc_sw: string;
  desc_en: string;
  event_date: string;
  photos: string[];
  videos: string[];
  is_published: boolean;
}

const EMPTY: EventForm = {
  id: null,
  title_sw: "",
  title_en: "",
  desc_sw: "",
  desc_en: "",
  event_date: "",
  photos: [],
  videos: [],
  is_published: true,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false });
    if (data) setEvents(data as EventItem[]);
  }

  function startEdit(ev: EventItem) {
    setForm({
      id: ev.id,
      title_sw: ev.title.sw,
      title_en: ev.title.en,
      desc_sw: ev.description?.sw ?? "",
      desc_en: ev.description?.en ?? "",
      event_date: ev.event_date ?? "",
      photos: ev.photos ?? [],
      videos: ev.videos ?? [],
      is_published: ev.is_published,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title: { sw: form.title_sw, en: form.title_en },
      description: { sw: form.desc_sw, en: form.desc_en },
      event_date: form.event_date || null,
      photos: form.photos,
      videos: form.videos,
      is_published: form.is_published,
    };

    const { error } = form.id
      ? await supabase.from("events").update(payload).eq("id", form.id)
      : await supabase.from("events").insert(payload);

    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` });
    } else {
      setMessage({ kind: "ok", text: form.id ? "Mabadiliko yamehifadhiwa." : "Tukio limeongezwa." });
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  }

  async function togglePublished(ev: EventItem) {
    setEvents((prev) => prev.map((x) => (x.id === ev.id ? { ...x, is_published: !x.is_published } : x)));
    await supabase.from("events").update({ is_published: !ev.is_published }).eq("id", ev.id);
  }

  async function remove(ev: EventItem) {
    if (!window.confirm(`Futa tukio "${ev.title.sw}" pamoja na picha zake? Hatua hii haiwezi kurudishwa.`)) return;
    const { error } = await supabase.from("events").delete().eq("id", ev.id);
    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kufuta: ${error.message}` });
      return;
    }
    if (form.id === ev.id) setForm(EMPTY);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Matukio na Picha
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-6"
      >
        <p className="text-sm font-semibold text-forest">
          {form.id ? "Hariri tukio" : "Ongeza tukio jipya"}
        </p>

        <BilingualField
          label="Jina la tukio"
          sw={form.title_sw}
          en={form.title_en}
          onSw={(v) => setForm({ ...form, title_sw: v })}
          onEn={(v) => setForm({ ...form, title_en: v })}
          required
        />
        <BilingualField
          label="Maelezo ya tukio (description)"
          sw={form.desc_sw}
          en={form.desc_en}
          onSw={(v) => setForm({ ...form, desc_sw: v })}
          onEn={(v) => setForm({ ...form, desc_en: v })}
          multiline
          rows={4}
        />

        <div className="max-w-xs">
          <TextField
            label="Tarehe ya tukio"
            type="date"
            value={form.event_date}
            onChange={(v) => setForm({ ...form, event_date: v })}
          />
        </div>

        <MultiImageUpload
          label="Picha za tukio (unaweza kuchagua nyingi kwa pamoja)"
          values={form.photos}
          onChange={(urls) => setForm({ ...form, photos: urls })}
          folder="events"
        />

        <VideoUpload
          label="Video za tukio"
          values={form.videos}
          onChange={(urls) => setForm({ ...form, videos: urls })}
          folder="events-video"
        />

        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Ionekane kwenye tovuti
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? "Inahifadhi..." : form.id ? "Hifadhi mabadiliko" : "Ongeza tukio"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="rounded-full border border-forest-dark/20 px-6 py-2.5 text-sm text-ink/70"
            >
              Acha kuhariri
            </button>
          )}
        </div>
        {message && <Notice kind={message.kind}>{message.text}</Notice>}
      </form>

      <div className="mt-8 space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-dark/10 bg-white px-5 py-3"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-md bg-cream">
                {ev.photos?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.photos[0]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-forest-dark">
                  {ev.title.sw} <span className="text-ink/40">/ {ev.title.en}</span>
                </p>
                <p className="text-xs text-ink/50">
                  {ev.event_date ?? "Bila tarehe"} · picha {ev.photos?.length ?? 0} ·{" "}
                  {ev.is_published ? "Inaonekana" : "Imefichwa"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(ev)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                Hariri
              </button>
              <button onClick={() => togglePublished(ev)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                {ev.is_published ? "Ficha" : "Onyesha"}
              </button>
              <button onClick={() => remove(ev)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600">
                Futa
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-ink/50">Hakuna matukio bado.</p>}
      </div>
    </div>
  );
}
