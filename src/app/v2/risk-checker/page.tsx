"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Pyramid,
  PyramidBar,
  TierBadge,
  type RiskTier,
} from "@/components/aicomply/atoms";

interface Question {
  q: string;
  citation: string;
  weight: { yes?: RiskTier };
}

const RC_QUESTIONS: Question[] = [
  {
    q: "Does the system manipulate or exploit vulnerabilities of children, the elderly, or people with disabilities?",
    citation: "Art. 5(1)(a–b)",
    weight: { yes: "prohibited" },
  },
  {
    q: "Does it perform 'social scoring' of natural persons by public authorities?",
    citation: "Art. 5(1)(c)",
    weight: { yes: "prohibited" },
  },
  {
    q: "Does it perform real-time remote biometric identification in public spaces?",
    citation: "Art. 5(1)(h)",
    weight: { yes: "prohibited" },
  },
  {
    q: "Is it used as a safety component of a regulated product (medical device, toy, machinery)?",
    citation: "Annex I · Art. 6(1)",
    weight: { yes: "high" },
  },
  {
    q: "Does it screen, score, or rank job applicants, students, or workers?",
    citation: "Annex III §4 · §3",
    weight: { yes: "high" },
  },
  {
    q: "Does it determine eligibility for credit, insurance, or essential public services?",
    citation: "Annex III §5",
    weight: { yes: "high" },
  },
  {
    q: "Does it interact directly with humans as a chatbot, agent, or assistant?",
    citation: "Art. 50(1)",
    weight: { yes: "limited" },
  },
  {
    q: "Does it generate or manipulate images, audio, or video that resembles real persons or events?",
    citation: "Art. 50(2,4)",
    weight: { yes: "limited" },
  },
  {
    q: "Does it perform emotion recognition or biometric categorisation?",
    citation: "Art. 50(3)",
    weight: { yes: "limited" },
  },
  {
    q: "Is the system trained, deployed, or used by anyone in the EU, or are its outputs used in the EU?",
    citation: "Art. 2(1)",
    weight: {},
  },
];

interface ResultDetails {
  title: string;
  citation: string;
  body: string;
  obligations: readonly string[];
  penalty: string;
}

const RESULT_DETAILS: Record<RiskTier, ResultDetails> = {
  prohibited: {
    title: "Prohibited",
    citation: "ART. 5",
    body: "This use is banned under the EU AI Act. Cease deployment in the EU before 02 February 2025. There is no compliance route — the prohibition is absolute.",
    obligations: [
      "Stop deployment immediately. No conformity assessment route exists.",
      "Document the discontinuation in your AI register with timestamp + signoff.",
      "Notify affected users within 72 hours.",
      "Review any data collected for GDPR Article 17 erasure obligations.",
    ],
    penalty:
      "Fines up to €35M or 7% of global annual turnover (whichever is higher).",
  },
  high: {
    title: "High-risk",
    citation: "ART. 6 · ANNEX III",
    body: "Subject to the full Article 8–17 obligations. You must complete a conformity assessment before placing on the EU market and maintain technical documentation throughout the lifecycle.",
    obligations: [
      "Risk management system (Art. 9) — continuous, iterative, throughout lifecycle.",
      "Data governance: training/validation/test sets must be relevant, representative, error-free (Art. 10).",
      "Annex IV technical documentation maintained and updated (Art. 11).",
      "Automatic event logging — minimum 6 months retention (Art. 12).",
      "Transparency: clear instructions for use to deployers (Art. 13).",
      "Human oversight measures designed in (Art. 14).",
      "Accuracy, robustness, cybersecurity (Art. 15).",
      "Conformity assessment (Art. 43) — third-party for Annex III §1.",
      "Post-market monitoring + incident reporting (Art. 72, 73).",
      "Register in the EU database (Art. 71) before deployment.",
    ],
    penalty:
      "Fines up to €15M or 3% of global annual turnover for non-compliance with Art. 8–17.",
  },
  limited: {
    title: "Limited risk",
    citation: "ART. 50",
    body: "Subject to transparency obligations only. Users must be informed that they are interacting with an AI system or seeing AI-generated content.",
    obligations: [
      "Inform users at first interaction that they are interacting with an AI system (Art. 50(1)).",
      "Mark AI-generated synthetic audio/image/video/text as artificially generated (Art. 50(2)).",
      "If the system performs emotion recognition or biometric categorisation, inform the natural persons exposed (Art. 50(3)).",
      "Disclose when content is a deepfake — exceptions for satire, art, criminal investigation (Art. 50(4)).",
      "Apply transparency in clear, distinguishable, accessible manner.",
    ],
    penalty: "Fines up to €15M or 3% of global annual turnover for transparency breaches.",
  },
  minimal: {
    title: "Minimal risk",
    citation: "RECITAL 165",
    body: "No mandatory obligations under the AI Act. You may voluntarily adopt the codes of conduct under Article 95.",
    obligations: [
      "Voluntary: adopt the AI Act code of conduct (Art. 95).",
      "Maintain Article 4 AI literacy across staff using the system.",
      "Document the classification rationale in your AI register.",
      "Re-classify if the system's purpose or capabilities change materially.",
    ],
    penalty: "No mandatory penalty. Article 4 literacy obligation still applies (€7.5M / 1.5% revenue cap).",
  },
};

