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

      {/* ============================================================
          FREE WEDGE — pull the free risk-checker into prominent view
          ============================================================ */}
      <section
        style={{
          padding: "64px 56px",
          background: "var(--aic-paper-1)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
          borderBottom: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 14 }}
              >
                FREE · NO SIGNUP
              </div>
              <h2
                style={{
                  font: "500 36px/1.1 var(--aic-font-serif)",
                  letterSpacing: "-.025em",
                  margin: 0,
                }}
              >
                Find out if your system is{" "}
                <span
                  style={{
                    color: "var(--aic-gold-deep)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  high-risk
                </span>
                {" "}in 30 seconds.
              </h2>
              <p
                style={{
                  marginTop: 14,
                  color: "var(--aic-fg-l-3)",
                  font: "15px/1.55 var(--aic-font-sans)",
                  maxWidth: 440,
                }}
              >
                10 yes/no questions, instant Article 6 + Annex III
                classification, plus the obligation checklist that
                applies to your tier. No card, no signup, no email
                wall.
              </p>
              <Link
                href="/free/risk-checker"
                className="aic-btn aic-btn--primary aic-btn--lg"
                style={{ marginTop: 24, display: "inline-flex" }}
              >
                Run the risk checker
              </Link>
            </div>
            <div
              style={{
                border: "1px solid var(--aic-paper-line)",
                background: "var(--aic-paper-0)",
                padding: 24,
              }}
            >
              <div
                style={{
                  font: "var(--aic-mono-sm)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-4)",
                  marginBottom: 18,
                }}
              >
                Sample classification — high-risk
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  fontFamily: "var(--aic-font-sans)",
                  fontSize: 13,
                  color: "var(--aic-fg-l-2)",
                }}
              >
                {[
                  ["Annex III area", "Recruitment · CV screening"],
                  ["Risk tier", "HIGH-RISK (Art. 6)"],
                  ["Conformity assessment", "Internal control (Art. 43)"],
                  ["FRIA required", "Yes — Art. 27"],
                  ["Article 4 literacy", "Required Aug 2, 2026"],
                  ["Documentation pack", "Annex IV (Art. 11)"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div
                      style={{
                        font: "var(--aic-mono-sm)",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "var(--aic-fg-l-4)",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--aic-fg-l-1)" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

      {/* ============================================================
          THREE DIFFERENTIATORS — what AIComply does that Vanta/Drata don't
          ============================================================ */}
      <section
        style={{
          padding: "72px 56px",
          background: "var(--aic-surface-1)",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line"
            style={{
              color: "var(--aic-gold)",
              marginBottom: 14,
            }}
          >
            THREE THINGS GENERIC GRC TOOLS SKIP
          </div>
          <h2
            style={{
              font: "500 40px/1.1 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: "0 0 48px",
              maxWidth: 780,
              color: "#fff",
            }}
          >
            Built around{" "}
            <span
              style={{
                color: "var(--aic-gold)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              the EU AI Act
            </span>
            . Not a generic compliance checkbox.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 0,
              border: "1px solid rgba(212,175,55,.22)",
            }}
          >
            {[
              {
                num: "01",
                title: "Annex IV generator",
                body: "Vanta and Drata stop at SOC 2 evidence. AIComply produces the EU AI Act Article 11 technical documentation pack — the exact artifact the conformity assessor requests — populated from your workspace inputs, not a 40-page Word template.",
                eyebrow: "ART. 11 · TECHNICAL DOCS",
              },
              {
                num: "02",
                title: "30-second risk classifier",
                body: "Generic GRC tools ask 200 questions across 14 frameworks. We ask 10 questions that map directly to Article 6 + Annex III categories. Operators self-classify in 30 seconds; high-risk systems get the conformity route auto-generated.",
                eyebrow: "ART. 6 + ANNEX III",
              },
              {
                num: "03",
                title: "Per-workspace pricing",
                body: "Holistic AI charges per AI system. Credo AI is custom-quote enterprise-only. We charge per workspace — add 50 new AI systems mid-quarter, the bill doesn't move. Pro $49, Business $149, Regulated $399.",
                eyebrow: "FLAT-RATE · NO PER-SYSTEM TAX",
              },
            ].map((d, i) => (
              <div
                key={d.num}
                style={{
                  padding: 28,
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,.08)" : "0",
                  background: "rgba(15,23,42,.32)",
                }}
              >
                <div
                  style={{
                    font: "var(--aic-mono)",
                    letterSpacing: ".12em",
                    color: "var(--aic-gold)",
                    marginBottom: 18,
                  }}
                >
                  {d.num}
                </div>
                <div
                  style={{
                    font: "600 20px/1.25 var(--aic-font-serif)",
                    letterSpacing: "-.01em",
                    marginBottom: 12,
                    color: "#fff",
                  }}
                >
                  {d.title}
                </div>
                <p
                  style={{
                    font: "14px/1.65 var(--aic-font-sans)",
                    color: "rgba(255,255,255,.7)",
                    margin: "0 0 14px",
                  }}
                >
                  {d.body}
                </p>
                <div
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "rgba(212,175,55,.65)",
                  }}
                >
                  {d.eyebrow}
                </div>
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

      {/* ============================================================
          COST OF NON-COMPLIANCE — €35M fines vs $49/mo
          ============================================================ */}
      <section
        style={{
          padding: "72px 56px",
          background: "var(--aic-paper-0)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            COST · NON-COMPLIANCE
          </div>
          <h2
            style={{
              font: "500 40px/1.1 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: "0 0 32px",
              maxWidth: 880,
            }}
          >
            One audit finding costs more than{" "}
            <span
              style={{
                color: "var(--aic-gold-deep)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              ten years of AIComply Regulated
            </span>
            .
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              border: "1px solid var(--aic-paper-line)",
            }}
          >
            {[
              {
                eyebrow: "MAX FINE · ART. 99",
                value: "€35M",
                value_sub: "or 7% of global revenue",
                body: "Prohibited-AI violations (Art. 5). Whichever is higher applies.",
              },
              {
                eyebrow: "TYPICAL · ART. 6 BREACH",
                value: "€15M",
                value_sub: "or 3% of global revenue",
                body: "High-risk system non-conformance. The category most companies fall into.",
              },
              {
                eyebrow: "AICOMPLY · REGULATED",
                value: "$399",
                value_sub: "per workspace · per month",
                body: "Annex IV pack, FRIA generator, BAA, BYO bucket. $4,788/yr — 0.014% of one €35M fine.",
              },
            ].map((c, i) => (
              <div
                key={c.eyebrow}
                style={{
                  padding: 28,
                  borderRight:
                    i < 2 ? "1px solid var(--aic-paper-line-soft)" : "0",
                  background: i === 2 ? "var(--aic-paper-1)" : "var(--aic-paper-0)",
                }}
              >
                <div
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color:
                      i === 2 ? "var(--aic-gold-deep)" : "var(--aic-fg-l-4)",
                    marginBottom: 14,
                  }}
                >
                  {c.eyebrow}
                </div>
                <div
                  className="aic-tabular"
                  style={{
                    font: "500 44px/1 var(--aic-font-serif)",
                    letterSpacing: "-.025em",
                    color: "var(--aic-fg-l-1)",
                    marginBottom: 4,
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    font: "14px/1.4 var(--aic-font-sans)",
                    color: "var(--aic-fg-l-3)",
                    marginBottom: 16,
                  }}
                >
                  {c.value_sub}
                </div>
                <p
                  style={{
                    font: "14px/1.6 var(--aic-font-sans)",
                    color: "var(--aic-fg-l-2)",
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: 24,
              font: "13px/1.55 var(--aic-font-sans)",
              color: "var(--aic-fg-l-4)",
              maxWidth: 880,
            }}
          >
            Source · Regulation (EU) 2024/1689 Article 99 · Penalty
            ceilings published in the Official Journal of the European
            Union, 12 July 2024.
          </p>
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
                  "What's your security posture?",
                  "Least-privilege Postgres RLS on every customer row. TLS 1.2+ in transit, AES-256 at rest (Supabase). DPA on request to alex@piposlab.com. SOC 2 Type II is on the roadmap once we hit 5+ enterprise customers; live posture details at aicomply.piposlab.com/trust.",
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

      {/* ============================================================
          COMPETITIVE COMPARISON — vs Vanta / Drata / Holistic / Credo
          ============================================================ */}
      <section
        style={{
          padding: "80px 56px",
          background: "var(--aic-paper-1)",
          borderTop: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            VS · GENERIC GRC PLATFORMS
          </div>
          <h2
            style={{
              font: "500 40px/1.1 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: "0 0 36px",
              maxWidth: 880,
            }}
          >
            How AIComply compares for{" "}
            <span
              style={{
                color: "var(--aic-gold-deep)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              EU AI Act readiness
            </span>
            .
          </h2>
          <div
            style={{
              border: "1px solid var(--aic-paper-line)",
              background: "var(--aic-paper-0)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr repeat(4,1fr)",
                background: "var(--aic-surface-1)",
                color: "#fff",
              }}
            >
              {["Capability", "AIComply", "Vanta", "Drata", "Holistic AI"].map(
                (h, i) => (
                  <div
                    key={h}
                    style={{
                      padding: "16px 18px",
                      font:
                        i === 0
                          ? "var(--aic-mono-sm)"
                          : "600 14px/1.2 var(--aic-font-serif)",
                      letterSpacing: i === 0 ? ".1em" : "-.005em",
                      textTransform: i === 0 ? "uppercase" : "none",
                      color: i === 1 ? "var(--aic-gold)" : "#fff",
                      borderRight:
                        i < 4 ? "1px solid rgba(255,255,255,.08)" : "0",
                    }}
                  >
                    {h}
                  </div>
                ),
              )}
            </div>
            {(
              [
                [
                  "EU AI Act Annex IV pack",
                  ["Yes — Art. 11 docs", true],
                  "No",
                  "No",
                  "Manual",
                ],
                [
                  "Article 6 risk classifier",
                  ["10 questions · 30 sec", true],
                  "—",
                  "—",
                  "Custom workflow",
                ],
                [
                  "Article 4 literacy training",
                  ["Modules + signed log", true],
                  "—",
                  "—",
                  "—",
                ],
                [
                  "FRIA generator (Art. 27)",
                  ["Yes — Business+", true],
                  "No",
                  "No",
                  "Yes",
                ],
                [
                  "DPIA generator",
                  ["Yes — Pro+", true],
                  "Yes",
                  "Yes",
                  "Yes",
                ],
                [
                  "Per-system pricing tax",
                  ["No · per workspace", true],
                  "Per AI seat",
                  "Per AI seat",
                  "Per system",
                ],
                [
                  "Entry price (annual)",
                  ["$588/yr · Pro", true],
                  "$10K-$30K",
                  "$8K-$25K",
                  "$30K+",
                ],
                [
                  "Enterprise sales gate",
                  ["No · self-serve to $399", true],
                  "Required >$10K",
                  "Required >$8K",
                  "Custom-quote only",
                ],
              ] as const
            ).map((row, r) => (
              <div
                key={String(row[0])}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr repeat(4,1fr)",
                  borderTop: "1px solid var(--aic-paper-line-soft)",
                  background: r % 2 ? "var(--aic-paper-1)" : "var(--aic-paper-0)",
                }}
              >
                {row.map((cell, c) => {
                  const isHighlight = c === 1 && Array.isArray(cell) && cell[1];
                  const display = Array.isArray(cell) ? cell[0] : cell;
                  return (
                    <div
                      key={c}
                      style={{
                        padding: "14px 18px",
                        font:
                          c === 0
                            ? "500 14px/1.4 var(--aic-font-serif)"
                            : "13px/1.4 var(--aic-font-sans)",
                        letterSpacing: "-.005em",
                        color:
                          c === 0
                            ? "var(--aic-fg-l-1)"
                            : isHighlight
                              ? "var(--aic-gold-deep)"
                              : "var(--aic-fg-l-3)",
                        fontWeight: isHighlight ? 600 : c === 0 ? 500 : 400,
                        borderRight:
                          c < 4 ? "1px solid var(--aic-paper-line-soft)" : "0",
                      }}
                    >
                      {display}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: 18,
              font: "12px/1.55 var(--aic-font-sans)",
              color: "var(--aic-fg-l-4)",
            }}
          >
            Pricing as of 2026-05. Vanta and Drata price points
            sourced from g2.com and capterra.com listings; Holistic AI
            from public RFP responses. No vendor disputes the
            EU-AI-Act-specific gaps in their public docs.
          </p>
        </div>
      </section>

      {/* ============================================================
          SOCIAL PROOF — why we built this + regulator-references
          ============================================================ */}
      <section
        style={{
          padding: "80px 56px",
          background: "var(--aic-surface-1)",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: 56,
              alignItems: "start",
            }}
          >
            <div>
              <div
                className="aic-eyebrow-line"
                style={{ color: "var(--aic-gold)", marginBottom: 14 }}
              >
                BUILT FOR · ART. 4 LITERACY DEADLINE
              </div>
              <h2
                style={{
                  font: "500 36px/1.1 var(--aic-font-serif)",
                  letterSpacing: "-.025em",
                  margin: 0,
                  color: "#fff",
                }}
              >
                Why AIComply exists.
              </h2>
              <p
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,.72)",
                  font: "15px/1.6 var(--aic-font-sans)",
                }}
              >
                Article 4 of Regulation (EU) 2024/1689 puts a binary
                obligation on every operator using an AI system in the
                EU: ensure your staff has &ldquo;a sufficient level of
                AI literacy.&rdquo; The clock runs out{" "}
                <span style={{ color: "var(--aic-gold)" }}>
                  August 2, 2026
                </span>
                . Vanta and Drata cover SOC 2 — not this.
              </p>
              <p
                style={{
                  marginTop: 14,
                  color: "rgba(255,255,255,.6)",
                  font: "14px/1.55 var(--aic-font-sans)",
                }}
              >
                We built AIComply because the operators we talked to
                were holding three documents in three places: a Notion
                doc with system inventory, a Google form for risk
                self-assessment, and a Word template for the Annex IV
                pack. None of them survived first contact with a real
                conformity assessor.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 18,
              }}
            >
              {[
                {
                  stat: "AUG 2",
                  unit: "2026 · Art. 4 deadline",
                  body: "Mandatory AI literacy obligations apply to every operator with an EU footprint.",
                },
                {
                  stat: "€35M",
                  unit: "or 7% revenue · max fine",
                  body: "Article 99 penalty ceiling for prohibited-AI infringements (whichever is higher).",
                },
                {
                  stat: "144",
                  unit: "Annex IV evidence rows",
                  body: "What the Annex IV technical documentation pack typically contains. We auto-populate.",
                },
                {
                  stat: "27",
                  unit: "EU member states",
                  body: "Each state has its own enforcement authority. The Act is a single regulation; the inspections are not.",
                },
              ].map((s) => (
                <div
                  key={s.stat}
                  style={{
                    border: "1px solid rgba(212,175,55,.22)",
                    background: "rgba(15,23,42,.32)",
                    padding: 20,
                  }}
                >
                  <div
                    className="aic-tabular"
                    style={{
                      font: "700 36px/1 var(--aic-font-sans)",
                      color: "var(--aic-gold)",
                      letterSpacing: "-.025em",
                      marginBottom: 6,
                    }}
                  >
                    {s.stat}
                  </div>
                  <div
                    style={{
                      font: "var(--aic-mono-sm)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,.5)",
                      marginBottom: 12,
                    }}
                  >
                    {s.unit}
                  </div>
                  <p
                    style={{
                      font: "13px/1.55 var(--aic-font-sans)",
                      color: "rgba(255,255,255,.7)",
                      margin: 0,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 56,
              borderTop: "1px solid rgba(255,255,255,.1)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
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
              Start with the free risk checker. Upgrade when the
              conformity assessor calls.
            </span>
            <Link
              href="/free/risk-checker"
              className="aic-btn aic-btn--primary aic-btn--lg"
            >
              Run the 10-question check
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
