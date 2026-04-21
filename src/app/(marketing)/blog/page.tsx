import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/content/blog/registry";

export const metadata: Metadata = {
  title: "AIComply Blog — EU AI Act, GDPR, and deployer compliance",
  description:
    "In-depth articles on Article 27 FRIA, GDPR Article 35 DPIA, GPAI Code of Practice, August 2 2026 deadline, and SMB-focused EU AI Act compliance.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_LABEL: Record<string, string> = {
  "eu-ai-act": "EU AI Act",
  gdpr: "GDPR",
  comparisons: "Comparisons",
  "how-to": "How-to",
  deadlines: "Deadlines",
};

export default function BlogIndex() {
  const sorted = [...POSTS].sort((a, b) => (a.date > b.date ? -1 : 1));
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b0f23] via-[#1a1338] to-[#1a2347] text-white">
        <div className="mx-auto max-w-[1100px] px-6 py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
            AIComply · blog
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            EU AI Act compliance, explained by builders
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            Articles written for SMBs scrambling to meet Aug 2, 2026. No
            $500K legal memos. Just field-tested guidance on FRIA, DPIA,
            Annex IV, GPAI signatories, and how to price the programme.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col rounded-md border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                <span>{CATEGORY_LABEL[p.category] ?? p.category}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">{p.readMinutes} min read</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-tight text-slate-900 group-hover:text-violet-700">
                {p.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {p.excerpt}
              </p>
              <p className="mt-4 text-xs text-slate-400">Published {p.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
