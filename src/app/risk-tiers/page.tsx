/**
 * /risk-tiers — public SEO content hub explaining each EU AI Act risk
 * tier (prohibited / high / limited / minimal) with live stats from
 * AIComply's free risk-checker.
 *
 * Why this page exists:
 *   AIComply's free quiz at /free/risk-checker produces public verdicts
 *   stored in public_quiz_results. This page aggregates them by tier and
 *   pairs the aggregate with long-form regulation content. Ranks for
 *   long-tail queries like "what is high-risk eu ai act" + "eu ai act
 *   risk classification stats" + "annex iii high risk systems".
 *
 * Updates daily (revalidate: 86400). Each tier section includes the
 * Article citation, body text, obligations checklist, and a tier-take-CTA
 * to /free/risk-checker.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { RESULT_DETAILS, PENALTY_BORDER } from "@/lib/risk-checker/data";
import type { RiskTier } from "@/components/aicomply/atoms";

export const revalidate = 86400; // 24h

interface TierStats {
  count: number;
  pct: number;
}

interface PageStats {
  total: number;
  tiers: Record<RiskTier, TierStats>;
}

async function fetchStats(): Promise<PageStats> {
  const empty: PageStats = {
    total: 0,
    tiers: {
      prohibited: { count: 0, pct: 0 },
      high: { count: 0, pct: 0 },
      limited: { count: 0, pct: 0 },
      minimal: { count: 0, pct: 0 },
    },
  };
  try {
    const admin = createAdminClient();
    type LooseDb = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
    const db = admin as unknown as LooseDb;
    const { data } = await db
      .from("public_quiz_results")
      .select("classification");
    const rows = (data ?? []) as Array<{ classification: RiskTier }>;
    const total = rows.length;
    if (total === 0) return empty;
    const counts: Record<RiskTier, number> = {
      prohibited: 0,
      high: 0,
      limited: 0,
      minimal: 0,
    };
    for (const r of rows) {
      if (r.classification in counts) counts[r.classification] += 1;
    }
    return {
      total,
      tiers: {
        prohibited: { count: counts.prohibited, pct: Math.round((counts.prohibited / total) * 100) },
        high: { count: counts.high, pct: Math.round((counts.high / total) * 100) },
        limited: { count: counts.limited, pct: Math.round((counts.limited / total) * 100) },
        minimal: { count: counts.minimal, pct: Math.round((counts.minimal / total) * 100) },
      },
    };
  } catch {
    return empty;
  }
}

export const metadata: Metadata = {
  title: "EU AI Act risk tiers — prohibited, high, limited, minimal · AIComply",
  description:
    "Regulation (EU) 2024/1689 sorts every AI system into 4 risk tiers. This guide explains each tier with Article citations, obligations checklists, and live AIComply quiz data.",
  alternates: { canonical: "/risk-tiers" },
  openGraph: {
    title: "EU AI Act risk tiers — the 4-tier taxonomy explained",
    description:
      "Prohibited / high / limited / minimal — what each tier means, who's subject, and what you have to ship. Plus live stats from 1000s of AIComply quiz takers.",
    type: "article",
  },
};

const TIER_ORDER: RiskTier[] = ["prohibited", "high", "limited", "minimal"];

const TIER_QUERY_HOOK: Record<RiskTier, string> = {
  prohibited: "Banned outright. Article 5. €35M / 7% global revenue cap if you ship it anyway.",
  high: "Subject to the full Article 8–17 obligations + conformity assessment before EU market launch.",
  limited: "Transparency-only. Article 50. Tell users they're interacting with AI; mark synthetic media.",
  minimal: "No mandatory obligations. Article 4 literacy obligation still applies to every staff member using the system.",
};

export default async function RiskTiersPage() {
  const stats = await fetchStats();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-12">
        <div className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
          REGULATION (EU) 2024/1689 — THE EU AI ACT
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
          The 4 EU AI Act risk tiers, explained.
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Every AI system put on the EU market or used in the EU falls into
          one of four risk tiers under Regulation (EU) 2024/1689. The tier
          determines your obligations — from documentation packs to outright
          prohibition. This guide explains each tier with Article citations.
          Run the 10-question{" "}
          <Link
            href="/free/risk-checker"
            className="font-medium text-blue-700 hover:underline"
          >
            free risk-checker quiz
          </Link>{" "}
          to classify your own system in 90 seconds.
        </p>
      </header>

      {stats.total > 0 ? (
        <section className="mb-12 rounded-md border bg-slate-50 p-6">
          <div className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
            LIVE — AIComply QUIZ TAKER DISTRIBUTION
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TIER_ORDER.map((t) => (
              <div key={t}>
                <div
                  className="text-3xl font-semibold tabular-nums tracking-tight"
                  style={{ color: PENALTY_BORDER[t] }}
                >
                  {stats.tiers[t].pct}%
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-600">
                  {RESULT_DETAILS[t].title}
                </div>
                <div className="text-xs text-slate-400">
                  {stats.tiers[t].count} of {stats.total}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Aggregated from {stats.total} anonymous quiz submissions. Updates
            daily.
          </p>
        </section>
      ) : null}

      {TIER_ORDER.map((tier, i) => {
        const det = RESULT_DETAILS[tier];
        const accent = PENALTY_BORDER[tier];
        return (
          <article
            key={tier}
            id={tier}
            className="mb-12 border-t pt-10"
            style={{ borderColor: i === 0 ? "transparent" : "#e2e8f0" }}
          >
            <div
              className="mb-1 text-xs font-medium uppercase tracking-widest"
              style={{ color: accent }}
            >
              {det.citation} · TIER {i + 1} OF 4
            </div>
            <h2 className="mb-3 text-3xl font-semibold tracking-tight text-slate-900">
              {det.title}
            </h2>
            <p className="mb-4 text-sm font-medium text-slate-700">
              {TIER_QUERY_HOOK[tier]}
            </p>
            <p className="mb-6 text-base leading-relaxed text-slate-700">
              {det.body}
            </p>

            <div
              className="mb-6 rounded-md border-l-4 bg-slate-50 px-5 py-4"
              style={{ borderColor: accent }}
            >
              <div className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                Max penalty
              </div>
              <div className="text-sm font-medium text-slate-900">
                {det.penalty}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
                Obligations checklist
              </div>
              <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-slate-700 marker:text-slate-400">
                {det.obligations.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/free/risk-checker"
                className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Classify my system →
              </Link>
              <Link
                href="/pricing"
                className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Annex IV pack pricing
              </Link>
            </div>
          </article>
        );
      })}

      <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
        Citations from Regulation (EU) 2024/1689 — the EU AI Act. AIComply
        helps SMBs ship Annex IV packs + Article 4 literacy + FRIA/DPIA
        assessments in under 7 days.{" "}
        <Link
          href="/pricing"
          className="font-medium text-blue-700 hover:underline"
        >
          See AIComply plans →
        </Link>
      </footer>
    </main>
  );
}
