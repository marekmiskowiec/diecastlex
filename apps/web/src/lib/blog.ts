import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  const files = await fs.readdir(BLOG_DIR);
  return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPost(slug: string) {
  "use cache";
  const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return { meta: toMeta(slug, data), content };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  "use cache";
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(async (s) => (await getPost(s)).meta));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