const PENALTY_BORDER: Record<RiskTier, string> = {
  prohibited: "#b91c1c",
  high: "#b45309",
  limited: "#1d4ed8",
  minimal: "#0f766e",
};

function classify(answers: Array<"yes" | "no" | null>): RiskTier {
  let p = false;
  let h = false;
  let l = false;
  RC_QUESTIONS.forEach((q, i) => {
    if (answers[i] === "yes" && q.weight.yes) {
      if (q.weight.yes === "prohibited") p = true;
      else if (q.weight.yes === "high") h = true;
      else if (q.weight.yes === "limited") l = true;
    }
  });
  if (p) return "prohibited";
  if (h) return "high";
  if (l) return "limited";
  return "minimal";
}

export default function V2RiskCheckerPage() {
  const total = RC_QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<"yes" | "no" | null>>(
    Array(total).fill(null),
  );
  const [systemLabel, setSystemLabel] = useState("");
  const [email, setEmail] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const done = step >= total;
  const result = done ? classify(answers) : null;
  const details = result ? RESULT_DETAILS[result] : null;

  const setAnswer = (a: "yes" | "no") => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = a;
      return next;
    });
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  const reset = () => {
    setStep(0);
    setAnswers(Array(total).fill(null));
    setSystemLabel("");
    setEmail("");
    setShareUrl(null);
    setSaveError(null);
    setCopied(false);
  };

  async function saveAndShare() {
    if (!result) return;
    setSaving(true);
    setSaveError(null);
    try {
      const r = await fetch("/api/free/risk-checker/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classification: result,
          answers,
          system_label: systemLabel || undefined,
          email: email || undefined,
        }),
      });
      const body = (await r.json()) as { ok?: boolean; share_url?: string; error?: string };
      if (!r.ok || !body.ok || !body.share_url) {
        setSaveError(body.error || "save_failed");
      } else {
        setShareUrl(body.share_url);
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "save_failed");
    } finally {
      setSaving(false);
    }
  }

  async function copyShare() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op (button still shows URL inline)
    }
  }

  return (
    <>
      <section
        style={{
          padding: "40px 56px 24px",
          background: "var(--aic-paper-0)",
          borderBottom: "1px solid var(--aic-paper-line-soft)",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            className="aic-eyebrow-line aic-eyebrow-line--light"
            style={{ marginBottom: 14 }}
          >
            FREE TOOL · NO ACCOUNT REQUIRED
          </div>
          <h1
            style={{
              font: "500 44px/1.06 var(--aic-font-serif)",
              letterSpacing: "-.025em",
              margin: "0 0 14px",
            }}
          >
            10 questions.{" "}
            <em
              style={{
                color: "var(--aic-gold-deep)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              One verdict.
            </em>
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--aic-fg-l-3)",
              font: "16px/1.55 var(--aic-font-sans)",
              maxWidth: 620,
            }}
          >
            Classify any AI system into one of four EU AI Act risk tiers. Takes 90 seconds.
            Outputs your obligations checklist.
          </p>
        </div>
      </section>

      <section style={{ padding: "36px 56px 80px", background: "var(--aic-paper-0)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {!done && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  font: "var(--aic-mono)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--aic-fg-l-3)",
                }}
              >
                QUESTION {String(step + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  background: "var(--aic-paper-line-soft)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${(step / total) * 100}%`,
                    background: "var(--aic-fg-l-1)",
                  }}
                />
              </div>
            </div>
          )}

          {!done && (
            <div className="aic-q-card">
              <div className="aic-q-num">{RC_QUESTIONS[step]?.citation}</div>
              <div className="aic-q-text">{RC_QUESTIONS[step]?.q}</div>
              <div className="aic-q-options">
                <button
                  type="button"
                  className="opt"
                  onClick={() => setAnswer("yes")}
                >
                  <span>Yes</span>
                  <span className="key">Y</span>
                </button>
                <button
                  type="button"
                  className="opt"
                  onClick={() => setAnswer("no")}
                >
                  <span>No</span>
                  <span className="key">N</span>
                </button>
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className="aic-btn aic-btn--ghost-light aic-btn--sm"
                  disabled={step === 0}
                  onClick={() => setStep(Math.max(0, step - 1))}
                  style={step === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  ← Previous
                </button>
                <span
                  style={{
                    font: "var(--aic-mono-sm)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "var(--aic-fg-l-4)",
                  }}
                >
                  REGULATION (EU) 2024/1689
                </span>
              </div>
            </div>
          )}

          {done && details && result && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                  flexWrap: "wrap",
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
                  VERDICT · {details.citation}
                </span>
                <button
                  type="button"
                  className="aic-btn aic-btn--ghost-light aic-btn--sm"
                  onClick={reset}
                >
                  Re-run check ↺
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  border: "1px solid var(--aic-paper-line)",
                }}
              >
                <div style={{ padding: "32px 28px", background: "var(--aic-paper-1)" }}>
                  <h2
                    style={{
                      font: "500 56px/1 var(--aic-font-serif)",
                      letterSpacing: "-.03em",
                      margin: "0 0 14px",
                      color: "var(--aic-fg-l-1)",
                    }}
                  >
                    {details.title}
                  </h2>
                  <TierBadge tier={result} />
                  <p
                    style={{
                      font: "15px/1.6 var(--aic-font-sans)",
                      color: "var(--aic-fg-l-2)",
                      marginTop: 18,
                    }}
                  >
                    {details.body}
                  </p>
                  <div
                    style={{
                      marginTop: 24,
                      padding: "14px 16px",
                      background: "var(--aic-paper-2)",
                      borderLeft: "3px solid currentColor",
                      color: PENALTY_BORDER[result],
                    }}
                  >
                    <div
                      className="aic-eyebrow-line aic-eyebrow-line--light"
                      style={{ marginBottom: 6 }}
                    >
                      MAX PENALTY
                    </div>
                    <div
                      style={{
                        font: "14px/1.55 var(--aic-font-sans)",
                        color: "var(--aic-fg-l-1)",
                      }}
                    >
                      {details.penalty}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "32px 28px",
                    background: "var(--aic-paper-0)",
                    borderLeft: "1px solid var(--aic-paper-line-soft)",
                  }}
                >
                  <div
                    className="aic-eyebrow-line aic-eyebrow-line--light"
                    style={{ marginBottom: 14 }}
                  >
                    YOUR OBLIGATIONS
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {details.obligations.map((o, i) => (
                      <div
                        key={o}
                        style={{
                          padding: "10px 0",
                          borderTop: i ? "1px solid var(--aic-paper-line-soft)" : "0",
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          className="aic-tabular"
                          style={{
                            font: "var(--aic-mono-sm)",
                            letterSpacing: ".06em",
                            color: "var(--aic-fg-l-4)",
                            minWidth: 24,
                            paddingTop: 3,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          style={{
                            font: "14px/1.55 var(--aic-font-sans)",
                            color: "var(--aic-fg-l-2)",
                          }}
                        >
                          {o}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shareable permalink — viral wedge. Visible before signup CTA. */}
              <div
                data-testid="quiz-share-card"
                style={{
                  marginTop: 24,
                  padding: "24px 28px",
                  background: "var(--aic-paper-1)",
                  border: "1px solid var(--aic-paper-line)",
                }}
              >
                <div
                  className="aic-eyebrow-line aic-eyebrow-line--light"
                  style={{ marginBottom: 10 }}
                >
                  SHAREABLE VERDICT
                </div>
                {!shareUrl ? (
                  <>
                    <h3
                      style={{
                        font: "500 22px/1.2 var(--aic-font-serif)",
                        letterSpacing: "-.015em",
                        margin: "0 0 6px",
                        color: "var(--aic-fg-l-1)",
                      }}
                    >
                      Get a permalink for this verdict
                    </h3>
                    <p
                      style={{
                        margin: "0 0 16px",
                        font: "14px/1.55 var(--aic-font-sans)",
                        color: "var(--aic-fg-l-3)",
                      }}
                    >
                      Drop the link in Slack / email / LinkedIn — recipients
                      see the verdict + obligations without re-running the
                      quiz. Email is optional (and only used to send your
                      verdict + Annex IV starter pack).
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          font: "13px/1 var(--aic-font-sans)",
                          color: "var(--aic-fg-l-3)",
                        }}
                      >
                        System label (optional)
                        <input
                          data-testid="quiz-system-label"
                          type="text"
                          value={systemLabel}
                          onChange={(e) => setSystemLabel(e.target.value.slice(0, 80))}
                          maxLength={80}
                          placeholder="e.g. ACME Corp resume screener"
                          style={{
                            border: "1px solid var(--aic-paper-line)",
                            padding: "10px 12px",
                            font: "14px var(--aic-font-sans)",
                            background: "var(--aic-paper-0)",
                            color: "var(--aic-fg-l-1)",
                          }}
                        />
                      </label>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          font: "13px/1 var(--aic-font-sans)",
                          color: "var(--aic-fg-l-3)",
                        }}
                      >
                        Email (optional)
                        <input
                          data-testid="quiz-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.slice(0, 254))}
                          maxLength={254}
                          placeholder="you@company.com"
                          style={{
                            border: "1px solid var(--aic-paper-line)",
                            padding: "10px 12px",
                            font: "14px var(--aic-font-sans)",
                            background: "var(--aic-paper-0)",
                            color: "var(--aic-fg-l-1)",
                          }}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      data-testid="quiz-save-share"
                      onClick={saveAndShare}
                      disabled={saving}
                      className="aic-btn aic-btn--primary aic-btn--lg"
                      style={{ opacity: saving ? 0.6 : 1 }}
                    >
                      {saving ? "Saving…" : "Create share link"}
                    </button>
                    {saveError ? (
                      <div
                        role="alert"
                        style={{
                          marginTop: 10,
                          font: "13px var(--aic-font-sans)",
                          color: "#b91c1c",
                        }}
                      >
                        Couldn&apos;t save: {saveError}. Try again in a moment.
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        font: "500 16px/1.4 var(--aic-font-serif)",
                        color: "var(--aic-fg-l-1)",
                        marginBottom: 10,
                      }}
                    >
                      Permalink ready — share anywhere.
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "stretch",
                        flexWrap: "wrap",
                      }}
                    >
                      <code
                        data-testid="quiz-share-url"
                        style={{
                          flex: "1 1 320px",
                          padding: "10px 14px",
                          background: "var(--aic-paper-0)",
                          border: "1px solid var(--aic-paper-line)",
                          font: "13px var(--aic-mono)",
                          color: "var(--aic-fg-l-2)",
                          wordBreak: "break-all",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {shareUrl}
                      </code>
                      <button
                        type="button"
                        onClick={copyShare}
                        className="aic-btn aic-btn--ghost-light"
                      >
                        {copied ? "Copied ✓" : "Copy link"}
                      </button>
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aic-btn aic-btn--ghost-light"
                      >
                        Open ↗
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: "24px 28px",
                  background: "var(--aic-surface-1)",
                  color: "#fff",
                  border: "1px solid rgba(212,175,55,.22)",
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr",
                  gap: 32,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    className="aic-eyebrow-line"
                    style={{ color: "var(--aic-gold)", marginBottom: 8 }}
                  >
                    NEXT · TURN VERDICT INTO PACKET
                  </div>
                  <h3
                    style={{
                      font: "500 24px/1.2 var(--aic-font-serif)",
                      letterSpacing: "-.015em",
                      margin: "0 0 6px",
                    }}
                  >
                    Track this system + 49 others.
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      font: "14px/1.55 var(--aic-font-sans)",
                      color: "rgba(255,255,255,.72)",
                    }}
                  >
                    Save this verdict. Inventory every system. Generate Annex IV. Sign off
                    Article 4 literacy. Hand auditors the packet on 02 Aug.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Link
                    href="/signup"
                    className="aic-btn aic-btn--primary aic-btn--lg aic-btn--block"
                  >
                    Save verdict — start free
                  </Link>
                  <Link
                    href="/pricing"
                    className="aic-btn aic-btn--ghost-dark aic-btn--block"
                  >
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!done && (
            <div
              style={{
                marginTop: 36,
                padding: "22px 24px",
                border: "1px solid var(--aic-paper-line)",
                background: "var(--aic-paper-1)",
              }}
            >
              <div
                className="aic-eyebrow-line aic-eyebrow-line--light"
                style={{ marginBottom: 14 }}
              >
                FOUR TIERS · EU AI ACT
              </div>
              <Pyramid
                hideOnMobile
                counts={{
                  prohibited: "BANNED",
                  high: "ASSESS",
                  limited: "DISCLOSE",
                  minimal: "VOLUNTARY",
                }}
              />
              <PyramidBar dark={false} />
            </div>
          )}
        </div>
      </section>

    </>
  );
}
