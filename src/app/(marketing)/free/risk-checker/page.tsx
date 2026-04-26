import type { Metadata } from "next";
import { RiskCheckerForm } from "@/components/free-checker/risk-checker-form";

export const metadata: Metadata = {
  title: "Free EU AI Act Risk Checker — instant classification | AIComply",
  description:
    "Answer 10 yes/no questions about your AI system. Instant EU AI Act risk classification (prohibited / high-risk / limited / minimal) with the full obligations checklist. No signup.",
  alternates: { canonical: "/free/risk-checker" },
  openGraph: {
    title: "Free EU AI Act Risk Checker — AIComply",
    description: "10 questions -> instant risk classification + obligations checklist. No signup.",
    type: "website",
  },
};

export default function FreeRiskCheckerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Free tool · no signup
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-[#0b1f3a]">
          Free EU AI Act Risk Checker
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Answer 10 yes/no questions about your AI system. We&apos;ll classify it as
          <strong> prohibited</strong>, <strong>high-risk</strong>, <strong>limited</strong>, or
          <strong> minimal</strong> per Articles 5, 6, and 50 of the EU AI Act, and show
          the obligations you owe.
        </p>
      </header>

      <div className="mt-10">
        <RiskCheckerForm />
      </div>

      <section className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
        <h2 className="font-semibold text-[#0b1f3a]">Disclaimer</h2>
        <p className="mt-2">
          This classifier reflects the public text of the EU AI Act (OJ L 2024/1689) and
          EDPB FRIA template guidance as of Q1 2026. It is illustrative — not legal
          advice. For audit-ready DPIA + FRIA + Annex IV documentation, see{" "}
          <a href="/" className="text-[#0b1f3a] underline">
            AIComply starting at $79/mo
          </a>
          .
        </p>
      </section>
    </div>
  );
}
