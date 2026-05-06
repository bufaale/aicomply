"use client";

import Link from "next/link";
import { MktHeader, MktFooter } from "@/components/aicomply/atoms";

const TIER_NAMES = ["Pro", "Business", "Regulated", "Enterprise"] as const;

interface MatrixRow {
  feature: string;
  values?: readonly string[];
}

const MATRIX: MatrixRow[] = [
  { feature: "AI systems & inventory" },
  { feature: "Tracked AI systems", values: ["5", "50", "Unlimited", "Unlimited"] },
  { feature: "Auto-discovery (Slack/Drive)", values: ["✓", "✓", "✓", "✓"] },
  { feature: "10-question risk classifier", values: ["✓", "✓", "✓", "✓"] },
  { feature: "Classification & risk" },
  { feature: "EU AI Act 4-tier classification", values: ["✓", "✓", "✓", "✓"] },
  { feature: "Annex III mapping", values: ["—", "✓", "✓", "✓"] },
  { feature: "Conformity assessment route", values: ["—", "✓", "✓", "✓"] },
  { feature: "Cross-walk (NIST · ISO · SOC 2)", values: ["—", "✓", "✓", "✓"] },
  { feature: "Documentation" },
  { feature: "Annex IV technical pack", values: ["—", "Draft", "Auto-gen", "Auto-gen"] },
  { feature: "DPIA generator", values: ["—", "—", "✓", "✓"] },
  { feature: "FRIA generator (Art. 27)", values: ["—", "—", "✓", "✓"] },
  { feature: "Post-market monitoring plan", values: ["—", "—", "✓", "✓"] },
  { feature: "Article 4 literacy" },
  {
    feature: "Employee literacy register",
    values: ["Up to 25", "Up to 100", "Unlimited", "Unlimited"],
  },
  { feature: "Training modules (8 min)", values: ["2", "8", "All", "All + custom"] },
  { feature: "Signed acknowledgements log", values: ["✓", "✓", "✓", "✓"] },
  { feature: "Audit & evidence" },
  { feature: "Append-only event log", values: ["30 days", "1 year", "7 years", "7 years"] },
  { feature: "Auditor read-only URL", values: ["—", "✓", "✓", "✓"] },
  { feature: "Public trust page", values: ["—", "✓", "✓", "✓"] },
  { feature: "Operations" },
  { feature: "SSO (SAML/OIDC)", values: ["—", "—", "✓", "✓"] },
  { feature: "BYO storage bucket", values: ["—", "—", "—", "✓"] },
  { feature: "Slack alerts", values: ["—", "✓", "✓", "✓"] },
  {
    feature: "Support",
    values: ["Email", "Email", "Priority", "Dedicated CSM"],
  },
];

interface TierCard {
  n: string;
  p: string;
  s: string;
  bullets: readonly string[];
  cta: string;
  ctaHref: string;
  featured: boolean;
}

