"use client";

import { useState } from "react";
import { Loader2, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { QUESTIONS, type RiskTier } from "@/lib/free-checker/classifier";

interface ClassificationResult {
  tier: RiskTier;
  rationale: string[];
  required_obligations: string[];
  triggered_questions: string[];
}

const TIER_LABEL: Record<RiskTier, string> = {
  prohibited: "Prohibited",
  high_risk: "High-risk",
  limited: "Limited / transparency",
  minimal: "Minimal risk",
};

const TIER_STYLE: Record<RiskTier, string> = {
  prohibited: "bg-rose-100 border-rose-300 text-rose-900",
  high_risk: "bg-amber-100 border-amber-300 text-amber-900",
  limited: "bg-sky-100 border-sky-300 text-sky-900",
  minimal: "bg-emerald-100 border-emerald-300 text-emerald-900",
};

const TIER_ICON: Record<RiskTier, typeof ShieldAlert> = {
  prohibited: ShieldAlert,
  high_risk: AlertTriangle,
  limited: AlertTriangle,
  minimal: ShieldCheck,
};

export function RiskCheckerForm() {
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  function setAnswer(id: string, val: "yes" | "no") {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        answers: QUESTIONS.map((q) => ({ question_id: q.id, answer: answers[q.id] })),
        email: email || undefined,
      };
      const res = await fetch("/api/free/risk-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Classification failed");
        return;
      }
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4" data-testid="risk-checker-form">
        {QUESTIONS.map((q, idx) => (
          <fieldset
            key={q.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <legend className="text-sm font-medium text-[#0b1f3a]">
              <span className="mr-2 text-slate-500">Q{idx + 1}.</span>
              {q.text}
            </legend>
            <div className="mt-2 flex gap-2">
              {(["yes", "no"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswer(q.id, opt)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium uppercase tracking-wide ${
                    answers[q.id] === opt
                      ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  data-testid={`answer-${q.id}-${opt}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Email <span className="text-xs text-slate-500">(optional — get a follow-up tips email)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#0b1f3a] focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
          />
        </label>

        <button
          type="submit"
          disabled={loading || !allAnswered}
          className="inline-flex items-center gap-2 rounded-md bg-[#0b1f3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#071428] disabled:opacity-50"
          data-testid="risk-submit"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Classifying…
            </>
          ) : (
            <>Classify my system</>
          )}
        </button>
      </form>

      {error && (
        <div
          className="mt-6 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
          role="alert"
          data-testid="risk-error"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8" data-testid="risk-result">
          <div className={`rounded-lg border p-5 ${TIER_STYLE[result.tier]}`}>
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = TIER_ICON[result.tier];
                return <Icon className="h-6 w-6" />;
              })()}
              <p className="font-display text-2xl font-semibold">
                {TIER_LABEL[result.tier]}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {result.rationale.map((r, i) => (
                <li key={i} className="leading-snug">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Required obligations
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-800">
              {result.required_obligations.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>

          <Link
            href="/signup"
            className="mt-5 inline-flex items-center gap-1 rounded-md bg-[#0b1f3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#071428]"
          >
            Generate my full DPIA + FRIA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
