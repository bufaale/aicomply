"use client";

import { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

/**
 * Pre-signup EU AI Act fine-exposure calculator. Article 99 caps at €35M
 * or 7% of global turnover. Article 6 high-risk systems start at lower
 * tiers but the multiplier is the company turnover, not a fixed band.
 */

const TURNOVER_BANDS = [
  { id: "small", label: "Under €5M/year", turnover_eur: 3_000_000 },
  { id: "medium", label: "€5M – €50M/year", turnover_eur: 25_000_000 },
  { id: "large", label: "€50M – €500M/year", turnover_eur: 200_000_000 },
  { id: "enterprise", label: "€500M+/year", turnover_eur: 1_000_000_000 },
];

const RISK_TIERS: Record<string, { label: string; cap_pct: number; cap_eur: number }> = {
  prohibited: { label: "Prohibited use (Art 5)", cap_pct: 0.07, cap_eur: 35_000_000 },
  high_risk: { label: "High-risk system (Art 6 + Annex III)", cap_pct: 0.03, cap_eur: 15_000_000 },
  gpai: { label: "General-purpose AI obligations", cap_pct: 0.015, cap_eur: 7_500_000 },
  transparency: { label: "Transparency / labeling only", cap_pct: 0.01, cap_eur: 5_000_000 },
};

export interface AIComplyExposure {
  turnover: string;
  risk: string;
  fine_eur: number;
}

export function calculateExposure(turnover: string, risk: string): AIComplyExposure | null {
  const t = TURNOVER_BANDS.find((b) => b.id === turnover);
  const r = RISK_TIERS[risk];
  if (!t || !r) return null;
  // Per Article 99: the fine is the HIGHER of the cap_eur and the cap_pct of turnover.
  const fine = Math.max(r.cap_eur, Math.round(t.turnover_eur * r.cap_pct));
  return { turnover, risk, fine_eur: fine };
}

export function RoiCalculator() {
  const [turnover, setTurnover] = useState("medium");
  const [risk, setRisk] = useState("high_risk");
  const exposure = calculateExposure(turnover, risk);

  return (
    <section
      id="roi"
      className="border-y border-slate-200 bg-slate-50 py-16"
      aria-labelledby="roi-heading"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
          <Calculator className="h-3.5 w-3.5" />
          EU AI Act fine-exposure calculator
        </div>
        <h2 id="roi-heading" className="font-display text-3xl font-semibold text-[#0b1f3a]">
          What's your maximum fine exposure under EU AI Act?
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Article 99 caps fines at the higher of a fixed €amount OR a % of global turnover.
          High-risk systems must be compliant by Aug 2, 2026.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="text-left">
            <span className="block text-sm font-medium text-slate-700">Annual turnover</span>
            <select
              value={turnover}
              onChange={(e) => setTurnover(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0b1f3a] focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
            >
              {TURNOVER_BANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-left">
            <span className="block text-sm font-medium text-slate-700">AI risk tier</span>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#0b1f3a] focus:outline-none focus:ring-1 focus:ring-[#0b1f3a]"
            >
              {Object.entries(RISK_TIERS).map(([id, v]) => (
                <option key={id} value={id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {exposure && (
          <div
            className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            data-testid="roi-result"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Maximum fine under Article 99
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-[#0b1f3a]">
              €{formatNumber(exposure.fine_eur)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Higher of a fixed €cap or a % of your annual turnover. AIComply generates a
              defensible DPIA + FRIA in &lt;48h to demonstrate good-faith compliance.
            </p>
            <Link
              href={`/signup?turnover=${exposure.turnover}&risk=${exposure.risk}`}
              className="mt-5 inline-flex items-center gap-1 rounded-md bg-[#0b1f3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#071428]"
            >
              Generate my first DPIA free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          <strong>Not legal advice.</strong> Numbers reflect the maximum statutory cap,
          not enforcement likelihood. Consult counsel for risk assessment.
        </p>
      </div>
    </section>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
