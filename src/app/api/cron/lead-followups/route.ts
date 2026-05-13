/**
 * /api/cron/lead-followups — daily 11:00 UTC.
 *
 * Mirror of AccessiScan's lead-followups cron. For every public_quiz_results
 * row where the visitor claimed their verdict (email_captured IS NOT NULL)
 * 3-10 days ago and no follow-up sent yet, send 1 polite nudge and mark
 * the row.
 *
 * Auth: bearer CRON_SECRET. Cap 5 follow-ups/run.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { RESULT_DETAILS } from "@/lib/risk-checker/data";
import type { RiskTier } from "@/components/aicomply/atoms";

export const maxDuration = 60;

const MIN_AGE_DAYS = 3;
const MAX_AGE_DAYS = 10;
const MAX_FOLLOWUPS_PER_RUN = 5;

interface FollowupResult {
  candidates: number;
  sent: number;
  failed: number;
  details: Array<{
    token: string;
    email: string;
    status: "sent" | "error";
    resend_id?: string;
    error?: string;
  }>;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildBody(opts: {
  classification: RiskTier;
  systemLabel: string | null;
  permalink: string;
}) {
  const { classification, systemLabel, permalink } = opts;
  const det = RESULT_DETAILS[classification];
  const labelLine = systemLabel ? `your ${escapeHtml(systemLabel)} system` : "the AI system you classified";

  const subject = `Following up on your EU AI Act ${det.title.toLowerCase()} verdict`;

  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#0f172a;font-size:14px;line-height:1.55">
  <p>Hi,</p>
  <p>A few days back you ran the AIComply EU AI Act risk-checker against ${labelLine}. The verdict came back: <strong>${det.title}</strong> (${det.citation}).</p>
  <p>Full verdict: <a href="${permalink}">${permalink}</a></p>
  <p>Two questions:</p>
  <ol>
    <li>Has anyone in your org started on the Article 4 AI literacy obligation yet? (Applies even to minimal-risk systems.)</li>
    <li>Would you like a 20-minute walkthrough of how AIComply generates the Annex IV technical documentation pack + FRIA/DPIA assessments your auditor will ask for? We can run it against ${labelLine} live on the call.</li>
  </ol>
  <p>Reply to this email if interested. No newsletter, no automated drip after this. If you&apos;d rather just try AIComply yourself, <a href="https://aicomply.piposlab.com/pricing">plans start at $49/mo</a> with a 14-day Pro trial.</p>
  <p style="color:#64748b;font-size:12px;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px">— Alejandro · Pipo&apos;s Lab LLC<br/>EU AI Act phased enforcement: Feb 2025 (prohibitions) → Aug 2025 (GPAI) → Aug 2026 (high-risk in Annex III) → Aug 2027 (high-risk in Annex I).</p>
</div>`;

  const text = `Hi,

A few days back you ran the AIComply EU AI Act risk-checker against ${systemLabel ?? "the AI system you classified"}. The verdict came back: ${det.title} (${det.citation}).

Full verdict: ${permalink}

Two questions:

1. Has anyone in your org started on the Article 4 AI literacy
   obligation yet? (Applies even to minimal-risk systems.)
2. Would you like a 20-minute walkthrough of how AIComply generates
   the Annex IV technical documentation pack + FRIA/DPIA assessments
   your auditor will ask for? We can run it against your system live
   on the call.

Reply to this email if interested. No newsletter, no automated drip
after this. If you'd rather just try AIComply yourself, plans start
at $49/mo with a 14-day Pro trial:
https://aicomply.piposlab.com/pricing

— Alejandro
Pipo's Lab LLC

EU AI Act phased enforcement: Feb 2025 (prohibitions) → Aug 2025 (GPAI)
→ Aug 2026 (high-risk Annex III) → Aug 2027 (high-risk Annex I).`;

  return { subject, html, text };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET?.trim()}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  type LooseDb = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const db = admin as unknown as LooseDb;

  const now = Date.now();
  const minCutoff = new Date(now - MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const maxCutoff = new Date(now - MIN_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error: queryErr } = await db
    .from("public_quiz_results")
    .select("id, classification, system_label, email_captured, created_at")
    .not("email_captured", "is", null)
    .is("followup_sent_at", null)
    .gte("created_at", minCutoff)
    .lte("created_at", maxCutoff)
    .order("created_at", { ascending: true })
    .limit(MAX_FOLLOWUPS_PER_RUN * 2);

  if (queryErr) {
    return NextResponse.json(
      { ok: false, error: "query_failed", message: queryErr.message },
      { status: 500 },
    );
  }

  const rows = (data ?? []) as Array<{
    id: string;
    classification: RiskTier;
    system_label: string | null;
    email_captured: string;
    created_at: string;
  }>;

  const result: FollowupResult = {
    candidates: rows.length,
    sent: 0,
    failed: 0,
    details: [],
  };

  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const row of rows) {
    if (result.sent >= MAX_FOLLOWUPS_PER_RUN) break;

    const permalink = `https://aicomply.piposlab.com/quiz-result/${row.id}`;
    const { subject, html, text } = buildBody({
      classification: row.classification,
      systemLabel: row.system_label,
      permalink,
    });

    try {
      const sendRes = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "AIComply <no-reply@piposlab.com>",
        replyTo: "alex@piposlab.com",
        to: row.email_captured,
        subject,
        html,
        text,
      });
      const resendId = sendRes.data?.id;
      if (!resendId) {
        result.failed += 1;
        result.details.push({
          token: row.id,
          email: row.email_captured,
          status: "error",
          error: sendRes.error?.message ?? "no_id_returned",
        });
        continue;
      }

      await db
        .from("public_quiz_results")
        .update({ followup_sent_at: new Date().toISOString() })
        .eq("id", row.id);

      result.sent += 1;
      result.details.push({
        token: row.id,
        email: row.email_captured,
        status: "sent",
        resend_id: resendId,
      });
    } catch (e) {
      result.failed += 1;
      result.details.push({
        token: row.id,
        email: row.email_captured,
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({ ok: true, ...result });
}
