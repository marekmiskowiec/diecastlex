import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artykuły o kolekcjonowaniu modeli Hot Wheels i odlewów.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="mt-8 space-y-8">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="text-xl font-semibold hover:underline">
              {p.title}
            </Link>
            <p className="mt-1 text-sm text-neutral-500">{p.date}</p>
            <p className="mt-2">{p.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
