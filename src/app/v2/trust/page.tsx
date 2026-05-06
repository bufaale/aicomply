import Link from "next/link";
import { PyramidBar, TierBadge } from "@/components/aicomply/atoms";

/**
 * Demo render of the public trust page that AIComply customers expose at
 * /trust/{operator}/{system-slug}. The real route is /trust/[slug] in
 * (marketing). This v2 page exists only to preview the design under the
 * v2 visual system; once the v2 swap completes, the per-slug template
 * inherits this layout.
 */
export default function V2TrustPublicPage() {
  return (
    <>
      <section
        style={{
          padding: "40px 56px",
          background: "var(--aic-paper-0)",
          borderBottom: "2px solid var(--aic-paper-line)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              font: "var(--aic-mono-sm)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--aic-fg-l-3)",
              marginBottom: 14,
            }}
          >
            <span style={{ color: "var(--aic-fg-l-4)" }}>aicomply.eu/trust/</span>
            <span style={{ color: "var(--aic-fg-l-1)", fontWeight: 600 }}>
              acme-health/triage-copilot
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 32,
              alignItems: "start",
            }}
          >
            <div>
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 12 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--aic-pass-deep)",
                    boxShadow: "0 0 0 4px rgba(15,118,110,.18)",
                  }}
                />
                COMPLIANT · LAST REVIEWED 28 APR 2026
              </div>
              <h1
                style={{
                  font: "500 44px/1.06 var(--aic-font-serif)",
                  letterSpacing: "-.025em",
                  margin: "0 0 8px",
                }}
              >
                Triage Copilot
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "var(--aic-fg-l-2)",
                  font: "16px/1.55 var(--aic-font-sans)",
                  maxWidth: 680,
                }}
              >
                AI-assisted clinical triage at Acme Health. Routes 12,000 patient inquiries
                per month to the right department, with a clinician final review on every
                output.
              </p>
            </div>
            <div
              style={{
                padding: "20px 22px",
                border: "1px solid var(--aic-paper-line)",
                background: "var(--aic-paper-1)",
              }}
            >
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 8 }}
              >
                OPERATOR
              </div>
              <div
                style={{
                  font: "600 17px/1.3 var(--aic-font-serif)",
                  color: "var(--aic-fg-l-1)",
                }}
              >
                Acme Health, Inc.
              </div>
              <div
                style={{
                  font: "13px/1.5 var(--aic-font-sans)",
                  color: "var(--aic-fg-l-3)",
                  marginTop: 4,
                }}
              >
                Healthcare · 142 employees · Berlin, DE
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: "1px solid var(--aic-paper-line-soft)",
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-4)",
                }}
              >
                CONTACT · privacy@acme.health
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 56px", background: "var(--aic-paper-1)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ border: "1px solid var(--aic-paper-line)", marginBottom: 32 }}>
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid var(--aic-paper-line-soft)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-3)",
                }}
              >
                EU AI ACT · CLASSIFICATION
              </span>
              <span
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-4)",
                }}
              >
                ART. 6 · ANNEX III
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 0,
              }}
            >
              <div
                style={{
                  padding: 28,
                  borderRight: "1px solid var(--aic-paper-line-soft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "baseline",
                    marginBottom: 14,
                  }}
                >
                  <h2
                    style={{
                      font: "500 48px/1 var(--aic-font-serif)",
                      letterSpacing: "-.025em",
                      margin: 0,
                      color: "#b45309",
                    }}
                  >
                    High-risk
                  </h2>
                  <TierBadge tier="high" />
                </div>
                <p
                  style={{
                    margin: "0 0 14px",
                    color: "var(--aic-fg-l-2)",
                    font: "15px/1.6 var(--aic-font-sans)",
                  }}
                >
                  Classified under <strong>Annex III §5(b)</strong> — AI used by public
                  services for triage in healthcare. Subject to Articles 8–17 obligations
                  including risk management, data governance, technical documentation,
                  transparency, human oversight, and post-market monitoring.
                </p>
                <PyramidBar current="high" />
              </div>
              <div style={{ padding: 28, background: "var(--aic-paper-0)" }}>
                <div
                  className="aic-eyebrow-line aic-eyebrow-line--light"
                  style={{ marginBottom: 14 }}
                >
                  CONFORMITY ROUTE
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    ["Internal control", "ANNEX VI", "✓"],
                    ["Annex IV technical doc", "ART. 11", "✓"],
                    ["EU database registration", "ART. 71", "✓"],
                    ["Post-market monitoring", "ART. 72", "✓"],
                    ["Notified body assessment", "ANNEX VII", "N/A"],
                  ].map(([l, c, s]) => (
                    <div
                      key={l}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        gap: 14,
                        alignItems: "baseline",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "var(--aic-fg-l-2)" }}>{l}</span>
                      <span
                        style={{
                          font: "var(--aic-mono-sm)",
                          letterSpacing: ".06em",
                          color: "var(--aic-fg-l-4)",
                        }}
                      >
                        {c}
                      </span>
                      <span
                        style={{
                          font: "var(--aic-mono-sm)",
                          letterSpacing: ".06em",
                          color:
                            s === "✓" ? "var(--aic-pass-deep)" : "var(--aic-fg-l-4)",
                        }}
                      >
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="aic-cards-3" style={{ marginBottom: 32 }}>
            {[
              ["Model", "Anthropic Claude Sonnet 4.5", "Provider · third-party"],
              [
                "Data sources",
                "De-identified patient inquiries",
                "No PHI stored beyond 30 days",
              ],
              ["Human oversight", "Clinician final review", "100% of outputs reviewed"],
              ["Decisions / month", "11,847", "Apr 2026"],
              ["Affected persons", "Patients of Acme Health", "Berlin, DE only"],
              ["Last incident", "None", "Since deployment"],
            ].map(([l, v, m]) => (
              <div
                key={l}
                style={{
                  padding: "18px 20px",
                  border: "1px solid var(--aic-paper-line)",
                  background: "var(--aic-paper-0)",
                }}
              >
                <div
                  className="aic-eyebrow-line aic-eyebrow-line--light"
                  style={{ marginBottom: 8 }}
                >
                  {l}
                </div>
                <div
                  style={{
                    font: "600 17px/1.3 var(--aic-font-serif)",
                    color: "var(--aic-fg-l-1)",
                    letterSpacing: "-.005em",
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    font: "13px/1.5 var(--aic-font-sans)",
                    color: "var(--aic-fg-l-4)",
                    marginTop: 4,
                  }}
                >
                  {m}
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: "1px solid var(--aic-paper-line)", marginBottom: 32 }}>
            <div
              style={{
                padding: "14px 22px",
                borderBottom: "1px solid var(--aic-paper-line-soft)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-3)",
                }}
              >
                PUBLIC DOCUMENTATION
              </span>
              <span
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-4)",
                }}
              >
                6 ITEMS
              </span>
            </div>
            <table className="aic-t aic-tabular">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Reference</th>
                  <th>Last reviewed</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI register entry", "Art. 71", "28 Apr 2026"],
                  ["Annex IV technical doc (public extract)", "Art. 11", "28 Apr 2026"],
                  ["DPIA — patient triage", "GDPR Art. 35", "14 Apr 2026"],
                  ["FRIA — fundamental rights", "AI Act Art. 27", "14 Apr 2026"],
                  ["Article 4 literacy register", "Art. 4", "02 May 2026"],
                  ["Post-market monitoring report", "Art. 72", "Q1 2026"],
                ].map((row, i) => (
                  <tr key={row[0]} style={i % 2 ? { background: "var(--aic-paper-2)" } : {}}>
                    <td style={{ color: "var(--aic-fg-l-1)", fontWeight: 500 }}>
                      {row[0]}
                    </td>
                    <td
                      style={{
                        font: "var(--aic-mono-sm)",
                        letterSpacing: ".06em",
                        color: "var(--aic-fg-l-3)",
                      }}
                    >
                      {row[1]}
                    </td>
                    <td style={{ color: "var(--aic-fg-l-3)" }}>{row[2]}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href="#"
                        style={{
                          color: "var(--aic-gold-deep)",
                          fontWeight: 600,
                          textDecoration: "none",
                          fontSize: 13,
                        }}
                      >
                        Download PDF →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "22px 24px",
              border: "1px solid var(--aic-paper-line)",
              background: "var(--aic-paper-0)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 6 }}
              >
                VERIFICATION
              </div>
              <div
                style={{
                  font: "15px/1.55 var(--aic-font-sans)",
                  color: "var(--aic-fg-l-2)",
                }}
              >
                This page is generated and updated automatically by AIComply. Documents are
                signed with the operator&apos;s key and timestamped on every update.
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-4)",
                }}
              >
                FINGERPRINT · 7B4E:9F12:A3D8:0142 · 02 MAY 2026 · 14:33:08 UTC
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="#" className="aic-btn aic-btn--ghost-light aic-btn--sm">
                Report a concern
              </Link>
              <Link href="#" className="aic-btn aic-btn--ink aic-btn--sm">
                Verify signature
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
