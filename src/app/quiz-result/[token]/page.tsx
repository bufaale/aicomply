/**
 * Public read-only EU AI Act risk-checker verdict permalink.
 *
 * Lives outside any auth boundary — anyone with the token can view. This
 * is the viral wedge: visitors share their verdict on LinkedIn / Slack /
 * email, recipients click through to a real result before deciding to
 * run their own.
 *
 * Renders the same data as the in-quiz result panel: classification +
 * obligations + max penalty + system label.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { RESULT_DETAILS, PENALTY_BORDER, RC_QUESTIONS } from "@/lib/risk-checker/data";
import { TierBadge, type RiskTier } from "@/components/aicomply/atoms";

interface PublicQuizRow {
  id: string;
  classification: RiskTier;
  answers: Array<"yes" | "no" | null>;
  system_label: string | null;
  view_count: number;
  created_at: string;
}

async function fetchQuiz(token: string): Promise<PublicQuizRow | null> {
  const admin = createAdminClient();
  type LooseDb = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as LooseDb;
  const { data } = await db
    .from("public_quiz_results")
    .select("id, classification, answers, system_label, view_count, created_at")
    .eq("id", token)
    .maybeSingle();
  if (!data) return null;
  try {
    await db
      .from("public_quiz_results")
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq("id", token);
  } catch {}
  return data as PublicQuizRow;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const row = await fetchQuiz(token);
  if (!row) {
    return { title: "Verdict not found · AIComply" };
  }
  const det = RESULT_DETAILS[row.classification];
  const label = row.system_label ? `${row.system_label} — ` : "";
  return {
    title: `${label}${det.title} · EU AI Act verdict · AIComply`,
    description: `${det.title} under the EU AI Act (${det.citation}). ${det.body.slice(0, 140)}`,
    openGraph: {
      title: `${label}${det.title} · EU AI Act`,
      description: `Risk-checker verdict from AIComply. ${det.body.slice(0, 160)}`,
      type: "article",
    },
  };
}

export default async function PublicQuizResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = await fetchQuiz(token);
  if (!row) notFound();
  const det = RESULT_DETAILS[row.classification];
  const borderColor = PENALTY_BORDER[row.classification];
  const dateStr = new Date(row.created_at).toISOString().slice(0, 10);
  const yesCount = row.answers.filter((a) => a === "yes").length;
  const total = RC_QUESTIONS.length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 text-sm text-slate-500">
        Checked {dateStr} ·{" "}
        <Link href="/free/risk-checker" className="font-medium text-blue-700 hover:underline">
          Run your own check
        </Link>
      </div>

      <div className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
        VERDICT · {det.citation}
      </div>
      {row.system_label ? (
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-900">
          {row.system_label}
        </h1>
      ) : null}
      <div className="mb-2 flex items-center gap-3">
        <span className="text-5xl font-semibold tracking-tight text-slate-900">{det.title}</span>
        <TierBadge tier={row.classification} />
      </div>
      <p className="mt-4 text-base leading-relaxed text-slate-700">{det.body}</p>

      <div
        className="my-8 rounded-md border-l-4 bg-slate-50 px-5 py-4"
        style={{ borderColor }}
      >
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
          Max penalty
        </div>
        <div className="text-base font-medium text-slate-900">{det.penalty}</div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Your obligations</h2>
        <div className="space-y-3">
          {det.obligations.map((o, i) => (
            <div key={o} className="flex gap-3 rounded-md border bg-white p-4">
              <span className="font-mono text-sm font-medium tabular-nums text-slate-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-slate-700">{o}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-md border bg-slate-50 p-5">
        <div className="text-xs font-medium uppercase tracking-widest text-slate-500">
          QUIZ SUMMARY
        </div>
        <div className="mt-2 text-sm text-slate-700">
          {yesCount} of {total} risk indicators marked yes. Classification reflects the
          most-severe applicable tier across the 10-question taxonomy
          (Regulation (EU) 2024/1689).
        </div>
      </section>

      <section className="mt-10 rounded-xl border-2 border-amber-300 bg-amber-50 p-6">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-900">
          NEXT · TURN VERDICT INTO PACKET
        </div>
        <h3 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900">
          Track this system + 49 others.
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-slate-700">
          Save this verdict. Inventory every system. Generate Annex IV. Sign off
          Article 4 literacy. Hand auditors the packet on 02 Aug.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save verdict — start free
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            See pricing
          </Link>
        </div>
      </section>

      <footer className="mt-12 border-t pt-6 text-xs text-slate-500">
        Generated by{" "}
        <Link href="/" className="font-medium text-blue-700 hover:underline">
          AIComply
        </Link>
        . Citations from Regulation (EU) 2024/1689 — the EU AI Act. Verdict is
        a tool to identify obligation tier, not a substitute for qualified
        legal counsel.
      </footer>
    </main>
  );
}
