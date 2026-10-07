"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { BlogPost } from "@/types/content";

export default function BlogPostPage() {
  const { lang } = useLanguage();
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

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
        <p className="text-ink/60">
          {lang === "sw" ? "Makala haijapatikana." : "Post not found."}
        </p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={pick(lang, post.title)}
          className="mb-8 aspect-video w-full rounded-2xl object-cover"
        />
      )}
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-forest-dark sm:text-4xl">
        {pick(lang, post.title)}
      </h1>
      <div className="mt-8 whitespace-pre-line text-ink/80">
        {pick(lang, post.body)}
      </div>
    </article>
  );
}
