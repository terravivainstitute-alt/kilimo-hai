import type { Metadata } from "next";
import BloguView from "@/app/components/BloguView";
import { getPublishedPosts } from "@/lib/server-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogu na Vidokezo vya Kilimo Hai",
  description:
    "Makala na vidokezo vya kilimo hai: kutengeneza mbolea ya compost, kudhibiti wadudu wa shambani kwa njia za asili, na kuboresha mazao.",
  alternates: { canonical: "/blogu" },
};

export default async function Page() {
  const posts = await getPublishedPosts();
  return <BloguView initialPosts={posts} />;
}
