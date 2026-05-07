import type { Metadata } from "next";
import Link from "next/link";
import { Scale, CheckCircle2, ArrowRight, ShieldAlert, FileText, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "FRIA Generator (Article 27 EU AI Act) | AIComply",
  description:
    "Generate a Fundamental Rights Impact Assessment draft for your high-risk AI system. Five Article 27(1) sections, auditor-ready PDF export. Claude-powered. FRIA generator included on Pro ($49/mo); free 30-second risk checker confirms you need one.",
  alternates: { canonical: "/fria-generator" },
  openGraph: {
    title: "FRIA Generator — Article 27 EU AI Act",
    description:
      "Draft a Fundamental Rights Impact Assessment in 10 minutes. Required before Aug 2, 2026 for many deployers.",
    url: "/fria-generator",
    type: "website",
  },
};

export default function FriaGeneratorPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061229] via-[#0b1f3a] to-[#0d253d] text-white">
        <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-sm border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 backdrop-blur-sm">
            <ShieldAlert className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300">
              Article 27 · deployer obligation · Aug 2, 2026
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Draft a Fundamental Rights Impact Assessment — before the AI Act audits arrive.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Claude generates a full five-section FRIA per Art. 27(1) from a short
            description of your system. Public authorities, public bodies, and
            private deployers in credit scoring or insurance pricing must complete
            one before first use — and the Commission template is still unpublished.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-[#0b1f3a] transition-colors hover:bg-slate-100"
            >
              Start FRIA generator on Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/free/risk-checker"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              Try free risk checker
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/50">
            FRIA generator is included on Pro ($49/mo) and above. The 30-second risk
            checker is free with no signup — start there to confirm you actually need a FRIA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">
              What Article 27 requires
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Five sections. Mandatory content. Notified to your national authority.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-700">
              The FRIA is a deployer-side obligation — separate from the provider&apos;s
              conformity assessment and separate from any DPIA. It must describe the
              processes, affected groups, specific risks, oversight measures,
              mitigation plan, and complaint mechanism for each high-risk AI system
              you deploy. The Commission will publish a template under Art. 27(5);
              it has not yet done so. AIComply gives you a compliant draft today.
            </p>

            <ul className="mt-8 space-y-4">
              {SECTIONS.map((s) => (
                <li
                  key={s.title}
                  className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-sky-100 font-mono text-xs font-bold text-sky-900">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{s.body}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {s.article}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-md border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-sky-700" />
              <p className="font-display text-lg font-semibold">Who must do this</p>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Art. 27 applies to deployers of high-risk AI systems who are:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <DeployerItem>Public authorities and public bodies</DeployerItem>
              <DeployerItem>
                Private entities providing a public service (health, education,
                transport, municipal services)
              </DeployerItem>
              <DeployerItem>
                Private entities using an AI system for credit scoring
              </DeployerItem>
              <DeployerItem>
                Private entities using an AI system for life / health insurance
                pricing
              </DeployerItem>
            </ul>

            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <p className="font-semibold">Penalties under Art. 99</p>
              <p className="mt-1">
                Up to €15M or 3% of global turnover for non-compliance with
                deployer obligations. Stacked on GDPR.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1100px] px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-3">
            <Feature
              icon={Clock}
              title="10 minutes, not 10 weeks"
              body="Paste a short description. Claude drafts all five sections. You edit, your DPO reviews, you export PDF."
            />
            <Feature
              icon={FileText}
              title="Auditor-ready PDF"
              body="Branded output with per-section Art. 27 references, Charter citations, and a notification disclaimer. Hand directly to counsel."
            />
            <Feature
              icon={CheckCircle2}
              title="Honest drafts"
              body="We flag residual risk and mark missing inputs inline. Regulators penalize optimistic assessments — we default to candor."
            />
          </div>

          <div className="mt-16 rounded-md border border-sky-300 bg-white p-8 text-center">
            <h3 className="font-display text-2xl font-semibold">
              FRIA generator on Pro · 3 per month, $49/mo
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Free 30-second risk checker confirms you need a FRIA before you upgrade. Audit trail and PDF export included on Pro.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-sky-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const SECTIONS = [
  {
    n: "1",
    title: "Deployer processes & context",
    body: "Narrative of where the system will be used, purpose, duration, frequency and affected groups.",
    article: "Art. 27(1)(a)-(c)",
  },
  {
    n: "2",
    title: "Risks to fundamental rights",
    body: "Charter articles implicated, concrete harm scenarios, residual risks.",
    article: "Art. 27(1)(d)",
  },
  {
    n: "3",
    title: "Human oversight measures",
    body: "Meaningful review, override capability, escalation thresholds, oversight personnel competencies.",
    article: "Art. 27(1)(e) · Art. 14",
  },
  {
    n: "4",
    title: "Mitigation when risks materialise",
    body: "Corrective actions, service interruption, notification of affected persons, bias re-testing.",
    article: "Art. 27(1)(f)",
  },
  {
    n: "5",
    title: "Governance & complaints",
    body: "Model registry, log retention per Art. 12, sign-off cadence, affected-person complaint mechanism per Art. 26(6).",
    article: "Art. 27(1)(f) · Art. 26",
  },
];

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#0b1f3a]">
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function DeployerItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
      <span>{children}</span>
    </li>
  );
}