const TIERS: readonly TierCard[] = [
  {
    n: "Pro",
    p: "$49",
    s: "For teams just starting AI Act prep",
    bullets: [
      "5 AI systems",
      "10-question classifier",
      "Up to 25 employees",
      "Templates only",
      "30-day audit log",
      "Email support",
    ],
    cta: "Start 14-day trial",
    ctaHref: "/signup",
    featured: false,
  },
  {
    n: "Business",
    p: "$149",
    s: "For growing SMBs with 5–50 systems",
    bullets: [
      "50 AI systems",
      "Annex III mapping",
      "Cross-walk to NIST + ISO",
      "1-year audit log",
      "Auditor URL · public trust page",
      "Slack alerts",
    ],
    cta: "Start 14-day trial",
    ctaHref: "/signup",
    featured: true,
  },
  {
    n: "Regulated",
    p: "$399",
    s: "For healthcare, finance, legal, HR",
    bullets: [
      "Unlimited AI systems",
      "DPIA + FRIA generator",
      "Annex IV auto-generation",
      "Post-market monitoring",
      "HIPAA BAA · 7-yr log",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    ctaHref: "/signup",
    featured: false,
  },
  {
    n: "Enterprise",
    p: "Contact",
    s: "For 500+ employee organisations",
    bullets: [
      "Unlimited everything",
      "SSO (SAML / OIDC)",
      "BYO storage bucket",
      "Custom frameworks",
      "Dedicated CSM",
      "Annual contract",
    ],
    cta: "Talk to sales",
    ctaHref: "mailto:alex@piposlab.com?subject=AIComply%20Enterprise%20tier%20inquiry",
    featured: false,
  },
];

const BILLING_FAQ: ReadonlyArray<readonly [string, string]> = [
  ["Can I switch tiers?", "Yes — upgrade prorates immediately, downgrade applies at next renewal."],
  [
    "What counts as one AI system?",
    "Each model + use case. ChatGPT for support and ChatGPT for coding count as two.",
  ],
  [
    "Do you charge per seat?",
    "No. Article 4 literacy modules are unlimited employees on every paid tier.",
  ],
  [
    "What's the trial?",
    "14 days, no credit card. Includes Annex III mapping and one Annex IV draft.",
  ],
  [
    "Can I bring my own auditor?",
    "Yes. The auditor URL is read-only and you control its expiry.",
  ],
];

export default function V2PricingPage() {
  return (
    <>
      <MktHeader activePath="/v2/pricing" />

      <section style={{ padding: "56px 56px 32px", background: "var(--aic-paper-0)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            PRICING · WORKSPACE · USD · ANNUAL
          </div>
          <h1
            style={{
              font: "500 52px/1.05 var(--aic-font-serif)",
              letterSpacing: "-.03em",
              margin: "0 0 14px",
            }}
          >
            Per workspace. Per month.
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--aic-fg-l-3)",
              font: "17px/1.55 var(--aic-font-sans)",
              maxWidth: 560,
            }}
          >
            14-day trial on every tier. Annual prepaid saves 17%. No per-seat tax on Article 4
            literacy.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 56px 64px", background: "var(--aic-paper-0)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              border: "1px solid var(--aic-paper-line)",
            }}
          >
            {TIERS.map((t, i) => (
              <div
                key={t.n}
                style={{
                  padding: t.featured ? "46px 22px 24px" : "28px 22px",
                  background: t.featured ? "var(--aic-surface-1)" : "var(--aic-paper-1)",
                  color: t.featured ? "#fff" : "var(--aic-fg-l-1)",
                  borderRight: i < 3 ? "1px solid var(--aic-paper-line-soft)" : "0",
                  position: "relative",
                }}
              >
                {t.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      padding: "6px 14px",
                      background: "var(--aic-gold)",
                      color: "var(--aic-gold-ink)",
                      font: "var(--aic-mono-sm)",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Most picked
                  </div>
                )}
                <div
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: t.featured ? "var(--aic-gold)" : "var(--aic-fg-l-3)",
                    marginBottom: 10,
                  }}
                >
                  {t.n}
                </div>
                <div
                  className="aic-tabular"
                  style={{
                    font: "500 36px/1 var(--aic-font-serif)",
                    letterSpacing: "-.025em",
                  }}
                >
                  {t.p}
                </div>
                <div
                  style={{
                    font: "13px/1.4 var(--aic-font-sans)",
                    color: t.featured ? "rgba(255,255,255,.6)" : "var(--aic-fg-l-3)",
                    marginTop: 8,
                    minHeight: 36,
                  }}
                >
                  {t.s}
                </div>
                <Link
                  href={t.ctaHref}
                  className={
                    t.featured
                      ? "aic-btn aic-btn--primary aic-btn--block"
                      : "aic-btn aic-btn--ghost-light aic-btn--block"
                  }
                  style={{ marginTop: 18 }}
                >
                  {t.cta}
                </Link>
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 14,
                    borderTop: t.featured
                      ? "1px solid rgba(255,255,255,.08)"
                      : "1px solid var(--aic-paper-line-soft)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {t.bullets.map((b) => (
                    <div
                      key={b}
                      style={{
                        display: "flex",
                        gap: 8,
                        font: "14px/1.5 var(--aic-font-sans)",
                        color: t.featured ? "rgba(255,255,255,.85)" : "var(--aic-fg-l-2)",
                      }}
                    >
                      <span
                        style={{
                          color: t.featured ? "var(--aic-gold)" : "var(--aic-gold-deep)",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "56px 56px",
          background: "var(--aic-paper-1)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            FEATURE MATRIX
          </div>
          <h2
            style={{
              font: "500 32px/1.1 var(--aic-font-serif)",
              letterSpacing: "-.02em",
              margin: "0 0 24px",
            }}
          >
            Everything in every tier.
          </h2>
          <div style={{ border: "1px solid var(--aic-paper-line)", overflow: "auto" }}>
            <table
              className="aic-t aic-matrix aic-tabular"
              style={{ minWidth: 760 }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--aic-paper-line)" }}>
                  <th style={{ width: "36%" }}>Feature</th>
                  {TIER_NAMES.map((t) => (
                    <th key={t} style={{ textAlign: "center" }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, idx) => {
                  if (!row.values) {
                    return (
                      <tr key={`h-${idx}`} className="row-h">
                        <td colSpan={5}>{row.feature}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={`r-${idx}`}>
                      <td style={{ color: "var(--aic-fg-l-2)" }}>{row.feature}</td>
                      {row.values.map((v, j) => (
                        <td key={j} style={{ textAlign: "center" }}>
                          {v === "✓" ? (
                            <span className="check">✓</span>
                          ) : v === "—" ? (
                            <span className="dash">—</span>
                          ) : (
                            <span
                              style={{
                                font: "var(--aic-mono-sm)",
                                letterSpacing: ".06em",
                                color: "var(--aic-fg-l-2)",
                              }}
                            >
                              {v}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: 24,
              font: "var(--aic-mono-sm)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--aic-fg-l-4)",
            }}
          >
            REGULATION (EU) 2024/1689 · ARTICLE 99 · ARTICLE 4
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "64px 56px",
          background: "var(--aic-paper-0)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            <div>
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 14 }}
              >
                BILLING FAQ
              </div>
              <h2
                style={{
                  font: "500 32px/1.1 var(--aic-font-serif)",
                  letterSpacing: "-.025em",
                  margin: 0,
                }}
              >
                Common pricing questions.
              </h2>
            </div>
            <div style={{ border: "1px solid var(--aic-paper-line)" }}>
              {BILLING_FAQ.map(([q, a], i) => (
                <details
                  key={q}
                  style={{
                    borderTop: i ? "1px solid var(--aic-paper-line-soft)" : "0",
                    padding: "18px 22px",
                    background: "var(--aic-paper-1)",
                  }}
                >
                  <summary
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      listStyle: "none",
                      font: "600 16px/1.4 var(--aic-font-serif)",
                    }}
                  >
                    <span>{q}</span>
                    <span
                      style={{
                        font: "var(--aic-mono-sm)",
                        color: "var(--aic-gold-deep)",
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    style={{
                      margin: "10px 0 0",
                      font: "14px/1.6 var(--aic-font-sans)",
                      color: "var(--aic-fg-l-2)",
                    }}
                  >
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MktFooter />
    </>
  );
}
