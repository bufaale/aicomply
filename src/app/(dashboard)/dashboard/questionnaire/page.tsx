import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionnaireHelper } from "./questionnaire-helper";

export const metadata: Metadata = {
  title: "Procurement Questionnaire Helper · AIComply",
  description:
    "Auto-draft procurement / vendor-security questionnaire answers grounded in your AIComply workspace (AI systems, FRIA approvals, Article 4 literacy).",
};

export default async function QuestionnairePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/dashboard/questionnaire");
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 28px" }}>
      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--aic-gold-deep, #a16207)",
            marginBottom: 8,
          }}
        >
          PROCUREMENT QUESTIONNAIRE HELPER · ART. 6 / 11 / 27
        </div>
        <h1
          style={{
            fontFamily: "var(--aic-font-serif, serif)",
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--aic-fg-l-1, #0f172a)",
          }}
        >
          Paste questions, get drafted answers.
        </h1>
        <p
          style={{
            marginTop: 12,
            fontSize: 16,
            lineHeight: 1.55,
            color: "var(--aic-fg-l-3, #475569)",
            maxWidth: 700,
          }}
        >
          One paste, one click. Claude reads your AI-system inventory, FRIA
          approvals, and literacy records, then drafts an answer per question
          that cites the actual EU AI Act articles. Edit any answer before you
          hand it to the requesting procurement team.
        </p>
      </header>

      <QuestionnaireHelper />

      <section
        style={{
          marginTop: 40,
          padding: 20,
          background: "var(--aic-paper-1, #fff)",
          border: "1px solid var(--aic-paper-line, #e5e7eb)",
          borderRadius: 12,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--aic-fg-l-1, #0f172a)",
            margin: 0,
            marginBottom: 12,
          }}
        >
          What this saves
        </h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--aic-fg-l-3, #475569)",
          }}
        >
          <li>
            Vanta + Drata charge $25k+/yr for the same questionnaire automation
            (in their case scoped to SOC 2). AIComply ships it scoped to the
            EU AI Act on the $399/mo Regulated tier.
          </li>
          <li>
            The longer your inventory + FRIA history grows in AIComply, the
            better the drafts get — every answer cites the actual systems
            you operate, not a generic boilerplate.
          </li>
          <li>
            Pre-fill SIG-Lite, CAIQ, and custom AI risk questionnaires in
            seconds. Skim, edit, send.
          </li>
        </ul>
      </section>
    </main>
  );
}
