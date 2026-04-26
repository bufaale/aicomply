/**
 * EU AI Act risk classifier — pure logic for the /free/risk-checker tool.
 * Maps a 10-question questionnaire to one of 4 risk categories per Art. 5
 * (prohibited), Art. 6 + Annex III (high-risk), Art. 50 (limited /
 * transparency), or "minimal" (no obligations beyond voluntary codes).
 *
 * Sources:
 *  - EU AI Act, OJ L 2024/1689
 *  - Annex III high-risk use cases list
 *  - EDPB FRIA template guidance
 */

export type RiskTier = "prohibited" | "high_risk" | "limited" | "minimal";

export interface QuestionAnswer {
  question_id: string;
  answer: "yes" | "no";
}

export interface ClassificationResult {
  tier: RiskTier;
  rationale: string[];
  required_obligations: string[];
  triggered_questions: string[];
}

interface QuestionDef {
  id: string;
  text: string;
  yes_implies: RiskTier;
  rationale: string;
}

// 10 questions, ordered by tier severity. First "yes" at the highest tier wins.
export const QUESTIONS: QuestionDef[] = [
  {
    id: "q1_subliminal",
    text: "Does the AI manipulate users via subliminal techniques to materially distort their behavior in a way likely to cause harm?",
    yes_implies: "prohibited",
    rationale: "Article 5(1)(a) prohibits subliminal manipulative AI causing material harm.",
  },
  {
    id: "q2_vulnerable_groups",
    text: "Does the AI exploit vulnerabilities of specific groups (age, disability, social/economic status) to materially distort behavior?",
    yes_implies: "prohibited",
    rationale: "Article 5(1)(b) prohibits exploitative targeting of vulnerable groups.",
  },
  {
    id: "q3_social_scoring",
    text: "Does the AI evaluate or classify natural persons based on social behavior or predicted personality, leading to detrimental treatment?",
    yes_implies: "prohibited",
    rationale: "Article 5(1)(c) prohibits social-scoring AI by public authorities.",
  },
  {
    id: "q4_realtime_biometric",
    text: "Does the AI perform real-time remote biometric identification in publicly accessible spaces for law enforcement?",
    yes_implies: "prohibited",
    rationale: "Article 5(1)(h) prohibits real-time biometric identification in public spaces.",
  },
  {
    id: "q5_critical_infra",
    text: "Is the AI used as a safety component in critical infrastructure (energy, water, transport, digital infrastructure)?",
    yes_implies: "high_risk",
    rationale: "Annex III(2) — critical infrastructure safety components are high-risk.",
  },
  {
    id: "q6_education_employment",
    text: "Does the AI determine access to education, training, or employment, or evaluate students/workers?",
    yes_implies: "high_risk",
    rationale: "Annex III(3-4) — education + employment AI systems are high-risk.",
  },
  {
    id: "q7_essential_services",
    text: "Does the AI assess eligibility for essential public/private services (credit scoring, insurance, public benefits, emergency services)?",
    yes_implies: "high_risk",
    rationale: "Annex III(5) — essential service eligibility AI is high-risk.",
  },
  {
    id: "q8_law_enforcement",
    text: "Is the AI used by law enforcement, migration, asylum, or border control authorities for risk assessment / profiling?",
    yes_implies: "high_risk",
    rationale: "Annex III(6-7) — law enforcement / migration AI is high-risk.",
  },
  {
    id: "q9_chatbot_deepfake",
    text: "Does the AI interact with humans (chatbot/voice agent) OR generate synthetic media (image, audio, video) of real people?",
    yes_implies: "limited",
    rationale: "Article 50 — chatbots + deepfakes have transparency / labeling obligations.",
  },
  {
    id: "q10_emotion_biometric_categorization",
    text: "Does the AI infer emotions or biometrically categorize people (NOT for identification)?",
    yes_implies: "limited",
    rationale: "Article 50 — emotion recognition + biometric categorization require disclosure.",
  },
];

const TIER_RANK: Record<RiskTier, number> = {
  minimal: 0,
  limited: 1,
  high_risk: 2,
  prohibited: 3,
};

const TIER_OBLIGATIONS: Record<RiskTier, string[]> = {
  prohibited: [
    "STOP — this AI use is prohibited under Art. 5 of the EU AI Act.",
    "Maximum fine: €35M or 7% of global turnover (Art. 99(3)).",
    "Discontinue deployment in the EU. No DPIA / FRIA can authorize this use case.",
  ],
  high_risk: [
    "Conduct a Fundamental Rights Impact Assessment (FRIA) per Art. 27 before deployment.",
    "Maintain technical documentation per Annex IV.",
    "Implement risk management system per Art. 9.",
    "Ensure human oversight per Art. 14 + accuracy/robustness per Art. 15.",
    "Register the AI system in the EU database per Art. 71.",
    "Maximum fine if non-compliant: €15M or 3% of global turnover.",
  ],
  limited: [
    "Disclose to users that they are interacting with AI per Art. 50(1).",
    "Label synthetic media (deepfakes) as artificially generated per Art. 50(4).",
    "Maintain transparency documentation but no FRIA required.",
    "Maximum fine if non-compliant: €7.5M or 1% of global turnover.",
  ],
  minimal: [
    "No mandatory obligations beyond voluntary codes of conduct (Art. 95).",
    "Recommended: maintain a data protection impact assessment (DPIA) per GDPR.",
    "Recommended: track AI literacy of staff per Art. 4 (applies to all providers).",
  ],
};

export function classify(answers: QuestionAnswer[]): ClassificationResult {
  let highest: RiskTier = "minimal";
  const triggered: string[] = [];
  const rationale: string[] = [];

  const answerMap = new Map(answers.map((a) => [a.question_id, a.answer]));

  for (const q of QUESTIONS) {
    if (answerMap.get(q.id) === "yes") {
      triggered.push(q.id);
      rationale.push(q.rationale);
      if (TIER_RANK[q.yes_implies] > TIER_RANK[highest]) {
        highest = q.yes_implies;
      }
    }
  }

  if (rationale.length === 0) {
    rationale.push(
      "No high-risk, prohibited, or transparency-trigger answers. The system likely falls under the minimal-risk tier (e.g. spam filters, basic analytics, AI in video games).",
    );
  }

  return {
    tier: highest,
    rationale,
    required_obligations: TIER_OBLIGATIONS[highest],
    triggered_questions: triggered,
  };
}
