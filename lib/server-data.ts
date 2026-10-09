import { supabaseServer } from "@/lib/supabase-server";
import type { BlogPost, HomeHeroContent, Service } from "@/types/content";
import type { Overrides } from "@/lib/LanguageContext";
import type { Lang } from "@/types/content";

type Pair<T> = Record<"sw" | "en", T>;

/** Kila kazi ya data inarudisha thamani salama ikishindikana, ili build isivunjike. */

export async function getServices(): Promise<Service[]> {
  try {
    const { data } = await supabaseServer
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return (data as Service[]) ?? [];
  } catch {
    return [];
  }
}

export async function getHomeData(): Promise<{ hero: Pair<HomeHeroContent> | null; services: Service[] }> {
  const services = await getServices();
  try {
    const { data } = await supabaseServer
      .from("site_content")
      .select("content")
      .eq("key", "home_hero")
      .maybeSingle();
    return { hero: (data?.content as Pair<HomeHeroContent>) ?? null, services };
  } catch {
    return { hero: null, services };
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await supabaseServer
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data as BlogPost[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await supabaseServer
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return (data as BlogPost) ?? null;
  } catch {
    return null;
  }
}

export async function getUiOverrides(): Promise<Record<Lang, Overrides>> {
  const empty = { sw: {}, en: {} };
  try {
    const { data } = await supabaseServer
      .from("site_content")
      .select("content")
      .eq("key", "ui_strings")
      .maybeSingle();
    if (!data?.content) return empty;
    return { sw: data.content.sw ?? {}, en: data.content.en ?? {} };
  } catch {
    return empty;
  }
}

/** Maelezo mafupi (kwa Google) kutoka kwenye makala */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}
