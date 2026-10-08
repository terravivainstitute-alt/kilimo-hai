"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import type { BlogPost } from "@/types/content";
import { BilingualField, Notice } from "@/app/components/admin/ui";
import { SingleImageUpload } from "@/app/components/admin/ImageUpload";
import { VideoUpload } from "@/app/components/admin/VideoUpload";

interface PostForm {
  id: string | null;
  slug: string;
  title_sw: string;
  title_en: string;
  body_sw: string;
  body_en: string;
  cover_image_url: string;
  videos: string[];
  published: boolean;
  published_at: string | null;
}

const EMPTY: PostForm = {
  id: null,
  slug: "",
  title_sw: "",
  title_en: "",
  body_sw: "",
  body_en: "",
  cover_image_url: "",
  videos: [],
  published: false,
  published_at: null,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<PostForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
  }

  function startEdit(p: BlogPost) {
    setForm({
      id: p.id,
      slug: p.slug,
      title_sw: p.title.sw,
      title_en: p.title.en,
      body_sw: p.body.sw,
      body_en: p.body.en,
      cover_image_url: p.cover_image_url ?? "",
      videos: p.videos ?? [],
      published: p.published,
      published_at: p.published_at,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: form.slug || slugify(form.title_en || form.title_sw),
      title: { sw: form.title_sw, en: form.title_en },
      body: { sw: form.body_sw, en: form.body_en },
      cover_image_url: form.cover_image_url || null,
      videos: form.videos,
      published: form.published,
      published_at: form.published ? form.published_at ?? new Date().toISOString() : null,
    };

    const { error } = form.id
      ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
      : await supabase.from("blog_posts").insert(payload);

    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kuhifadhi: ${error.message}` });
    } else {
      setMessage({ kind: "ok", text: form.id ? "Mabadiliko yamehifadhiwa." : "Makala imeongezwa." });
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  }

  async function togglePublished(p: BlogPost) {
    const published = !p.published;
    const published_at = published ? p.published_at ?? new Date().toISOString() : null;
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, published, published_at } : x)));
    await supabase.from("blog_posts").update({ published, published_at }).eq("id", p.id);
  }

  async function remove(p: BlogPost) {
    if (!window.confirm(`Futa makala "${p.title.sw}"? Hatua hii haiwezi kurudishwa.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) {
      setMessage({ kind: "error", text: `Imeshindikana kufuta: ${error.message}` });
      return;
    }
    if (form.id === p.id) setForm(EMPTY);
    await load();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
        Blogu
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-6"
      >
        <p className="text-sm font-semibold text-forest">
          {form.id ? "Hariri makala" : "Andika makala mpya"}
        </p>

        <BilingualField
          label="Kichwa cha makala"
          sw={form.title_sw}
          en={form.title_en}
          onSw={(v) => setForm({ ...form, title_sw: v })}
          onEn={(v) => setForm({ ...form, title_en: v })}
          required
        />
        <BilingualField
          label="Maudhui ya makala"
          sw={form.body_sw}
          en={form.body_en}
          onSw={(v) => setForm({ ...form, body_sw: v })}
          onEn={(v) => setForm({ ...form, body_en: v })}
          multiline
          rows={10}
          required
        />

        <SingleImageUpload
          label="Picha ya juu (cover)"
          value={form.cover_image_url}
          onChange={(url) => setForm({ ...form, cover_image_url: url })}
          folder="blog"
        />

        <VideoUpload
          label="Video za makala"
          values={form.videos}
          onChange={(urls) => setForm({ ...form, videos: urls })}
          folder="blog-video"
        />

        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Chapisha (ionekane kwenye tovuti)
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? "Inahifadhi..." : form.id ? "Hifadhi mabadiliko" : "Ongeza makala"}
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
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-dark/10 bg-white px-5 py-3"
          >
            <div>
              <p className="font-medium text-forest-dark">
                {p.title.sw} <span className="text-ink/40">/ {p.title.en}</span>
              </p>
              <p className="text-xs text-ink/50">{p.published ? "Imechapishwa" : "Rasimu (haionekani)"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                Hariri
              </button>
              <button onClick={() => togglePublished(p)} className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs">
                {p.published ? "Ondoa kwenye tovuti" : "Chapisha"}
              </button>
              <button onClick={() => remove(p)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600">
                Futa
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-ink/50">Hakuna makala bado.</p>}
      </div>
    </div>
  );
}
