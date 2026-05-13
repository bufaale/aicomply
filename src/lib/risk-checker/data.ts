/**
 * Shared (server-safe) data + classifier for the EU AI Act risk-checker
 * quiz. Used by:
 *   - /v2/risk-checker (client quiz)
 *   - /quiz-result/[token] (server-rendered permalink)
 *   - /api/free/risk-checker/save (server-side validation)
 *
 * No "use client" directive: plain data module, safe to import from any
 * server context.
 */

import type { RiskTier } from "@/components/aicomply/atoms";

export interface Question {
  q: string;
  citation: string;
  weight: { yes?: RiskTier };
}

export const QUIZ_VERSION = "v1-2026-05-13";

export const RC_QUESTIONS: readonly Question[] = [
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

export interface ResultDetails {
  title: string;
  citation: string;
  body: string;
  obligations: readonly string[];
  penalty: string;
}

export const RESULT_DETAILS: Record<RiskTier, ResultDetails> = {
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
    penalty:
      "No mandatory penalty. Article 4 literacy obligation still applies (€7.5M / 1.5% revenue cap).",
  },
};

export const PENALTY_BORDER: Record<RiskTier, string> = {
  prohibited: "#b91c1c",
  high: "#b45309",
  limited: "#1d4ed8",
  minimal: "#0f766e",
};

export function classify(answers: ReadonlyArray<"yes" | "no" | null>): RiskTier {
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
