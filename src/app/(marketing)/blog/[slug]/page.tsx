import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, POSTS } from "@/content/blog/registry";

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | AIComply`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { Component } = post;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-[780px] px-6 py-16">
        <Link href="/blog" className="text-sm text-violet-700 hover:underline">
          ← All posts
        </Link>

        <header className="mt-6 border-b border-slate-200 pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
            AIComply · {post.date} · {post.readMinutes} min read
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>
        </header>

        <div className="mt-10">
          <Component />
        </div>

        <div className="mt-14 rounded-md border border-violet-300 bg-violet-50 p-6">
          <p className="font-display text-lg font-semibold">
            Free AI system classification + risk checker
          </p>
          <p className="mt-2 text-sm text-slate-700">
            No credit card. Pro from $49/month when you need 20 systems, FRIA
            generator, and the public trust page. Business at $149/mo for DPIA.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-violet-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
          >
            Start free
          </Link>
        </div>
      </div>
    </main>
  );
}
