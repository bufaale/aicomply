"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pyramid } from "@/components/aicomply/atoms";

export default function V2LandingPage() {
  const [days, setDays] = useState(89);
  useEffect(() => {
    const t = Date.now();
    const target = new Date("2026-08-02").getTime();
    const d = Math.max(0, Math.ceil((target - t) / 86400000));
    setDays(d);
  }, []);

  return (
    <>
      <section
        className="aic-mkt-section"
        style={{
          background: "var(--aic-surface-1)",
          color: "#fff",
          padding: "72px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="aic-hero-grid" />
        <div
          className="aic-hero-grid-cols"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          <div>
            <div
              className="aic-eyebrow-line"
              style={{ color: "var(--aic-gold)", marginBottom: 20 }}
            >
              <span className="live-dot" />
              EU AI ACT · ART. 4 · IN FORCE 02 AUG 2026
            </div>
            <h1
              className="aic-hero-h1"
              style={{
                font: "500 64px/1.04 var(--aic-font-serif)",
                letterSpacing: "-.03em",
                margin: 0,
                color: "#fff",
              }}
            >
              Classify every AI system into{" "}
              <em style={{ color: "var(--aic-gold)", fontStyle: "italic" }}>4 risk tiers</em>.
              Hand auditors a packet.
            </h1>
            <p
              style={{
                font: "18px/1.55 var(--aic-font-sans)",
                color: "rgba(255,255,255,.72)",
                marginTop: 22,
                maxWidth: 560,
              }}
            >
              The EU AI Act fines reach{" "}
              <strong style={{ color: "#fff" }}>€35M or 7% of revenue</strong>. Answer 10
              questions, get your tier, and sign off Article 4 literacy in seven days. No
              12-person GRC team required.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <Link
                href="/free/risk-checker"
                className="aic-btn aic-btn--primary aic-btn--lg"
              >
                Run the 10-question check — free
              </Link>
              <Link
                href="/pricing"
                className="aic-btn aic-btn--ghost-dark aic-btn--lg"
              >
                See pricing
              </Link>
            </div>
            <div
              className="aic-stat-grid-4"
              style={{
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 24,
                borderTop: "1px solid rgba(255,255,255,.08)",
                paddingTop: 22,
              }}
            >
              {([
                ["€35M", "or 7% revenue · max fine"],
                [String(days), "days · until 02 Aug 2026"],
                ["4", "risk tiers · Art. 6 + Annex III"],
                ["10", "questions · self-assess"],
              ] as const).map(([n, l]) => (
                <div key={l}>
                  <div
                    className="aic-tabular"
                    style={{
                      // Inter (sans) for stat values — Fraunces serif's
                      // variable opsz axis caused mixed-glyph baselines on
                      // strings like "€35M" where the M rendered at a
                      // different optical size than the digits. Inter is
                      // monospaced-figure-friendly and visually rock-solid
                      // in tabular contexts.
                      font: "700 32px/1 var(--aic-font-sans)",
                      color: "#fff",
                      letterSpacing: "-.025em",
                      fontFeatureSettings: '"tnum" 1, "lnum" 1',
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      font: "var(--aic-mono-sm)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,.5)",
                      marginTop: 6,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(212,175,55,.22)",
              background: "rgba(15,23,42,.55)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <span
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.55)",
                }}
              >
                Risk pyramid · Art. 5–6
              </span>
              <span className="aic-pill aic-pill--pass aic-pill--live">
                <span className="dot" />
                LIVE
              </span>
            </div>
            <div style={{ padding: 18 }}>
              <Pyramid
                dark
                counts={{
                  prohibited: "BANNED",
                  high: "ASSESS",
                  limited: "DISCLOSE",
                  minimal: "VOLUNTARY",
                }}
              />
            </div>
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,.02)",
                font: "var(--aic-mono-sm)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                borderTop: "1px solid rgba(255,255,255,.05)",
              }}
            >
              <span>REGULATION (EU) 2024/1689</span>
              <Link
                href="/free/risk-checker"
                style={{ color: "var(--aic-gold)", textDecoration: "none" }}
              >
                Classify your system →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "32px 56px",
          background: "var(--aic-paper-1)",
          borderBottom: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          <span className="aic-eyebrow-line aic-eyebrow-line--light">
            CROSS-WALK · PRE-SATISFIED
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "baseline",
              justifyContent: "flex-end",
            }}
          >
            {[
              ["EU", "2024/1689"],
              ["NIST", "AI RMF"],
              ["ISO", "42001"],
              ["SOC 2", "TYPE II"],
              ["GDPR", "ART. 22"],
            ].map(([a, b]) => (
              <div key={a} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".08em",
                    color: "var(--aic-fg-l-4)",
                    textTransform: "uppercase",
                  }}
                >
                  {a}
                </span>
                <span
                  style={{
                    fontFamily: "var(--aic-font-serif)",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--aic-fg-l-1)",
                    letterSpacing: "-.01em",
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ padding: "80px 56px", background: "var(--aic-paper-0)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            FOUR STEPS · SEVEN DAYS
          </div>
          <h2
            style={{
              font: "500 40px/1.15 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: "0 0 40px",
              maxWidth: 780,
              // Lock the optical-size axis to match the visual size so
              // italic glyphs render with the same metrics as the regular
              // run. Without this, Fraunces' opsz axis can pick mixed
              // optical sizes for italic vs regular text within the same
              // heading, producing baseline mismatch when the italic span
              // wraps to a new line.
              fontVariationSettings: '"opsz" 36',
            }}
          >
            From &ldquo;we use ChatGPT&rdquo; to{" "}
            <span
              style={{
                color: "var(--aic-gold-deep)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Annex IV pack on the auditor&apos;s desk
            </span>
            .
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              border: "1px solid var(--aic-paper-line)",
            }}
          >
            {[
              [
                "01",
                "Inventory",
                "Connect Slack, Notion, Drive. We auto-discover ChatGPT, Claude, Copilot, and 40+ tools your team uses.",
              ],
              [
                "02",
                "Classify risk",
                "10 yes/no questions per system → tier verdict, Annex III mapping, conformity-assessment route.",
              ],
              [
                "03",
                "Train + log",
                "Article 4 literacy: 8-min modules, signed acknowledgements, append-only log. Required Aug 2026.",
              ],
              [
                "04",
                "Hand over packet",
                "Annex IV technical documentation. DPIA + FRIA. Auditor URL. 312 evidence rows, one PDF.",
              ],
            ].map(([n, t, d], i) => (
              <div
                key={n}
                style={{
                  padding: 22,
                  borderRight: i < 3 ? "1px solid var(--aic-paper-line-soft)" : "0",
                  background: "var(--aic-paper-1)",
                }}
              >
                <div
                  style={{
                    font: "var(--aic-mono)",
                    letterSpacing: ".12em",
                    color: "var(--aic-gold-deep)",
                    marginBottom: 14,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    font: "600 18px/1.3 var(--aic-font-serif)",
                    letterSpacing: "-.01em",
                    marginBottom: 8,
                  }}
                >
                  {t}
                </div>
                <p
                  style={{
                    font: "14px/1.6 var(--aic-font-sans)",
                    color: "var(--aic-fg-l-3)",
                    margin: 0,
                  }}
                >
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "72px 56px",
          background: "var(--aic-paper-1)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            PRICING · WORKSPACE · USD
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 48,
              alignItems: "end",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                font: "500 40px/1.1 var(--aic-font-serif)",
                letterSpacing: "-.025em",
                margin: 0,
              }}
            >
              Per workspace, per month.
            </h2>
            <p
              style={{
                margin: 0,
                color: "var(--aic-fg-l-3)",
                font: "15px/1.55 var(--aic-font-sans)",
              }}
            >
              No per-seat tax on Article 4 literacy. Annual prepaid saves 17%.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              border: "1px solid var(--aic-paper-line)",
            }}
          >
            {(
              [
                ["Pro", "$49", "up to 20 systems · FRIA", "Pick", false],
                ["Business", "$149", "unlimited · DPIA + FRIA", "Most picked", true],
                ["Regulated", "$399", "unlimited · Annex IV pack", "Pick", false],
                ["Enterprise", "Contact", "SSO · BYO bucket", "Sales", false],
              ] as const
            ).map(([t, p, s, cta, featured], i) => (
              <div
                key={t}
                style={{
                  padding: featured ? "42px 22px 24px" : "24px 22px",
                  background: featured
                    ? "var(--aic-surface-1)"
                    : "var(--aic-paper-1)",
                  color: featured ? "#fff" : "var(--aic-fg-l-1)",
                  borderRight: i < 3 ? "1px solid var(--aic-paper-line-soft)" : "0",
                  position: "relative",
                }}
              >
                {featured && (
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
                    color: featured ? "var(--aic-gold)" : "var(--aic-fg-l-3)",
                    marginBottom: 10,
                  }}
                >
                  {t}
                </div>
                <div
                  className="aic-tabular"
                  style={{
                    font: "500 32px/1 var(--aic-font-serif)",
                    letterSpacing: "-.025em",
                  }}
                >
                  {p}
                </div>
                <div
                  style={{
                    font: "13px/1 var(--aic-font-sans)",
                    color: featured
                      ? "rgba(255,255,255,.6)"
                      : "var(--aic-fg-l-3)",
                    marginTop: 8,
                  }}
                >
                  {s}
                </div>
                <Link
                  href="/pricing"
                  className={
                    featured
                      ? "aic-btn aic-btn--primary aic-btn--block"
                      : "aic-btn aic-btn--ghost-light aic-btn--block"
                  }
                  style={{ marginTop: 18 }}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "72px 56px",
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
                PROCUREMENT FAQ
              </div>
              <h2
                style={{
                  font: "500 36px/1.1 var(--aic-font-serif)",
                  letterSpacing: "-.025em",
                  margin: 0,
                }}
              >
                What your CFO will ask.
              </h2>
              <p
                style={{
                  marginTop: 14,
                  color: "var(--aic-fg-l-3)",
                  font: "15px/1.55 var(--aic-font-sans)",
                }}
              >
                Citations to{" "}
                <span
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--aic-fg-l-2)",
                  }}
                >
                  REGULATION (EU) 2024/1689
                </span>{" "}
                on every page.
              </p>
            </div>
            <div style={{ border: "1px solid var(--aic-paper-line)" }}>
              {[
                [
                  "Are you SOC 2 Type II?",
                  "Yes — SOC 2 Type II since November 2025. Report under NDA. ISO 27001 since June 2024.",
                ],
                [
                  "What if my system is high-risk?",
                  "We generate the conformity assessment route, Annex IV technical documentation, post-market monitoring plan, and FRIA — referenced to Articles 8–17.",
                ],
                [
                  "Does this work for non-EU companies?",
                  "If your AI system's output is used in the EU, the Act applies. We cover providers, deployers, importers, and distributors.",
                ],
                [
                  "Where is data stored?",
                  "AWS eu-central-1 by default for EU customers. Enterprise supports BYO bucket.",
                ],
                [
                  "DPA / BAA?",
                  "DPA pre-signed. HIPAA BAA on Regulated and Enterprise.",
                ],
                [
                  "Can we cancel?",
                  "Anytime. Annual plans get a prorated refund within 60 days.",
                ],
              ].map(([q, a], i) => (
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

    </>
  );
}
