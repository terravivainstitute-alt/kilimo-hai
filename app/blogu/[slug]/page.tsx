import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostView from "@/app/components/BlogPostView";
import JsonLd from "@/app/components/JsonLd";
import { excerpt, getPostBySlug, getPublishedPosts } from "@/lib/server-data";
import { optimizeImage } from "@/lib/media";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Makala haijapatikana" };

  const description = excerpt(post.body.sw);
  return {
    title: post.title.sw,
    description,
    alternates: { canonical: `/blogu/${slug}` },
    openGraph: {
      title: post.title.sw,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url
        ? [{ url: optimizeImage(post.cover_image_url, 1200) }]
        : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title.sw,
          description: excerpt(post.body.sw),
          image: post.cover_image_url ? [optimizeImage(post.cover_image_url, 1200)] : undefined,
          datePublished: post.published_at ?? post.created_at,
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/blogu/${slug}`,
        }}
      />
      <BlogPostView post={post} />
    </>
  );
}
