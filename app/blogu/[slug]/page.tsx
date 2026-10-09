"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import { buildMedia, optimizeImage } from "@/lib/media";
import MediaLightbox, { InlinePlayer } from "@/app/components/MediaLightbox";
import type { BlogPost } from "@/types/content";

export default function BlogPostPage() {
  const { lang, t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [coverOpen, setCoverOpen] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .maybeSingle();
      if (data) {
        setPost(data as BlogPost);
      } else {
        setNotFound(true);
      }
    }
    load();
  }, [params.slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-ink/60">{t.blog.notFound}</p>
      </div>
    );
  }

  if (!post) return null;

  const cover = buildMedia(post.cover_image_url ? [post.cover_image_url] : []);
  const videos = buildMedia([], post.videos);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {post.cover_image_url && (
        <button onClick={() => setCoverOpen(0)} className="mb-8 block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optimizeImage(post.cover_image_url, 1400)}
            alt={pick(lang, post.title)}
            className="aspect-video w-full rounded-2xl object-cover"
          />
        </button>
      )}
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark sm:text-4xl">
        {pick(lang, post.title)}
      </h1>
      <div className="mt-8 whitespace-pre-line text-ink/80">
        {pick(lang, post.body)}
      </div>

      {videos.length > 0 && (
        <div className="mt-10 space-y-6">
          {videos.map((v, i) => (
            <InlinePlayer key={`${v.url}-${i}`} item={v} />
          ))}
        </div>
      )}

      <MediaLightbox
        items={cover}
        index={coverOpen}
        onClose={() => setCoverOpen(null)}
        onChange={setCoverOpen}
      />
    </article>
  );
}
