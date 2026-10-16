import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPostSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.description };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <article className="space-y-4 leading-7 [&_a]:underline [&_code]:font-mono [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-neutral-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-neutral-100 [&_ul]:list-disc [&_ul]:pl-6">
        <h1>{post.meta.title}</h1>
        <p className="text-sm text-neutral-500">{post.meta.date}</p>
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
