import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free EU AI Act Risk Checker — instant classification | AIComply",
  description:
    "Answer 10 yes/no questions about your AI system. Instant EU AI Act risk classification (prohibited / high-risk / limited / minimal) with the full obligations checklist. No signup.",
  alternates: { canonical: "/free/risk-checker" },
  openGraph: {
    title: "Free EU AI Act Risk Checker — AIComply",
    description:
      "10 questions -> instant risk classification + obligations checklist. No signup.",
    type: "website",
  },
};

export { default } from "../../../v2/risk-checker/page";
