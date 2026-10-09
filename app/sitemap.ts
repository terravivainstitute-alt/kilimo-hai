import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/server-data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const now = new Date();

  const pages = ["", "/huduma", "/duka", "/matukio", "/kuhusu", "/blogu", "/wasiliana", "/booking"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const postPages = posts.map((p) => ({
    url: `${SITE_URL}/blogu/${p.slug}`,
    lastModified: new Date(p.published_at ?? p.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...postPages];
}
