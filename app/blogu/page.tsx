"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { BlogPost } from "@/types/content";

export default function BloguPage() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (data) setPosts(data as BlogPost[]);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.blog.title}
      </h1>

      {posts.length === 0 && (
        <p className="mt-12 text-sm text-ink/50">
          {lang === "sw" ? "Makala zinakuja hivi karibuni." : "Posts coming soon."}
        </p>
      )}

      <div className="mt-10 space-y-6">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blogu/${p.slug}`}
            className="block rounded-2xl border border-forest-dark/10 bg-white p-7 transition hover:border-forest/40"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-forest-dark">
              {pick(lang, p.title)}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-ink/60">
              {pick(lang, p.body)}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-forest">
              {t.blog.readMore}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
