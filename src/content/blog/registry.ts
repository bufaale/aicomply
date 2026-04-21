import { type ComponentType } from "react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  keyword: string;
  category: "eu-ai-act" | "gdpr" | "comparisons" | "how-to" | "deadlines";
  excerpt: string;
  Component: ComponentType;
}

import FriaVsDpia from "./posts/fria-vs-dpia";
import Aug2Runway from "./posts/august-2-runway";
import SmbDeployerGuide from "./posts/smb-deployer-guide";
import GpaiSignatories from "./posts/gpai-code-of-practice";
import VantaComparison from "./posts/vanta-onetrust-comparison";

export const POSTS: BlogPost[] = [
  {
    slug: "fria-vs-dpia",
    title: "FRIA vs DPIA — When You Need Both (and Why the Commission Template Is Late)",
    description:
      "Article 27 FRIA and GDPR Article 35 DPIA overlap on the surface but answer different questions. Here is the decision tree and the combined workflow.",
    date: "2026-04-21",
    readMinutes: 10,
    keyword: "FRIA vs DPIA",
    category: "eu-ai-act",
    excerpt:
      "The EU AI Act introduces a second risk assessment alongside the GDPR DPIA. A deployer of a high-risk AI system processing personal data often needs both. Here is when, why, and how to run them together.",
    Component: FriaVsDpia,
  },
  {
    slug: "august-2-runway",
    title: "104 Days to August 2, 2026 — EU AI Act High-Risk Deployer Runway",
    description:
      "What every EU-exposed SMB must have in place by August 2, 2026: inventory, classification, FRIA for public-facing high-risk uses, Article 4 literacy, transparency notices.",
    date: "2026-04-21",
    readMinutes: 9,
    keyword: "EU AI Act August 2 2026",
    category: "deadlines",
    excerpt:
      "Article 4 (AI literacy) has been enforceable since February 2025. Annex III deployer obligations enter into force on August 2, 2026. The rest — general-purpose AI obligations — phase in through 2027. Here is the honest runway.",
    Component: Aug2Runway,
  },
  {
    slug: "smb-deployer-guide",
    title: "The SMB Deployer Survival Guide — What a 20-Person SaaS Actually Needs",
    description:
      "Most EU AI Act commentary is written for legal counsel at Fortune 500 companies. Here is what a 20-person SaaS with EU users actually has to do and what it costs.",
    date: "2026-04-21",
    readMinutes: 11,
    keyword: "EU AI Act SMB compliance",
    category: "how-to",
    excerpt:
      "The Act applies at the deployer level. A US SaaS with one EU customer is a deployer. Vanta quotes €50K+; PwC six figures. The minimum defensible SMB programme costs under €500 per month if you know where to look.",
    Component: SmbDeployerGuide,
  },
  {
    slug: "gpai-code-of-practice",
    title: "GPAI Code of Practice Signatories — Why It Matters to Deployers",
    description:
      "The Commission published the GPAI Code of Practice on 10 July 2025. OpenAI, Anthropic, Google, Mistral, Cohere signed. Meta declined. Here is what that changes for deployers.",
    date: "2026-04-21",
    readMinutes: 8,
    keyword: "GPAI Code of Practice signatories",
    category: "eu-ai-act",
    excerpt:
      "A deployer who fine-tunes a GPAI model becomes a provider under Art. 3(68)(b). The upstream provider's signatory status affects your inheritance calculus — and your Annex IV pack.",
    Component: GpaiSignatories,
  },
  {
    slug: "vanta-onetrust-comparison",
    title: "AIComply vs Vanta vs OneTrust vs Credo — 2026 Procurement Comparison",
    description:
      "Side-by-side comparison of EU AI Act compliance platforms for SMBs: pricing, coverage, DPO ergonomics, and where each wins and loses.",
    date: "2026-04-21",
    readMinutes: 12,
    keyword: "Vanta EU AI Act alternative",
    category: "comparisons",
    excerpt:
      "Vanta starts at €50,000 per year and focuses on general GRC. Credo AI targets ML-dev lifecycle from $30K. Modulos ships ISO 42001 certification from €15K. Where does AIComply at $49/month fit?",
    Component: VantaComparison,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
