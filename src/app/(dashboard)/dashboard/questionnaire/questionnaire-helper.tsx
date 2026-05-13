"use client";

import { useState } from "react";

interface AnswerRow {
  q: string;
  draft: string;
  needs_review: boolean;
}

interface ContextSummary {
  systems_count: number;
  fria_count: number;
  fria_approved: number;
  literacy_count: number;
}

export function QuestionnaireHelper() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [contextSummary, setContextSummary] = useState<ContextSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const questions = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 30);

  async function onDraft() {
    if (questions.length === 0) return;
    setLoading(true);
    setError(null);
    setAnswers([]);
    try {
      const res = await fetch("/api/questionnaire/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });
      const body = await res.json();
      if (!res.ok && body.error) setError(body.error);
      setAnswers(body.answers ?? []);
      setContextSummary(body.context_summary ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function updateAnswer(idx: number, newDraft: string) {
    setAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, draft: newDraft } : a)),
    );
  }

  function copyAnswer(text: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text);
  }

  function copyAll() {
    const all = answers
      .map((a, i) => `Q${i + 1}: ${a.q}\nA: ${a.draft}`)
      .join("\n\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(all);
    }
  }

  return (
    <div>
      <label
        htmlFor="questionnaire-input"
        style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--aic-fg-l-2, #334155)" }}
      >
        Paste questions — one per line ({questions.length}/30)
      </label>
      <textarea
        id="questionnaire-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Example:\nDo you have a written AI risk-management policy?\nList all high-risk AI systems per Annex III.\nWho is the designated authority for FRIA approval?\nHave staff completed Article 4 AI literacy training in the last 12 months?`}
        rows={10}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 14,
          fontFamily: "var(--aic-font-sans, system-ui), sans-serif",
          lineHeight: 1.55,
          border: "1px solid var(--aic-paper-line, #e5e7eb)",
          borderRadius: 8,
          background: "var(--aic-paper-1, #fff)",
          color: "var(--aic-fg-l-1, #0f172a)",
          resize: "vertical",
        }}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onDraft}
          disabled={loading || questions.length === 0}
          style={{
            background: "var(--aic-gold, #d4af37)",
            color: "#0b1220",
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 6,
            border: "none",
            cursor: loading || questions.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || questions.length === 0 ? 0.6 : 1,
          }}
        >
          {loading ? "Drafting…" : `Draft answers (${questions.length})`}
        </button>
        {answers.length > 0 ? (
          <button
            type="button"
            onClick={copyAll}
            style={{
              background: "transparent",
              color: "var(--aic-fg-l-2, #334155)",
              padding: "10px 16px",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid var(--aic-paper-line, #d1d5db)",
              cursor: "pointer",
            }}
          >
            Copy all (Q+A)
          </button>
        ) : null}
        {error ? (
          <span style={{ fontSize: 13, color: "#b91c1c" }}>{error}</span>
        ) : null}
      </div>

      {contextSummary && (
        <div
          style={{
            marginTop: 18,
            padding: 12,
            background: "var(--aic-paper-1, #fff)",
            border: "1px dashed var(--aic-paper-line, #e5e7eb)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--aic-fg-l-3, #475569)",
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <span>
            <strong>{contextSummary.systems_count}</strong> systems
          </span>
          <span>
            <strong>{contextSummary.fria_approved}</strong>/{contextSummary.fria_count} FRIAs approved
          </span>
          <span>
            <strong>{contextSummary.literacy_count}</strong> literacy records
          </span>
          <span style={{ color: "var(--aic-fg-l-4, #94a3b8)" }}>
            Drafts cite this context — add more systems/FRIAs to improve quality.
          </span>
        </div>
      )}

      {answers.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--aic-fg-l-1, #0f172a)",
              margin: 0,
              marginBottom: 14,
            }}
          >
            {answers.length} drafted {answers.length === 1 ? "answer" : "answers"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {answers.map((a, i) => (
              <article
                key={i}
                style={{
                  background: "var(--aic-paper-1, #fff)",
                  border: a.needs_review
                    ? "1px solid #f59e0b"
                    : "1px solid var(--aic-paper-line, #e5e7eb)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "var(--aic-fg-l-4, #94a3b8)",
                    }}
                  >
                    Q{i + 1}
                    {a.needs_review ? (
                      <span style={{ color: "#a16207", marginLeft: 8 }}>· REVIEW</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyAnswer(a.draft)}
                    style={{
                      background: "transparent",
                      color: "var(--aic-fg-l-3, #475569)",
                      border: "1px solid var(--aic-paper-line, #d1d5db)",
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    copy
                  </button>
                </div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "var(--aic-fg-l-1, #0f172a)", marginBottom: 10 }}>
                  {a.q}
                </div>
                <textarea
                  value={a.draft}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  rows={Math.max(3, Math.ceil(a.draft.length / 90))}
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 14,
                    lineHeight: 1.55,
                    border: "1px solid var(--aic-paper-line, #e5e7eb)",
                    borderRadius: 6,
                    background: "var(--aic-paper-0, #fafafa)",
                    color: "var(--aic-fg-l-1, #0f172a)",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
