/**
 * Registry of ~60 commonly-used AI tools. Used by the shadow-AI discovery
 * feature: when a user uploads a bookmarks export, browser history or SaaS
 * spend CSV, we match URLs / domain names against this registry and create
 * pre-classified draft AI systems for their inventory.
 *
 * Maintained by hand. When a new commonly-used tool emerges, add it here and
 * ship a release — no DB migration needed.
 */

export type SuggestedTier = "high" | "limited" | "minimal";

export interface AiToolEntry {
  /** Canonical display name. */
  name: string;
  /** Domains that identify the tool. Substring match against the URL. */
  domains: string[];
  vendor: string;
  /** If the tool proxies a known base model, capture it for GPAI tracking. */
  baseModel?: string;
  deploymentType: "saas" | "api" | "plugin" | "self_hosted";
  suggestedTier: SuggestedTier;
  /** Short rationale shown to the user during review. */
  rationale: string;
  /** Category for UI grouping. */
  category:
    | "chatbot"
    | "code"
    | "writing"
    | "image"
    | "meeting"
    | "search"
    | "agent"
    | "data"
    | "hr"
    | "hiring";
}

export const AI_TOOLS: AiToolEntry[] = [
  // General LLM chatbots
  { name: "ChatGPT", domains: ["chat.openai.com", "chatgpt.com"], vendor: "OpenAI", baseModel: "GPT-4", deploymentType: "saas", suggestedTier: "limited", rationale: "General-purpose conversational AI. Art. 50 transparency obligations for end-user interactions.", category: "chatbot" },
  { name: "Claude", domains: ["claude.ai", "anthropic.com"], vendor: "Anthropic", baseModel: "Claude", deploymentType: "saas", suggestedTier: "limited", rationale: "General-purpose conversational AI. Art. 50 transparency obligations.", category: "chatbot" },
  { name: "Gemini", domains: ["gemini.google.com", "bard.google.com"], vendor: "Google", baseModel: "Gemini", deploymentType: "saas", suggestedTier: "limited", rationale: "General-purpose conversational AI. Art. 50 applies.", category: "chatbot" },
  { name: "Microsoft Copilot", domains: ["copilot.microsoft.com"], vendor: "Microsoft", baseModel: "GPT-4", deploymentType: "saas", suggestedTier: "limited", rationale: "Conversational AI integrated into Microsoft 365. Art. 50 applies.", category: "chatbot" },
  { name: "Perplexity", domains: ["perplexity.ai"], vendor: "Perplexity AI", deploymentType: "saas", suggestedTier: "limited", rationale: "AI-powered search with generative answers. Art. 50 Art. 50 applies for generated outputs.", category: "search" },

  // Code assistants
  { name: "GitHub Copilot", domains: ["github.com/copilot", "copilot.github.com"], vendor: "GitHub / Microsoft", baseModel: "GPT-4", deploymentType: "plugin", suggestedTier: "minimal", rationale: "Code completion assistant. Most use is minimal-risk. Transparency depends on deployment context.", category: "code" },
  { name: "Cursor", domains: ["cursor.com", "cursor.sh"], vendor: "Anysphere", baseModel: "Claude/GPT-4", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI code editor. Minimal-risk except when generating code that enters regulated-product pipelines.", category: "code" },
  { name: "Claude Code", domains: ["claude.ai/code"], vendor: "Anthropic", baseModel: "Claude", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI coding agent. Minimal-risk for code generation.", category: "code" },
  { name: "Tabnine", domains: ["tabnine.com"], vendor: "Tabnine", deploymentType: "plugin", suggestedTier: "minimal", rationale: "Code completion.", category: "code" },
  { name: "Codeium", domains: ["codeium.com"], vendor: "Codeium", deploymentType: "plugin", suggestedTier: "minimal", rationale: "Free code completion assistant.", category: "code" },

  // Writing / content
  { name: "Jasper", domains: ["jasper.ai"], vendor: "Jasper", deploymentType: "saas", suggestedTier: "limited", rationale: "AI writing assistant. Art. 50 watermarking obligation for generated marketing content.", category: "writing" },
  { name: "Copy.ai", domains: ["copy.ai"], vendor: "Copy.ai", deploymentType: "saas", suggestedTier: "limited", rationale: "AI writing assistant. Art. 50 applies.", category: "writing" },
  { name: "Writesonic", domains: ["writesonic.com"], vendor: "Writesonic", deploymentType: "saas", suggestedTier: "limited", rationale: "AI writing. Art. 50 applies.", category: "writing" },
  { name: "Notion AI", domains: ["notion.so"], vendor: "Notion", baseModel: "Claude", deploymentType: "saas", suggestedTier: "limited", rationale: "AI writing inside the Notion workspace. Art. 50 applies for generated content.", category: "writing" },
  { name: "Grammarly", domains: ["grammarly.com"], vendor: "Grammarly", deploymentType: "plugin", suggestedTier: "minimal", rationale: "Grammar + style assistant. Minimal-risk except the newer generative features which fall under Art. 50.", category: "writing" },

  // Image / video
  { name: "Midjourney", domains: ["midjourney.com"], vendor: "Midjourney", deploymentType: "saas", suggestedTier: "limited", rationale: "GenAI image synthesis. Art. 50(2)(c) deepfake disclosure applies where photorealistic.", category: "image" },
  { name: "DALL·E / OpenAI Images", domains: ["labs.openai.com"], vendor: "OpenAI", baseModel: "DALL-E", deploymentType: "api", suggestedTier: "limited", rationale: "GenAI image synthesis. Art. 50 applies.", category: "image" },
  { name: "Stable Diffusion", domains: ["stability.ai", "huggingface.co/stabilityai"], vendor: "Stability AI", deploymentType: "api", suggestedTier: "limited", rationale: "GenAI image synthesis. Art. 50 applies; open-weight.", category: "image" },
  { name: "Runway", domains: ["runwayml.com"], vendor: "Runway", deploymentType: "saas", suggestedTier: "limited", rationale: "GenAI video. Art. 50 deepfake rules apply for photorealistic output.", category: "image" },
  { name: "Canva Magic Studio", domains: ["canva.com"], vendor: "Canva", deploymentType: "saas", suggestedTier: "limited", rationale: "Canva's generative features — Art. 50 for output content.", category: "image" },

  // Meeting assistants
  { name: "Otter.ai", domains: ["otter.ai"], vendor: "Otter.ai", deploymentType: "saas", suggestedTier: "limited", rationale: "Meeting transcription + summary. Art. 50 disclosure for AI-generated summaries; GDPR implications for recording without consent.", category: "meeting" },
  { name: "Fireflies", domains: ["fireflies.ai"], vendor: "Fireflies", deploymentType: "saas", suggestedTier: "limited", rationale: "Meeting transcription. Art. 50 applies; consent management is critical.", category: "meeting" },
  { name: "tl;dv", domains: ["tldv.io"], vendor: "tl;dv", deploymentType: "saas", suggestedTier: "limited", rationale: "Meeting recorder + AI summary. Art. 50 disclosure for AI-generated summaries.", category: "meeting" },
  { name: "Read.ai", domains: ["read.ai"], vendor: "Read.ai", deploymentType: "saas", suggestedTier: "limited", rationale: "Meeting intelligence. Art. 50 applies.", category: "meeting" },
  { name: "Granola", domains: ["granola.ai"], vendor: "Granola", deploymentType: "saas", suggestedTier: "limited", rationale: "AI meeting notes. Art. 50 applies.", category: "meeting" },

  // Agentic / workflow
  { name: "Zapier AI", domains: ["zapier.com"], vendor: "Zapier", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI-powered workflow automation. Minimal-risk unless used in regulated decision workflows.", category: "agent" },
  { name: "Make.com AI", domains: ["make.com"], vendor: "Make", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI workflow automation. Minimal-risk in most uses.", category: "agent" },
  { name: "AutoGPT", domains: ["autogpt.net"], vendor: "AutoGPT", deploymentType: "self_hosted", suggestedTier: "limited", rationale: "Agentic AI. Depends on the task — agentic workflows that affect user rights may move to high-risk.", category: "agent" },

  // Data / analytics
  { name: "Hex", domains: ["hex.tech"], vendor: "Hex", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI data notebook features. Minimal-risk for internal analytics.", category: "data" },
  { name: "Julius.ai", domains: ["julius.ai"], vendor: "Julius", deploymentType: "saas", suggestedTier: "minimal", rationale: "AI data analysis. Minimal-risk for internal analytics.", category: "data" },

  // HR / hiring (high-risk per Annex III §4)
  { name: "HireVue", domains: ["hirevue.com"], vendor: "HireVue", deploymentType: "saas", suggestedTier: "high", rationale: "Candidate video assessment with AI scoring. Annex III §4 employment — HIGH-RISK. Requires FRIA if you are a public body or public-service provider.", category: "hiring" },
  { name: "Eightfold AI", domains: ["eightfold.ai"], vendor: "Eightfold", deploymentType: "saas", suggestedTier: "high", rationale: "Talent intelligence platform with AI candidate matching. Annex III §4 employment — HIGH-RISK.", category: "hiring" },
  { name: "Harver", domains: ["harver.com"], vendor: "Harver", deploymentType: "saas", suggestedTier: "high", rationale: "Pre-employment assessment. Annex III §4 employment — HIGH-RISK.", category: "hiring" },
  { name: "Pymetrics / Harver Games", domains: ["pymetrics.ai"], vendor: "Pymetrics", deploymentType: "saas", suggestedTier: "high", rationale: "AI behavioural assessment for hiring. Annex III §4 — HIGH-RISK.", category: "hiring" },
  { name: "Workable AI", domains: ["workable.com"], vendor: "Workable", deploymentType: "saas", suggestedTier: "high", rationale: "AI-assisted candidate sourcing + ranking. Annex III §4 — HIGH-RISK when used for ranking.", category: "hiring" },
];

export interface DiscoveryMatch {
  url: string;
  name: string;
  tool: AiToolEntry;
}

export function matchTool(url: string): AiToolEntry | null {
  const normalized = url.toLowerCase().trim();
  for (const tool of AI_TOOLS) {
    for (const domain of tool.domains) {
      if (normalized.includes(domain.toLowerCase())) return tool;
    }
  }
  return null;
}
