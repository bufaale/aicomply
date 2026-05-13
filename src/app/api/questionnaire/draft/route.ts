/**
 * Procurement questionnaire auto-fill.
 *
 * POST /api/questionnaire/draft
 * Body: { questions: string[] }  (max 30 questions, each ≤500 chars)
 *
 * Reads the authenticated user's AI systems + FRIA records + literacy
 * records + (if any) Annex IV pack metadata, then asks Claude to
 * draft an answer per question that cites the customer's actual
 * inventory. Returns an editable card per question.
 *
 * Why this exists (per competitive-gaps memo #6):
 *   - Vanta + Drata both ship questionnaire automation as a primary
 *     enterprise sales feature ("saves 375+ hours/year").
 *   - For an AIComply customer drowning in vendor SIG-Lite + CAIQ +
 *     custom AI risk questionnaires, this is the daily-pain feature.
 *   - We already have the data (Annex IV pack + ai_systems table) +
 *     the AI infra (generateText with structured output).
 *
 * Cost model: ~$0.002 per 20-question draft via Claude Haiku. Margin
 * neutral. Frontend should rate-limit to avoid abuse.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "ai";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getModel } from "@/lib/ai/providers";

export const maxDuration = 60;

const bodySchema = z.object({
  questions: z.array(z.string().trim().min(3).max(500)).min(1).max(30),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }
  const { questions } = parsed.data;

  // Pull the user's compliance context. createAdminClient bypasses RLS so
  // the cron-like behavior works inside this server-side route.
  const admin = createAdminClient();

  type LooseDb = { from: (table: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as LooseDb;

  const [sysRes, friaRes, litRes, profileRes] = await Promise.all([
    db
      .from("ai_systems")
      .select("name, risk_tier, purpose, deployment_status")
      .eq("user_id", user.id)
      .limit(30),
    db
      .from("fria_assessments")
      .select("id, status, system_id, reviewed_at")
      .eq("user_id", user.id)
      .limit(30),
    db
      .from("ai_literacy_records")
      .select("id, training_date")
      .eq("user_id", user.id)
      .limit(30),
    db
      .from("profiles")
      .select("trust_display_name, trust_website")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const systems = (sysRes?.data ?? []) as Array<{
    name: string;
    risk_tier: string | null;
    purpose: string | null;
    deployment_status: string | null;
  }>;
  const frias = (friaRes?.data ?? []) as Array<{ id: string; status: string }>;
  const literacy = (litRes?.data ?? []) as Array<{ training_date: string | null }>;
  const profile = (profileRes?.data ?? null) as {
    trust_display_name: string | null;
    trust_website: string | null;
  } | null;

  // Build context block for Claude. Keep it terse — we want the model
  // to ground answers in real inventory without burning tokens.
  const contextBlock = `Operator: ${profile?.trust_display_name ?? "an AIComply customer"}${profile?.trust_website ? ` (${profile.trust_website})` : ""}

AI systems on file (${systems.length}):
${systems.length === 0 ? "  (none recorded yet)" : systems.map((s, i) => `  ${i + 1}. ${s.name} — risk tier: ${s.risk_tier ?? "unclassified"} · purpose: ${s.purpose ?? "n/a"} · status: ${s.deployment_status ?? "n/a"}`).join("\n")}

FRIA assessments: ${frias.length} total (${frias.filter((f) => f.status === "approved").length} approved)
Article 4 literacy training records: ${literacy.length}`;

  const numbered = questions
    .map((q, i) => `Q${i + 1}: ${q}`)
    .join("\n");

  const prompt = `You are helping an EU AI Act compliance team auto-draft procurement questionnaire answers. Use ONLY the operator-supplied compliance context below. If a question cannot be answered from the context, say so honestly ("not yet documented") and suggest the smallest concrete next step the operator should take to be able to answer it next time.

Each answer must:
  - Cite specific systems / FRIAs / numbers from the context when possible
  - Map to EU AI Act articles when relevant (Article 4 literacy, Article 6 risk tiers, Article 11 Annex IV, Article 27 FRIA, Article 43 conformity assessment)
  - Be 2-4 sentences max — procurement teams skim
  - End with "(draft — review before sending)" so the operator knows to verify

Output STRICT JSON only, no preamble, no markdown:
{"answers": [{"q": "<original question, verbatim>", "draft": "<answer text>", "needs_review": <boolean — true if the operator should manually verify a specific claim>}]}

=== COMPLIANCE CONTEXT ===
${contextBlock}

=== QUESTIONS (draft an answer for each in order) ===
${numbered}`;

  try {
    const { text, usage } = await generateText({
      model: getModel("anthropic:fast"),
      prompt,
      maxOutputTokens: Math.max(800, questions.length * 250),
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Claude did not return JSON");
    const parsed = JSON.parse(match[0]) as {
      answers: Array<{ q: string; draft: string; needs_review: boolean }>;
    };

    return NextResponse.json({
      ok: true,
      answers: parsed.answers ?? [],
      context_summary: {
        systems_count: systems.length,
        fria_count: frias.length,
        fria_approved: frias.filter((f) => f.status === "approved").length,
        literacy_count: literacy.length,
      },
      tokens_used: usage ? Number(usage.totalTokens ?? usage.outputTokens ?? 0) : null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI generation failed";
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        // Fallback: return one row per question with a generic stub so the UI
        // still renders an editable card the operator can fill in by hand.
        answers: questions.map((q) => ({
          q,
          draft: `(AI draft failed — fill in manually)`,
          needs_review: true,
        })),
      },
      { status: 500 },
    );
  }
}
