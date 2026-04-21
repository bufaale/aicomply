/**
 * GPAI (General-Purpose AI) signatory registry.
 *
 * The EU AI Act Article 53 imposes obligations on providers of general-purpose
 * AI models. The Commission published the voluntary *Code of Practice for
 * General-Purpose AI* on 10 July 2025 as a way for providers to demonstrate
 * compliance until harmonised standards are published.
 *
 * Signatories commit to transparency on training data, copyright compliance,
 * and systemic-risk assessments. Deployers that build on top of or FINE-TUNE
 * a GPAI model inherit provider-side obligations under Art. 53(1)(d) — making
 * this a crucial piece of information during risk classification.
 *
 * This registry is maintained by hand and reflects public signing status as of
 * the Aug 2, 2026 enforcement date. When a new provider signs or publishes a
 * refusal, update this table and ship.
 */

export type GpaiStatus =
  | "signed"       // Provider has signed the Code of Practice
  | "declined"     // Provider publicly declined (e.g. Meta)
  | "uncertain"    // No public statement
  | "not-gpai";    // The model is not considered a GPAI model

export interface GpaiEntry {
  /** Provider name as it appears in commercial contracts. */
  provider: string;
  /** Canonical provider surface names (brands, subsidiaries). Substring match. */
  aliases: string[];
  status: GpaiStatus;
  /** Human-readable notes for the AIComply user's context. */
  notes: string;
  /** Public source for the signing status (for audit). */
  source?: string;
}

/**
 * Hand-maintained registry. Keep alphabetical by provider. When the user's
 * ai_system has a base_model or vendor matching an alias, we surface the
 * corresponding entry on the inventory row.
 */
export const GPAI_REGISTRY: GpaiEntry[] = [
  {
    provider: "Anthropic",
    aliases: ["anthropic", "claude"],
    status: "signed",
    notes:
      "Signed the EU GPAI Code of Practice. Claude Opus / Sonnet / Haiku models covered.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "Google",
    aliases: ["google", "gemini", "google deepmind", "deepmind"],
    status: "signed",
    notes:
      "Google committed to sign the chapters on transparency and copyright; systemic-risk chapter remains under discussion.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "OpenAI",
    aliases: ["openai", "chatgpt", "gpt-4", "gpt-4o", "gpt-5", "o1", "o3"],
    status: "signed",
    notes:
      "Signed the EU GPAI Code of Practice. Covers GPT-4/5 family and o-series reasoning models.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "Microsoft",
    aliases: ["microsoft", "copilot", "azure openai"],
    status: "signed",
    notes:
      "Microsoft signed in its capacity as an AI systems provider that integrates third-party GPAI models.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "Mistral AI",
    aliases: ["mistral", "mixtral", "codestral"],
    status: "signed",
    notes:
      "French provider — signatory. European-data hosting often cited as a procurement advantage.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "Cohere",
    aliases: ["cohere", "command r"],
    status: "signed",
    notes: "Signed the EU GPAI Code of Practice.",
    source: "https://code-of-practice.ai/",
  },
  {
    provider: "Meta",
    aliases: ["meta", "llama", "llama 2", "llama 3", "llama 4"],
    status: "declined",
    notes:
      "Meta publicly declined to sign the Code of Practice (July 2025). Deployers using Llama still have to meet Art. 53 obligations without the safe-harbour benefit of a signed CoP — more homework for the deployer.",
    source: "https://techcrunch.com/2025/07/18/meta-wont-sign-eu-ai-code-of-practice/",
  },
  {
    provider: "xAI",
    aliases: ["xai", "grok"],
    status: "uncertain",
    notes:
      "As of Q1 2026 xAI has not publicly signed the Code of Practice. Treat as unsigned when assessing deployer inheritance obligations.",
  },
  {
    provider: "DeepSeek",
    aliases: ["deepseek"],
    status: "uncertain",
    notes:
      "Chinese provider without a public EU Code of Practice signing statement. Deployers should document alternative compliance basis.",
  },
  {
    provider: "Alibaba Qwen",
    aliases: ["qwen", "alibaba", "tongyi"],
    status: "uncertain",
    notes:
      "No public signing statement. Treat as unsigned for deployer inheritance.",
  },
];

export function findGpaiEntry(
  vendor?: string | null,
  baseModel?: string | null,
): GpaiEntry | null {
  const haystack = `${vendor ?? ""} ${baseModel ?? ""}`.toLowerCase();
  if (!haystack.trim()) return null;
  for (const entry of GPAI_REGISTRY) {
    if (entry.aliases.some((alias) => haystack.includes(alias.toLowerCase()))) {
      return entry;
    }
  }
  return null;
}

export function gpaiStatusBadgeLabel(status: GpaiStatus): string {
  switch (status) {
    case "signed":
      return "GPAI CoP · signed";
    case "declined":
      return "GPAI CoP · declined";
    case "uncertain":
      return "GPAI CoP · unsigned";
    case "not-gpai":
      return "Not GPAI";
  }
}

export function gpaiDeployerGuidance(entry: GpaiEntry): string {
  if (entry.status === "signed") {
    return "Upstream provider has signed the Code of Practice. Your deployer-side obligations remain (Art. 26/27) but the safe-harbour benefit applies to the provider tier. Document the provider's signatory status in your Annex IV pack.";
  }
  if (entry.status === "declined") {
    return "Upstream provider declined the Code of Practice. You inherit more documentation burden: you must separately evidence Art. 53 compliance for the model you deploy (training data transparency, copyright compliance, systemic-risk assessment if applicable).";
  }
  return "Upstream provider has NOT publicly signed the Code of Practice. Request provider documentation or a written statement to include in your Annex IV pack; otherwise document your alternative compliance basis.";
}
