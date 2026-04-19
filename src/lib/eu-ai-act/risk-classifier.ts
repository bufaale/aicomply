/**
 * EU AI Act risk classifier.
 *
 * Maps a user-described AI system to one of the four risk tiers defined in
 * Regulation (EU) 2024/1689:
 *  - unacceptable (Art. 5 — prohibited practices)
 *  - high (Art. 6 + Annex III — high-risk systems, heaviest obligations)
 *  - limited (Art. 50 — transparency obligations, e.g. chatbots, GenAI)
 *  - minimal (no specific obligations beyond Art. 4 AI literacy)
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export type RiskTier = "unacceptable" | "high" | "limited" | "minimal";

export interface SystemSnapshot {
  name: string;
  vendor?: string | null;
  purpose: string;
  usageContext?: string | null;
  dataInputs?: string | null;
  dataOutputs?: string | null;
  baseModel?: string | null;
  deploymentType?: string | null;
  businessUnits?: string | null;
}

export interface ClassifierResult {
  tier: RiskTier;
  rationale: string;
  obligations: Array<{ article: string; title: string; description: string }>;
}

const ResponseSchema = z.object({
  tier: z.enum(["unacceptable", "high", "limited", "minimal"]),
  rationale: z.string().min(10).max(1200),
  obligations: z
    .array(
      z.object({
        article: z.string().min(1).max(40),
        title: z.string().min(3).max(160),
        description: z.string().min(5).max(600),
      }),
    )
    .max(10),
});

const SYSTEM_PROMPT = `You are an EU AI Act (Regulation (EU) 2024/1689) compliance analyst.
Classify the described AI system into exactly one risk tier and list concrete obligations.

Risk tiers:
- "unacceptable" — practices prohibited by Article 5 (social scoring by public authorities, exploitative subliminal techniques, untargeted scraping of facial images, emotion recognition in workplaces/schools, real-time biometric identification in public for law enforcement with narrow exceptions, biometric categorisation to infer race/political opinions/sexual orientation/etc.).
- "high" — high-risk systems under Article 6 + Annex III (employment decisions, credit scoring, education/exam grading, critical infrastructure, biometric identification allowed, migration/asylum/border control, administration of justice, essential private/public services including healthcare, safety components of regulated products).
- "limited" — transparency obligations under Article 50 (chatbots interacting with humans, generative AI producing synthetic content, deepfakes, emotion recognition or biometric categorisation not covered above).
- "minimal" — no AI-Act-specific obligations beyond Article 4 AI literacy (spam filters, enterprise search, code completion, internal knowledge retrieval, product recommendations without material effect on rights).

Output strict JSON matching this TypeScript type — no prose before or after:
{
  "tier": "unacceptable" | "high" | "limited" | "minimal",
  "rationale": "1-3 sentence justification citing the specific article or Annex III category",
  "obligations": [
    {
      "article": "Art. 50(1)",
      "title": "Short action title",
      "description": "Concrete action the deployer must take"
    }
  ]
}

Include 3-6 obligations scaled to the tier (more for high, fewer for minimal).
Always include Article 4 (AI literacy) as at least one obligation regardless of tier.
If uncertain between two tiers, pick the more conservative (higher) tier and say so in the rationale.`;

function buildUserPrompt(system: SystemSnapshot): string {
  const lines = [
    `System name: ${system.name}`,
    system.vendor ? `Vendor: ${system.vendor}` : null,
    `Purpose: ${system.purpose}`,
    system.usageContext ? `Usage context: ${system.usageContext}` : null,
    system.dataInputs ? `Data inputs: ${system.dataInputs}` : null,
    system.dataOutputs ? `Outputs / decisions produced: ${system.dataOutputs}` : null,
    system.baseModel ? `Underlying model: ${system.baseModel}` : null,
    system.deploymentType ? `Deployment: ${system.deploymentType}` : null,
    system.businessUnits ? `Business units using it: ${system.businessUnits}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function classifySystem(
  system: SystemSnapshot,
): Promise<ClassifierResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(system) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Classifier returned no text");
  }

  const jsonStart = textBlock.text.indexOf("{");
  const jsonEnd = textBlock.text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < 0) {
    throw new Error("Classifier response did not contain JSON");
  }
  const raw = textBlock.text.slice(jsonStart, jsonEnd + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Classifier returned invalid JSON");
  }

  const validated = ResponseSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(`Classifier response failed validation: ${validated.error.message}`);
  }
  return validated.data;
}
