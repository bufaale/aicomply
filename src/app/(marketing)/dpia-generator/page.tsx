import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, FileText, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Free DPIA Generator (GDPR Article 35) | AIComply",
  description:
    "Generate a Data Protection Impact Assessment draft for any high-risk processing operation. Five Art. 35(7) sections + PDF export. Claude-powered. Free tier includes one DPIA.",
  alternates: { canonical: "/dpia-generator" },
  openGraph: {
    title: "Free DPIA Generator — GDPR Article 35",
    description: "Draft a DPIA in 15 minutes. Required for any high-risk processing.",
    url: "/dpia-generator",
    type: "website",
  },
};

export default function DpiaGeneratorPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b0f23] via-[#1a1338] to-[#1a2347] text-white">
        <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-sm border border-violet-400/40 bg-violet-400/10 px-3 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
              GDPR Article 35 · controller obligation
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Draft a DPIA in 15 minutes — not 15 meetings.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Every SaaS processing EU user data needs a DPIA the moment the
            processing looks high-risk — large-scale profiling, special
            category data, automated decision-making. Claude drafts all five
            Art. 35(7) sections from a short description. Your DPO reviews,
            you export PDF, you ship.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-[#0b0f23] transition-colors hover:bg-slate-100"
            >
              Generate my first DPIA free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              See plans
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/50">
            Free tier · 1 DPIA · no credit card · PDF export unlocked on Pro.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
              What Article 35(7) requires
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Five sections. Concrete content. Auditor-ready output.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-700">
              Supervisory authorities (CNIL in France, ICO in the UK, AEPD in
              Spain, Garante in Italy) all publish DPIA methodologies with the
              same bones: systematic description, necessity, risk, mitigation.
              AIComply drafts all of them with Claude and flags residual risk
              honestly — authorities penalize optimistic DPIAs.
            </p>

            <ul className="mt-8 space-y-4">
              {SECTIONS.map((s) => (
                <li
                  key={s.title}
                  className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-violet-100 font-mono text-xs font-bold text-violet-900">
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
              <AlertTriangle className="h-5 w-5 text-violet-700" />
              <p className="font-display text-lg font-semibold">When is a DPIA mandatory</p>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Art. 35(3) lists examples; most supervisory authorities have
              published positive lists that extend these:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <TriggerItem>Systematic, extensive automated evaluation (profiling, scoring) that produces legal / similarly significant effects.</TriggerItem>
              <TriggerItem>Processing special category data on a large scale (health, race, politics, sexual orientation, biometrics for ID).</TriggerItem>
              <TriggerItem>Systematic monitoring of publicly accessible areas on a large scale.</TriggerItem>
              <TriggerItem>Processing that sits on the supervisory authority&apos;s published Art. 35(4) positive list (varies by country).</TriggerItem>
            </ul>

            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <p className="font-semibold">Penalties under Art. 83(4)</p>
              <p className="mt-1">
                Failure to conduct a required DPIA: up to €10M or 2% of global
                turnover. Failure of prior consultation per Art. 36: same tier.
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
              title="15 minutes, not 15 meetings"
              body="Paste a short description of the processing. Claude drafts all five sections. DPO reviews, you export."
            />
            <Feature
              icon={FileText}
              title="Auditor-ready PDF"
              body="Per-block article references, methodology call-outs, and an explicit Art. 36 consultation checkbox."
            />
            <Feature
              icon={CheckCircle2}
              title="Stacks with FRIA"
              body="If the processing uses a high-risk AI system, pair your DPIA with an Art. 27 FRIA in one click."
            />
          </div>

          <div className="mt-16 rounded-md border border-violet-300 bg-white p-8 text-center">
            <h3 className="font-display text-2xl font-semibold">
              First DPIA free. Unlimited on Business.
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              No credit card. PDF export on Pro. Unlimited on Business.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-violet-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
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
    title: "Systematic description & purposes",
    body: "Narrative of the processing, data categories (special categories flagged), data subjects, recipients, retention, and international transfers.",
    article: "Art. 35(7)(a)",
  },
  {
    n: "2",
    title: "Necessity & proportionality",
    body: "Art. 6 lawful basis with rationale, necessity justification, proportionality balancing, and concrete data-minimisation measures.",
    article: "Art. 35(7)(b)",
  },
  {
    n: "3",
    title: "Risks to rights & freedoms",
    body: "Charter + GDPR-protected rights at risk, concrete harm scenarios, likelihood × severity scoring methodology.",
    article: "Art. 35(7)(c)",
  },
  {
    n: "4",
    title: "Mitigation measures",
    body: "Technical (encryption, access control, logging) + organisational (policies, training, vendor DPAs) + data-subject rights fulfilment + breach procedure.",
    article: "Art. 35(7)(d) · Art. 32",
  },
  {
    n: "5",
    title: "DPO & supervisory consultation",
    body: "Involvement of the DPO per Art. 35(2). Explicit posture on Art. 36(1) prior consultation.",
    article: "Art. 35(2) · Art. 36",
  },
];

function Feature({ icon: Icon, title, body }: { icon: typeof Clock; title: string; body: string }) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#0b0f23]">
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function TriggerItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
      <span>{children}</span>
    </li>
  );
}
